import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "      else if (t.w === 'how' && wh.end === j + 1 && inf.pred.cls !== 'suru' && /.する$/.test(inf.pred.plain()) && !/(?:でいる|ている|である|になる)$/.test(inf.pred.plain())) s = vpJoin(inf, 'dict') + '方法';"
assert s.count(old) == 1
s = s.replace(old, "      else if (t.w === 'how' && wh.end === j + 1 && inf.pred.cls !== 'suru' && (/.する$/.test(inf.pred.plain()) || inf.parts.some((x) => /一緒に$/.test(x))) && !/(?:でいる|ている|である|になる)$/.test(inf.pred.plain())) s = vpJoin(inf, 'dict') + '方法';")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
