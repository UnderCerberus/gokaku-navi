import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Halfway around the track, I passed one runner → トラックを半周したところで、1人の走者を追い抜いた
# （halfway around + コース・トラックは「半周したところで」。競走の文の track は「トラック」、pass + 走者・車は「追い抜く」）
rep("""        const wHw = T[i + 1].w === 'around' && /^(?:world|globe|earth)$/.test(pHw.obj.head || '') ? '地球の裏側' : pHw.obj.ja + (T[i + 1].w === 'to' ? 'への途中' : 'の途中');""",
    """        if (T[i + 1].w === 'around' && /^(?:track|tracks|lake|park|field|island|course|circuit|pond|block)$/.test(pHw.obj.head || '')) return { ja: pHw.obj.ja.replace(/通った跡$/, 'トラック') + 'を半周したところで', adn: pHw.obj.ja + 'を半周したところの', kind: 'place', end: pHw.end, prep: 'halfway', obj: pHw.obj };
        const wHw = T[i + 1].w === 'around' && /^(?:world|globe|earth)$/.test(pHw.obj.head || '') ? '地球の裏側' : pHw.obj.ja + (T[i + 1].w === 'to' ? 'への途中' : 'の途中');""")
rep("""      else if (L === 'pass' && /(?:^| )(?:ball|balls)$/.test(oh)) sense = { particle: 'を', core: 'パスする', tr: true };""",
    """      else if (L === 'pass' && /(?:^| )(?:ball|balls)$/.test(oh)) sense = { particle: 'を', core: 'パスする', tr: true };
      else if (L === 'pass' && !vg.passive && /(?:^| )(?:runner|runners|car|cars|truck|trucks|bus|buses|bike|bikes|cyclist|cyclists|swimmer|swimmers|rival|rivals|opponent|opponents|leader|leaders|competitor|competitors)$/.test(oh)) sense = { particle: 'を', core: '追い抜く', tr: true };""")
rep("""    if (/^legs?$/.test(nom.head || '') && /脚$/.test(ja)""",
    """    if (/^tracks?$/.test(nom.head || '') && /通った跡$/.test(ja) && T.some((x) => x.k === 'w' && /^(?:run|runs|ran|running|runner|runners|race|races|relay|lap|laps|sprint|athlete|athletes|stadium)$/.test(x.w))) ja = ja.replace(/通った跡$/, 'トラック');
    if (/^legs?$/.test(nom.head || '') && /脚$/.test(ja)""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
