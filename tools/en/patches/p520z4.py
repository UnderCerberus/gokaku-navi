import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# They said that they would rather stay home / Many of the students … said that they would rather … → 主語と同じ彼らは（は も）省く
rep("""        if (o.subj && o.subj.pron && PJA[o.subj.pron] && tc.cl && tc.cl.subj && tc.cl.subj.pron === o.subj.pron && tStr.indexOf(PJA[o.subj.pron] + 'が') === 0) tStr = tStr.slice(PJA[o.subj.pron].length + 1);""",
    """        if (o.subj && o.subj.pron && PJA[o.subj.pron] && tc.cl && tc.cl.subj && tc.cl.subj.pron === o.subj.pron && (tStr.indexOf(PJA[o.subj.pron] + 'が') === 0 || tStr.indexOf(PJA[o.subj.pron] + 'は') === 0)) tStr = tStr.slice(PJA[o.subj.pron].length + 1);   // They said that they would rather … → むしろ…たいと言った""")
rep("""        if (o.subj && !o.subj.pron && o.subj.an && (o.subj.pl || o.subj.coord) && /^彼らが/.test(tStr)) tStr = tStr.replace(/^彼らが/, '');""",
    """        if (o.subj && !o.subj.pron && (o.subj.an || /(?:たち|人々)の(?:多く|ほとんど|大半|一部)$/.test(o.subj.ja || '')) && (o.subj.pl || o.subj.coord || /の(?:多く|ほとんど|大半|一部)$/.test(o.subj.ja || '')) && /^彼ら(?:が|は)/.test(tStr)) tStr = tStr.replace(/^彼ら(?:が|は)/, '');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
