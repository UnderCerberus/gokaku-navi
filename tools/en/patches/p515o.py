import io
p = r'C:\Claude\gokaku-navi\js\english/syntax.js'.replace('/', '\\')
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# …, especially if you are shy → 特に内気なら、…（especially は後ろの従属節にかける。主節には入れない）
rep("""      const m4 = mark();
      const je = isP(pv, ',') ? j - 1 : j;
      if (s2.key === 'when' && !o.sub) {""",
    """      const m4 = mark();
      const espS = pv.k === 'w' && /^(?:especially|particularly)$/.test(pv.w) && isP(T[j - 2], ',') && j - 2 > a + 1;
      const je = espS ? j - 2 : (isP(pv, ',') ? j - 1 : j);
      if (s2.key === 'when' && !o.sub) {""")
rep("""          return wrap(nodeW);
        }
        return wrap(joinSub(s2.key, sc4, mn4));
      }
      fail(m4);""",
    """          return wrap(nodeW);
        }
        const nodeJs = joinSub(s2.key, sc4, mn4);
        if (espS && nodeJs && nodeJs.out) { const outJs = nodeJs.out; nodeJs.out = (z) => { const rJs = outJs(z); return rJs.indexOf('もし') >= 0 ? rJs.replace('もし', '特に') : '特に' + rJs; }; }   // , especially if / when … → 特に〜なら・とき
        return wrap(nodeJs);
      }
      fail(m4);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
