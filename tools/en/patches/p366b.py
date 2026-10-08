import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/中国の万里の長城/g, '万里の長城');"
assert s.count(old) == 1
s = s.replace(old, old + """
    ja = ja.replace(/偉大そうに見え/g, 'すてきに見え').replace(/^((?:その|この)?(?:ケーキ|料理|食べ物|スープ|パン|ピザ|カレー|夕食|昼食|朝食|クッキー|パスタ|すし|寿司))は(とても|本当に)?(?:すてきに|良さそうに|よさそうに|おいしそうに)見え(る|た)(?=。|$)/, (m0, a0, b0, c0) => a0 + 'は' + (b0 || '') + 'おいしそう' + (c0 === 'た' ? 'だった' : 'だ'));   // The cake looks great → ケーキはおいしそうだ""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
