import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      const kR = T.findIndex((x, q) => q >= 1 && q <= 4 && /^(?:said|told|thought|promised|explained|wrote|replied|answered|believed|felt|hoped|guessed)$/.test(x.w || ''));""",
    """      const kR = T.findIndex((x, q) => q >= 1 && q <= 4 && /^(?:said|told|thought|promised|explained|wrote|replied|answered|believed|felt|hoped|guessed|say|says|think|thinks|believe|believes|know|knows|promise|promises|hope|hopes|guess|feel|feels|am|is|are)$/.test(x.w || '') && (!/^(?:am|is|are)$/.test(x.w || '') || (T[q + 1] && /^(?:sure|afraid|certain|confident)$/.test(T[q + 1].w || ''))));""")

rep("""        let kS = kR + 1;
        if (/^(?:told|promised)$/.test(T[kR].w) && T[kS] && T[kS].k === 'w' && PRON[T[kS].w] && !PRON[T[kS].w].sub) kS++;""",
    """        let kS = kR + 1;
        if (/^(?:am|is|are)$/.test(T[kR].w)) kS++;   // I'm sure you can do it if you try
        if (/^(?:told|promised|promise|promises)$/.test(T[kR].w) && T[kS] && T[kS].k === 'w' && PRON[T[kS].w] && !PRON[T[kS].w].sub) kS++;""")

rep("""        if (kIf > 0 && T[kC] && T[kC].k === 'w' && PRON[T[kC].w] && PRON[T[kC].w].sub && T.slice(kC, kIf).some((x) => /^(?:would|could|might)$/.test(x.w || ''))) {""",
    """        if (kIf > 0 && T[kC] && T[kC].k === 'w' && PRON[T[kC].w] && PRON[T[kC].w].sub && T.slice(kC, kIf).some((x) => /^(?:would|could|might|will|can|should|must)$/.test(x.w || ''))) {""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/^(彼|彼女|彼ら|私)はもし\\1(?:に|が)/, '$1は、もし').replace(/^([^、。]{1,10}?)は(私に|彼に|彼女に)?もし/, '$1は$2、もし').replace(/^(彼|彼女)は(.+?)、\\1が/, '$1は$2、');   // He said he would come if he had time → 彼は、もし時間があったら、来ると言った / He told me that he would help me if I needed it → 彼は私に、もし…、私を助けると言った
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
