import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """&& !T.some((x) => x.k === 'w' && /^(?:yesterday|ago|then)$/.test(x.w))) { p = P(p.plain() + 'かもしれない', 'i'); past = false; break; }"""
assert s.count(old) == 1
s = s.replace(old, """&& !T.some((x) => x.k === 'w' && /^(?:yesterday|ago|then)$/.test(x.w))) { p = P((/^(?:solve|help|save|cure|prevent|provide|produce|find|reduce|improve|make|create|feed|protect|treat|stop)$/.test(vg.lemma) ? canP(p).plain() : p.plain()) + 'かもしれない', 'i'); past = false; break; }""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
