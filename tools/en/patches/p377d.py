import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# She must cook dinner and wash the dishes（法助動詞を抜いた最初の節 "She cook dinner" は一致を見ない）
rep("""  function agree(sj, p) {
    const t = T[p];""",
    """  let NO_AGREE = false;
  function agree(sj, p) {
    if (NO_AGREE) return true;
    const t = T[p];""")
rep("""    const c0 = withTokens(firstT, () => clause(0, firstT.length, {}));""",
    """    NO_AGREE = true;
    let c0 = null;
    try { c0 = withTokens(firstT, () => clause(0, firstT.length, {})); } finally { NO_AGREE = false; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
