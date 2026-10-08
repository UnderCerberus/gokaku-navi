import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/自分の誇りに思/g, '自分を誇りに思');"
assert s.count(old) == 1
s = s.replace(old, old + "\n    ja = ja.replace(/夜の空/g, '夜空');\n    if (tokens.some((x, q) => x.w === 'so' && tokens[q + 1] && /^(?:many|much)$/.test(tokens[q + 1].w || ''))) ja = ja.replace(/数えられなかった/g, '数えきれなかった').replace(/数えられない/g, '数えきれない');   // so many stars that I couldn't count them → 数えきれなかった")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
