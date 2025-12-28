# Quick Reference Guide - MFA Authentication System

##  Getting Started (30 seconds)

```bash
# 1. Navigate to project
cd mfa-auth-system

# 2. Install (first time only)
npm install

# 3. Run
npm start
```

App opens at **http://localhost:3000**

---

##  Demo Accounts

### Standard User
```
Username: demo_user
Password: Demo@123
```

### Admin User
```
Username: admin
Password: Admin@123
```

### MFA Codes
```
TOTP: Enter ANY 6 digits (000000 - 999999)
SMS:  123456
```

---

##  Main Features

| Feature | Description |
|---------|-------------|
| **Dual MFA** | TOTP (Authenticator) + SMS |
| **Account Security** | Lockout after 3 failed attempts |
| **Backup Codes** | 10 unique recovery codes generated |
| **QR Code** | Scan with Google Authenticator, Authy, Microsoft Authenticator |
| **Activity Log** | Real-time security event tracking |
| **Password Toggle** | Show/hide password field |
| **Copy Codes** | One-click copy to clipboard |

---

##  Project Structure

```
src/
├── App.js              → Main component (~ 600 lines)
├── App.css             → Comprehensive styles
├── index.js            → React entry point
├── index.css           → Global styles
└── setupTests.js       → Test config
```

---




 # UI/UX
- ✓ Modern gradient background
- ✓ Password visibility toggle
- ✓ Real-time lockout countdown timer
- ✓ Clear error messages
- ✓ Smooth animations
- ✓ Mobile responsive
- ✓ Accessibility features

### Security Features
- ✓ Input validation
- ✓ Account lockout mechanism
- ✓ Security event logging
- ✓ Backup code generation
- ✓ QR code for authenticator setup

---

##  Security Flow

```
1. LOGIN
   ↓
2. MFA VERIFICATION (TOTP or SMS)
   ↓
3. DASHBOARD (Protected area)
   ↓
4. LOGOUT (Clear session)
```

### Account Lockout Logic
```
Attempt 1: Failed  (2 remaining)
Attempt 2: Failed  (1 remaining)
Attempt 3: Failed   LOCKED for 5 minutes
After 5 min: Automatically unlocked
```

---

##  Usage Tips

1. **First Time**: Click "Setup New Authenticator" to see backup codes
2. **Backup Codes**: Click copy icon to save each code
3. **QR Code**: Use Google Authenticator or Authy to scan
4. **View Logs**: Click "View Security Logs" on dashboard
5. **Logout**: Click "Logout" button to end session


---

##  Responsive Design

- ✓ Works on desktop, tablet, mobile
- ✓ Optimized for all screen sizes
- ✓ Touch-friendly buttons
- ✓ Mobile-first approach

---

##  Component Architecture

### Views
1. **LoginView** - Username/password entry
2. **MFAView** - TOTP/SMS verification
3. **DashboardView** - Main user dashboard

### Features
- Dual method selection
- QR code & backup code display
- Security activity logging
- Account lockout protection

---

##  Key Functions

| Function | Purpose |
|----------|---------|
| `handleLogin()` | Process login credentials |
| `handleMFAVerification()` | Verify TOTP or SMS code |
| `handleMFASetup()` | Generate backup codes & QR |
| `handleLogout()` | Clear session & return to login |
| `addLog()` | Track security events |
| `copyToClipboard()` | Copy codes to clipboard |

---


##  Component States

### LoginView States
- ✓ Username/password fields
- ✓ Show/hide password
- ✓ Error messages
- ✓ Account lockout warning
- ✓ Attempt counter
- ✓ Demo credentials display

### MFAView States
- ✓ TOTP method
- ✓ SMS method
- ✓ Code input field
- ✓ Error messages
- ✓ Verify button

### DashboardView States
- ✓ Welcome card
- ✓ Security status cards
- ✓ MFA management section
- ✓ Backup codes/QR code display
- ✓ Security activity log

---

 
**Status**: Production Ready (Demo)  
**License**: MIT
