import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# a single message from a friend to break a student's concentration（from A to + 名詞にもなる原形 + 限定詞・目的格は不定詞。「友達から休憩まで」にしない）
rep("""      const verbOnly = isW(T[obj.end], 'to') && !!vc(T[obj.end + 1], ['base']) && !nounC(T[obj.end + 1]);""",
    """      const verbOnly = isW(T[obj.end], 'to') && !!vc(T[obj.end + 1], ['base']) && (!nounC(T[obj.end + 1]) || (!!T[obj.end + 2] && T[obj.end + 2].k === 'w' && (DET[T[obj.end + 2].w] !== undefined || (!!PRON[T[obj.end + 2].w] && !PRON[T[obj.end + 2].w].sub))));""")

# It takes courage / effort to … → 〜には勇気が必要だ（単独の勇気・努力も「必要だ」。time and effort の並列は かかる のまま）
rep("""!/(?:時間|日|年|分|か月|週間|秒|世紀|円|ドル|お金|努力|勇気|忍耐|練習|手間)/.test(n2.ja || '') && !who;""",
    """!/(?:時間|日|年|分|か月|週間|秒|世紀|円|ドル|お金)/.test(n2.ja || '') && !who;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
