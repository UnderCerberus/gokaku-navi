import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# she began to appreciate the food she had eaten as a child → 食べ物の良さが分かり始めた（正しく評価する にしない）
rep("""    'meet|deadline deadlines|を|守る', 'meet|goal goals target targets|を|達成する',
""",
    """    'meet|deadline deadlines|を|守る', 'meet|goal goals target targets|を|達成する',
    'appreciate|food foods meal meals cooking cuisine dish dishes music art arts painting paintings nature culture cultures poetry literature novel novels film films movie movies taste flavor flavors tradition traditions life|の|良さが分かる',
    'appreciate|help kindness support effort efforts advice gift gifts hospitality|に|感謝する',
    'appreciate|beauty importance value significance difference differences|が|分かる',
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
