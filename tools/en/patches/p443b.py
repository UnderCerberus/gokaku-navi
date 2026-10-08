import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/(駅|空港|家|学校|部屋|車|バス停)に([^、。]+?)を(運|持って行)/g, '$2を$1まで$3')"
assert s.count(old) == 1
s = s.replace(old, ".replace(/((?:[^、。にをはがで]{1,8}の)?(?:駅|空港|家|学校|部屋|車|バス停))に([^、。]+?)を(運|持って行)/g, '$2を$1まで$3')")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
