import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# within fifty years printing shops had appeared …（複数の期間の単位 years / days のあとの名詞は複合名詞にしない: 主語の始まり）
rep("""    while (j < lim) {
      const t = T[j];
      if (cnt > 0 && t.k === 'w' && /^(?:last|next|this|every|each)$/.test(t.w) && j + 1 < lim""",
    """    while (j < lim) {
      const t = T[j];
      if (cnt > 0 && pl && t.k === 'w' && lastC && DURUNIT[lastC.lemma] && /s$/.test((T[j - 1] || {}).w || '') && !/^(?:old|ago|later|earlier|long|before|after)$/.test(t.w)) break;   // fifty years printing shops
      if (cnt > 0 && t.k === 'w' && /^(?:last|next|this|every|each)$/.test(t.w) && j + 1 < lim""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
