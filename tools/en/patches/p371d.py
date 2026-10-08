import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/(あなた|彼|彼女|君)が聞こえ(ない|なかった|ますか|ません)/g, '$1の声が聞こえ$2');"
assert s.count(old) == 1
s = s.replace(old, old + """
    if (tokens.some((x) => /^(?:hear|hears|heard|hearing)$/.test(x.w || '')) && tokens.some((x) => x.w === 'about')) ja = ja.replace(/について聞(い|く|き|か|け)/g, 'のことを聞$1').replace(/(それ|これ|あれ)のことを聞/g, (m0, a0) => ({ 'それ': 'その', 'これ': 'この', 'あれ': 'あの' })[a0] + 'ことを聞');   // I heard about the accident → 事故のことを聞いた / I've never heard of that → そのことを聞いたことがない""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
