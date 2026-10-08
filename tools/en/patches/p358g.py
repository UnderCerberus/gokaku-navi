import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""  function translate1(tokens) {
    reset(tokens);""",
    """  let FRAG_WIDE = false;   // 文全体を直接訳すときだけ、長め（8 語まで）の断片を認める（コロンの右側・引用の中は 5 語まで）
  function translate1(tokens) {
    const wideF = FRAG_WIDE; FRAG_WIDE = false;
    reset(tokens);""")
rep("""    const rT = translate1(tokens);   // 文全体の最後の整形（文単位の規則が早く返した場合にも効かせる）""",
    """    FRAG_WIDE = true;
    const rT = translate1(tokens);   // 文全体の最後の整形（文単位の規則が早く返した場合にも効かせる）
    FRAG_WIDE = false;""")
rep("""    if (!node && b >= 1 && b <= 8 && !tokens.some((x) => x.k === 'q')) {""",
    """    if (!node && b >= 1 && b <= (wideF ? 8 : 5) && !tokens.some((x) => x.k === 'q')) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
