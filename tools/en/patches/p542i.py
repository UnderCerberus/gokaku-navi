import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# lower the temperature by a degree or two → 1、2度下げる / for a day or two → 1、2日間 / a minute or two → 1、2分（a + 単位 + or two / three は概数）
rep("""      if (/^(?:a|an|one)$/.test(t.w) && i + 4 < lim && seq(i + 2, ['and', 'a', 'half'])) {   // an hour and a half → 1時間半""",
    """      if (/^(?:a|an|one)$/.test(t.w) && i + 3 < lim && isW(T[i + 2], 'or') && /^(?:two|three)$/.test(T[i + 3].w || '')) {
        const ucO = nounC(T[i + 1]);
        if (ucO && UNIT[ucO.lemma]) { pick(i + 1, ucO.e); const n2O = T[i + 3].w === 'two' ? 2 : 3; return postMod({ ja: '1、' + n2O + UNIT[ucO.lemma], end: i + 4, head: ucO.lemma, dur: !!DURUNIT[ucO.lemma], num: { val: n2O, ja: '1、' + n2O }, unit: ucO.lemma, pl: true }, lim, o); }
      }
      if (/^(?:a|an|one)$/.test(t.w) && i + 4 < lim && seq(i + 2, ['and', 'a', 'half'])) {   // an hour and a half → 1時間半""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
