import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "(sj.bare ? '' : (cl.also ? (cl.niSubj ? 'にも' : 'も') : (sj.wh ||"
new = "(sj.bare ? (/だけ$/.test(sj.ja) && !o.part && !cl.neg && !cl.also ? 'が' : '') : (cl.also ? (cl.niSubj ? 'にも' : 'も') : (sj.wh ||"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
