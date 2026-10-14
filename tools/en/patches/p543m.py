import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# dogs that saw their owners pay attention to a toy dog behaved in ways … → おもちゃの犬に注意を払うのを見た犬は…振る舞った
# （関係詞節の中に知覚動詞 + 目的語 + 原形があるとき、そのあとの名詞 + 過去形の動詞の手前でも関係詞節を閉じられる）
rep("""      else if (isP(T[x], ',') && (isW(T[x + 1], 'like') || seq(x + 1, ['such', 'as']) || isW(T[x + 1], 'including'))) ends.push(x);""",
    """      else if (isP(T[x], ',') && (isW(T[x + 1], 'like') || seq(x + 1, ['such', 'as']) || isW(T[x + 1], 'including'))) ends.push(x);
      else if (x > j + 3 && T[x].k === 'w' && !!vc(T[x], ['past']) && !vc(T[x], ['base']) && !nounC(T[x]) && T[x - 1].k === 'w' && !!nounC(T[x - 1]) && !vc(T[x - 1], ['past', '3sg']) && T.slice(j + 1, x - 1).some((y, q) => y.k === 'w' && /^(?:saw|see|sees|watched|watch|heard|hear|felt|noticed|made|let|helped)$/.test(y.w))) ends.push(x);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
