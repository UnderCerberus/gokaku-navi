import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# they stay up playing games or chatting with friends → ゲームをしたり友達とおしゃべりしたりして夜更かしする
# （付帯状況の分詞が and / or で並ぶときは「〜たり…たりして」。目的語の動名詞にしない）
rep("""    if (ingVerb(j, lim)) {
      const m4 = mark();
      const g = vpNonfin(j, lim, 'ing', {});""",
    """    if (ingVerb(j, lim)) {
      const m4 = mark();
      const kCo = T.findIndex((x, q) => q > j && q < lim - 1 && (isW(x, 'or') || isW(x, 'and')) && !isP(T[q - 1], ',') && ingVerb(q + 1, lim));
      if (kCo > 0 && vg && !/^(?:enjoy|stop|finish|keep|avoid|mind|practice|consider|start|begin|continue|like|love|hate|prefer|quit|miss|risk|suggest|imagine|deny|admit)$/.test(vg.lemma)) {
        const gC1 = vpNonfin(j, kCo, 'ing', {});
        const gC2 = gC1 && gC1.end === kCo ? vpNonfin(kCo + 1, lim, 'ing', {}) : null;
        if (gC1 && gC2 && verbal(gC1.pred) && verbal(gC2.pred) && !gC1.neg && !gC2.neg) { name('participle-const'); st.manner.push(vpJoin(gC1, 'past') + 'り、' + vpJoin(gC2, 'past') + 'りして'); return gC2.end; }
        fail(m4);
      }
      const g = vpNonfin(j, lim, 'ing', {});""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
