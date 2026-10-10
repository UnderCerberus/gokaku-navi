import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# rely on several of these methods rather than on just one → 1つだけではなく（rather than + 前置詞句）
rep("""          if (vR) { st.other.unshift(adR + vpJoin(vR, 'dict') + 'のではなく'); j = vR.end; continue; }
          fail(mR);
        }
      }""",
    """          if (vR) { st.other.unshift(adR + vpJoin(vR, 'dict') + 'のではなく'); j = vR.end; continue; }
          fail(mR);
        }
        if (kR < lim && T[kR].k === 'w' && !!PREP[T[kR].w] && kR + 1 < lim) {
          const mRp = mark();
          const pR = parsePP(kR, lim, {});
          if (pR && (pR.end === lim || T[pR.end].k === 'p')) { st.other.unshift(adR + ((T[kR].w === 'on' || T[kR].w === 'with') && pR.obj ? pR.obj.ja : pR.ja) + 'ではなく'); j = pR.end; continue; }
          fail(mRp);
        }
      }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
