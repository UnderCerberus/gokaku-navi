import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Some zoos in Japan are open → 日本の…動物園もある（場所の前置詞句で「日本のいくつかの」と前に何かつくとき）
rep("""    if (subjShown && ((/^(?:何人かの|一部の)/.test(sj.ja) && sj.an) || (/^いくつかの/.test(sj.ja)""",
    """    if (subjShown && ((/^(?:何人かの|一部の)/.test(sj.ja) && sj.an) || (/^(?:[^、。]{1,8}の)?いくつかの/.test(sj.ja)""")
rep("""sj.ja.replace(/^(?:何人かの|一部の|いくつかの)/, '')""",
    """sj.ja.replace(/^(?:何人かの|一部の|いくつかの)/, '').replace(/^([^、。]{1,8}の)いくつかの/, '$1')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
