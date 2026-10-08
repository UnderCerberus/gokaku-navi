import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""|reading|free|sign|register|library|museum|admission|volunteer|volunteers|summer|winter|local|community|club)$/.test(x.w || ''))) ja = ja.replace(/出来事/g, 'イベント')""",
    """|reading|free|sign|register|library|museum|admission|volunteer|volunteers|summer|winter|local|community|club|draw|drew|draws|attract|attracted|attracts|crowd|crowds)$/.test(x.w || ''))) ja = ja.replace(/出来事/g, 'イベント')""")

rep("""    ja = ja.replace(/(リスク|危険|費用|コスト|ストレス|量|ごみ)を(減らす|下げる|抑える)ことがある/g, '$1を$2ことができる');""",
    """    ja = ja.replace(/(リスク|危険|費用|コスト|ストレス|量|ごみ)を(減らす|下げる|抑える)ことがある/g, '$1を$2ことができる').replace(/(?:大きい|大きな)群衆/g, '大勢の人');   // drew large crowds → 大勢の人を集めた""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
