import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# as well as ~（比較・並列）は as well（もまた）にしない
rep("""      if (key && TIMEPH[key] && !pastSpan && !(/^so (?:much|many|long|far)$/.test(key) && isW(T[j + len], 'that'))""",
    """      if (key && TIMEPH[key] && !pastSpan && !(key === 'as well' && isW(T[j + len], 'as') && j + len + 1 < lim) && !(/^so (?:much|many|long|far)$/.test(key) && isW(T[j + len], 'that'))""")

# I can't swim as well as my brother → 兄ほど上手に泳げない / She speaks English as well as French → フランス語だけでなく英語も話す
rep("""      if (isW(T[ja0], 'as') && ja0 + 2 < lim && advC(T[ja0 + 1]) && isW(T[ja0 + 2], 'as')) {
        const m0 = mark();
        const a0 = advC(T[ja0 + 1]), pre0 = ja0 > j ? 'ちょうど' : '';
        if (isW(T[ja0 + 3], 'possible')) { st.manner.push(pre0 + 'できるだけ' + a0.ja); return ja0 + 4; }
        const el0 = thanEllipsis(ja0 + 3, lim);                                   // as strongly as before / as ever / as usual
        if (el0) { name('as-as'); st.manner.push(pre0 + el0 + 'と同じくらい' + a0.ja); return lim; }
        const n0 = np(ja0 + 3, lim, { noRel: true });
        if (n0) { name('as-as'); st.manner.push(pre0 + n0.ja + 'と同じくらい' + a0.ja); return n0.end; }
        fail(m0);
      }""",
    """      if (isW(T[ja0], 'as') && ja0 + 2 < lim && (advC(T[ja0 + 1]) || isW(T[ja0 + 1], 'well')) && isW(T[ja0 + 2], 'as')) {
        const m0 = mark();
        const wellAs = isW(T[ja0 + 1], 'well');
        const a0 = wellAs ? { ja: '上手に' } : advC(T[ja0 + 1]), pre0 = ja0 > j ? 'ちょうど' : '';
        const cmp0 = vg && vg.neg && !pre0 ? 'ほど' : 'と同じくらい';   // He can't run as fast as Ken → ケンほど速く走れない
        if (isW(T[ja0 + 3], 'possible')) { st.manner.push(pre0 + 'できるだけ' + a0.ja); return ja0 + 4; }
        const el0 = thanEllipsis(ja0 + 3, lim);                                   // as strongly as before / as ever / as usual
        if (el0) { name('as-as'); st.manner.push(pre0 + el0 + cmp0 + a0.ja); return lim; }
        if (wellAs && ja0 + 3 < lim && T[ja0 + 3].k === 'w' && !!vc(T[ja0 + 3], ['base', 'ing']) && !nounC(T[ja0 + 3]) && !PRON[T[ja0 + 3].w]) {   // She can sing as well as dance → 踊るだけでなく歌える
          const vW = vpNonfin(ja0 + 3, lim, vc(T[ja0 + 3], ['ing']) && !vc(T[ja0 + 3], ['base']) ? 'ing' : 'base', {});
          if (vW && vW.end === lim) { name('as-well-as'); st.other.push(vpJoin(vW, 'dict') + 'だけでなく'); return lim; }
          fail(m0);
        }
        const n0 = np(ja0 + 3, lim, { noRel: true });
        const auxAfter0 = !!n0 && n0.end < lim && T[n0.end].k === 'w' && (!!DO[T[n0.end].w] || !!MODAL[T[n0.end].w]);
        if (n0 && wellAs && !n0.an && !n0.pron && !auxAfter0 && !(n0.proper && NAME_JA[T[ja0 + 3].w])) { name('as-well-as'); st.other.push(n0.ja + 'だけでなく'); return n0.end; }   // She speaks English as well as French → フランス語だけでなく英語も
        if (n0) { name('as-as'); st.manner.push(pre0 + n0.ja + cmp0 + a0.ja); return auxAfter0 ? n0.end + 1 : n0.end; }
        fail(m0);
      }""")

# だけでなく英語を → だけでなく英語も / 人気があるですか → 人気がありますか
rep("""    ja = ja.replace(/(右|左)の側(?=[にでのをはが])/g, '$1側');""",
    """    ja = ja.replace(/(右|左)の側(?=[にでのをはが])/g, '$1側');
    if (tokens.some((x, q) => x.w === 'as' && tokens[q + 1] && tokens[q + 1].w === 'well' && tokens[q + 2] && tokens[q + 2].w === 'as')) ja = ja.replace(/だけでなく([^、。]{1,14}?)を/, 'だけでなく$1も').replace(/^([^、。]{1,10}?は)([^、。]{1,14}?)を([^、。]{1,14}?だけでなく)/, '$1$3$2も');
    ja = ja.replace(/(ある|いる)ですか(?=。|$)/, (m0, a0) => (a0 === 'ある' ? 'ありますか' : 'いますか'));   // どちらのほうが人気があるですか → 人気がありますか""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
