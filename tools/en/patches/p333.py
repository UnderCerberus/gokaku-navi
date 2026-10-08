import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      if (T[kP0] && T[kP0].k === 'w' && PRON[T[kP0].w] && PRON[T[kP0].w].sub) {
        const kY = kP0 + 1;""",
    """      if (isW(T[kP0], 'there') && T[kP0 + 1] && /^(?:is|are|was|were)$/.test(T[kP0 + 1].w || '') && kP0 + (isW(T[kP0 + 2], 'not') ? 3 : 2) === b) {   // Yes, there is. → はい、あります
        const negT = T[0].w === 'no' || isW(T[kP0 + 2], 'not'), pastT = /^(?:was|were)$/.test(T[kP0 + 1].w);
        return { ok: true, ja: (negT ? 'いいえ、' + (pastT ? 'ありませんでした' : 'ありません') : 'はい、' + (pastT ? 'ありました' : 'あります')) + '。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      }
      if (T[kP0] && T[kP0].k === 'w' && PRON[T[kP0].w] && PRON[T[kP0].w].sub) {
        const kY = kP0 + 1;""")

rep("""          const jaY = /^(?:can|could)$/.test(auxY) ? (negY ? 'いいえ、できません' : 'はい、できます') :""",
    """          const jaY = auxY === 'did' ? (negY ? 'いいえ、しませんでした' : 'はい、しました') : (/^(?:was|were)$/.test(auxY) ? (negY ? 'いいえ、そうではありませんでした' : 'はい、そうでした') : (auxY === 'may' ? (negY ? 'いいえ、いけません' : 'はい、いいですよ') : (auxY === 'must' ? (negY ? 'いいえ、いけません' : 'はい、そうしなければなりません') : (/^(?:should|shall)$/.test(auxY) ? (negY ? 'いいえ、その必要はありません' : 'はい、そうしましょう') : null)))) || (/^(?:can|could)$/.test(auxY) ? (negY ? 'いいえ、できません' : 'はい、できます') :""")
rep("""(negY ? 'いいえ、そうではありません' : 'はい、そうです')));
          return { ok: true, ja: jaY + '。'""",
    """(negY ? 'いいえ、そうではありません' : 'はい、そうです'))));
          return { ok: true, ja: jaY + '。'""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
