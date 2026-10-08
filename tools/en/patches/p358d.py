import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# KATA_N を共通の表へ移す
start = s.index("      const KATA_N = { green: 'グリーン',")
end = s.index('\n', start) + 1
line = s[start:end]
s = s[:start] + s[end:]
table = line.strip().replace('const KATA_N = {', 'const KATA_N = dic({').rstrip(';').rstrip('}') + '});'
rep("""  const FACIL = dic({ station: '駅',""",
    "  " + table + "   // Green Park → グリーン公園（大文字の一般語 + 大文字の施設名）\n" + """  const FACIL = dic({ station: '駅',""")

# 修飾語のループで Green を形容詞として取らない
rep("""    for (;;) {
      if (j >= lim || multiAt(j, lim)) break;""",
    """    for (;;) {
      if (j >= lim || multiAt(j, lim)) break;
      if (T[j].k === 'w' && KATA_N[T[j].w] && (T[j].cap || T[j].first) && j + 1 < lim && T[j + 1].k === 'w' && T[j + 1].cap && FACIL[T[j + 1].w]) break;   // Green Park""")

# 断片は 8 語まで
rep("""    if (!node && b >= 1 && b <= 5 && !tokens.some((x) => x.k === 'q')) {""",
    """    if (!node && b >= 1 && b <= 8 && !tokens.some((x) => x.k === 'q')) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
