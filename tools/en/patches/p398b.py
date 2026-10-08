import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "ja = ja.replace(/^朝に、/, '午前中は、').replace(/^午後に、/, '午後は、').replace(/^夕方に、/, '夕方は、').replace(/^夜に、/, '夜は、')"
new = "ja = ja.replace(/^朝に、/, '朝、').replace(/^午後に、/, '午後、').replace(/^夕方に、/, '夕方、').replace(/^夜に、/, '夜、')"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
