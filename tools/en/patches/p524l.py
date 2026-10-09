import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The old temple is well worth visiting → 十分に訪れる価値がある（worth の前の well は程度の副詞）
rep("""    let kk = j, deg0 = '';
    const DEGX = { really: '本当に', totally: 'すっかり', completely: 'すっかり' };""",
    """    let kk = j, deg0 = '';
    if (isW(T[kk], 'well') && isW(T[kk + 1], 'worth') && kk + 2 < lim) { deg0 = '十分に'; kk++; }
    const DEGX = { really: '本当に', totally: 'すっかり', completely: 'すっかり' };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
