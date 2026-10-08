import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""|octopus|octopuses|whale|whales|dolphin|dolphins|""",
    """|radioactivity|electricity|magnetism|gravity|atoms|atom|molecules|octopus|octopuses|whale|whales|dolphin|dolphins|""")

rep("""    ja = ja.replace(/知識の隙間/g, '知識の空白')""",
    """    ja = ja.replace(/自分の教育を続け/g, '勉学を続け').replace(/([^、。]+?)を研究するために一緒に働いた/g, '協力して$1を研究した').replace(/([^、。]+?)する最初の(女性|男性|日本人|人|アジア人)になった/g, '$2として初めて$1した');   // continue her education → 勉学を続ける / worked together to study radioactivity → 協力して放射能を研究した / became the first woman to win a Nobel Prize → 女性として初めてノーベル賞を受賞した
    ja = ja.replace(/知識の隙間/g, '知識の空白')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
