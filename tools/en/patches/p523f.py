import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# a safe and loving home / a warm and loving home → 安全で愛情のある家庭（形容詞 and -ing + 名詞も名詞の前の並列）
rep("""      if (!more && md.te && nx && isW(nx, 'and') && md.end + 2 < lim && adjC(T[md.end + 1]) && (nounC(T[md.end + 2]) || adjC(T[md.end + 2]) || ingHead(md.end + 2))) {""",
    """      if (!more && md.te && nx && isW(nx, 'and') && md.end + 2 < lim && (adjC(T[md.end + 1]) || (T[md.end + 1].k === 'w' && !!vc(T[md.end + 1], ['ing']) && !nounC(T[md.end + 1]) && T[md.end + 2].k === 'w' && !!nounC(T[md.end + 2]) && !PREP[T[md.end + 2].w])) && (nounC(T[md.end + 2]) || adjC(T[md.end + 2]) || ingHead(md.end + 2))) {""")
# We live in a safe and clean city → 安全できれいな都市に住んでいる（限定詞 + 形容詞 and 形容詞 + 名詞 の and で文を分けない）
rep("""      if (t.w === 'and' && isW(T[j - 1], 'press') && isW(T[j + 1], 'hold')) continue;   // Press and hold the button（長押し）""",
    """      if (t.w === 'and' && isW(T[j - 1], 'press') && isW(T[j + 1], 'hold')) continue;   // Press and hold the button（長押し）
      if (t.w === 'and' && j >= 2 && T[j - 2].k === 'w' && /^(?:a|an|the|this|that|my|your|his|her|our|their|its|such|very|so|quite)$/.test(T[j - 2].w) && T[j - 1].k === 'w' && !!adjC(T[j - 1]) && j + 2 < b && T[j + 1].k === 'w' && (!!adjC(T[j + 1]) || (!!vc(T[j + 1], ['ing']) && !nounC(T[j + 1]))) && T[j + 2].k === 'w' && !!nounC(T[j + 2]) && !PREP[T[j + 2].w] && !vc(T[j + 2], ['3sg', 'past'])) continue;   // a safe and clean city""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
