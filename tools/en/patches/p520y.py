import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# few concrete measures have been taken so far → 具体的な対策はこれまでのところほとんど講じられていない（物の few 主語 + 受け身は hardly と同じ）
rep("""          if (sj.fewNeg && !vg.neg && vg.lemma !== 'be' && !vg.passive && !o.sub && !o.q && /^ほとんどの/.test(sj.ja || '')) sj = Object.assign({}, sj, { fewRel: true });""",
    """          const aHd = sj.fewNeg && !vg.neg && vg.passive && !o.q && !sj.an && /^ほとんどの/.test(sj.ja || '') ? advC({ k: 'w', w: 'hardly', s: 'hardly' }) : null;
          if (aHd) { sj = Object.assign({}, sj, { ja: sj.ja.replace(/^ほとんどの/, ''), fewNeg: undefined }); vg.advs = (vg.advs || []).concat([{ a: aHd, w: 'hardly' }]); }   // Few measures have been taken → 対策はほとんど講じられていない
          else if (sj.fewNeg && !vg.neg && vg.lemma !== 'be' && !vg.passive && !o.sub && !o.q && /^ほとんどの/.test(sj.ja || '')) sj = Object.assign({}, sj, { fewRel: true });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
