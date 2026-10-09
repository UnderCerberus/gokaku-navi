import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

# Some experts worry about it → それを心配する専門家もいる（熟語で目的語ごと述語に入ったときも「〜する N もいる」にする）
old = "&& !cl.niSubj && !cl.lead && ((cl.parts || []).join('') || cl.pred.cls === 'da' || cl.pred.cls === 'i')) {   // Some readers say that"
new = "&& !cl.niSubj && !cl.lead && ((cl.parts || []).join('') || cl.pred.cls === 'da' || cl.pred.cls === 'i' || /^[^、。]+[をにがと][^、。]+$/.test(cl.pred.s || ''))) {   // Some readers say that"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
