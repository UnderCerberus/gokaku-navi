import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# lives alone on a small island in the south of Japan → 日本の南の小さい島に一人で暮らしている
# （場所の名詞 + in the north / south … of + 名詞句 は名詞にかける。「小さい島に日本の南に」にしない）
rep("""      // came from Asian countries such as China and South Korea → 中国や韓国のようなアジアの国から（such as は前置詞の目的語の中でも名詞にかける）
      if (!o.pp && !o.noPost && seq(j, ['such', 'as']) && j + 2 < lim && !node.pron) {""",
    """      if (!node.pron && !o.noPost && isW(t, 'in') && isW(T[j + 1], 'the') && T[j + 2] && /^(?:north|south|east|west|northeast|northwest|southeast|southwest|center|centre|middle|heart)$/.test(T[j + 2].w || '') && isW(T[j + 3], 'of') && j + 4 < lim &&
        /^(?:island|islands|town|towns|city|cities|village|villages|country|countries|region|regions|area|areas|house|houses|school|schools|farm|farms|port|lake|lakes|mountain|mountains|forest|forests|river|rivers|coast|beach|state|states|province|prefecture|place|places|community|communities|hotel|temple|shrine|castle|park)$/.test(node.head || '')) {
        const mDr = mark();
        const nDr = np(j + 4, lim, { noRel: true, noCoord: true });
        const DRJ = { north: '北', south: '南', east: '東', west: '西', northeast: '北東', northwest: '北西', southeast: '南東', southwest: '南西', center: '中心', centre: '中心', middle: '中央', heart: '中心' };
        if (nDr && !nDr.pron && !nDr.an && !nDr.time) { node = Object.assign({}, node, { ja: nDr.ja + 'の' + DRJ[T[j + 2].w] + 'の' + node.ja, end: nDr.end }); continue; }
        fail(mDr);
      }
      // came from Asian countries such as China and South Korea → 中国や韓国のようなアジアの国から（such as は前置詞の目的語の中でも名詞にかける）
      if (!o.pp && !o.noPost && seq(j, ['such', 'as']) && j + 2 < lim && !node.pron) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
