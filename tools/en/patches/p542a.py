import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# cities have far fewer trees and green spaces than rural areas → 農村部よりはるかに少ない木と緑地 / many more cars than villages → 村よりずっと多くの車
# （far / much / many / even + more / fewer / less + 名詞（並列も）+ than … は比較の名詞句。「はるかによりほとんどない木」「多くの車がたくさん」にしない）
rep("""      const mu = timesAt(i, lim);
      const k0 = mu ? mu.end : i;
      if (k0 + 3 < lim && T[k0].k === 'w' && /^(?:more|less|fewer)$/.test(T[k0].w) && !isW(T[k0 + 1], 'than') && T[k0 + 1].k === 'w' && (nounC(T[k0 + 1]) || adjC(T[k0 + 1]))) {
        let th = -1;
        for (let x = k0 + 2; x < lim && x < k0 + 6; x++) { if (isW(T[x], 'than')) { th = x; break; } }
        if (th > 0) {
          const mt = mark();
          const head = np1(k0 + 1, th, Object.assign({}, o, { noThan: true, noPost: true }));""",
    """      const mu = timesAt(i, lim);
      const degC = !mu && /^(?:far|much|many|even)$/.test(t.w) && /^(?:more|less|fewer)$/.test((T[i + 1] || {}).w || '') ? ({ far: 'はるかに', much: 'ずっと', many: 'ずっと', even: 'さらに' })[t.w] : '';
      const k0 = mu ? mu.end : (degC ? i + 1 : i);
      if (k0 + 3 < lim && T[k0].k === 'w' && /^(?:more|less|fewer)$/.test(T[k0].w) && !isW(T[k0 + 1], 'than') && T[k0 + 1].k === 'w' && (nounC(T[k0 + 1]) || adjC(T[k0 + 1]))) {
        let th = -1;
        for (let x = k0 + 2; x < lim && x < k0 + 7; x++) { if (isW(T[x], 'than')) { th = x; break; } }
        if (th > 0) {
          const mt = mark();
          let head = np1(k0 + 1, th, Object.assign({}, o, { noThan: true, noPost: true }));
          if (head && head.end < th && /^(?:and|or)$/.test((T[head.end] || {}).w || '')) { const hC = np(k0 + 1, th, Object.assign({}, o, { noThan: true, noRel: true })); if (hC && hC.end === th) head = hC; }""")

rep("""            const ja = mu ? cmp.ja + 'の' + mu.ja.replace(/^約|^ほぼ/, '') + 'の' + head.ja : cmp.ja + 'より' + (T[k0].w === 'more' ? '多くの' : '少ない') + head.ja;""",
    """            const ja = mu ? cmp.ja + 'の' + mu.ja.replace(/^約|^ほぼ/, '') + 'の' + head.ja : cmp.ja + 'より' + degC + (T[k0].w === 'more' ? '多くの' : '少ない') + head.ja;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
