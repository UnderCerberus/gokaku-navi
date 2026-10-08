import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      !st.other.concat(st.manner).some((x) => /[にで]$/.test(x) && !/(?:なしで|ために|ように|とともに|と一緒に|によって|として|一人で|ひとりで)$/.test(x))) p = P('生きる', 'v1');""",
    """      !st.other.concat(st.manner).some((x) => /[にで]$/.test(x) && !/(?:なしで|ために|ように|とともに|と一緒に|によって|として|一人で|ひとりで)$/.test(x)) && !st.time.some((x) => /^(?:隣に|近くに|ここに|そこに|海外に|外国に|近所に)$/.test(x))) p = P('生きる', 'v1');   // The man who lives next door → 隣に住んでいる男性""")

rep("""    ja = ja.replace(/夜の空/g, '夜空');""",
    """    ja = ja.replace(/夜の空/g, '夜空');
    if (tokens[0] && tokens[0].w === 'if' && tokens[1] && tokens[1].w === 'i' && tokens[2] && tokens[2].w === 'were' && tokens[3] && tokens[3].w === 'you') ja = ja.replace(/^もし私があなただったら、/, '私があなたなら、').replace(/だろうに(。?)$/, 'だろう$1');   // If I were you, I would accept the offer → 私があなたなら、申し出を受け入れるだろう
    if (tokens.some((x) => x.w === 'could') && tokens.some((x) => x.w === 'if')) ja = ja.replace(/([えけげせぜてでねへべめれ]る)だろうに(。?)$/, '$1のに$2').replace(/あなたに飛べるのに/, 'あなたのところへ飛んで行けるのに');   // If I were a bird, I could fly to you → あなたのところへ飛んで行けるのに""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
