import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    if (b === 2 && T[0].k === 'w' && ((PRON[T[0].w] && PRON[T[0].w].sub && T[0].w !== 'it') || T[0].cap) && T[1].k === 'w' && /^(?:do|does|did|am|is|are|was|were|can|will)$/.test(T[1].w)) {
      const nAns = np(0, 1, {});
      if (nAns && nAns.end === 1) return { ok: true, ja: nAns.ja + (T[1].w === 'can' ? 'ができます' : (T[1].w === 'will' ? 'がやります' : 'です')) + '。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };""",
    """    if (b === 2 && T[0].k === 'w' && ((PRON[T[0].w] && PRON[T[0].w].sub && T[0].w !== 'it') || T[0].cap || NAME_JA[T[0].w]) && T[1].k === 'w' && /^(?:do|does|did)$/.test(T[1].w)) {
      const nAns = np(0, 1, {});
      if (nAns && nAns.end === 1) return { ok: true, ja: nAns.ja + 'です。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };""")

rep("""          const negSo = T[kSo + 1].w !== 'so';
          return { ok: true, ja: r1So.ja.replace(/。$/, '').replace(/だ$/, 'で').replace(/(い)$/, '$1し').replace(/た$/, 'たし') + '、' + nSo.ja + (negSo ? 'もそうではない' : 'もそうだ') + '。', sp: '', names: ['ellipsis'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };""",
    """          const negSo = T[kSo + 1].w !== 'so';
          const pastSo = /^(?:did|was|were|could|had|would)$/.test(T[kSo + 2].w);
          const predSo = negSo ? (r1So.ja.match(/^[^、。]{1,12}?は([^、。]+)。$/) || [])[1] : null;
          return { ok: true, ja: r1So.ja.replace(/。$/, '').replace(/だ$/, 'で').replace(/(い)$/, '$1し').replace(/た$/, 'たし') + '、' + nSo.ja + (negSo ? (predSo ? 'も' + predSo : 'もそうではない') : (pastSo ? 'もそうだった' : 'もそうだ')) + '。', sp: '', names: ['ellipsis'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };""")

# She went to the party, but I didn't. → 彼女はパーティーに行ったが、私は行かなかった
rep("""          if (r1B && r1B.ok && r2B && r2B.ok) return { ok: true, ja: r1B.ja.replace(/。$/, '') + 'が、' + r2B.ja.replace(/^私は/, '').replace(/^それを/, '').replace(/^(?:彼|彼女|彼ら|私|私たち)(?:に|を)/, ''), sp: '', names: ['ellipsis'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
        }
      }
    }""",
    """          if (r1B && r1B.ok && r2B && r2B.ok) return { ok: true, ja: r1B.ja.replace(/。$/, '') + 'が、' + r2B.ja.replace(/^私は/, '').replace(/^それを/, '').replace(/^(?:彼|彼女|彼ら|私|私たち)(?:に|を)/, ''), sp: '', names: ['ellipsis'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
        }
      }
      // She went to the party, but I didn't. → 彼女はパーティーに行ったが、私は行かなかった（did だけの省略は前の過去形動詞を補う）
      if (kBt > 0 && T[kBt + 1] && T[kBt + 1].k === 'w' && PRON[T[kBt + 1].w] && PRON[T[kBt + 1].w].sub && isW(T[kBt + 2], 'did') && isW(T[kBt + 3], 'not') && kBt + 4 === b && T[0].k === 'w' && T[0].w !== T[kBt + 1].w && !T.slice(0, kBt).some((x) => isW(x, 'to') && T[T.indexOf(x) - 1] && /^(?:tried|wanted|planned|hoped|decided|like|liked)$/.test(T[T.indexOf(x) - 1].w || ''))) {
        const qD = T.findIndex((x, q) => q > 0 && q < kBt - 1 && x.k === 'w' && !BE[x.w] && !HAVE[x.w] && !DO[x.w] && !MODAL[x.w] && !!vc(x, ['past']) && !nounC(x));
        const vD = qD > 0 ? vc(T[qD], ['past']) : null;
        if (vD && vD.e && !T.slice(1, qD).some((x) => x.k === 'w' && (BE[x.w] || HAVE[x.w] || DO[x.w] || MODAL[x.w]))) {
          const r1D = translate1(T.slice(0, kBt - 1).map((x, k) => Object.assign({}, x, { i: k })).concat([tokenize('.')[0]].filter(Boolean)));
          reset(tokens);
          const objD = T.slice(qD + 1, kBt - 1).filter((x) => x.k === 'w');
          const trD = en.jp.senses(vD.e.ja).some((x) => x.tr) && objD.length && !/^(?:to|in|at|on|for|with|from|into|by|about)$/.test(objD[0].w);
          const t2D = tokenize(T[kBt + 1].w + ' did not ' + vD.lemma + (trD ? ' it' : '') + '.');
          const r2D = t2D && t2D.length ? translate1(t2D) : null;
          reset(tokens);
          if (r1D && r1D.ok && r2D && r2D.ok) return { ok: true, ja: r1D.ja.replace(/。$/, '') + 'が、' + r2D.ja.replace(/^([^、。]{1,6}?は)それを/, '$1'), sp: '', names: ['ellipsis'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
        }
      }
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
