import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# his older brothers and sisters → 兄弟姉妹（既存の置換が「兄たちと姉」だけ取って 兄弟姉妹妹 になっていた）
rep(""".replace(/兄(?:たち)?か姉(?:たち)?/g, '兄弟姉妹')""", """.replace(/兄(?:たち)?か姉(?:たち|妹)?/g, '兄弟姉妹')""")
rep(""".replace(/兄(?:たち)?と姉(?:たち)?/g, '兄弟姉妹')""", """.replace(/兄(?:たち)?と姉(?:たち|妹)?/g, '兄弟姉妹')""")
# It is raining, so … / so to speak / as it were（文中の挿入句 → いわば）
rep("""    'weather permitting': '天気がよければ',""", """    'weather permitting': '天気がよければ', 'so to speak': 'いわば', 'as it were': 'いわば',""")
# Don't tell anyone about what happened → 起こったことについて誰にも言ってはいけない（anyone / someone に about 句をかけない）
rep("""      if (node.pron && /^(?:i|you|he|she|we|they|me|him|her|us|them|it)$/.test(node.pron) && t.k === 'w' && PREP[t.w] && t.w !== 'of') break;""",
    """      if (node.pron && /^(?:i|you|he|she|we|they|me|him|her|us|them|it)$/.test(node.pron) && t.k === 'w' && PREP[t.w] && t.w !== 'of') break;
      if (node.pron && /^(?:anyone|anybody|someone|somebody|everyone|everybody|nobody)$/.test(node.pron) && isW(t, 'about')) break;   // tell anyone about what happened""")
# would rather you didn't tell anyone → 誰にも話さないでほしい（否定の any の形 + に・と・から → 誰にも・誰とも）
rep("""    if (n.any && (st.neg || st.vgNeg)) return (n.infS ? n.infS + 'ものを' : '') + n.any;""",
    """    if (n.any && (st.neg || st.vgNeg) && /^(?:誰も|何も)$/.test(n.any) && /^(?:に|と|から|で)$/.test(particle || '')) return n.any.replace(/も$/, particle + 'も');   // tell anyone → 誰にも
    if (n.any && (st.neg || st.vgNeg)) return (n.infS ? n.infS + 'ものを' : '') + n.any;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
