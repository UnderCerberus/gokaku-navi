import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# nothing but my own breathing → 自分自身の呼吸（my own + 動名詞は「私自身のもの」にしない。p547b の np1 に回す）
rep("""    if (/^(?:my|your|his|her|our|their)$/.test(t.w) && isW(T[i + 1], 'own') && (i + 2 >= lim || T[i + 2].k !== 'w' || (!nounC(T[i + 2]) && !adjC(T[i + 2]))""",
    """    if (/^(?:my|your|his|her|our|their)$/.test(t.w) && isW(T[i + 1], 'own') && !(T[i + 2] && T[i + 2].k === 'w' && !!vc(T[i + 2], ['ing']) && !nounC(T[i + 2]) && /^[一-龯ァ-ヶー]+する$/.test((() => { const cOw = vc(T[i + 2], ['ing']); return cOw && cOw.e ? verbSense(cOw.e, true).core : ''; })())) && (i + 2 >= lim || T[i + 2].k !== 'w' || (!nounC(T[i + 2]) && !adjC(T[i + 2]))""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
