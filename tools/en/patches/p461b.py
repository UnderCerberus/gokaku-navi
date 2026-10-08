import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """      if (t.w === 'so' && !isP(T[j - 1], ',') && j + 2 === b && T[j + 1].k === 'w' && (/^(?:long|much|far|hard|well|fast|early|late|often|quickly|slowly|loudly|badly|many)$/.test(T[j + 1].w) || ((!!adjC(T[j + 1]) || !!vc(T[j + 1], ['pp'])) && T[j - 1].k === 'w' && !!BE[T[j - 1].w]))) continue;"""
assert s.count(old) == 1
s = s.replace(old, old + """
      if (t.w === 'so' && !isP(T[j - 1], ',') && T[j - 1] && T[j - 1].k === 'w' && !!BE[T[j - 1].w] && T[j + 1] && T[j + 1].k === 'w' && (!!adjC(T[j + 1]) || !!vc(T[j + 1], ['pp']))) continue;   // I'm so excited about the concert（be + so + 形容詞は程度の so）""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
