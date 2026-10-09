import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Turn off the lights when you leave the room, or you will waste electricity → 部屋を出るとき、電気を消しなさい。さもないと、電気を無駄にする
# （副詞節つきの命令文 + , or / and you will … は、副詞節の中の並列にしない）
rep("""    {
      const AUXE = /^(?:is|are|was|were|am|do|does|did|can|could|will|would|should|must|may|might|has|have|had)$/;""",
    """    {
      const kIo = T.findIndex((x, q) => q > 3 && q < b - 3 && isP(x, ',') && /^(?:or|and)$/.test((T[q + 1] || {}).w || '') && isW(T[q + 2], 'you') && /^(?:will|would|can|may|might)$/.test((T[q + 3] || {}).w || ''));
      if (kIo > 0 && !tokens.__ioSplit && T[0].k === 'w' && ((!!vc(T[0], ['base']) && !vc(T[0], ['3sg', 'past']) && !PRON[T[0].w] && DET[T[0].w] === undefined) || isW(T[0], 'please') || (isW(T[0], 'do') && isW(T[1], 'not')) || isW(T[0], 'never')) && T.slice(1, kIo).some((x) => x.k === 'w' && SUB[x.w])) {
        const orIo = T[kIo + 1].w === 'or';
        const tL = tokens.slice(0, kIo).concat(tokens.slice(b)); tL.__ioSplit = true;
        const tR = tokens.slice(kIo + 2); tR.__ioSplit = true;
        const rL = translate1(tL), rR = rL && rL.ok ? translate1(tR) : null;
        reset(tokens);
        if (rL && rL.ok && rR && rR.ok && (rL.names || []).indexOf('imperative') >= 0) return Object.assign({}, rL, { ja: rL.ja.replace(/。$/, '') + (orIo ? '。さもないと、' : '。そうすれば、') + rR.ja.replace(/^あなた(?:たち)?は/, '').replace(/だろう。$/, orIo ? '。' : 'だろう。') });
      }
    }
    {
      const AUXE = /^(?:is|are|was|were|am|do|does|did|can|could|will|would|should|must|may|might|has|have|had)$/;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
