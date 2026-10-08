import io
p = r'C:\Claude\gokaku-navi\js\data\idioms.js'
s = io.open(p, encoding='utf-8').read()
old = "    ['go over ~', '〜を調べる; 〜を見直す', 2],"
assert s.count(old) == 1
s = s.replace(old, "    ['go over ~', '〜を見直す; 〜を調べる', 2],")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)

p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, """    ja = ja.replace(/((?:ショッピング)?モール|駅|店|公園|図書館|空港|スーパー|コンビニ)に([^、。]{1,8}?)に偶然出会/g, '$1で$2に偶然出会').replace(/テントを貼/g, 'テントを張').replace(/(?:外に)?(?:よく|うまく)機能した(?=。|$)/, 'うまくいった').replace(/いくらかの(牛乳|パン|水|お茶|コーヒー|卵|果物)/g, '$1').replace(/(牛乳|パン|卵|食べ物|食料品|飲み物|果物|野菜)を拾/g, '$1を買');   // came across an old friend at the mall → モールで旧友に偶然出会った / put up a tent → テントを張る / The plan worked out well → うまくいった / pick up some milk → 牛乳を買う
""" + old)
old2 = "|special|annual|charity|sports|music|school|online|big|fun|start|starts|started|begin|begins|began|end|ends|ended|finish|finishes)$/.test(x.w || ''))) ja = ja.replace(/出来事/g, 'イベント');"
assert s.count(old2) == 1
s = s.replace(old2, "|special|annual|charity|sports|music|school|online|big|fun|start|starts|started|begin|begins|began|end|ends|ended|finish|finishes|charge|organize|organizes|organized|prepare|prepared)$/.test(x.w || ''))) ja = ja.replace(/出来事/g, 'イベント');")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
