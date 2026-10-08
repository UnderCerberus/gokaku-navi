import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/(のか|るか|たか)と((?:あなたが)?(?:いつ|どこ|何|誰|なぜ|どう))/g, '$1、$2')"
assert s.count(old) == 1
s = s.replace(old, old + ".replace(/(あなたが[^、。]{1,20}?か)、あなたが/, '$1、')")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
