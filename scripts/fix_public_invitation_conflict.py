from pathlib import Path
import re

path = Path('apps/frontend-user/src/pages/public/PublicInvitationPage.jsx')
text = path.read_text(encoding='utf-8')
pattern = re.compile(r'<<<<<<< HEAD\nfunction safeJson\(value, fallback = \{\}\) \{.*?\n=======\nfunction safeJson\(value\) \{.*?\n>>>>>>> main', re.S)
replacement = '''function safeJson(value, fallback = {}) {
    if (!value) return fallback;
    if (typeof value === "object") return value;
    if (typeof value !== "string") return fallback;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}'''
new_text, count = pattern.subn(replacement, text)
if count != 1:
    raise SystemExit(f'Expected 1 replacement, found {count}')
path.write_text(new_text, encoding='utf-8')
print(f'updated {count}')
