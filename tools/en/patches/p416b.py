import io
p = r'C:\Claude\gokaku-navi\js\data\dict-a-l.js'
s = io.open(p, encoding='utf-8').read()
old = "    ['closet', '名', '押し入れ; クローゼット', 2],"
assert s.count(old) == 1
s = s.replace(old, "    ['closet', '名', 'クローゼット; 押し入れ', 2],")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)

p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };""",
    """      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };
      else if (L === 'check' && /(?:^| )(?:machine|bag|bags|pocket|pockets|drawer|drawers|closet|closets|box|boxes|locker|lockers|backpack|purse|wallet|refrigerator|fridge|cupboard|car|trunk|basket|suitcase|desk)$/.test(oh) && !vg.passive) sense = { particle: 'の中を', core: '見る', tr: true };   // Did you check the washing machine? → 洗濯機の中を見ましたか""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/毎週(月|火|水|木|金|土|日)曜日(?=[^にはもの、でだ。とかま])/g, '毎週$1曜日に');   // We meet every Sunday → 毎週日曜日に会う
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
