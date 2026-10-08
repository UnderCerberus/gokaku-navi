import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)
rep("""        else if (vg.lemma === 'be' && !vg.passive && !verbal(p) && !neg && sj && !/^(?:i|you|we)$/.test(sj.pron || '') && T[vg.end] && !!adjC(T[vg.end]) && /^(?:dangerous|""",
    """        else if (vg.lemma === 'be' && !vg.passive && !verbal(p) && !neg && sj && !/^(?:i|you|we)$/.test(sj.pron || '') && (() => { let qA = vg.end; while (T[qA] && /^(?:very|so|really|quite|extremely|pretty|rather|too)$/.test(T[qA].w || '')) qA++; return !!T[qA] && !!adjC(T[qA]) && (vg.cbAdj = adjC(T[qA]).lemma); })() && /^(?:dangerous|""")
rep("""|addictive|stressful|lonely|tiring|unfair|unreliable|inaccurate)$/.test(adjC(T[vg.end]).lemma)) p = P(p.plain() + 'こともある', 'aru');""",
    """|addictive|stressful|lonely|tiring|unfair|unreliable|inaccurate)$/.test(vg.cbAdj)) p = P(p.plain() + 'こともある', 'aru');
        // You can be happy / You can be a doctor → 幸せになれる・医者になれる
        else if (vg.lemma === 'be' && !vg.passive && !vg.prog && !verbal(p) && !neg && sj && (anim || (sj.pron && PRON[sj.pron] && PRON[sj.pron].an)) && /(?:い|だ)$/.test(p.plain()) && !/(?:ない|たい|らしい|ようだ|そうだ)$/.test(p.plain())) p = P((/い$/.test(p.plain()) ? p.plain().replace(/い$/, 'く') : p.plain().replace(/だ$/, 'に')) + 'なれる', 'v1');""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
