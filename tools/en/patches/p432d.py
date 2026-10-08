import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      const kOt = T.findIndex((x, q) => q > 2 && isW(x, 'others') && isP(T[q - 1], ','));
      if (kOt > 0 && kOt + 1 < b) {
        const t1Ot = tokenize('Some people ' + T.slice(1, kOt - 1).map((x) => x.s || x.w).join(' ') + '.');""",
    """      const kOt = T.findIndex((x, q) => q > 2 && isW(x, 'others') && (isP(T[q - 1], ',') || (T[q - 1] && /^(?:while|whereas|but|and)$/.test(T[q - 1].w || '') && isP(T[q - 2], ','))));
      if (kOt > 0 && kOt + 1 < b) {
        const kEt = isP(T[kOt - 1], ',') ? kOt - 1 : kOt - 2;
        const t1Ot = tokenize('Some people ' + T.slice(1, kEt).map((x) => x.s || x.w).join(' ') + '.');""")

rep("""    ja = ja.replace(/より偉大な/g, 'より大きな')""",
    """    ja = ja.replace(/私的な生活/g, '私生活').replace(/自分の同僚(から|と|に|を|の)/g, '同僚$1').replace(/より偉大な/g, 'より大きな')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
