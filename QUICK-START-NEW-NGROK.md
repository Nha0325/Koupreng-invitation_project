# ⚡ Quick Start - New Ngrok Account

## You Have New Authtoken: `3EnYe7vqheYCHq9CTwCJmmEBh5d_2iSBy8bSR1dhKJLGjh1jR`

---

## 🚀 What to Do (4 Steps):

### 1️⃣ Configure Ngrok (ONE TIME ONLY)

```bash
ngrok config add-authtoken 3EnYe7vqheYCHq9CTwCJmmEBh5d_2iSBy8bSR1dhKJLGjh1jR
```

✅ Done! Never need to do this again.

---

### 2️⃣ Start Your App

```bash
./dev.sh
```

Wait for this line:
```
Public URL  → https://YOUR-DOMAIN.ngrok-free.dev
```

Copy the domain (no https://): `YOUR-DOMAIN.ngrok-free.dev`

---

### 3️⃣ Tell Telegram Your Domain

**In Telegram app:**

1. Search: `@BotFather`
2. Send: `/setdomain`
3. Click: `@koupreng_invitation_bot`
4. Send: `YOUR-DOMAIN.ngrok-free.dev` (paste what you copied, no https://)
5. Wait: "Success! Domain updated."

---

### 4️⃣ Test

Open browser:
```
https://YOUR-DOMAIN.ngrok-free.dev/login
```

✅ Telegram login should work!

---

## 🔄 Next Time You Restart:

**Step 1** → Skip (already done)  
**Step 2** → Run `./dev.sh` → Copy NEW domain  
**Step 3** → Update BotFather with NEW domain  
**Step 4** → Test with NEW URL

---

## 💡 Easier Way (Recommended):

### Use Localhost - Set Once, Never Change:

**ONE TIME:**
1. Telegram → @BotFather → `/setdomain`
2. Click: `@koupreng_invitation_bot`
3. Send: `localhost`

**EVERY TIME:**
```bash
./dev.sh --no-ngrok
```
Open: `http://localhost:5173/login`

✅ Never update BotFather again!

---

See `START-FROM-ZERO-NGROK.md` for detailed explanation.
