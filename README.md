                                                                    ./+o+-       root@star-ThinkPad-T470p
                                                            yyyyy- -yyyyyy+      OS: Ubuntu 26.04 resolute
                                                        ://+//////-yyyyyyo      Kernel: x86_64 Linux 7.0.0-14-generic
                                                    .++ .:/++++++/-.+sss/`      Uptime: 1d 18h 30m
                                                  .:++o:  /++++++++/:--:/-      Packages: 2378
                                                  o:+o+:++.`..```.-/oo+++++/     Shell: bash 5.3.9
                                                .:+o:+o/.          `+sssoo+/    Resolution: 3072x1728
                                            .++/+:+oo+o:`             /sssooo.   WM: Mutter
                                          /+++//+:`oo+o               /::--:.   WM Theme: Adwaita
                                          \+/+o+++`o++o               ++////.   GTK Theme: Yaru [GTK3]
                                            .++.o+++oo+:`             /dddhhh.   Disk: 341G / 474G (74%)
                                                .+.o+oo:.          `oddhhhh+    CPU: Intel Core i5-7300HQ @ 4x 3.5GHz [56.0°C]
                                                  \+.++o+o``-````.:ohdhhhhh+     GPU: Mesa Intel(R) HD Graphics 630 (KBL GT2)
                                                  `:o+++ `ohhhhhhhhyo++os:      RAM: 7685MiB / 31325MiB
                                                    .o:`.syhhhhhhh/.oo++o`     
                                                        /osyyyyyyo++ooo+++/    
                                                            ````` +oo+++o\:    
                                                                    `oo++.    

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
