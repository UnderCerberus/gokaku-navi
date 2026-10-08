import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I gave my seat to an elderly woman → 年配の女性に席を譲った
rep("""      else if (L === 'give' && !vg.passive && /^(?:example|examples|reason|""",
    """      else if (L === 'give' && !vg.passive && /^(?:seat|seats)$/.test(oh)) sense = { particle: 'を', core: '譲る', tr: true };   // I gave my seat to an elderly woman → 席を譲った
      else if (L === 'give' && !vg.passive && /^(?:example|examples|reason|""")

# We got stuck in a traffic jam → 渋滞に巻き込まれた
rep(""".replace(/\\bU\\.S\\.(?:A\\.)?/g, 'USA')""",
    """.replace(/\\b([Gg]et|[Gg]ot|[Gg]ets|[Gg]etting|[Gg]otten) stuck in (?:a |the )?(?:traffic jam|traffic)\\b/g, '$1 stuck in traffic').replace(/\\bU\\.S\\.(?:A\\.)?/g, 'USA')""")

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    ja = ja.replace(/渋滞にはま(った|る)/, (m0, a0) => (a0 === 'った' ? '渋滞に巻き込まれた' : '渋滞に巻き込まれる')).replace(/急ぎながらつかまえられた/, 'スピード違反で捕まった').replace(/停止に降り/g, '停留所で降り').replace(/([0-9０-９]+)番目の停留所/g, '$1つ目の停留所').replace(/([^、。はがを]{1,6}?)のための正しい(プラットホーム|ホーム|バス|電車|列車)/, '$1行きの正しい$2').replace(/門のところで(チケット|切符)を見せ/, '改札で$1を見せ');   // We got stuck in a traffic jam / He was caught speeding / Get off at the third stop / the right platform for Kyoto
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
