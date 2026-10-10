import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# EMO の moved / touched は戻す（辞書の形容詞「感動した」も外した: The meeting has been moved to Thursday を 感動 にしない）
rep("""const EMO = set('glad happy sad sorry surprised pleased excited disappointed shocked delighted proud angry relieved amazed impressed embarrassed upset thrilled moved touched');""",
    """const EMO = set('glad happy sad sorry surprised pleased excited disappointed shocked delighted proud angry relieved amazed impressed embarrassed upset thrilled');""")

# I was deeply moved that a stranger had gone out of their way to help me → 見知らぬ人が…ことに深く感動した（be moved / touched + that 節だけ）
rep("""    // be left（残っている）: how much of the book is left / Only two days are left""",
    """    {
      let iMv = i;
      while (iMv < lim - 2 && T[iMv].k === 'w' && (ADV[T[iMv].w] || (/ly$/.test(T[iMv].w) && !!advC(T[iMv]) && !adjC(T[iMv]))) && !/^(?:moved|touched)$/.test(T[iMv].w)) iMv++;
      if (T[iMv] && /^(?:moved|touched)$/.test(T[iMv].w || '') && isW(T[iMv + 1], 'that') && iMv + 2 < lim && !vg.neg) {
        const mMv = mark();
        const clMv = sentence(iMv + 2, lim, { sub: true });
        if (clMv) {
          name('that-clause');
          for (let x = i; x < iMv; x++) addAdv(st, advC(T[x]), T[x].w);
          return fin(P('感動する', 'suru'), lim, 'SVC', [clMv.out({ part: 'が' }) + 'ことに']);
        }
        fail(mMv);
      }
    }
    // be left（残っている）: how much of the book is left / Only two days are left""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
