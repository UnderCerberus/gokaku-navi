import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Insects help plants grow by carrying pollen → 花粉を運ぶことによって、植物が成長するのに役立つ（by + 〜ing は主節の help にかける）
rep("""      const v3 = vpNonfin(j, lim, 'base', { subj: ob });
      if (v3) {
        name(CAUS[L][2]);""",
    """      let limV3 = lim;
      if (/^(?:help|make|let)$/.test(L)) {
        const kBy3 = T.findIndex((x, q) => q > j + 1 && q < lim - 1 && isW(x, 'by') && T[q + 1] && T[q + 1].k === 'w' && !!vc(T[q + 1], ['ing']));
        if (kBy3 > 0) {
          const mBy3 = mark();
          const stBy3 = newSt(vg);
          const eBy3 = tail(kBy3, lim, stBy3, o, vg);
          if (eBy3 === lim && stBy3.other.concat(stBy3.manner).length) { stBy3.other.forEach((x) => st.other.push(x)); stBy3.manner.forEach((x) => st.manner.push(x)); limV3 = kBy3; } else fail(mBy3);
        }
      }
      let v3 = vpNonfin(j, limV3, 'base', { subj: ob });
      if (v3 && limV3 !== lim) v3 = v3.end === limV3 ? Object.assign({}, v3, { end: lim }) : null;
      if (v3) {
        name(CAUS[L][2]);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
