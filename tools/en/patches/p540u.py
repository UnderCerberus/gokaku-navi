import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# trying to stop a bad habit through willpower alone → 意志の力だけで（意志・努力・忍耐などの手段の through は「〜で・〜によって」。「意志の力だけを通って」にしない）
rep("""      case 'through':
""",
    """      case 'through':
        if (obj.head && /^(?:willpower|determination|patience|persistence|perseverance|discipline|repetition|hard work|observation|experiment|experiments|analysis|negotiation|negotiations|dialogue|diplomacy|imitation|trial and error)$/.test(obj.head) && !obj.pron) return R(n + 'によって', 'other', n + 'による');
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
