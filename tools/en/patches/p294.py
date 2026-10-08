import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""  const LEAD2 = dic({ """, """  const LEAD2 = dic({ "to everyone 's surprise": 'みんなが驚いたことに', 'to our surprise': '私たちが驚いたことに', 'to his surprise': '彼が驚いたことに', 'to her surprise': '彼女が驚いたことに', 'to their surprise': '彼らが驚いたことに', 'much to my surprise': 'とても驚いたことに', 'to my joy': 'うれしいことに', 'to my delight': 'うれしいことに', 'to my disappointment': 'がっかりしたことに', 'to my relief': 'ほっとしたことに', 'to our relief': 'ほっとしたことに', """)

rep("""'for half an hour': '30分間', """, """'for half an hour': '30分間', 'at first sight': '一目で', """)

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    ja = ja.replace(/一目で([^、。]{1,10}?)に恋をした/, '$1に一目ぼれした').replace(/一目で([^、。]{1,10}?)に恋をする/, '$1に一目ぼれする').replace(/([^、。]{1,10}?)に一目で恋をした/, '$1に一目ぼれした');   // fell in love with the prince at first sight → 王子に一目ぼれした
    ja = ja.replace(/(おじいさん|おばあさん|男性|女性|男|女|王|王様|農夫|漁師)と彼の(妻|息子|娘|犬)/, '$1とその$2').replace(/(おばあさん|女性|女|女王)と彼女の(夫|息子|娘|猫)/, '$1とその$2');   // an old man and his wife → おじいさんとその妻
    ja = ja.replace(/背が高い(男性|女性|人|少年|少女|男|女|男の子|女の子|学生|生徒|選手)/g, '背の高い$1').replace(/背が低い(男性|女性|人|少年|少女|男|女|男の子|女の子)/g, '背の低い$1');   // a tall man → 背の高い男性
    if (tokens.some((x) => x.w === 'came') && tokens.some((x) => x.w === 'in')) ja = ja.replace(/が中に入った/, 'が入ってきた').replace(/は中に入った/, 'は入ってきた');   // a tall man came in → 背の高い男性が入ってきた
    if (tokens.some((x) => /^(?:king|queen|lord|emperor|prince)$/.test(x.w || ''))) ja = ja.replace(/(?:彼|彼女)の男性たち/g, '家来たち');   // The king ordered his men → 王は家来たちに
    else if (tokens.some((x) => /^(?:captain|general|chief|commander|leader|boss)$/.test(x.w || ''))) ja = ja.replace(/(?:彼|彼女)の男性たち/g, '部下たち');
    ja = ja.replace(/家まで急(いだ|ぐ)/, (m0, a0) => '急いで家に帰' + (a0 === 'いだ' ? 'った' : 'る'));   // they hurried home → 急いで家に帰った
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
