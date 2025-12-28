// ============================================================
// Wellness Pharmacy Backend - Node.js/Express + MongoDB
// ============================================================
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { ObjectId } = require('mongodb');
require('dotenv').config();

const { connectDB, testConnection } = require('./db/connection');

const app = express();
const PORT = process.env.PORT || 3000;
let db;

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
});

// ==================== SERVE FRONTEND ====================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web_project.html'));
});

// ==================== HEALTH CHECK ====================
app.get('/api/health', async (req, res) => {
    try {
        await db.command({ ping: 1 });
        res.json({ status: 'Server running', database: 'connected', timestamp: new Date().toISOString() });
    } catch (error) {
        res.json({ status: 'Server running', database: 'disconnected', error: error.message, timestamp: new Date().toISOString() });
    }
});

// ==================== CATEGORIES ====================
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await db.collection('categories').find({}).sort({ name: 1 }).toArray();
        res.json({ success: true, data: categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== PRODUCTS ====================
app.get('/api/products', async (req, res) => {
    try {
        const { category, search, limit, offset = 0 } = req.query;
        const query = {};
        if (category) query.cat = category;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { desc: { $regex: search, $options: 'i' } }
            ];
        }

        // Return full catalog by default; cap user-supplied limits to prevent runaway queries
        const parsedOffset = Number.isFinite(Number(offset)) ? parseInt(offset, 10) : 0;
        const parsedLimit = Number.isFinite(Number(limit)) ? Math.min(parseInt(limit, 10), 1000) : null;

        let cursor = db.collection('products').find(query).sort({ cat: 1, name: 1 });
        if (parsedOffset) cursor = cursor.skip(parsedOffset);
        if (parsedLimit) cursor = cursor.limit(parsedLimit);

        const products = await cursor.toArray();

        // Normalize for frontend
        const formatted = products.map(p => ({
            ...p,
            id: p.id ?? (p._id ? p._id.toString() : undefined),
            price: parseFloat(p.price),
            stock: p.stock !== undefined ? parseInt(p.stock) : undefined
        }));

        res.json({ success: true, data: formatted });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let product;
        if (ObjectId.isValid(id)) {
            product = await db.collection('products').findOne({ _id: new ObjectId(id) });
        }
        if (!product) {
            const numericId = isNaN(Number(id)) ? null : Number(id);
            if (numericId !== null) {
                product = await db.collection('products').findOne({ id: numericId });
            }
        }
        if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
        product.price = parseFloat(product.price);
        if (!product.id && product._id) product.id = product._id.toString();
        if (product.stock !== undefined) product.stock = parseInt(product.stock);
        res.json({ success: true, data: product });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/products/category/:cat', async (req, res) => {
    try {
        const { cat } = req.params;
        const products = await db.collection('products').find({ cat }).sort({ name: 1 }).toArray();
        const formatted = products.map(p => ({
            ...p,
            id: p.id ?? (p._id ? p._id.toString() : undefined),
            price: parseFloat(p.price)
        }));
        res.json({ success: true, data: formatted });
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== AUTHENTICATION ====================
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, pass, phone } = req.body;
        if (!name || !email || !pass) return res.status(400).json({ success: false, error: 'Missing required fields' });
        if (name.length < 2) return res.status(400).json({ success: false, error: 'Name must be at least 2 characters' });
        if (!email.includes('@')) return res.status(400).json({ success: false, error: 'Invalid email format' });
        if (pass.length < 6) return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });

        const existing = await db.collection('users').findOne({ email: email.toLowerCase() });
        if (existing) return res.status(400).json({ success: false, error: 'Email already registered' });

        const newUser = {
            email: email.toLowerCase(),
            password: pass, // demo only; hash in production
            fullName: name,
            phone: phone || null,
            role: 'customer',
            isVerified: false,
            createdAt: new Date()
        };

        const result = await db.collection('users').insertOne(newUser);
        await db.collection('audits').insertOne({
            userId: result.insertedId,
            entityType: 'user',
            entityId: result.insertedId,
            action: 'user_registered',
            detail: { email: newUser.email },
            createdAt: new Date()
        });

        res.json({ success: true, user: { id: result.insertedId, name: newUser.fullName, email: newUser.email } });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, pass } = req.body;
        if (!email || !pass) return res.status(400).json({ success: false, error: 'Missing email or password' });

        const user = await db.collection('users').findOne({ email: email.toLowerCase() });
        if (!user || user.password !== pass) return res.status(401).json({ success: false, error: 'Invalid email or password' });

        await db.collection('audits').insertOne({
            userId: user._id,
            entityType: 'user',
            entityId: user._id,
            action: 'user_login',
            detail: { email: user.email },
            createdAt: new Date()
        });

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.fullName,
                email: user.email,
                phone: user.phone,
                isVerified: user.isVerified,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/auth/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        let user;
        if (ObjectId.isValid(userId)) {
            user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        }
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        res.json({ success: true, data: {
            id: user._id,
            email: user.email,
            name: user.fullName,
            phone: user.phone,
            role: user.role,
            isVerified: user.isVerified,
            createdAt: user.createdAt
        }});
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== ADDRESSES ====================
app.get('/api/addresses/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const addresses = await db.collection('addresses')
            .find({ userId: new ObjectId(userId) })
            .sort({ isDefault: -1, createdAt: -1 })
            .toArray();
        res.json({ success: true, data: addresses });
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/addresses', async (req, res) => {
    try {
        const { userId, label, line1, line2, city, state, postalCode, country, phone, isDefault } = req.body;
        if (!userId || !line1) return res.status(400).json({ success: false, error: 'Missing required fields' });

        if (isDefault) {
            await db.collection('addresses').updateMany({ userId: new ObjectId(userId) }, { $set: { isDefault: false } });
        }

        const newAddress = {
            userId: new ObjectId(userId),
            label,
            line1,
            line2,
            city,
            state,
            postalCode,
            country,
            phone,
            isDefault: !!isDefault,
            createdAt: new Date()
        };

        const result = await db.collection('addresses').insertOne(newAddress);
        res.json({ success: true, data: { ...newAddress, _id: result.insertedId } });
    } catch (error) {
        console.error('Error adding address:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== ORDERS ====================
app.post('/api/orders', async (req, res) => {
    try {
        const { userEmail, userId, items, shippingName, shippingCard, shippingPhone, shippingAddress, addressId, couponCode } = req.body;
        if (!items || !Array.isArray(items) || !items.length) return res.status(400).json({ success: false, error: 'Order must contain items' });
        if (!shippingName || !shippingCard || !shippingPhone || !shippingAddress) return res.status(400).json({ success: false, error: 'Missing shipping information' });

        let user = null;
        if (userId && ObjectId.isValid(userId)) user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        else if (userEmail) user = await db.collection('users').findOne({ email: userEmail.toLowerCase() });
        if (!user) return res.status(400).json({ success: false, error: 'User not found' });

        const orderNumber = 'ORD-' + Date.now();

        // Calculate subtotal from items, preferring DB prices when available
        const normalizedItems = [];
        let subtotal = 0;
        for (const item of items) {
            const qty = item.qty || 1;
            let effectivePrice = item.price;
            let matchedProduct = null;

            if (!effectivePrice) {
                const orQuery = [];
                if (item.id) {
                    orQuery.push({ id: item.id });
                    const numericId = Number(item.id);
                    if (!isNaN(numericId)) orQuery.push({ id: numericId });
                    if (ObjectId.isValid(item.id)) orQuery.push({ _id: new ObjectId(item.id) });
                }
                if (item.name) orQuery.push({ name: item.name });

                if (orQuery.length) {
                    matchedProduct = await db.collection('products').findOne({ $or: orQuery });
                    if (matchedProduct) effectivePrice = matchedProduct.price;
                }
            }

            effectivePrice = parseFloat(effectivePrice || 0);
            subtotal += effectivePrice * qty;
            normalizedItems.push({
                id: item.id || (matchedProduct?._id ? matchedProduct._id.toString() : null),
                name: item.name || matchedProduct?.name,
                price: effectivePrice,
                qty
            });
        }

        // Apply coupon
        let discount = 0;
        let appliedCoupon = null;
        if (couponCode) {
            const coupon = await db.collection('coupons').findOne({
                code: couponCode,
                active: true,
                $and: [
                    { $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }] },
                    { $or: [{ usageLimit: null }, { $expr: { $lt: ['$usedCount', '$usageLimit'] } }] }
                ]
            });
            if (coupon) {
                appliedCoupon = coupon;
                if (coupon.type === 'percentage') {
                    discount = subtotal * (parseFloat(coupon.value) / 100);
                    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
                } else {
                    discount = parseFloat(coupon.value);
                }
                await db.collection('coupons').updateOne({ _id: coupon._id }, { $inc: { usedCount: 1 } });
            }
        }

        const tax = 0;
        const shippingCost = 0;
        const finalTotal = subtotal - discount + tax + shippingCost;

        const newOrder = {
            orderNumber,
            userId: user._id,
            userEmail: user.email,
            addressId: addressId ? new ObjectId(addressId) : null,
            couponCode: appliedCoupon ? appliedCoupon.code : null,
            status: 'pending',
            items: normalizedItems,
            subtotal,
            discount,
            tax,
            shippingCost,
            total: finalTotal,
            shippingName,
            shippingPhone,
            shippingAddress,
            cardLastFour: shippingCard.slice(-4),
            placedAt: new Date(),
            createdAt: new Date()
        };

        const result = await db.collection('orders').insertOne(newOrder);
        await db.collection('payments').insertOne({
            orderId: result.insertedId,
            paymentMethod: 'card',
            amount: finalTotal,
            currency: 'EGP',
            status: 'pending',
            createdAt: new Date()
        });
        await db.collection('audits').insertOne({
            userId: user._id,
            entityType: 'order',
            entityId: result.insertedId,
            action: 'order_created',
            detail: { orderNumber, total: finalTotal, itemCount: items.length },
            createdAt: new Date()
        });

        res.json({ success: true, orderId: orderNumber, order: { id: result.insertedId, orderNumber, total: finalTotal, status: 'pending' } });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/orders/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const orders = await db.collection('orders').find({ userEmail: email.toLowerCase() }).sort({ placedAt: -1 }).toArray();
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/orders/id/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        let order;
        if (ObjectId.isValid(orderId)) {
            order = await db.collection('orders').findOne({ _id: new ObjectId(orderId) });
        }
        if (!order) order = await db.collection('orders').findOne({ orderNumber: orderId });
        if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
        res.json({ success: true, data: order });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.patch('/api/orders/:orderId/status', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const validStatuses = ['pending', 'processing', 'ready_for_shipment', 'shipped', 'delivered', 'cancelled', 'returned'];
        if (!validStatuses.includes(status)) return res.status(400).json({ success: false, error: 'Invalid status' });

        const filter = ObjectId.isValid(orderId) ? { _id: new ObjectId(orderId) } : { orderNumber: orderId };
        const result = await db.collection('orders').findOneAndUpdate(filter, { $set: { status, updatedAt: new Date() } }, { returnDocument: 'after' });
        if (!result.value) return res.status(404).json({ success: false, error: 'Order not found' });
        res.json({ success: true, data: result.value });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== COUPONS ====================
app.post('/api/coupons/validate', async (req, res) => {
    try {
        const { code, subtotal } = req.body;
        const coupon = await db.collection('coupons').findOne({
            code,
            active: true,
            $and: [
                { $or: [{ startsAt: null }, { startsAt: { $lte: new Date() } }] },
                { $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }] }
            ]
        });

        if (!coupon) return res.status(400).json({ success: false, error: 'Invalid or expired coupon' });
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ success: false, error: 'Coupon usage limit reached' });
        if (subtotal && parseFloat(subtotal) < parseFloat(coupon.minOrderAmount || 0)) {
            return res.status(400).json({ success: false, error: `Minimum order amount is L.E ${coupon.minOrderAmount}` });
        }

        let discount = 0;
        if (subtotal) {
            if (coupon.type === 'percentage') {
                discount = parseFloat(subtotal) * (parseFloat(coupon.value) / 100);
                if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
            } else {
                discount = parseFloat(coupon.value);
            }
        }

        res.json({ success: true, data: { code: coupon.code, type: coupon.type, value: parseFloat(coupon.value), discount, expiresAt: coupon.expiresAt } });
    } catch (error) {
        console.error('Coupon validation error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== ADMIN ROUTES ====================
app.get('/api/admin/orders', async (req, res) => {
    try {
        const orders = await db.collection('orders').find().sort({ placedAt: -1 }).limit(200).toArray();
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/admin/stats', async (req, res) => {
    try {
        const [users, products, ordersCount, revenueAgg] = await Promise.all([
            db.collection('users').countDocuments(),
            db.collection('products').countDocuments(),
            db.collection('orders').countDocuments(),
            db.collection('orders').aggregate([
                { $match: { status: { $ne: 'cancelled' } } },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]).toArray()
        ]);

        const totalRevenue = revenueAgg.length ? revenueAgg[0].total : 0;

        const recentOrders = await db.collection('orders').find().sort({ placedAt: -1 }).limit(5).toArray();
        const topProducts = await db.collection('orders').aggregate([
            { $unwind: '$items' },
            { $group: { _id: '$items.name', sold: { $sum: '$items.qty' }, revenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } } } },
            { $sort: { sold: -1 } },
            { $limit: 5 },
            { $project: { name: '$_id', sold: 1, revenue: 1, _id: 0 } }
        ]).toArray();

        res.json({
            success: true,
            stats: {
                totalUsers: users,
                totalProducts: products,
                totalOrders: ordersCount,
                totalRevenue: totalRevenue.toFixed(2),
                averageOrderValue: ordersCount > 0 ? (totalRevenue / ordersCount).toFixed(2) : '0.00'
            },
            recentOrders,
            topProducts
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/admin/users', async (req, res) => {
    try {
        const users = await db.collection('users').find({}, { projection: { password: 0 } }).sort({ createdAt: -1 }).limit(200).toArray();
        res.json({ success: true, data: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/admin/inventory', async (req, res) => {
    try {
        const products = await db.collection('products').find().project({ name: 1, price: 1, stock: 1, cat: 1 }).toArray();
        res.json({ success: true, data: products });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/admin/audits', async (req, res) => {
    try {
        const audits = await db.collection('audits').find().sort({ createdAt: -1 }).limit(200).toArray();
        res.json({ success: true, data: audits });
    } catch (error) {
        console.error('Error fetching audits:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== ERROR HANDLING ====================
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ success: false, error: error.message });
});

// ==================== START SERVER ====================
connectDB()
    .then(database => {
        db = database;
        return testConnection();
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`\n    ╔═══════════════════════════════════════╗\n    ║  Wellness Pharmacy Backend Server      ║\n    ║  MongoDB Edition                       ║\n    ║  Running on http://localhost:${PORT}  ║\n    ║  ${new Date().toLocaleString()}     ║\n    ╚═══════════════════════════════════════╝\n    `);
        });
    })
    .catch(err => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });

module.exports = app;

