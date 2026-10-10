import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# he told me that everyone makes mistakes when they are new → みんな新人のときは間違えると私に言った（tell / show / teach + 目的格 + that 節の後ろの when も that 節の中）
rep("""      // Many students say that they feel nervous when they speak …（言う・思う + that 節の中の when は that 節の中で読む）""",
    """      if (/^(?:when|if|because|before|after|while|until|once)$/.test(s2.key) && !isP(T[j - 1], ',') && T.slice(a, j).some((x, q) => isW(x, 'that') && q > 1 && T[a + q - 1].k === 'w' && /^(?:me|us|him|her|them|you)$/.test(T[a + q - 1].w) && T[a + q - 2].k === 'w' && /^(?:tell|tells|told|telling|teach|teaches|taught|show|shows|showed|remind|reminds|reminded|warn|warns|warned|assure|assured|promise|promised)$/.test(T[a + q - 2].w))) continue;
      // Many students say that they feel nervous when they speak …（言う・思う + that 節の中の when は that 節の中で読む）""")

# when they are new / I am new here → 新人のとき・ここは初めてだ（人の主語 + be new。新しい にしない）
rep("""    // be left（残っている）: how much of the book is left / Only two days are left""",
    """    if (isW(T[i], 'new') && !vg.neg && sj && (sj.an || /^(?:i|you|he|she|we|they)$/.test(sj.pron || '')) && (i + 1 >= lim || T[i + 1].k === 'p' || isW(T[i + 1], 'here') || isW(T[i + 1], 'there') || ((isW(T[i + 1], 'to') || isW(T[i + 1], 'at')) && i + 2 < lim && !vc(T[i + 2], ['base'])))) {
      const mNw = mark();
      if (isW(T[i + 1], 'here') || isW(T[i + 1], 'there')) { if (i + 2 >= lim || T[i + 2].k === 'p') return fin(P((T[i + 1].w === 'here' ? 'ここ' : 'そこ') + 'は初めてだ', 'da'), i + 2, 'SVC'); }
      else if (i + 1 < lim && T[i + 1].k === 'w') { const pNw = parsePP(i + 1, lim, {}); if (pNw && pNw.obj && pNw.end === lim) return fin(P(pNw.obj.ja + 'は初めてだ', 'da'), lim, 'SVC'); }
      else return fin(P('新人だ', 'da'), i + 1, 'SVC');
      fail(mNw);
    }
    // be left（残っている）: how much of the book is left / Only two days are left""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
