import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/知識の隙間/g, '知識の空白')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/([^、。]{1,10})にただ(重要|大切|必要|有名|役立つ)(ではなかった|ではない|でなかった)/g, (m0, a0, b0, c0) => a0 + 'にとって' + b0 + (/なかった$/.test(c0) ? 'だっただけではない' : 'なだけではない').replace(/^役立つなだけ/, '役立つだけ'));   // was not only important for trade → 貿易にとって重要だっただけではない\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
