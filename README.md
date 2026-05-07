. បង្កើត SSH Key

ssh-keygen -t ed25519 -C "example@gmail.com"
→ បង្កើត key ២ ប្រភេទ:

cmd or Ctrl+J

  ~/.ssh/id_ed25519 → Private key (កុំចែករំលែក!)
  
  ~/.ssh/id_ed25519.pub → Public key (ដាក់ GitHub)

២. Copy Public Key ទៅ GitHub
ssh-ed25519 AAAAC3NzaC1J37KXGRvKJVGtz example@gmail.com

https://github.com/settings/keys
  
  GitHub Settings → SSH Keys → "ThinkPad T470p" or "My Laptop"

៣. Test Connection

ssh -T git@github.com
→ GitHub បានឆ្លើយ: "Hi Nha0325!" ✅

៤. Push Code

git push -u origin main
→ Code ទៅដល់ GitHub ជោគជ័យ ✅


Every time you write new code and want to push
git add .
git commit -m "add login page"
git push

command run Tailwin

npx @tailwindcss/cli -i ./src/assets/style/input.css -o ./src/assets/style/output.css --watch
