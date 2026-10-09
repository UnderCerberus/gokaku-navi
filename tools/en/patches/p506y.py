import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 「〜すぎて」の形: 頼っている → 頼りすぎて（五段の て形 っ・ん は連用形に戻す）/ 依存している → 依存しすぎて
rep("""  function adjPPs(k, lim, aLemma) {""",
    """  function tooTe(f) {
    const pl = f.pred ? f.pred.plain() : '';
    const EXC = { 酔っている: '酔いすぎて', 言っている: '言いすぎて', 思っている: '思いすぎて', 使っている: '使いすぎて' };
    if (EXC[pl]) return EXC[pl];
    if (/している$/.test(pl)) return pl.replace(/している$/, 'しすぎて');
    if (/っている$/.test(pl)) return pl.replace(/っている$/, 'りすぎて');
    if (/んでいる$/.test(pl)) return pl.replace(/んでいる$/, 'みすぎて');
    if (/ている$/.test(pl)) return pl.replace(/ている$/, 'すぎて');
    return f.stem !== null && (f.kind === 'i' || f.kind === 'na') ? f.stem + 'すぎて' : 'あまりに' + f.te;
  }
  function adjPPs(k, lim, aLemma) {""")
rep("""            const pre = f2.stem !== null && (f2.kind === 'i' || f2.kind === 'na') ? f2.stem + 'すぎて' : 'あまりに' + f2.te;""",
    """            const pre = tooTe(f2);""")
rep("""          const preB = f8b.stem !== null && (f8b.kind === 'i' || f8b.kind === 'na') ? f8b.stem + 'すぎて' : 'あまりに' + f8b.te;""",
    """          const preB = tooTe(f8b);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
