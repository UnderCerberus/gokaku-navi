import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# She is used to getting up early, but her husband is not → 彼女の夫は早く起きることに慣れていない
# I like coffee, but my wife does not / She can swim, but I can't / They said they would come, but they didn't
# （文末の「, but + 主語 + 助動詞 (+ not)」の省略は、前の節の最後の助動詞のあとの動詞句を補って読む。夫はいない・妻はしない にしない）
rep("""          if (rNm && rNm.ok) return Object.assign({}, rNm, { ja: jNm + '言うまでもなく、' + rNm.ja });
        }
      }
    }""",
    """          if (rNm && rNm.ok) return Object.assign({}, rNm, { ja: jNm + '言うまでもなく、' + rNm.ja });
        }
      }
    }
    {
      const AUXE = /^(?:is|are|was|were|am|do|does|did|can|could|will|would|should|must|may|might|has|have|had)$/;
      let kEl = -1;
      for (let x = b - 3; x > 1; x--) if (isP(T[x], ',') && /^(?:but|and|while|whereas|though|although)$/.test((T[x + 1] || {}).w || '')) { kEl = x; break; }
      if (kEl > 0 && !tokens.__ellSplit) {
        let qa = b - 1, negEl = false;
        if (isW(T[qa], 'not')) { negEl = true; qa--; }
        const auxW = T[qa] && T[qa].k === 'w' ? T[qa].w : '';
        if (AUXE.test(auxW) && qa > kEl + 2) {
          const mEl = mark();
          const sEl = np(kEl + 2, qa, { noRel: true });
          const kindOf = (w) => (/^(?:is|are|was|were|am)$/.test(w) ? 'be' : (/^(?:has|have|had)$/.test(w) ? 'have' : 'mod'));
          let vpT = null;
          if (sEl && sEl.end === qa) {
            let la = -1;
            for (let x = kEl - 1; x > 0; x--) if (T[x].k === 'w' && AUXE.test(T[x].w) && !(/^(?:do|does|did|has|have|had)$/.test(T[x].w) && !(T[x + 1] && T[x + 1].k === 'w' && (isW(T[x + 1], 'not') || !!vc(T[x + 1], ['base', 'pp']))))) { la = x; break; }
            if (la > 0) {
              let s0 = la + 1;
              while (s0 < kEl && isW(T[s0], 'not')) s0++;
              if (s0 < kEl && kindOf(T[la].w) === kindOf(auxW)) vpT = tokens.slice(s0, kEl);
            } else if (/^(?:do|does|did)$/.test(auxW)) {
              const s1 = np(0, kEl, { noRel: true });
              const cV = s1 && s1.end < kEl && T[s1.end].k === 'w' ? vc(T[s1.end], ['base', '3sg', 'past']) : null;
              if (cV && cV.lemma) vpT = [tokenize(cV.lemma)[0]].concat(tokens.slice(s1.end + 1, kEl));
            }
          }
          fail(mEl);
          if (vpT && vpT.length) {
            const tEl = tokens.slice(0, qa + 1).concat(negEl ? [tokens[qa + 1]] : []).concat(vpT).concat(tokens.slice(b));
            tEl.__ellSplit = true;
            const rEl = translate1(tEl);
            reset(tokens);
            if (rEl && rEl.ok) return rEl;
          }
        }
      }
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
