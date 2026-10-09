import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I do not think the plan is as risky as you say → あなたが言うほど危険だとは思わない（否定は think にあるが、as … as は ほど）
NT = "T.slice(0, k).some((x, q) => x.k === 'w' && x.w === 'not' && T[q + 1] && /^(?:think|believe|suppose|expect|imagine)$/.test(T[q + 1].w || ''))"
rep("""            return fin(f3.pred, tail(n3.end, lim, st, o, vg), 'SVC', [n3.ja + (mult || (vg.neg || (o.subj && o.subj.neg) ? 'ほど' : 'と同じくらい'))]);""",
    """            return fin(f3.pred, tail(n3.end, lim, st, o, vg), 'SVC', [n3.ja + (mult || (vg.neg || (o.subj && o.subj.neg) || """ + NT + """ ? 'ほど' : 'と同じくらい'))]);""")
rep("""            return fin(f3.pred, lim, 'SVC', [cl6.out({ part: 'が', form: 'attr', omit: sj && sj.pron }) + (vg.neg ? 'ほど' : 'のと同じくらい')]);""",
    """            return fin(f3.pred, lim, 'SVC', [cl6.out({ part: 'が', form: 'attr', omit: sj && sj.pron }) + (vg.neg || """ + NT + """ ? 'ほど' : 'のと同じくらい')]);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
