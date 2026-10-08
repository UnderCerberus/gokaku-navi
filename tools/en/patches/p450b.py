import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/(?:ほかの|他の)?誰かよりも/g,"
assert s.count(old) == 1
s = s.replace(old, """    ja = ja.replace(/誰かより(?!も)/g, '誰よりも').replace(/誰か以上/g, '誰よりも').replace(/数が(だんだん)?小さくなって/g, '数が$1減って').replace(/数が(だんだん)?大きくなって/g, '数が$1増えて').replace(/結婚している([^、。]{1,6}?)が(減って|増えて)/g, '結婚する$1が$2').replace(/^(.+?)には世界で最も高い平均寿命の1つがある/, '$1は世界で最も平均寿命が長い国の1つだ');   // He works harder than anyone → 誰よりも熱心に / The number of children is getting smaller → 子どもの数が減ってきている / Fewer young people are getting married → 結婚する若い人が減っている
""" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
