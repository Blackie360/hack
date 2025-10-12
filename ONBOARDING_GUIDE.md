# VaultSync E2EE Member Onboarding Guide

## Overview
VaultSync uses end-to-end encryption (E2EE) to protect your secrets. Each organization has a single encryption key that is wrapped (encrypted) separately for each member using their device public key.

## How It Works

### 1. Owner Creates Organization
- When the owner logs in for the first time, their device generates:
  - A random **device keypair** (stored in browser localStorage)
  - A random **organization encryption key** (32 bytes)
- The org key is wrapped (encrypted) with the owner's device public key and stored in the database
- The owner can now create projects and secrets

### 2. Owner Invites Members
- Owner goes to **Members** page → **Invite Member**
- Member receives an invitation email
- Member accepts and joins the organization

### 3. Member Needs Onboarding
- When the member logs in, they:
  - Generate their own device keypair
  - Register their device public key in the database
  - **But they don't have the org encryption key yet!**
- Member will see a yellow **"Pending Access"** banner on the dashboard

### 4. Owner Onboards Members
- Owner visits **Settings** → **Onboard Members** section
- Click **"Onboard N Member(s)"** button
- The owner's browser:
  - Decrypts the org key using their device key
  - Re-wraps (re-encrypts) it for each member's device public key
  - Saves the wrapped keys to the database

### 5. Member Can Access Secrets
- Member refreshes the page
- The app auto-decrypts the org key using their device key
- Member can now view and decrypt all secrets!

## User Flows

### Owner Flow
```
1. Log in → Auto-generates device key & org key
2. Create projects and secrets (encrypted with org key)
3. Invite members
4. Go to Settings → Onboard Members
5. All members can now decrypt secrets ✅
```

### Admin Flow
- Same as members (read/write access to secrets)
- Can invite other members
- Cannot onboard members (owner-only feature)

### Member Flow  
```
1. Accept invitation → Join org
2. Log in → Auto-generates device key
3. See "Pending Access" banner
4. Wait for owner to onboard
5. Refresh page → Can now decrypt secrets ✅
```

## Troubleshooting

### "The provided data is too small" Error
- This means the member is trying to decrypt secrets encrypted with a key they don't have
- **Solution**: Owner must onboard the member via Settings

### Member Can't See Secrets
- Check console logs:
  - `⚠️ Member has no wrapped key` → Owner needs to onboard
  - `✅ Auto-unlocked successfully` → Member is onboarded

### Owner Lost Device
- If owner loses their device, they can recover using the **Recovery Passphrase**
- Set this up in **Settings** → **Recovery Passphrase**

## Key Points
1. **Device keys never leave the browser** (stored in localStorage)
2. **Org key never touches the server unencrypted** (always wrapped)
3. **Owner must onboard members** after they join
4. **Auto-unlock is seamless** once onboarded
5. **Members are read-only** by default (can view/copy, not edit/delete)

## API Endpoints
- `GET /api/org-keys` - Fetch wrapped org key for current member
- `POST /api/org-keys` - Save wrapped org key
- `GET /api/members-with-keys` - List members and their onboarding status
- `POST /api/rewrap-member-keys` - Owner re-wraps org key for members
- `POST /api/member-device-keys` - Register member's device public key

## Security Model
- **NaCl Sealed Boxes** (XSalsa20-Poly1305) for wrapping org keys
- **AES-256-GCM** for encrypting secrets
- **PBKDF2** (fallback from Argon2id) for recovery passphrase
- **Row Level Security (RLS)** on all database tables

