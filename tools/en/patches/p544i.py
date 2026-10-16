import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# a good way to relax → くつろぐ良い方法（way / method + to do は目的語の穴を先に使わない。「くつろがせる良い方法」にしない）
rep("""      const inf0 = (noGap2 && !(node.head === 'time' && /^(?:spend|waste|kill|save|share|enjoy|find)$/.test(T[j + 1].w || ''))) || firstN ? vpNonfin(j + 1, e, 'base', {}) : null;""",
    """      const inf0 = (noGap2 && !(node.head === 'time' && /^(?:spend|waste|kill|save|share|enjoy|find)$/.test(T[j + 1].w || ''))) || firstN || /^(?:way|ways|method|methods|means)$/.test(node.head || '') ? vpNonfin(j + 1, e, 'base', {}) : null;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
