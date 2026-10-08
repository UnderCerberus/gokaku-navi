import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/偉大そうに見え/g, 'すてきに見え')"
new = "    if (!tokens.some((x, q) => x.w === 'on' && tokens[q + 1] && /^(?:you|me|him|her|them|us)$/.test(tokens[q + 1].w || ''))) ja = ja.replace(/偉大そうに見え/g, 'すてきに見え');\n    ja = ja"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
