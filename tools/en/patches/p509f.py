import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 複合語の並列: solar and wind power → 太陽光発電と風力発電（W1 and W2 HEAD）/ a sense of purpose and belonging → 目的意識と帰属意識（X of Y and Z）
rep("""  function multiAt(k, lim) {
    for (let len = 4; len >= 2; len--) {                       // man of few words（4 語の見出し語まで）""",
    """  function dictN(key) {
    const es = JK.dict && JK.dict.words && Object.prototype.hasOwnProperty.call(JK.dict.words, key) ? JK.dict.words[key] : null;
    return es ? es.filter((x) => x.pos === '名')[0] || null : null;
  }
  function multiAt(k, lim) {
    if (k + 3 < lim + 1 && T[k] && T[k].k === 'w' && isW(T[k + 1], 'and') && T[k + 2] && T[k + 2].k === 'w' && T[k + 3] && T[k + 3].k === 'w' && k + 4 <= lim && !isW(T[k - 1], 'both') && !(T[k].w === 'physical' && T[k + 2].w === 'mental')) {
      const hd = T[k + 3].w, hdS = (A(T[k + 3]).find((a) => a.form === 'pl') || {}).lemma;
      for (const h of [hd, hdS]) {
        if (!h) continue;
        const e1 = dictN(T[k].w + ' ' + h), e2 = e1 ? dictN(T[k + 2].w + ' ' + h) : null;
        if (e1 && e2) return { e: { w: T[k].w + ' and ' + T[k + 2].w + ' ' + h, pos: '名', ja: en.jp.first(e1.ja) + 'と' + en.jp.first(e2.ja), lv: e1.lv }, len: 4, pl: true };
      }
    }
    if (k + 4 < lim && T[k] && T[k].k === 'w' && isW(T[k + 1], 'of') && T[k + 2] && T[k + 2].k === 'w' && isW(T[k + 3], 'and') && T[k + 4] && T[k + 4].k === 'w') {
      const e1 = dictN(T[k].w + ' of ' + T[k + 2].w), e2 = e1 ? dictN(T[k].w + ' of ' + T[k + 4].w) : null;
      if (e1 && e2) return { e: { w: T[k].w + ' of ' + T[k + 2].w + ' and ' + T[k + 4].w, pos: '名', ja: en.jp.first(e1.ja) + 'と' + en.jp.first(e2.ja), lv: e1.lv }, len: 5, pl: true };
    }
    for (let len = 4; len >= 2; len--) {                       // man of few words（4 語の見出し語まで）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
