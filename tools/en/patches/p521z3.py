import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# She did nothing wrong → 間違ったことは何もしなかった / Nothing bad happened → 悪いことは何も起こらなかった
# Did you see anything interesting? → 何か興味深いものを見ましたか / I didn't see anything interesting → 興味深いものは何も見なかった（悪い何も・興味深い何か にしない。肯定文の Anyone interested can apply は従来どおり 誰でも）
rep("""          return postMod({ ja: adjJ + p.ja, end: aj.end, an: !!p.an, pron: t.w, neg: !!p.neg, bare: !!p.neg, any: p.any || '', adjMod: true }, lim, o);
""",
    """          const toAbN = !!(T[aj.end] && /^(?:to|about)$/.test(T[aj.end].w || ''));
          if (/^(?:nothing|nobody)$/.test(t.w) && /^(?:何も|誰も)$/.test(p.ja) && !toAbN) return postMod({ ja: adjJ + (t.w === 'nobody' ? '人' : 'こと') + 'は' + p.ja, end: aj.end, an: !!p.an, pron: t.w, neg: true, bare: true, any: '', adjMod: true }, lim, o);
          if (/^(?:anything|anyone|anybody)$/.test(t.w) && /^(?:何か|誰か)$/.test(p.ja) && !toAbN && !deg && !aj.deg && aj.form !== 'comp') { const hdA = t.w === 'anything' ? 'もの' : '人'; const qA = Q_DEPTH > 0 || T.some((x) => /^(?:if|whether)$/.test(x.w || '')); return postMod({ ja: qA ? p.ja + adjJ + hdA : adjJ + p.ja, end: aj.end, an: !!p.an, pron: t.w, neg: false, bare: false, any: p.any ? adjJ + hdA + 'は' + p.any : '', adjMod: true }, lim, o); }
          return postMod({ ja: adjJ + p.ja, end: aj.end, an: !!p.an, pron: t.w, neg: !!p.neg, bare: !!p.neg, any: p.any || '', adjMod: true }, lim, o);
""")
# 疑問文（平叙文に組み替えて読む）の中かどうか
rep("""  function question(a, b) {
    const m = mark();
    name('question');""",
    """  let Q_DEPTH = 0;
  function question(a, b) { Q_DEPTH++; try { return question0(a, b); } finally { Q_DEPTH--; } }
  function question0(a, b) {
    const m = mark();
    name('question');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
