import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the water and energy used to grow and transport the food → 食べ物を育てて輸送するために使われる水とエネルギー
# （the + 名詞 and 冠詞のない名詞 + 分詞・関係詞の後置修飾は、並列の全体にかける。水と…エネルギー にしない）
rep("""    const ja = then ? items.slice(0, -1).map((x) => x.ja).join('と') + '、それから' + last.ja : items.map((x) => x.ja).join(conj === 'or' ? 'か' : 'と');
    return { ja: ja, end: j, an: items.every((x) => x.an), pl: true, coord: true,""",
    """    if (items.length === 2 && !then && isW(T[i], 'the') && first.end === i + 2 && isW(T[first.end], conj) && T[first.end + 1] && T[first.end + 1].k === 'w' && DET[T[first.end + 1].w] === undefined && !PRON[T[first.end + 1].w] && last.end > first.end + 2 && T[first.end + 2].k === 'w' && ((!!vc(T[first.end + 2], ['pp', 'ing']) && !nounC(T[first.end + 2])) || /^(?:who|which|that)$/.test(T[first.end + 2].w))) {
      const mSc = mark();
      const h2c = np1(first.end + 1, first.end + 2, { noPost: true });
      const allC = h2c && h2c.end === first.end + 2 ? postMod({ ja: first.ja + (conj === 'or' ? 'か' : 'と') + h2c.ja, end: first.end + 2, head: h2c.head, pl: true, coord: true, an: !!first.an && !!h2c.an }, lim, o) : null;
      if (allC && allC.end === last.end) return Object.assign({}, allC, { pl: true, coord: true });
      fail(mSc);
    }
    const ja = then ? items.slice(0, -1).map((x) => x.ja).join('と') + '、それから' + last.ja : items.map((x) => x.ja).join(conj === 'or' ? 'か' : 'と');
    return { ja: ja, end: j, an: items.every((x) => x.an), pl: true, coord: true,""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
