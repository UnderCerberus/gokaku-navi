import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 記録（適用済み）: donate / recycle / wear … + them は物（sell them … or donate them to charity → それらを）
old_them = "|picked|pick|picks|washed|wash|washes|cut|cuts|cooked|cook|cooks)$/.test(T[i - 1].w) && !T.slice(0, Math.max(0,"
if s.count(old_them) == 1:
    s = s.replace(old_them, "|picked|pick|picks|washed|wash|washes|cut|cuts|cooked|cook|cooks|donate|donates|donated|recycle|recycles|recycled|reuse|reuses|reused|repair|repairs|repaired|wear|wears|wore|fold|folds|folded|plant|plants|planted|harvest|harvests|harvested|collect|collects|collected|deliver|delivers|delivered)$/.test(T[i - 1].w) && !T.slice(0, Math.max(0,")

# having little money and no formal education → お金がほとんどなく、正規の教育もない（have + little / no の並列）
rep("""      else if (L === 'have' && objs[0].littleQ && !vg.passive && !vg.neg && objs.length === 1) {""",
    """      else if (L === 'have' && !vg.passive && !vg.neg && objs.length === 1 && vg.idx >= 0 && T[vg.idx + 1] && /^(?:little|few|no)$/.test(T[vg.idx + 1].w || '') && (() => {
        const kA = T.findIndex((x, q) => q > vg.idx + 2 && q < objs[0].end - 1 && isW(x, 'and') && /^(?:little|few|no)$/.test(T[q + 1].w || ''));
        if (kA < 0 || (T[vg.idx + 1].w === 'no' && T[kA + 1].w === 'no')) return false;
        const mHq = mark();
        const n1 = np(vg.idx + 2, kA, { noCoord: true }), n2 = n1 && n1.end === kA ? np(kA + 2, objs[0].end, { noCoord: true }) : null;
        if (!(n2 && n2.end === objs[0].end)) { fail(mHq); return false; }
        const ng = (w) => (w === 'no' ? 'ない' : 'ほとんどない');
        sense = { particle: '', core: n1.ja + 'が' + ng(T[vg.idx + 1].w).replace(/ない$/, 'なく') + '、' + n2.ja + 'も' + ng(T[kA + 1].w), tr: true, noParticle: true };
        objs[0] = Object.assign({}, objs[0], { ja: '' });
        return true;
      })()) { /* little A and no B */ }
      else if (L === 'have' && objs[0].littleQ && !vg.passive && !vg.neg && objs.length === 1) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
