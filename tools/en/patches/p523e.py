import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Nothing is more important to a growing child than a safe and loving home → 成長する子どもにとって、安全で愛情のある家庭ほど大切なものはない
#（比較級の形容詞と than の間の to / for + 名詞句 は 〜にとって として前に出す）
rep("""          if (isW(T[e], 'than') && e + 1 < lim) {
            const m2 = mark();
            // than I am / than it looks / than you think（省略された比較の節。名詞句より先に見る）""",
    """          if (T[e] && /^(?:to|for)$/.test(T[e].w || '') && e + 3 < lim && T.slice(e + 2, lim).some((x) => isW(x, 'than'))) {
            const mTf = mark();
            const nTf = np(e + 1, lim, { noRel: true, noCoord: true });
            if (nTf && isW(T[nTf.end], 'than') && nTf.end + 1 < lim) { st.other.push(nTf.ja + 'にとって'); e = nTf.end; } else fail(mTf);   // more important to me than … → 私にとって
          }
          if (isW(T[e], 'than') && e + 1 < lim) {
            const m2 = mark();
            // than I am / than it looks / than you think（省略された比較の節。名詞句より先に見る）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
