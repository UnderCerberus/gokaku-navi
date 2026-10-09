import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He spoke English, not to mention French and German, so … → フランス語とドイツ語は言うまでもなく、彼は英語を話したので、…
# The hotel was expensive, not to mention noisy → うるさいのは言うまでもなく、ホテルは高かった（not を主節の否定にしない）
rep("""          if (rLa && rLa.ok) return Object.assign({}, rLa, { ja: rLa.ja.replace(/。$/, '') + '。まして' + jLa + 'はなおさらだ。' });
        } else fail(mLa);
      }
    }""",
    """          if (rLa && rLa.ok) return Object.assign({}, rLa, { ja: rLa.ja.replace(/。$/, '') + '。まして' + jLa + 'はなおさらだ。' });
        } else fail(mLa);
      }
    }
    {
      const kNm = T.findIndex((x, q) => q > 1 && q < b - 3 && isP(x, ',') && (seq(q + 1, ['not', 'to', 'mention']) || seq(q + 1, ['not', 'to', 'speak', 'of'])));
      if (kNm > 0 && !tokens.__nmSplit) {
        const sNm = kNm + (isW(T[kNm + 3], 'speak') ? 5 : 4);
        let eNm = b;
        for (let x = sNm + 1; x < b; x++) if (isP(T[x], ',')) { eNm = x; break; }
        const mNm = mark();
        const nNm = np(sNm, eNm, { noRel: true });
        const aNm = !nNm || nNm.end !== eNm ? adjAt(sNm, eNm) : null;
        const jNm = nNm && nNm.end === eNm && !nNm.pron ? nNm.ja + 'は' : (aNm && aNm.end === eNm && aNm.adj && aNm.adj.attr ? aNm.deg + aNm.adj.attr + 'のは' : '');
        fail(mNm);
        if (jNm) {
          const tNm = tokens.slice(0, kNm).concat(tokens.slice(eNm));
          tNm.__nmSplit = true;
          const rNm = translate1(tNm);
          reset(tokens);
          if (rNm && rNm.ok) return Object.assign({}, rNm, { ja: jNm + '言うまでもなく、' + rNm.ja });
        }
      }
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
