import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# …, almost as if they had a compass inside their heads → まるで…かのように（almost / just as if）
rep("""'the moment', 'the last time', 'the next time', 'as if', 'as though',""",
    """'the moment', 'the last time', 'the next time', 'as if', 'as though', 'almost as if', 'just as if', 'almost as though',""")
rep("""      case 'as if': case 'as though': return 'まるで' + S('attr', sc.perfect ? true : false) + 'かのように、';""",
    """      case 'as if': case 'as though': case 'almost as if': case 'just as if': case 'almost as though': return 'まるで' + S('attr', sc.perfect ? true : false) + 'かのように、';""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
