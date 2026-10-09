import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I understand your concern / growing concerns about … → 懸念（関心 でなく）
rep("""      if (c.lemma === 'degree' && c.e && w === '程度' &&""",
    """      if (c.lemma === 'concern' && c.e && w === '関心' && ((j > 0 && /^(?:your|his|her|their|our|my|growing|serious|major|main|real|great|public|safety|health|environmental|security)$/.test(T[j - 1].w || '')) || T.some((x) => x.k === 'w' && /^(?:understand|understood|share|shared|express|expressed|raise|raised|raises|address|addressed|voice|voiced|ease|eased|worry|worries|fear|fears)$/.test(x.w)) || isW(T[j + 1], 'about') || isW(T[j + 1], 'over'))) w = '懸念';   // I understand your concern → あなたの懸念
      if (c.lemma === 'degree' && c.e && w === '程度' &&""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
