import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """ja = ja.replace(/([^、。]{1,8}?)することから([^、。]{1,10}?)を禁止(し|す)/, '$2が$1することを禁止$3').replace(/([^、。]{1,8}?)ることから([^、。]{1,10}?)を禁止(し|す)/, '$2が$1ることを禁止$3');"""
assert s.count(old) == 1
s = s.replace(old, """ja = ja.replace(/([^、。はが]{1,8}?)ことから([^、。]{1,10}?)を禁止(し|す)/, (m0, a0, b0, c0) => { const lt = /^(後で|のちに|その後)/.exec(a0); const v0 = (lt ? a0.slice(lt[1].length) : a0).replace(/^行う$/, '演じる'); return (lt ? lt[1] : '') + b0 + 'が' + v0 + 'ことを禁止' + c0; });
    if (tokens.some((x) => /^(?:kabuki|theater|theatre|stage|actor|actors|actress|performers|performer|drama|play|plays|musical|opera)$/.test(x.w || '')) || tokens.some((x, q) => x.w === 'roles' && tokens[q - 1] && /^(?:the|all)$/.test(tokens[q - 1].w || ''))) ja = ja.replace(/(すべての|主|女性の|男性の)?役割を果たし/g, (m0, a0) => (a0 || '') + '役を演じ');   // men began to play all the roles → 男性がすべての役を演じ始めた
    ja = ja.replace(/(ユネスコ|国連|政府|世界保健機関)に(.{1,30}?)として(?:認識|認め)られている/, '$1によって$2として認められている').replace(/として認識されている/g, 'として認められている');   // recognized by UNESCO as … → ユネスコによって…として認められている""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
