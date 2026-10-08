# syntax.js などに紛れ込んだ制御文字（\x00-\x08 など）を探す: python tools/en/ctrl-scan.py
import io, re, sys
files = sys.argv[1:] or [r'C:\Claude\gokaku-navi\js\english\syntax.js']
for p in files:
    s = io.open(p, encoding='utf-8').read()
    for m in re.finditer(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', s):
        ln = s.count('\n', 0, m.start()) + 1
        ctx = s[max(0, m.start() - 40):m.start() + 20].replace('\n', ' ')
        print('%s:%d %r  %s' % (p.split('\\')[-1], ln, m.group(), ctx))
