import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    return !!nx && nx.k === 'w' && !PREP[nx.w] && (DET[nx.w] !== undefined || !!PRON[nx.w] || !!nounC(nx));\n  }\n  function passiveOK"
new = "    return !!nx && nx.k === 'w' && !PREP[nx.w] && !/^(?:today|tonight|now|tomorrow|yesterday|nowadays|anymore|again|too|also|either|here|there|these|lately|recently)$/.test(nx.w) && (DET[nx.w] !== undefined || !!PRON[nx.w] || !!nounC(nx));   // they are still interesting today の today は目的語ではない\n  }\n  function passiveOK"
assert s.count(old) == 1, s.count(old)
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
