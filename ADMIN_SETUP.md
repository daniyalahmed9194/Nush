# Admin Setup Instructions

## Setting Admin Credentials

The admin credentials are stored securely in environment variables. You can customize them in the `.env` file.

### Step 1: Edit `.env` File

Open the `.env` file and set your own credentials:

```env
# Admin Credentials - CHANGE THESE TO YOUR OWN SECRET VALUES!
ADMIN_USERNAME=your_secret_username
ADMIN_PASSWORD=your_secure_password_here
ADMIN_NAME=Your Display Name
```

### Step 2: Security Best Practices

**Strong Password Guidelines:**
- Minimum 8 characters
- Mix of uppercase and lowercase letters
- Include numbers and special characters
- Example: `MyR3st@ur@nt2026!`

**Important Security Notes:**
- ⚠️ **NEVER** commit the `.env` file to version control (it's already in `.gitignore`)
- 🔒 Keep your credentials secret
- 📝 Store them in a password manager
- 🔄 Change the password periodically

### Step 3: First Time Setup

1. **Set your credentials** in `.env`:
   ```env
   ADMIN_USERNAME=nushadmin
   ADMIN_PASSWORD=SecurePass@2026
   ADMIN_NAME=Restaurant Manager
   ```

2. **Delete existing admin** (if you want to reset):
   - Connect to your database
   - Run: `DELETE FROM admins WHERE username = 'admin';`
   
   Or simply change the username in `.env` and restart the server.

3. **Restart the server**:
   ```bash
   npm run dev
   ```

4. **Login** at `http://localhost:5000/admin/login` with your new credentials

### Step 4: Share Credentials with Client

**SECURE METHOD - Share via:**
- 🔐 Password manager (1Password, LastPass, etc.)
- 📧 Encrypted email
- 💬 Secure messaging app (Signal, WhatsApp)
- 📱 Phone call for verbal communication

**Provide to client:**
```
Admin Dashboard URL: https://your-domain.com/admin/login
Username: [The username you set]
Password: [The password you set]

⚠️ Please keep these credentials secure and do not share them.
```

### Default Credentials (Initial Setup)

If you haven't changed the `.env` file, these are the current defaults:

```
Username: nushadmin
Password: SecurePass@2026
```

**⚠️ CHANGE THESE IMMEDIATELY FOR PRODUCTION!**

### Troubleshooting

**Problem:** Can't login with new credentials
- **Solution:** Restart the server after changing `.env`
- If still not working, delete the old admin from database and restart

**Problem:** Admin already exists error
- **Solution:** The username already exists in database
  - Either use a different username in `.env`
  - Or delete the existing admin from database

### Database Management

To manually check or delete admin users:

```sql
-- View all admins
SELECT id, username, name, created_at FROM admins;

-- Delete an admin
DELETE FROM admins WHERE username = 'old_username';
```

Then restart the server to create new admin with your `.env` credentials.
