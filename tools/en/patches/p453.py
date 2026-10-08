import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/誰かより(?!も)/g, '誰よりも')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/^1ダースの([^、。]{1,6}?)は/, '$11ダースは').replace(/([^、。]{1,10}?)で費やされた/g, '$1に使われた').replace(/^(ほぼ|約|およそ)([^、。]{1,10}?)の([0-9０-９]+(?:%|パーセント))/, '$2の$1$3').replace(/半分に落ち/g, '半分に減っ').replace(/いいよと(言っ|答え)/g, 'はいと$1');   // A dozen eggs → 卵1ダース / Half of the money was spent on food → 食べ物に使われた / Nearly 40 percent of the people → 人々のほぼ40% / Sales fell by half → 半分に減った / said yes → はいと言った\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
