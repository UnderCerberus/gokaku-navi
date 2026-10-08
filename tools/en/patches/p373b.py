import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/^(春|夏|秋|冬)に、/, '$1には、');"
assert s.count(old) == 1
s = s.replace(old, old + """
    if (tokens.some((x, q) => x.w === 'such' && tokens[q + 1] && tokens[q + 1].w === 'as')) ja = ja.replace(/([^、。か]{1,10}?)か([^、。か]{1,10}?)か([^、。か]{1,10}?)のような/, '$1や$2、$3などの').replace(/([^、。か]{1,10}?)か([^、。か]{1,10}?)のような/, '$1や$2などの');   // such as a play, a cafe, or a haunted house → 劇や喫茶店、お化け屋敷などの""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
