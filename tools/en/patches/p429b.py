import io
p = r'C:\Claude\gokaku-navi\js\data\idioms.js'
s = io.open(p, encoding='utf-8').read()
old = "    ['pose ~ to ~', '〜に〜をもたらす', 3],"
assert s.count(old) == 1
s = s.replace(old, "    ['pose A to B', 'BにAをもたらす', 3],")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)

p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/危険を(下げ|減ら|高め|上げ|減少させ|増加させ)/g, 'リスクを$1')"
assert s.count(old) == 1
s = s.replace(old, """    ja = ja.replace(/まだ([^、。]+?)(ためらう|嫌がる)(。?)$/, (m0, a0, b0, c0) => 'まだ' + a0 + (b0 === 'ためらう' ? 'ためらっている' : '嫌がっている') + c0).replace(/海外へ((?:その|自らの)?成功を)([^、。]*?)売上/, '$1海外での$2売上').replace(/強い売上/g, '好調な売上');   // remain hesitant to buy them → まだ…ためらっている / attributed its success to strong sales overseas → 成功を海外での好調な売上によるものだと考えた
    if (tokens.some((x, q) => x.w === 'home' && tokens[q + 1] && tokens[q + 1].w === 'to' && tokens[q - 1] && /^(?:is|are|was|were)$/.test(tokens[q - 1].w || ''))) ja = ja.replace(/^([^、。]+?)は([^、。]+?)が(ある|いる|生息している)/, '$1には$2が$3').replace(/([0-9０-９]+(?:万|千|百)?)以上の(美術品|作品|絵画)/, '$1点以上の$2');   // The museum is home to more than 10,000 works of art → 博物館には1万点以上の美術品がある
""" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
