import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The money you save now / the food we save today → 貯める・節約する（関係詞の先行詞がお金・食べ物などの save は 救う にしない）
rep("""      else if (L === 'take' && /^(?:test|tests|exam|exams|examination|examinations|quiz|quizzes|course|courses|class|classes|lesson|lessons)$/.test(gaA)) sense = { particle: 'を', core: '受ける', tr: true };""",
    """      else if (L === 'take' && /^(?:test|tests|exam|exams|examination|examinations|quiz|quizzes|course|courses|class|classes|lesson|lessons)$/.test(gaA)) sense = { particle: 'を', core: '受ける', tr: true };
      else if (L === 'save' && /^(?:money|cash|yen|dollars)$/.test(gaA)) sense = { particle: 'を', core: '貯める', tr: true };
      else if (L === 'save' && /^(?:food|water|energy|electricity|fuel|paper|resources|time)$/.test(gaA)) sense = { particle: 'を', core: '節約する', tr: true };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
