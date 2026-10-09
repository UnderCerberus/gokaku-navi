import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# as much as the smartphone has (in the past two decades) → スマートフォンほど（省略の has も as … as の後ろの助動詞として読み飛ばす）
rep("""        const auxAfter0 = !!n0 && n0.end < lim && T[n0.end].k === 'w' && (!!DO[T[n0.end].w] || !!MODAL[T[n0.end].w]);""",
    """        const auxAfter0 = !!n0 && n0.end < lim && T[n0.end].k === 'w' && (!!DO[T[n0.end].w] || !!MODAL[T[n0.end].w] || (!!HAVE[T[n0.end].w] && vg && vg.perfect && (n0.end + 1 >= lim || T[n0.end + 1].k === 'p' || !!PREP[T[n0.end + 1].w])));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
