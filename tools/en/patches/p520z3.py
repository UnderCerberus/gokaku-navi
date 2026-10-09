import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the way we produce and consume energy → 私たちがエネルギーを生産し消費する方法（and の後ろの目的語を両方の動詞で共有）
rep("""      const cw = clause(j, e, { sub: true });
      // the way we live → 私たちの生き方 / the way people think → 人々の考え方""",
    """      const cw = clause(j, e, { sub: true });
      if (!cw) {
        const kAn = T.findIndex((x, q) => q > j + 1 && q < e - 2 && isW(x, 'and'));
        if (kAn > 0 && T[kAn - 1].k === 'w' && !!vc(T[kAn - 1], ['base', '3sg', 'past']) && T[kAn + 1].k === 'w' && !!vc(T[kAn + 1], ['base', '3sg', 'past'])) {
          const mSo = mark();
          const cA = clause(j, kAn, { sub: true });
          const vB = cA && cA.subj && cA.pred && verbal(cA.pred) && !(cA.parts || []).some((x) => /を$/.test(x)) ? predOnly(kAn + 1, e, { subj: cA.subj, sub: true }) : null;
          const objB = vB && vB.pred && verbal(vB.pred) ? (vB.parts || []).find((x) => /を$/.test(x)) : null;
          if (objB && !vB.neg && !cA.neg) {
            name('rel-adv');
            const sB = vB.out({ form: 'attr', omit: cA.subj.pron || '\\u0001', omitSubj: true }).replace(objB, '');
            const outerSo = (() => { for (let x = j - 3; x >= Math.max(0, j - 7); x--) { if (T[x].k !== 'w') return null; if (PRON[T[x].w] && PRON[T[x].w].sub) return T[x].w; } return null; })();   // we change the way we produce … → 内側の「私たちが」は省く
            return fin((cA.subj.ja && !(cA.subj.pron && cA.subj.pron === outerSo) ? cA.subj.ja + 'が' : '') + objB + cA.pred.form('stem') + sB, 'rel-adv');
          }
          fail(mSo);
        }
      }
      // the way we live → 私たちの生き方 / the way people think → 人々の考え方""")
# We must change the way people think and behave / Unless we change the way we produce and consume energy（the way 節の中の並列を先に。右が「動詞 + 目的語」でも）
rep("""          (w === 'and' && b - rs === 1 && isCC && T.slice(a + 1, je).some((t0, q) => isW(t0, 'way') && isW(T[a + q], 'the'))) ||""",
    """          (w === 'and' && (b - rs === 1 || (b - rs <= 4 && T[rs] && T[rs].k === 'w' && !!vc(T[rs], ['base', '3sg', 'past']) && T[je - 1] && T[je - 1].k === 'w' && !!vc(T[je - 1], ['base', '3sg', 'past']))) && isCC && T.slice(Math.max(a + 1, je - 5), je).some((t0, q) => isW(t0, 'way') && isW(T[Math.max(a + 1, je - 5) + q - 1], 'the'))) ||""")
rep("""        if (!cuts.length && !isP(T[x - 1], ',') && T.slice(v0 + 1, x).some((y, q) => isW(y, 'to') && T[v0 + 2 + q] && T[v0 + 2 + q].k === 'w' && !!vc(T[v0 + 2 + q], ['base']))) return null;""",
    """        if (!cuts.length && !isP(T[x - 1], ',') && T.slice(v0 + 1, x).some((y, q) => isW(y, 'to') && T[v0 + 2 + q] && T[v0 + 2 + q].k === 'w' && !!vc(T[v0 + 2 + q], ['base']))) return null;
        if (!cuts.length && !isP(T[x - 1], ',') && T.slice(Math.max(v0 + 1, x - 5), x).some((y, q) => isW(y, 'way') && isW(T[Math.max(v0 + 1, x - 5) + q - 1], 'the')) && T[x - 1].k === 'w' && !!vc(T[x - 1], ['base', '3sg', 'past'])) return null;   // must change the way people think and behave（the way 節の中の並列）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
