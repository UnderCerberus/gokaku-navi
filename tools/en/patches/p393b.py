import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """          const jaNt = rNt.ja.replace(/^(.*?)([一-龠ァ-ヶー]+する|[一-龠][ぁ-ん]{0,4}(?:る|う|く|ぐ|す|つ|ぬ|ぶ|む))(ことは|のは|ことが)/, (m0, a0, v0) => { try { const pNt = P(v0); return verbal(pNt) ? a0 + pNt.aux('neg').plain() + 'ことが' : m0; } catch (eNt) { return m0; } });"""
new = """          const negNt = (m0, a0, v0) => { try { const pNt = P(v0); return verbal(pNt) && /(?:る|う|く|ぐ|す|つ|ぬ|ぶ|む)$/.test(v0) ? a0 + pNt.aux('neg').plain() + 'ことが' : m0; } catch (eNt) { return m0; } };
          let jaNt = rNt.ja.replace(/^(.*[をにがでとへはも、]|)([^、。をにがでとへはも]+)(ことは|のは|ことが)/, negNt);
          if (jaNt === rNt.ja) jaNt = rNt.ja.replace(/^(.*?)([一-龠ァ-ヶー]+する|[一-龠][ぁ-ん]{0,4}(?:る|う|く|ぐ|す|つ|ぬ|ぶ|む))(ことは|のは|ことが)/, negNt);"""
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
