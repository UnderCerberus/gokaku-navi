import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "      const wcTw = kTw > 0 && stTw.time.length && !stTw.other.length ? whClause(kTw, lim) : null;\n      if (wcTw && wcTw.end === lim) {"
new = "      WH_MAINPAST = !!vg.past;\n      const wcTw = kTw > 0 && stTw.time.length && !stTw.other.length ? whClause(kTw, lim) : null;\n      WH_MAINPAST = false;\n      if (wcTw && wcTw.end === lim) {\n        wcTw.str = wcTw.str.replace(new RegExp('^' + ({ me: '私', us: '私たち', him: '彼', her: '彼女', them: '彼ら', you: 'あなた' })[T[i].w] + 'が'), '').replace(new RegExp('^(どこ|いつ|なぜ|どのように|何)([^、。]{0,4}?)' + ({ me: '私', us: '私たち', him: '彼', her: '彼女', them: '彼ら', you: 'あなた' })[T[i].w] + 'が'), '$1$2');"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
