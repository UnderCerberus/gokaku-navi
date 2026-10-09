import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The roads are not safe enough. / It is not big enough. → 十分安全ではない（enough で終わる。to / for が続かない）
rep("""          fail(m); pick(k, a.e);
        }
        // Be careful not to burn yourself""",
    """          fail(m); pick(k, a.e);
        }
        if (isW(T[e], 'enough') && !cmp && !sup && !isW(T[e + 1], 'to') && !isW(T[e + 1], 'for')) {
          const mEn = mark();
          const nM = st.manner.length, nO = st.other.length, nTm = st.time.length;
          const eEn = tail(e + 1, lim, st, o, vg);
          if (eEn === lim) { name('enough-to'); return fin(predD('十分'), lim, 'SVC', []); }
          st.manner.length = nM; st.other.length = nO; st.time.length = nTm;
          fail(mEn);
        }
        // Be careful not to burn yourself""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
