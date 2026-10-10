import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Some authorities worried that … for them to control → 当局は…自分たちが（authorities は組織。それら にしない）
rep("""  const ORG = set('union company team group family government school club band crew staff committee organization association party nation country city town village community firm agency department office army police force class audience public society');""",
    """  const ORG = set('union company team group family government school club band crew staff committee organization association party nation country city town village community firm agency department office army police force class audience public society authority authorities');""")

# Ideas that had once been shared … / He had once lived in Paris → かつて（過去完了の once は「かつて」。現在完了の have once visited は 一度 のまま）
rep("""    if (st.once && vg.perfect) parts.push('一度');""",
    """    if (st.once && vg.perfect && !vg.past) parts.push('一度');""")
rep("""    if (st.once && !vg.perfect) parts.push('かつて');""",
    """    if (st.once && (!vg.perfect || vg.past)) parts.push('かつて');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
