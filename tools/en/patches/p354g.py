import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
fixes = [
    ("(彼ら|彼|彼女|私たち)が\x01の/g, '$1が')", "(彼ら|彼|彼女|私たち)が\\1の/g, '$1が')"),
    ("t.w.replace(/([b-df-hj-np-tv-z])\x01er$/, '$1')", "t.w.replace(/([b-df-hj-np-tv-z])\\1er$/, '$1')"),
]
for bad, good in fixes:
    assert s.count(bad) == 1, (s.count(bad), bad)
    s = s.replace(bad, good)
assert '\x01' not in s, 'still has \\x01'
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
