import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/(?:ミスター)?氏と([^、。]{1,8}?)さん/g, '$1夫妻')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/((?:職員|スタッフ|店員|係員|運転手|人|男性|女性|先生|友達|母|父|祖母|祖父|彼|彼女|少年|少女|客|乗客|医者|看護師|警察官))への([^、。]{1,8}?)を(手渡|渡|送|あげ|見せ|贈)/g, '$1に$2を$3');   // handing a ticket to a staff member → 職員にチケットを手渡している\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
