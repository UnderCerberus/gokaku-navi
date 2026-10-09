import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """            : reasonIng ? v.parts.join('') + (mn3.past ? (v.neg ? v.pred.aux('neg') : v.pred).form('past') : noDouble(v.neg ? v.pred.aux('neg') : v.pred).plain()) + 'ので、'   // Feeling tired, … → 疲れていると感じたので"""
new = """            : reasonIng ? (v.parts.join('') + (v.vg.lemma === 'know' && !v.neg ? (mn3.past ? v.pred.aux('prog').form('past') : v.pred.aux('prog').plain()) : (mn3.past ? (v.neg ? v.pred.aux('neg') : v.pred).form('past') : noDouble(v.neg ? v.pred.aux('neg') : v.pred).plain())) + 'ので、').replace(/であるので、$/, 'なので、')   // Feeling tired, … → 疲れていると感じたので / Being a student → 学生なので"""
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
