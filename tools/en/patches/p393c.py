import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """          if (jaNt === rNt.ja) jaNt = rNt.ja.replace(/^(.*?)([一-龠ァ-ヶー]+する|[一-龠][ぁ-ん]{0,4}(?:る|う|く|ぐ|す|つ|ぬ|ぶ|む))(ことは|のは|ことが)/, negNt);"""
new = old + """
          if (jaNt === rNt.ja) jaNt = rNt.ja.replace(/^(.*[をにがでとへはも、]|)([^、。をにがでとへはも]+)必要が(ある|あった)/, (m0, a0, v0, e0) => { const rN = negNt(m0, a0, v0); return rN === m0 ? m0 : rN + '必要' + (e0 === 'ある' ? 'だ' : 'だった'); });   // It is necessary not to waste water → 水を無駄にしないことが必要だ"""
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
