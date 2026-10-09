import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The test I took yesterday / the hardest test I had ever taken → 受けた試験（関係詞の先行詞が試験・授業なら take は 受ける）
rep("""      else if (L === 'spend' && /^(?:money|cash|yen|dollars|allowance)$/.test(gaA)) sense = { particle: 'を', core: '使う', tr: true };
    }""",
    """      else if (L === 'spend' && /^(?:money|cash|yen|dollars|allowance)$/.test(gaA)) sense = { particle: 'を', core: '使う', tr: true };
      else if (L === 'take' && /^(?:test|tests|exam|exams|examination|examinations|quiz|quizzes|course|courses|class|classes|lesson|lessons)$/.test(gaA)) sense = { particle: 'を', core: '受ける', tr: true };
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
