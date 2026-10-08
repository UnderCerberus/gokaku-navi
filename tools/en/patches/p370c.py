import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/^(春|夏|秋|冬)に、/, '$1には、');"
assert s.count(old) == 1
s = s.replace(old, old + "\n    ja = ja.replace(/職業上の(選手|野球選手|サッカー選手|歌手|写真家|ダンサー|料理人|ゴルファー|スポーツ選手|音楽家|テニス選手|ボクサー|画家|作家)/g, 'プロの$1').replace(/が何であるか(?=知|分|教|聞|尋)/g, 'が何か');   // a professional player → プロの選手 / Do you know what this is? → これが何か知っていますか")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
