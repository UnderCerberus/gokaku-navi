import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Many language-learning apps → 多くの言語学習のアプリ / problem-solving skills → 問題解決の技能
# （辞書にないハイフン語「名詞-ing」は名詞 + 動名詞の名詞（learning → 学習・solving → 解決）として読む）
rep("""  function A(t) {
    if (t.an) return t.an;
    let as = t.k === 'w' && en.analyze ? en.analyze(t.w) : [];""",
    """  function A(t) {
    if (t.an) return t.an;
    let as = t.k === 'w' && en.analyze ? en.analyze(t.w) : [];
    if (!as.length && t.k === 'w' && /^[a-z]+-[a-z]+ing$/.test(t.w) && en.analyze) {
      const [hA, hB] = t.w.split('-');
      const first = (w, pos) => { const xs = en.analyze(w) || []; for (const x of xs) for (const e of x.entries) if (e.pos === pos) return { x, e }; return null; };
      const nA = first(hA, '名');
      const nB = first(hB, '名'), vB = nB ? null : first(hB.replace(/ing$/, ''), '動') || first(hB.replace(/ing$/, 'e'), '動') || first(hB.replace(/([a-z])\\1ing$/, '$1'), '動');
      const jA = nA ? String(nA.e.ja).split(/[;；]/)[0].replace(/[〜…]/g, '').trim() : '';
      let jB = nB ? String(nB.e.ja).split(/[;；]/)[0].replace(/[〜…]/g, '').trim() : '';
      if (!jB && vB) { const c = String(vB.e.ja).split(/[;；]/)[0].replace(/^[〜…](?:を|に|と)?/, '').trim(); if (/^[一-龯ァ-ヶー]+する$/.test(c)) jB = c.replace(/する$/, ''); }
      if (jA && jB) as = [{ lemma: t.w, form: 'base', entries: [{ pos: '名', ja: jA + jB, lv: 3, w: t.w }] }];
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
