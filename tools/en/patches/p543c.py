import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He came later than I expected → 予想していたより遅く来た / which was much earlier than I usually got up → いつも起きるよりずっと早かった
# （later / earlier / sooner + than は比較。時の副詞「後で」にしない）
rep("""  function modOther(j, lim, st, o, vg) {
    const t = T[j];
    if (!t || j >= lim || t.k !== 'w') return -1;""",
    """  function thanTimeJa(k, lim, o) {   // than のあとの句・節 → 「〜」（より は付けない）
    const elT = thanEllipsis(k, lim, o && o.subj);
    if (elT) return elT;
    const mT = mark();
    const nT = np(k, lim, { noRel: true });
    if (nT && nT.end === lim) return nT.ja;
    fail(mT);
    const cT = sentence(k, lim, { sub: true });
    if (cT) return cT.out({ part: 'が', form: 'attr', omit: o && o.subj && o.subj.pron ? o.subj.pron : null }).replace(/(?:たいてい|普段|ふだん)(.+?)た$/, 'いつも$1る').replace(/起きた$/, '起きる');
    fail(mT);
    return null;
  }
  function modOther(j, lim, st, o, vg) {
    const t = T[j];
    if (!t || j >= lim || t.k !== 'w') return -1;
    {
      const kLt = /^(?:much|far|a little|slightly)$/.test(t.w) && /^(?:later|earlier|sooner)$/.test((T[j + 1] || {}).w || '') ? j + 1 : j;
      if (/^(?:later|earlier|sooner)$/.test(T[kLt].w || '') && isW(T[kLt + 1], 'than') && kLt + 2 < lim && vg && vg.lemma !== 'be') {
        const thLt = thanTimeJa(kLt + 2, lim, o);
        if (thLt) { st.other.push(thLt + 'より' + (kLt > j ? ({ much: 'ずっと', far: 'はるかに', slightly: '少し' })[t.w] || '' : '') + (T[kLt].w === 'later' ? '遅く' : '早く')); name('comparative'); return lim; }
      }
    }""")

rep("""    const exist = () => P(anim ? 'いる' : 'ある', anim ? 'v1' : 'aru');
""",
    """    const exist = () => P(anim ? 'いる' : 'ある', anim ? 'v1' : 'aru');
    {
      const kLb = /^(?:much|far|slightly)$/.test((T[i] || {}).w || '') && /^(?:later|earlier)$/.test((T[i + 1] || {}).w || '') ? i + 1 : i;
      if (vg.lemma === 'be' && !vg.passive && /^(?:later|earlier)$/.test((T[kLb] || {}).w || '') && isW(T[kLb + 1], 'than') && kLb + 2 < lim) {
        const thLb = thanTimeJa(kLb + 2, lim, o);
        if (thLb) { name('comparative'); return fin(P(thLb + 'より' + (kLb > i ? ({ much: 'ずっと', far: 'はるかに', slightly: '少し' })[T[i].w] : '') + (T[kLb].w === 'later' ? '遅い' : '早い'), 'i'), lim); }
      }
    }
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
