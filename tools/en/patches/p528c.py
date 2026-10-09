import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I was about to leave the house when it suddenly started to snow → 私がまさに家を出ようとしていたとき、突然雪が降り始めた
# （be about to / be on the point of ~ing + when 節: 後ろの when 節が主な出来事。まさに突然雪が降り始めたとき にしない）
rep("""    if (!o.sub) {
      let xOy = -1;""",
    """    if (!o.sub) {
      const kAb = T.findIndex((x, q) => q > a && q < b - 4 && /^(?:was|were)$/.test(x.w || '') && (seq(q + 1, ['about', 'to']) || seq(q + 2, ['about', 'to']) || seq(q + 1, ['on', 'the', 'point', 'of'])));
      let xWh = -1;
      if (kAb > 0) for (let x = kAb + 3; x < b - 2; x++) if (isW(T[x], 'when')) { xWh = x; break; }
      if (xWh > 0) {
        const mAb = mark();
        const lAb = sentence(a, isP(T[xWh - 1], ',') ? xWh - 1 : xWh, { sub: true });
        const rAb = lAb ? sentence(xWh + 1, b, o) : null;
        if (lAb && rAb) { name('idiom'); const nodeAb = Object.assign({}, rAb); nodeAb.out = (y) => lAb.out({ part: 'が', form: 'attr' }) + 'とき、' + rAb.out(y); return wrap(nodeAb); }
        fail(mAb);
      }
      let xOy = -1;""")

# I was on the point of giving up → まさにあきらめようとしていた（be on the point of ~ing。点の上にいた にしない）
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
