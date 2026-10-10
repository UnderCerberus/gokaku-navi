import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 既存の置換の修正: affect / influence + 疑問詞節に「に」がつくようになったので、内蔵長文の置換は「かに?影響」で受ける
rep("""replace(/媒体が私たちがどのくらい上手に何を読むか理解するか影響するかもしれない/,""",
    """replace(/媒体が私たちがどのくらい上手に何を読むか理解するかに?影響するかもしれない/,""")
rep("""replace(/^決定するというよりむしろ、それは言語が私たちが何に気づいて覚えているか影響すると主張する/,""",
    """replace(/^決定するというよりむしろ、それは言語が私たちが何に気づいて覚えているかに?影響すると主張する/,""")

# The light will turn green when charging is complete（when + 動名詞の主語 + 動詞は節。while reading … sentences の skip は後ろに定動詞がないときだけ）
rep("""      if (/^(?:while|when)$/.test(s2.key) && T[j + 1] && T[j + 1].k === 'w' && !!vc(T[j + 1], ['ing']) && (!nounC(T[j + 1]) || ingVerb(j + 1, b)) && !isP(T[j - 1], ',')) continue;   // while reading the last two sentences""",
    """      if (/^(?:while|when)$/.test(s2.key) && T[j + 1] && T[j + 1].k === 'w' && !!vc(T[j + 1], ['ing']) && (!nounC(T[j + 1]) || ingVerb(j + 1, b)) && !isP(T[j - 1], ',') && !T.slice(j + 2, b).some((x) => x.k === 'w' && (!!BE[x.w] || !!MODAL[x.w] || !!HAVE[x.w] || !!DO[x.w] || (!!vc(x, ['3sg', 'past']) && !nounC(x))))) continue;   // while reading the last two sentences""")

# Camping, hiking, and fishing are popular activities（目的語を共有しない名詞の列挙は「キャンプとハイキングと釣り」のまま: 動名詞の列挙の規則は最後の項に目的語・前置詞句があるときだけ）
rep("""          const gZ = vpNonfin(kZ, s, 'ing', {});
          if (gZ && gZ.end === s) {""",
    """          const gZ = vpNonfin(kZ, s, 'ing', {});
          if (gZ && gZ.end === s && gZ.end > kZ + 1) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
