import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Vegetables are often left in the fields → 野菜はよく畑に残っている（be + 頻度の副詞 + left も「残っている」。左だ にしない）
# The door was left open → ドアは開いたままだった / The lights were left on → 電気はつけたままだった
rep("""    // be left（残っている）: how much of the book is left / Only two days are left
    if (isW(T[i], 'left') && (i + 1 === lim || (T[i + 1].k === 'w' && (PREP[T[i + 1].w] || ADV[T[i + 1].w]) && !nounC(T[i + 1])))) {
      const m0 = mark();
      const end0 = tail(i + 1, lim, st, o, vg);
      if (end0 === lim) return fin(P('残っている', 'v1'), lim, 'SV');
      fail(m0);
    }""",
    """    // be left（残っている）: how much of the book is left / Only two days are left
    {
      let iLf = i;
      const advLf = [];
      while (iLf < lim - 1 && T[iLf].k === 'w' && ADV[T[iLf].w] && /^[fd]$/.test(ADV[T[iLf].w][1] || '') && !isW(T[iLf], 'left')) { advLf.push(iLf); iLf++; }
      if (isW(T[iLf], 'left') && iLf + 1 < lim && /^(?:open|closed|shut|unlocked|on|off|empty|unattended|untouched)$/.test(T[iLf + 1].w || '') && (iLf + 2 === lim || T[iLf + 2].k === 'p' || (T[iLf + 2].k === 'w' && (PREP[T[iLf + 2].w] || /^(?:and|but|so|because|when|all|overnight)$/.test(T[iLf + 2].w))))) {
        const m0 = mark();
        advLf.forEach((x) => addAdv(st, advC(T[x]), T[x].w));
        const LFC = { open: '開いたまま', closed: '閉まったまま', shut: '閉まったまま', unlocked: '鍵がかかっていないまま', on: 'ついたまま', off: '消えたまま', empty: '空のまま', unattended: '放置されたまま', untouched: '手つかずのまま' };
        const end0 = tail(iLf + 2, lim, st, o, vg);
        if (end0 === lim) return fin(P(LFC[T[iLf + 1].w] + 'だ', 'da'), lim, 'SVC');
        fail(m0);
      }
      if (isW(T[iLf], 'left') && (iLf + 1 === lim || (T[iLf + 1].k === 'w' && (PREP[T[iLf + 1].w] || ADV[T[iLf + 1].w]) && !nounC(T[iLf + 1])))) {
        const m0 = mark();
        advLf.forEach((x) => addAdv(st, advC(T[x]), T[x].w));
        const end0 = tail(iLf + 1, lim, st, o, vg);
        if (end0 === lim) return fin(P('残っている', 'v1'), lim, 'SV');
        fail(m0);
      }
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
