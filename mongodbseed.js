

// To use this script, run: node mongodbseed.js

const { MongoClient } = require('mongodb');
require('dotenv').config();

const egyptianManufacturers = [
  'Eva Pharma',
  'Pharco',
  'EIPICO',
  'Amoun',
  'Marcyrl',
  'SEDICO',
  'Global Napi',
  'GSK Egypt',
  'Sanofi Egypt',
  'Novartis Egypt',
  'Pfizer Egypt'
];

const productCatalog = {
  vitals: [
    'Amlodipine 5mg',
    'Bisoprolol 5mg',
    'Captopril 25mg',
    'Enalapril 10mg',
    'Lisinopril 10mg',
    'Valsartan 80mg',
    'Losartan 50mg',
    'Hydrochlorothiazide 25mg',
    'Spironolactone 25mg',
    'Furosemide 40mg',
    'Atorvastatin 20mg',
    'Rosuvastatin 10mg',
    'Simvastatin 20mg',
    'Clopidogrel 75mg',
    'Aspirin 81mg',
    'Warfarin 5mg',
    'Apixaban 5mg',
    'Rivaroxaban 10mg',
    'Metformin 850mg',
    'Gliclazide MR 60mg',
    'Sitagliptin 100mg',
    'Empagliflozin 10mg',
    'Dapagliflozin 10mg',
    'Insulin Glargine Vial',
    'Insulin Aspart Vial',
    'Omeprazole 20mg',
    'Pantoprazole 40mg',
    'Esomeprazole 40mg',
    'Rabeprazole 20mg',
    'Amoxicillin/Clavulanate 1g',
    'Azithromycin 500mg',
    'Cefixime 400mg',
    'Ceftriaxone 1g Vial',
    'Ciprofloxacin 500mg',
    'Levofloxacin 500mg',
    'Doxycycline 100mg',
    'Paracetamol 500mg',
    'Ibuprofen 400mg',
    'Diclofenac Potassium 50mg',
    'Ketoprofen 75mg',
    'Mefenamic Acid 500mg',
    'Tramadol 50mg',
    'Prednisone 20mg',
    'Hydrocortisone 100mg Amp',
    'Salbutamol Inhaler',
    'Budesonide/Formoterol Inhaler',
    'Montelukast 10mg',
    'Cetirizine 10mg',
    'Loratadine 10mg',
    'Fexofenadine 180mg'
  ],
  vitamins: [
    'Vitamin C 1000mg',
    'Vitamin D3 5000 IU',
    'Vitamin B-Complex',
    'Vitamin B12 1000mcg',
    'Folic Acid 5mg',
    'Iron (Ferrous Fumarate)',
    'Calcium + Vitamin D',
    'Magnesium Glycinate',
    'Zinc 50mg',
    'Selenium 200mcg',
    'Omega-3 Fish Oil',
    'Multivitamin Adult',
    'Prenatal Multivitamin',
    'Biotin 10mg',
    'Vitamin E 400IU',
    'Collagen Peptides',
    'Probiotic 10B CFU',
    'Lutein + Zeaxanthin',
    'CoQ10 100mg',
    'Glucosamine + Chondroitin',
    'Garlic Oil Capsules',
    'Evening Primrose Oil',
    'Royal Jelly 1000mg',
    'Spirulina Tablets',
    'Korean Ginseng',
    'Milk Thistle',
    'Cranberry Extract',
    'Ashwagandha 500mg',
    'Melatonin 5mg',
    'Vitamin K2 + D3',
    'Chromium Picolinate',
    'Potassium Gluconate',
    'ORS Electrolyte Sachets',
    'Vitamin A 5000 IU',
    'Niacin (B3)',
    'Riboflavin (B2)',
    'Thiamine (B1)',
    'Pyridoxine (B6)',
    'Methylfolate',
    'Cyanocobalamin',
    'Inositol',
    'MSM (Methylsulfonylmethane)',
    'Green Tea Extract',
    'Turmeric Curcumin',
    'Saw Palmetto',
    'Ginkgo Biloba',
    'Iron + Vitamin C',
    'Zinc + Vitamin C',
    'Propolis Capsules',
    'Bone Support Complex'
  ],
  fitness: [
    'Whey Protein Concentrate',
    'Whey Protein Isolate',
    'Hydrolyzed Whey',
    'Casein Protein',
    'Mass Gainer',
    'BCAA 2:1:1',
    'EAA Blend',
    'Creatine Monohydrate',
    'Creatine HCl',
    'Beta-Alanine',
    'Citrulline Malate',
    'L-Arginine',
    'L-Carnitine',
    'CLA Softgels',
    'HMB 3g',
    'Glutamine Powder',
    'Pre-Workout (Stim)',
    'Pre-Workout (Non-Stim)',
    'Electrolyte Tablets',
    'Isotonic Drink Powder',
    'Carb Powder (Maltodextrin)',
    'Energy Gel',
    'Caffeine 200mg',
    'Green Coffee Capsules',
    'MCT Oil',
    'Psyllium Husk',
    'Joint Support (Collagen)',
    'Recovery Shake',
    'Nitric Oxide Booster',
    'ZMA (Zinc Magnesium B6)',
    'Betaine Anhydrous',
    'Taurine 1000mg',
    'Beta-Glucan',
    'Beetroot Powder',
    'Hydration Tabs',
    'Fasted Cardio Burner',
    'Protein Cookies',
    'Protein Bars',
    'Electrolyte Gummies',
    'Electrolyte Effervescent',
    'BCAA RTD Drink',
    'Protein RTD Drink',
    'Carb/Electrolyte Sachet',
    'Immune Support for Athletes',
    'Sleep Support for Athletes',
    'Digestive Enzymes',
    'Antioxidant Blend',
    'Omega-3 Sport',
    'Multivitamin Sport',
    'Collagen + Vitamin C Sport'
  ],
  cosmetics: [
    'Adapalene Gel 0.1%',
    'Tretinoin Cream 0.05%',
    'Benzoyl Peroxide Gel 5%',
    'Clindamycin Gel 1%',
    'Erythromycin Topical 2%',
    'Fusidic Acid Cream 2%',
    'Mupirocin Ointment 2%',
    'Hydrocortisone Cream 1%',
    'Betamethasone Cream 0.1%',
    'Clotrimazole Cream 1%',
    'Terbinafine Cream 1%',
    'Ketoconazole Cream 2%',
    'Ketoconazole Shampoo 2%',
    'Selenium Sulfide Shampoo 2.5%',
    'Coal Tar Shampoo',
    'Salicylic Acid Cleanser 2%',
    'Urea Cream 10%',
    'Ceramide Moisturizing Cream',
    'Hyaluronic Acid Serum',
    'Niacinamide Serum 10%',
    'Vitamin C Serum 15%',
    'Sunscreen SPF50',
    'Panthenol Cream',
    'Zinc Oxide Cream',
    'Calamine Lotion',
    'Emollient Ointment',
    'AHA/BHA Toner',
    'Azelaic Acid Gel 15%',
    'Silver Sulfadiazine Cream 1%',
    'Antifungal Powder (Miconazole)',
    'Tolnaftate Spray',
    'Nystatin Cream',
    'Sulfur Soap',
    'Barrier Repair Cream',
    'Medicated Lip Balm',
    'Acyclovir Cream 5%',
    'Ciclopirox Nail Lacquer',
    'Minoxidil 5% Topical',
    'Hair Serum Biotin',
    'Anti-Dandruff Lotion (Pyrithione Zinc)',
    'Lice Treatment Lotion',
    'Moisturizing Eye Cream',
    'Retinol Night Cream 0.3%',
    'Lactic Acid Lotion 12%',
    'Pramoxine Anti-Itch Lotion',
    'Hydrating Foot Cream',
    'Hand Cream with Urea',
    'Antiperspirant Roll-On Clinical',
    'Antiseptic Skin Spray (Chlorhexidine)',
    'Nasal Saline Spray'
  ]
};

const defaultDescByCat = {
  vitals: 'Core prescription and pharmacy essentials used across Egypt.',
  vitamins: 'Common supplements available in Egyptian pharmacies.',
  fitness: 'Sport and recovery supplements stocked in local pharmacies.',
  cosmetics: 'Dermatology and cosmeceutical pharmacy staples.'
};

const defaultImageByCat = {
  vitals: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
  vitamins: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=900&q=80',
  fitness: 'https://images.everydayhealth.com/images/healthy-living/fitness/everything-you-need-know-about-fitness-1440x810.jpg?sfvrsn=2fee0a3b_5',
  cosmetics: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80'
};

const priceBands = {
  vitals: [12, 60],
  vitamins: [6, 35],
  fitness: [15, 90],
  cosmetics: [8, 70]
};

const defaultRxByCat = {
  vitals: true,
  vitamins: false,
  fitness: false,
  cosmetics: false
};

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

function randomInt(min, max) {
  return Math.floor(randomInRange(min, max + 1));
}

function generateProducts() {
  let idCounter = 1;
  const products = [];

  Object.entries(productCatalog).forEach(([cat, items]) => {
    items.forEach((name) => {
      const [minPrice, maxPrice] = priceBands[cat];
      const price = parseFloat(randomInRange(minPrice, maxPrice).toFixed(2));
      const stock = randomInt(80, 360);
      const manufacturer = egyptianManufacturers[(idCounter - 1) % egyptianManufacturers.length];
      const sku = `${cat.slice(0, 3).toUpperCase()}-${String(idCounter).padStart(4, '0')}`;

      products.push({
        id: idCounter,
        name,
        price,
        rx: defaultRxByCat[cat],
        cat,
        desc: defaultDescByCat[cat],
        sku,
        manufacturer,
        stock,
        imageUrl: defaultImageByCat[cat]
      });

      idCounter += 1;
    });
  });

  return products;
}

const seedData = {
  categories: [
    { id: 'vitals', name: 'Vital Medications', icon: '💊', description: 'Essential prescription and over-the-counter medications for vital health conditions' },
    { id: 'vitamins', name: 'Vitamins', icon: '🥗', description: 'Nutritional supplements and vitamins for daily health' },
    { id: 'fitness', name: 'Fitness', icon: '💪', description: 'Sports nutrition and fitness supplements' },
    { id: 'cosmetics', name: 'Cosmetics', icon: '✨', description: 'Skincare and beauty products' }
  ],
  products: generateProducts(),
  users: [
    { email: 'demo@example.com', password: 'Demo123!', fullName: 'Demo User', phone: '+1234567890', role: 'customer', isVerified: true, createdAt: new Date() }
  ],
  coupons: [
    { code: 'WELCOME10', type: 'percentage', value: 10, minOrderAmount: 50, maxDiscount: 20, active: true, usageLimit: 100, usedCount: 0, startsAt: new Date(), expiresAt: new Date(Date.now() + 90*24*60*60*1000) },
    { code: 'SAVE5', type: 'fixed', value: 5, minOrderAmount: 25, active: true, usageLimit: null, usedCount: 0, startsAt: new Date(), expiresAt: null }
  ]
};

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017';
const DB_NAME = process.env.MONGODB_DB || 'wellness_pharmacy';

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing collections...');
    const collections = ['categories', 'products', 'users', 'coupons', 'orders'];
    for (const collectionName of collections) {
      try {
        await db.collection(collectionName).drop();
        console.log(`   ✓ Dropped ${collectionName}`);
      } catch (err) {
        console.log(`   ⚠ ${collectionName} doesn't exist, skipping...`);
      }
    }

    // Insert categories
    console.log('\n📦 Inserting categories...');
    await db.collection('categories').insertMany(seedData.categories);
    console.log(`   ✓ Inserted ${seedData.categories.length} categories`);

    // Insert products
    console.log('📦 Inserting products...');
    await db.collection('products').insertMany(seedData.products);
    console.log(`   ✓ Inserted ${seedData.products.length} products`);

    // Insert users
    console.log('📦 Inserting users...');
    await db.collection('users').insertMany(seedData.users);
    console.log(`   ✓ Inserted ${seedData.users.length} users`);

    // Insert coupons
    console.log('📦 Inserting coupons...');
    await db.collection('coupons').insertMany(seedData.coupons);
    console.log(`   ✓ Inserted ${seedData.coupons.length} coupons`);

    // Create indexes for better performance
    console.log('\n🔍 Creating indexes...');
    await db.collection('products').createIndex({ name: 'text', desc: 'text' });
    await db.collection('products').createIndex({ cat: 1 });
    await db.collection('products').createIndex({ price: 1 });
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('coupons').createIndex({ code: 1 }, { unique: true });
    console.log('   ✓ Indexes created');

    console.log('\n✨ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Categories: ${seedData.categories.length}`);
    console.log(`   • Products: ${seedData.products.length}`);
    console.log(`   • Users: ${seedData.users.length}`);
    console.log(`   • Coupons: ${seedData.coupons.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the seeding function
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedData, seedDatabase };