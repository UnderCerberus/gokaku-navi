import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the noise and crowds of the city → 都市の騒音と群衆（the + 名詞 and 名詞 + of the 〜: 限定詞を共有する 2 語の後ろの of 句は両方にかかる）
rep("""    const ja = then ? items.slice(0, -1).map((x) => x.ja).join('と') + '、それから' + last.ja : items.map((x) => x.ja).join(conj === 'or' ? 'か' : 'と');
    return { ja: ja, end: j, an: items.every((x) => x.an), pl: true, coord: true,""",
    """    if (items.length === 2 && conj === 'and' && !then && isW(T[i], 'the') && first.end === i + 2 && isW(T[first.end], 'and') && last.end > first.end + 4 && T[first.end + 1].k === 'w' && DET[T[first.end + 1].w] === undefined && !PRON[T[first.end + 1].w] && isW(T[first.end + 2], 'of') && T[first.end + 3] && /^(?:the|their|his|her|its|our|my|your|this|these|that|those)$/.test(T[first.end + 3].w || '')) {
      const mSh = mark();
      const h2 = np1(first.end + 1, first.end + 2, { noPost: true });
      const ofN = h2 ? np(first.end + 3, last.end, { noCoord: true }) : null;
      if (h2 && h2.end === first.end + 2 && ofN && ofN.end === last.end && !/の/.test(first.ja)) return { ja: ofN.ja + 'の' + first.ja + 'と' + h2.ja, end: j, an: first.an && h2.an, pl: true, coord: true, head: first.head };
      fail(mSh);
    }
    const ja = then ? items.slice(0, -1).map((x) => x.ja).join('と') + '、それから' + last.ja : items.map((x) => x.ja).join(conj === 'or' ? 'か' : 'と');
    return { ja: ja, end: j, an: items.every((x) => x.an), pl: true, coord: true,""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
