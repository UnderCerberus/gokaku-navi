import io, re
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
lines = io.open(p, encoding='utf-8').read().split('\n')
pat = re.compile(r'(Object\.assign\(\{\}, [^{};]*?, \{ )(w: )')
n = 0
for k, line in enumerate(lines):
    if 'Object.assign({}, ' in line and '{ w: ' in line and 'an: undefined' not in line:
        new, c = pat.subn(lambda m: m.group(1) + 'an: undefined, ' + m.group(2), line)
        if c:
            lines[k] = new
            n += c
io.open(p, 'w', encoding='utf-8', newline='\n').write('\n'.join(lines))
print('patched', n)
