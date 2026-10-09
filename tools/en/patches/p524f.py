import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# halfway up the mountain → 山の途中で / halfway to the airport → 空港への途中で / halfway around the world → 地球の裏側で
rep("""    const m = mark();
    let key = mprepAt(i), j = i, idi = null;""",
    """    const m = mark();
    if (t.w === 'halfway' && T[i + 1] && /^(?:to|up|down|through|across|along|into|around)$/.test(T[i + 1].w || '') && i + 2 < lim) {
      const pHw = parsePP(i + 1, lim, o);
      if (pHw && pHw.obj && pHw.obj.ja && !pHw.obj.pron) {
        const wHw = T[i + 1].w === 'around' && /^(?:world|globe|earth)$/.test(pHw.obj.head || '') ? '地球の裏側' : pHw.obj.ja + (T[i + 1].w === 'to' ? 'への途中' : 'の途中');
        return { ja: wHw + 'で', adn: wHw + 'の', kind: 'place', end: pHw.end, prep: 'halfway', obj: pHw.obj };
      }
      fail(m);
    }
    let key = mprepAt(i), j = i, idi = null;""")

# 副詞 halfway の直後が方向の前置詞なら副詞で取らず、前置詞句（halfway up the mountain）として読む
rep("""!(t.w === 'far' && (isW(T[j0 + 1], 'from') || (isW(T[j0 + 1], 'away') && isW(T[j0 + 2], 'from')))) && !(/^(?:almost|nearly|just)$/.test(t.w)""",
    """!(t.w === 'far' && (isW(T[j0 + 1], 'from') || (isW(T[j0 + 1], 'away') && isW(T[j0 + 2], 'from')))) && !(t.w === 'halfway' && /^(?:to|up|down|through|across|along|into|around)$/.test((T[j0 + 1] || {}).w || '')) && !(/^(?:almost|nearly|just)$/.test(t.w)""")

rep("""    // 前置詞句
    if ((PREP[t.w] || mprepAt(j) || idiomIndex().prep[t.w]) && (!approxAt(j, lim)""",
    """    // 前置詞句
    if ((PREP[t.w] || mprepAt(j) || idiomIndex().prep[t.w] || (t.w === 'halfway' && /^(?:to|up|down|through|across|along|into|around)$/.test((T[j + 1] || {}).w || ''))) && (!approxAt(j, lim)""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
