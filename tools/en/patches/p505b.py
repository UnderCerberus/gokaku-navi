import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) are not only healthier but also sleep better → より健康なだけでなく、夜によりよく眠る（not only + 形容詞 but also + 述語）
rep("""        const k2 = isW(T[A.end + 1], 'also') ? A.end + 2 : A.end + 1;
        const B = k2 < lim ? compl(k2) : null;""",
    """        const k2 = isW(T[A.end + 1], 'also') ? A.end + 2 : A.end + 1;
        if (k2 < lim && T[k2].k === 'w' && !!vc(T[k2], ['base', '3sg', 'past']) && !BE[T[k2].w] && !adjC(T[k2])) {
          const mVb = mark();
          const pvB = predOnly(k2, lim, { subj: sj });
          if (pvB) { name('not-only'); vg.neg = false; return fin(P(A.head + '、' + pvB.out({}).replace(/。$/, '')), lim); }
          fail(mVb);
        }
        const B = k2 < lim ? compl(k2) : null;""")
rep("""          return { end: e, head: pre + g.attr + 'だけでなく',""",
    """          return { end: e, head: pre + (a.form === 'comp' ? 'より' : '') + g.attr + 'だけでなく',""")

# 2) learned how to ride a bicycle → 自転車の乗り方（乗る の に → の）
rep("""      else if (t.w === 'how' && wh.end === j + 1) s = (inf.pred.cls === 'suru' || (verbal(inf.pred) && !/(?:でいる|ている|である|になる)$/.test(inf.pred.plain())) ? inf.parts.join('').replace(/を$/, 'の') : inf.parts.join('')) +""",
    """      else if (t.w === 'how' && wh.end === j + 1) s = (inf.pred.cls === 'suru' || (verbal(inf.pred) && !/(?:でいる|ている|である|になる)$/.test(inf.pred.plain())) ? inf.parts.join('').replace(/を$/, 'の').replace(/に$/, /^乗る$/.test(inf.pred.plain()) ? 'の' : 'に') : inf.parts.join('')) +""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
