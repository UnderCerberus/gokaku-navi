import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, "    if (tokens.some((x) => /^(?:take|takes|took|taking|bring|brings|brought)$/.test(x.w || '')) && tokens.some((x) => x.w === 'home')) ja = ja.replace(/余った食べ物/g, '食べ残し');   // let customers take leftover food home → 食べ残しを持って帰らせる\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
