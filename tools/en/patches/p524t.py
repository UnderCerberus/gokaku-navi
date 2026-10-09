import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Not knowing anyone at the party, … → パーティーで誰も知らなくて、（not + 分詞の目的語の any は否定の形。人を知らない は 分からない にしない）
rep("""    const vg = { modal: '', semi: '', perfect: false, prog: false, passive: form === 'pp', neg: false, past: false, advs: [], lemma: '', e: null, idx: j, end: j + 1, nonfin: true, imp: !!(o && o.imp) };""",
    """    const vg = { modal: '', semi: '', perfect: false, prog: false, passive: form === 'pp', neg: false, past: false, advs: [], lemma: '', e: null, idx: j, end: j + 1, nonfin: true, imp: !!(o && o.imp), negCtx: neg };""")
rep("""  const newSt = (vg) => ({ neg: false, vgNeg: !!(vg && vg.neg),""",
    """  const newSt = (vg) => ({ neg: false, vgNeg: !!(vg && (vg.neg || vg.negCtx)),""")
rep("""        const vN = vpNonfin(a + 1, c0, 'ing', {});
        const mnN = vN && vN.end === c0 ? sentence(c0 + 1, b, o) : null;
        if (mnN) {
          name('participle-const');
          const preN = (vN.parts.join('') + vN.pred.aux('neg').form('te')).replace(/知らなくて$/, '分からなくて') + '、';""",
    """        const vN = vpNonfin(a, c0, 'ing', {});
        const mnN = vN && vN.end === c0 ? sentence(c0 + 1, b, o) : null;
        if (mnN) {
          name('participle-const');
          const preN = (vN.parts.join('') + vN.pred.aux('neg').form('te')).replace(/知らなくて$/, (m0) => (/(?:誰も|誰にも|人も)$/.test(vN.parts.join('')) ? m0 : '分からなくて')) + '、';""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
