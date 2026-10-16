import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# students should be taught how to manage their sleep → 睡眠の管理の仕方を教えられるべきだ（受け身の teach / show + 疑問詞節・how to も ask / tell と同じく読む）
rep("""    if (vg.passive && /^(?:ask|tell)$/.test(vg.lemma) && T[i] && T[i].k === 'w' && /^(?:why|what|where|when|how|whether|if|who|which)$/.test(T[i].w)) {""",
    """    if (vg.passive && /^(?:ask|tell|teach|show)$/.test(vg.lemma) && T[i] && T[i].k === 'w' && /^(?:why|what|where|when|how|whether|if|who|which)$/.test(T[i].w)) {""")

# the four of us practiced … → 私たち4人は練習した（the + 数 + of us / them / you は「私たち〜人」）
rep("""    if (/^(?:my|your|his|her|our|their)$/.test(t.w) && isW(T[i + 1], 'own') && !(T[i + 2]""",
    """    if (isW(t, 'the') && T[i + 1] && /^(?:two|three|four|five|six|seven|eight|nine|ten)$/.test(T[i + 1].w || '') && isW(T[i + 2], 'of') && T[i + 3] && /^(?:us|them|you)$/.test(T[i + 3].w || '')) {
      const NOF = { two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', ten: '10' };
      return { ja: ({ us: '私たち', them: '彼ら', you: 'あなたたち' })[T[i + 3].w] + NOF[T[i + 1].w] + '人', end: i + 4, an: true, pl: true, head: 'people' };
    }
    if (/^(?:my|your|his|her|our|their)$/.test(t.w) && isW(T[i + 1], 'own') && !(T[i + 2]""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
