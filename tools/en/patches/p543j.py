import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# whenever we can → できるときはいつでも（whenever + 「できる」だけの節は「〜ときはいつでも」。「できるたびに」にしない）
rep("""      case 'every time': case 'each time': case 'whenever': return S('attr', false) + 'たびに、';""",
    """      case 'every time': case 'each time': case 'whenever': return key === 'whenever' && /できる$/.test(S('attr', false)) ? S('attr', false) + 'ときはいつでも、' : S('attr', false) + 'たびに、';""")

# If animals can suffer → 動物が苦しむことができるなら（可能形が他動詞と同じ形になる 苦しむ・進む・休む などは「〜ことができる」。「苦しめたら」にしない）
rep("""    const canP = (x) => (/(?:聞こえる|見える|分かる|届く|起こる|生じる)$/.test(x.s) ? x : x.aux('can'));""",
    """    const canP = (x) => (/(?:聞こえる|見える|分かる|届く|起こる|生じる)$/.test(x.s) ? x : (/(?:^|[^ぁ-ん])(?:苦しむ|休む|沈む|悩む|縮む|痛む|緩む)$/.test(x.s) ? P(x.s + 'ことができる', 'v1') : x.aux('can')));""")

# If animals can suffer, then we have … → もし…なら、私たちには…（if 節のあとの , then は訳さない。「そのとき」にしない）
rep("""      if (t.k === 'w' && /^(?:perhaps|maybe|probably|certainly|surely|fortunately|unfortunately|actually|suddenly|finally|clearly|obviously|hopefully|luckily|sadly|interestingly|naturally|apparently|definitely|honestly|then|now|someday|eventually|recently|lately|nowadays|afterwards|later)$/.test(t.w)""",
    """      if (t.k === 'w' && t.w === 'then' && a > 0 && isP(T[a - 1], ',') && a + 2 < b && T.slice(0, a).some((x) => x.k === 'w' && /^(?:if|unless|once|when)$/.test(x.w)) && T[a + 1].k === 'w' && ((PRON[T[a + 1].w] && PRON[T[a + 1].w].sub) || DET[T[a + 1].w] !== undefined || !!nounC(T[a + 1]) || isW(T[a + 1], 'there'))) { a += 1; continue; }
      if (t.k === 'w' && /^(?:perhaps|maybe|probably|certainly|surely|fortunately|unfortunately|actually|suddenly|finally|clearly|obviously|hopefully|luckily|sadly|interestingly|naturally|apparently|definitely|honestly|then|now|someday|eventually|recently|lately|nowadays|afterwards|later)$/.test(t.w)""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
