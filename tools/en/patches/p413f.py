import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/^([^、。]{1,10}?)は来ている(?=。|$)/, '$1は来る');"
assert s.count(old) == 1
s = s.replace(old, ".replace(/^((?:彼|彼女|彼ら|私|私たち|あなた|あなたたち|みんな)(?:たち)?)は来ている(?=。|$)/, '$1は来る');\n    }\n    if (tokens.some((x, q) => x.w === 'coming' && tokens[q + 1] && tokens[q + 1].w === 'to' && tokens[q + 2] && /^(?:an|the)$/.test(tokens[q + 2].w || '') && tokens[q + 3] && tokens[q + 3].w === 'end')) {\n      ja = ja.replace(/終わっている(?=。|$)/, '終わりに近づいている').replace(/終わっていた(?=。|$)/, '終わりに近づいていた');   // Winter is coming to an end → 冬は終わりに近づいている")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
