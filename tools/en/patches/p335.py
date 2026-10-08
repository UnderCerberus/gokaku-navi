import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    'each time', 'the moment', 'as if',""", """    'each time', 'the moment', 'the last time', 'the next time', 'as if',""")
rep("""      case 'every time': case 'each time': case 'whenever': return S('attr', false) + 'たびに、';""",
    """      case 'every time': case 'each time': case 'whenever': return S('attr', false) + 'たびに、';
      case 'the last time': return '最後に' + S('attr') + 'とき、';   // The last time I saw him, he was a student → 最後に彼に会ったとき、
      case 'the next time': return '今度' + S('attr', false) + 'ときは、';   // The next time you come, bring your sister → 今度来るときは、""")

# so as (not) to → in order (not) to
rep(""".replace(/\\bonce in a blue moon\\b/gi, 'bluemoonadv')""",
    """.replace(/\\bso as (not )?to\\b/g, (m0, n0) => 'in order ' + (n0 || '') + 'to').replace(/\\bonce in a blue moon\\b/gi, 'bluemoonadv')""")

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    ja = ja.replace(/(?:もの|の)は([0-9０-９]+)(杯|個|本|枚)の([^、。]{1,8}?)だ(?=。|$)/, 'のは$3$1$2だ').replace(/ので、みんなは(彼|彼女)が好きだった/, 'ので、みんなが$1を好きだった');   // What I want is a cup of coffee → 私がほしいのはコーヒー1杯だ / so kind that everyone liked him
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
