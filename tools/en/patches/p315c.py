import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'who is calling please': 'どちら様ですか', 'who is calling': 'どちら様ですか', 'sorry to interrupt': 'お話し中すみません', 'sorry to interrupt but i have a question': 'お話し中すみませんが、質問があります', """)

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    if (tokens[0] && tokens[0].w === 'may' && tokens[1] && tokens[1].w === 'i' && tokens.some((x) => x.w === 'speak')) ja = ja.replace(/と話せますか/, 'とお話しできますか');   // May I speak to Mr. Tanaka? → 田中さんとお話しできますか
    ja = ja.replace(/(彼|彼女)は今利用できない/, '$1は今手が離せない').replace(/(彼|彼女)に私に折り返し電話するように頼んで/, '折り返し電話をくれるよう$1に伝えて').replace(/(?:私は)?(彼|彼女)にあなたが電話をかけたことを知らせるつもりだ/, 'あなたから電話があったことを$1に伝えておく').replace(/について電話をかけている(?=。|$)/, 'の件で電話している').replace(/時間を使い果たしている/, '時間がなくなってきている');   // he's not available / ask him to call me back / I'll let him know you called / I'm calling about / running out of time
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
