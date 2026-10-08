import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It's been ages since we last met → 最後に会ってから、ずいぶんたつ（ages / forever / so long も「長い時間」）
rep("""      const longT = !!nD && nD.end === lim && ((nD.head === 'time' && /^長い時間$/.test(nD.ja)) || nD.head === 'while');""",
    """      const longT = !!nD && nD.end === lim && ((nD.head === 'time' && /^長い時間$/.test(nD.ja)) || nD.head === 'while' || (j + 1 === lim && /^(?:ages|forever|years|decades)$/.test(T[j].w || '')));""")

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'same old same old': '相変わらずだよ', 'same old': '相変わらずだよ', 'could i get the check please': 'お会計をお願いします', 'can i get the check please': 'お会計をお願いします', 'could we get the check please': 'お会計をお願いします', 'check please': 'お会計をお願いします', 'the check please': 'お会計をお願いします', 'could i have the check please': 'お会計をお願いします', 'can we have the check please': 'お会計をお願いします', """)

rep("""    ja = ja.replace(/(利用者|ユーザー|消費者)が彼らの/g, '$1が');""",
    """    ja = ja.replace(/(利用者|ユーザー|消費者)が彼らの/g, '$1が');
    ja = ja.replace(/背中で(確かめ|確認し|見て|探し|探)/g, '奥で$1').replace(/何かが聞こえるとすぐに/g, '何か分かったらすぐに').replace(/何かが聞こえたら/g, '何か分かったら');   // Let me check in the back → 奥で確かめさせてください / as soon as I hear anything → 何か分かったらすぐに
    if (tokens.some((x) => x.w === 'leaving') && tokens.some((x) => x.w === 'when')) ja = ja.replace(/いつ出発していますか/, 'いつ出発するのですか');   // When are you leaving? → いつ出発するのですか""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
