import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Children should be allowed to use smartphones only after they turn fourteen → 14歳になって初めて、子どもはスマートフォンを使うことを許されるべきだ
# I realized the truth only after he left → 彼が出発して初めて、私は真実に気づいた（文末の only after / when / once / if + 節。ただ使う・ただ気づいた にしない）
rep("""    if (T[a] && /^(?:hardly|scarcely|not|never)$/.test(T[a].w || '') && isW(T[a + 1], 'a') && T[a + 2] && /^(?:day|week|month|year)$/.test(T[a + 2].w || '')""",
    """    if (!o.sub) {
      let xOy = -1;
      for (let x = a + 2; x < b - 3; x++) if (isW(T[x], 'only') && T[x + 1] && /^(?:after|when|once|if)$/.test(T[x + 1].w || '')) { xOy = x; break; }
      if (xOy > 0) {
        const mOy = mark();
        const kwOy = T[xOy + 1].w;
        const scOy = sentence(xOy + 2, b, { sub: true });
        const eOy = isP(T[xOy - 1], ',') ? xOy - 1 : xOy;
        const mnOy = scOy ? sentence(a, eOy, o) : null;
        if (scOy && mnOy) {
          const sjM = mnOy.subj ? plainSubj(mnOy.subj) : null;
          const sameOy = scOy.subj && sjM && scOy.subj.pron && (scOy.subj.pron === sjM.pron || (scOy.subj.pron === 'they' && !sjM.pron && (sjM.pl || sjM.coord)) || (/^(?:he|she)$/.test(scOy.subj.pron) && !sjM.pron && sjM.an && !sjM.pl) || (scOy.subj.pron === 'it' && !sjM.pron && !sjM.an && !sjM.pl));
          const leadOy = kwOy === 'if' ? scOy.out(Object.assign({ part: 'が', form: 'attr' }, sameOy ? { omit: scOy.subj.pron } : {})) + '場合に限り、' : scOy.out(Object.assign({ part: 'が', form: 'te' }, sameOy ? { omit: scOy.subj.pron } : {})) + '初めて、';
          name('idiom');
          const nodeOy = Object.assign({}, mnOy); nodeOy.out = (y) => leadOy + mnOy.out(y); return wrap(nodeOy);
        }
        fail(mOy);
      }
    }
    if (T[a] && /^(?:hardly|scarcely|not|never)$/.test(T[a].w || '') && isW(T[a + 1], 'a') && T[a + 2] && /^(?:day|week|month|year)$/.test(T[a + 2].w || '')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
