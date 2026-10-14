import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# good service is about paying attention to people's feelings, not just selling products → 良いサービスは、単に製品を売ることではなく、人々の気持ちに注意を払うことだ
# （物事が主語の be about + 動名詞は「〜ことだ」。後ろの , not just + 動名詞は「単に〜ではなく」。「〜ことについてある」にしない）
rep("""    const exist = () => P(anim ? 'いる' : 'ある', anim ? 'v1' : 'aru');
""",
    """    const exist = () => P(anim ? 'いる' : 'ある', anim ? 'v1' : 'aru');
    if (vg.lemma === 'be' && !vg.passive && !vg.neg && isW(T[i], 'about') && i + 1 < lim && sj && !anim && !sj.pron && ingVerb(i + 1, lim)) {
      const mAb = mark();
      let eAb = lim, nB = null;
      const kNj = T.findIndex((x, q) => q > i + 1 && q < lim - 2 && isP(x, ',') && isW(T[q + 1], 'not'));
      if (kNj > 0) {
        const kB = /^(?:just|only|simply|merely)$/.test((T[kNj + 2] || {}).w || '') ? kNj + 3 : kNj + 2;
        nB = ingVerb(kB, lim) ? gerundNP(kB, lim) : null;
        if (nB && nB.end === lim) eAb = kNj; else nB = null;
      }
      const gA = gerundNP(i + 1, eAb);
      if (gA && gA.end === eAb) {
        name('gerund');
        return fin(P((nB ? '単に' + nB.ja + 'ではなく、' : '') + gA.ja + 'だ', 'da'), lim);
      }
      fail(mAb);
    }
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
