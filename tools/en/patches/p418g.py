import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, "    if (/^(?:[^、。]{0,12}、)?(?:人々|多くの人々|一部の人々)は/.test(ja)) ja = ja.replace(/彼らの(?=[^、。]{1,10}を)/g, '');   // people can help by planning their meals → 人々は…食事を計画する\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
