import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """      if (cnt > 0 && head === 'way') break;                               // the way S V（way のあとは節）
"""
assert s.count(old) == 1
s = s.replace(old, old + """      // give the other bees information（二重目的語: 複数名詞 + 物質名詞は複合名詞にしない）
      if (cnt > 0 && pl && /^(?:information|advice|food|water|money|help|permission|news|instructions|directions|homework|tips|support|energy|shelter|protection|warmth|attention|nectar|milk)$/.test(t.w || '') && T.slice(Math.max(0, i - 3), i).some((x) => x.k === 'w' && /^(?:give|gives|gave|giving|given|show|shows|showed|showing|tell|tells|told|telling|send|sends|sent|sending|teach|teaches|taught|teaching|offer|offers|offered|bring|brings|brought|lend|lends|lent)$/.test(x.w))) break;
""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
