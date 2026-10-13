import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# describe directions in terms of mountains and rivers rather than left and right → 左右というよりむしろ山や川の観点から方角を表す
# （並列の名詞句 + rather than + 名詞句: 並列全体と比べる。「左と権利よりむしろ方向を」にしない）
rep("""    const ja = then ? items.slice(0, -1).map((x) => x.ja).join('と') + '、それから' + last.ja : items.map((x) => x.ja).join(conj === 'or' ? 'か' : 'と');
    return { ja: ja, end: j, an: items.every((x) => x.an), pl: true, coord: true,
      time: items.every((x) => x.time), head: first.head };""",
    """    const ja = then ? items.slice(0, -1).map((x) => x.ja).join('と') + '、それから' + last.ja : items.map((x) => x.ja).join(conj === 'or' ? 'か' : 'と');
    if (!o.noThan && !then && isW(T[j], 'rather') && isW(T[j + 1], 'than') && j + 2 < lim) {
      const mRc = mark();
      const bRc = np(j + 2, lim, Object.assign({}, o, { noThan: true }));
      if (bRc) { name('comparative'); return { ja: bRc.ja + 'というよりむしろ' + ja, end: bRc.end, an: items.every((x) => x.an), pl: true, coord: true, head: first.head }; }
      fail(mRc);
    }
    return { ja: ja, end: j, an: items.every((x) => x.an), pl: true, coord: true,
      time: items.every((x) => x.time), head: first.head };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
