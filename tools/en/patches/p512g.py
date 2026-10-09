import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Little did he know that … → …とは夢にも思わなかった（that 節を受ける know / realize など）
rep("""      if (cl && t.w === 'little') { name('inversion'); const outL = cl.out; return Object.assign({}, cl, { out: (y) => outL(y).replace(/((?:知ら|分から|気づか|思わ|想像し|予想し|夢にも思わ)なかった)$/, '少しも$1') }); }""",
    """      if (cl && t.w === 'little') { name('inversion'); const outL = cl.out; return Object.assign({}, cl, { out: (y) => { const oL = outL(y); return /(?:だろう)?(?:こと|の)を(?:知ら|分から|気づか|思わ|想像し|予想し)なかった$/.test(oL) ? oL.replace(/(?:だろう)?(?:こと|の)を(?:知ら|分から|気づか|思わ|想像し|予想し)なかった$/, 'とは夢にも思わなかった') : oL.replace(/((?:知ら|分から|気づか|思わ|想像し|予想し|夢にも思わ)なかった)$/, '少しも$1'); } }); }""")

# Regardless of how talented they are → どれほど才能があるかに関係なく（regardless of / irrespective of / depending on + 疑問詞節）
rep("""    if (key === 'within' && !idi && j + 3 < lim) {""",
    """    if (idi && idi.toks && /^(?:regardless of|irrespective of|depending on)$/.test(idi.toks.join(' ')) && j + 1 < lim && T[j].k === 'w' && (WH[T[j].w] || T[j].w === 'whether')) {
      const mRg = mark();
      const wcR = whClause(j, lim);
      if (wcR) { useIdiom(idi.it); return { ja: wcR.str + (idi.toks[0] === 'depending' ? '次第で' : 'に関係なく'), kind: 'other', end: wcR.end, prep: idi.toks.join(' ') }; }
      fail(mRg);
    }
    if (key === 'within' && !idi && j + 3 < lim) {""")

# across the country / across the world → 全国の・世界中の
rep("""      case 'over':
        if (!obj.pron && obj.head && /^(?:distance|distances|kilometer|kilometers|kilometre|kilometres|mile|miles)$/.test(obj.head)) return R(n + 'を越えて', 'other');""",
    """      case 'across':
        if (!obj.pron && obj.det === 'the' && /^(?:country|nation)$/.test(obj.head || '')) return R('全国で', 'other', '全国の');
        if (!obj.pron && obj.det === 'the' && /^(?:world|globe|planet)$/.test(obj.head || '')) return R('世界中で', 'other', '世界中の');
        break;
      case 'over':
        if (!obj.pron && obj.head && /^(?:distance|distances|kilometer|kilometers|kilometre|kilometres|mile|miles)$/.test(obj.head)) return R(n + 'を越えて', 'other');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
