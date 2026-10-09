import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# She is caring / responsible and caring → 思いやりがある（自動詞の -ing でも形容詞として使う語。節末・and・than の前）
rep("""    const s = en.jp.senses(r.c.e.ja)[0];
    if (s && !s.tr) return true;                       // living など自動詞""",
    """    if (/^(?:caring|outgoing|promising|thriving|lasting|willing|forgiving|understanding|accommodating|easygoing)$/.test(t.w) && (r.end >= lim || T[r.end].k === 'p' || /^(?:and|but|than|enough|to)$/.test(T[r.end].w || ''))) return false;   // She is caring → 思いやりがある
    const s = en.jp.senses(r.c.e.ja)[0];
    if (s && !s.tr) return true;                       // living など自動詞""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
