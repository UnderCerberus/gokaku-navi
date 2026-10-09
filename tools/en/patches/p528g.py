import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The more I thought about the problem → 問題について考えれば考えるほど（について / に対して も助詞として切る。考えればついて考えるほど にしない）
rep("""      const mV1 = !c1.neg && !h1.lessV && /^(?:v5|v1|suru)$/.test(p1.cls || '') ? /^(.*[をにがでと])([^をにがでと]{2,})$/.exec(p1.plain()) : null;
      if (mV1) { const pV1 = P(mV1[2], p1.cls); return (sj1 && sj1.ja && !genYou ? sj1.ja + 'が' : '') + c1.parts.join('') + mV1[1] + h1.pre + pV1.form('ba') + (p1.cls === 'suru' ? 'する' : pV1.plain()) + 'ほど、'; }   // put off the work → 仕事を長く延期すればするほど""",
    """      const mV1 = !c1.neg && !h1.lessV && /^(?:v5|v1|suru)$/.test(p1.cls || '') ? /^(.*(?:について|に対して|[をにがでと]))([^をにがでと]{2,})$/.exec(p1.plain()) : null;
      if (mV1) { const pV1 = P(mV1[2], p1.cls); return (sj1 && sj1.ja && !genYou ? sj1.ja + 'が' : '') + c1.parts.join('') + mV1[1] + h1.pre + pV1.form('ba') + (p1.cls === 'suru' ? 'する' : pV1.plain()) + 'ほど、'; }   // put off the work → 仕事を長く延期すればするほど""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
