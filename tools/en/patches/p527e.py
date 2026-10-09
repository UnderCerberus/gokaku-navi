import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# get used to life in Japan again / He is used to life in the city → 日本の生活に再び慣れる・都市の生活に慣れている（慣れるの目的語は前置詞句まで名詞句で読む。日本に生活に にしない）
rep("""const oUt = np(s0, lim, { pp: true }); if (oUt && oUt.end === lim) obj = oUt; else fail(mUt); }""",
    """const oUt = np(s0, lim, { pp: true }); if (oUt && (oUt.end === lim || (T[oUt.end].k === 'w' && !!ADV[T[oUt.end].w] && !PREP[T[oUt.end].w]))) obj = oUt; else fail(mUt); }""")
rep("""          obj = gerundNP(e0, lim) || np(e0, lim, {});
        }
        if (!obj) { fail(m1); continue; }""",
    """          if (it.it && /^(?:be used to ~|be accustomed to ~)$/.test(it.it.phrase) && !ingVerb(e0, lim)) { const mUb = mark(); const oUb = np(e0, lim, { pp: true }); if (oUb && (oUb.end === lim || (T[oUb.end].k === 'w' && !!ADV[T[oUb.end].w] && !PREP[T[oUb.end].w]))) obj = oUb; else fail(mUb); }
          if (!obj) obj = gerundNP(e0, lim) || np(e0, lim, {});
        }
        if (!obj) { fail(m1); continue; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
