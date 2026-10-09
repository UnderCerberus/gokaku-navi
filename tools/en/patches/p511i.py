import io
# snap diff の見直し:
# 1) instrument の語順を戻す（doctors give up their instruments → 器具）。play + instrument のときだけ「楽器」にする（syntax.js の play の規則）
# 2) work week / four-day (work) week の複合語を外す（four-day が「4日の」になり複合語に届かず、introduce の規則も外れた）
p = r'C:\Claude\gokaku-navi\js\data\dict-a-l.js'
s = io.open(p, encoding='utf-8').read()
for old, new in (("    ['instrument', '名', '楽器; 器具', 2],\n", "    ['instrument', '名', '器具; 楽器', 2],\n"),
                 ("    ['four-day week', '名', '週4日勤務', 3],\n", ""),
                 ("    ['four-day work week', '名', '週4日勤務制', 3],\n", "")):
    assert s.count(old) == 1, old
    s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
p = r'C:\Claude\gokaku-navi\js\data\dict-m-z.js'
s = io.open(p, encoding='utf-8').read()
old = "    ['work week', '名', '週の労働時間; 週労働日', 3],\n"
assert s.count(old) == 1
s = s.replace(old, '')
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)

p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """      const vob = !vg.passive && VOBJ[L] && oh ? VOBJ[L].find((x) => x.re.test(oh)) : null;"""
new = """      if (L === 'play' && /^(?:instrument|instruments)$/.test(oh) && /器具$/.test(objs[0].ja || '')) objs[0] = Object.assign({}, objs[0], { ja: objs[0].ja.replace(/器具$/, '楽器') });   // play an instrument → 楽器を演奏する
      const vob = !vg.passive && VOBJ[L] && oh ? VOBJ[L].find((x) => x.re.test(oh)) : null;"""
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
