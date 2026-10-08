import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/アルバイトを持つ/g, 'アルバイトをする')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/(?:ミスター)?氏と([^、。]{1,8}?)さん/g, '$1夫妻').replace(/夫妻は([^、。]{0,10}?)(?:それらの|彼らの)/g, '夫妻は$1');   // Mr. and Mrs. Sato were talking about their summer vacation → 佐藤夫妻は夏休みについて話していた\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
