import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# animals that are small, like fish and bees, may … / things that he needed, such as food, …（関係詞節はコンマ + like / such as の手前でも閉じられる）
rep("""      else if (isP(T[x], ',') && T[x + 1].k === 'w' && ((PRON[T[x + 1].w] && PRON[T[x + 1].w].sub) || DET[T[x + 1].w] !== undefined || isW(T[x + 1], 'there') || (nounC(T[x + 1]) && !PREP[T[x + 1].w]))) ends.push(x);
    }""",
    """      else if (isP(T[x], ',') && T[x + 1].k === 'w' && ((PRON[T[x + 1].w] && PRON[T[x + 1].w].sub) || DET[T[x + 1].w] !== undefined || isW(T[x + 1], 'there') || (nounC(T[x + 1]) && !PREP[T[x + 1].w]))) ends.push(x);
      else if (isP(T[x], ',') && (isW(T[x + 1], 'like') || seq(x + 1, ['such', 'as']) || isW(T[x + 1], 'including'))) ends.push(x);
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
