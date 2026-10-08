import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/記録の(利益|売上|高さ|気温|数|人数|量|収益)/g, '過去最高の$1')"
assert s.count(old) == 1
s = s.replace(old, "    if (tokens.some((x, q) => /^(?:vote|votes|voted)$/.test(x.w || '') && tokens[q + 1] && tokens[q + 1].w === 'to')) ja = ja.replace(/([^、。]+?)するために投票(した|する)/, (m0, a0, b0) => a0 + 'することを投票で決め' + (b0 === 'した' ? 'た' : 'る'));   // The town council voted to ban plastic bags → ビニール袋を禁止することを投票で決めた\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
