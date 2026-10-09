import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# you should keep it no matter what → 何があっても（節の末尾の no matter what は副詞の決まり文句。後ろに節が続く no matter what you do は別の読み）
rep("""    [['a great deal', '大いに'], ['far away', '遠くに'],""",
    """    [['a great deal', '大いに'], ['no matter what', '何があっても'], ['far away', '遠くに'],""")
rep("""      if (/^on (?:the|my|his|her|our|their|your) way(?: back)?$/.test(fx[k].toks.join(' ')) && isW(T[j + 3], 'back')""",
    """      if (fx[k].toks.join(' ') === 'no matter what' && j + 3 < lim && T[j + 3].k !== 'p') continue;
      if (/^on (?:the|my|his|her|our|their|your) way(?: back)?$/.test(fx[k].toks.join(' ')) && isW(T[j + 3], 'back')""")

# Once you have made a promise, you should keep it → それを守るべきだ（keep + it / them の先行詞が約束・秘密・規則なら 守る）
rep("""      else if (L === 'show' && objs.length === 1 && !objs[0].an && o.subj""",
    """      else if (L === 'keep' && objs.length === 1 && /^(?:it|them)$/.test(objs[0].pron || '') && T.some((x, q) => q < vg.idx && /^(?:promise|promises|secret|secrets|rule|rules|resolution|resolutions)$/.test(x.w || ''))) sense = { particle: 'を', core: '守る', tr: true };
      else if (L === 'show' && objs.length === 1 && !objs[0].an && o.subj""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
