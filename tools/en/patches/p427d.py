import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""          if (rE && rE.ok) return Object.assign({}, rE, { ja: rE.ja.replace(/^もしそれが必要だったら、/, '必要なら、').replace(/^もしそれが必要なら、/, '必要なら、') });""",
    """          if (rE && rE.ok) return Object.assign({}, rE, { ja: rE.ja.replace(/^もしそれが必要だったら、/, '必要なら、').replace(/^もしそれが必要なら、/, '必要なら、').replace(/^もしそれが可能(?:だったら|なら)、/, '可能なら、') });""")

rep("""    ja = ja.replace(/夜の空/g, '夜空');""",
    """    ja = ja.replace(/夜の空/g, '夜空');
    ja = ja.replace(/かもしれなくて、/g, 'かもしれず、').replace(/だろう、そして/g, 'だろうし、');   // many crops could be affected, and food prices might rise → 影響を受けるかもしれず、…""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
