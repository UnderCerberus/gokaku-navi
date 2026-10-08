import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep(""".replace(/べきであるのは/g, 'べきなのは').replace(/(東京|パリ|ロンドン|北京|リオ|長野|札幌|ロサンゼルス|シドニー|アテネ)のオリンピック/g, '$1オリンピック')""",
    """.replace(/べきであるのは/g, 'べきなのは').replace(/(東京|パリ|ロンドン|北京|リオ|長野|札幌|ロサンゼルス|シドニー|アテネ)のオリンピック/g, '$1オリンピック').replace(/早い返事/g, '早速のお返事')""")

rep("""        if (rDr && rDr.ok) return Object.assign({}, rDr, { ja: nDr2.ja.replace(/^(?:ミスター|ミス|ミセス)/, '').replace(/さん$/, '') + (/(?:様|先生)$/.test(nDr2.ja) ? '' : '様') + '。' + rDr.ja });""",
    """        if (rDr && rDr.ok) return Object.assign({}, rDr, { ja: nDr2.ja.replace(/^(?:ミスター|ミス|ミセス)/, '').replace(/さん$/, '') + (/(?:様|先生)$/.test(nDr2.ja) ? '' : '様') + '。' + rDr.ja.replace(/ありがとう。$/, 'ありがとうございます。') });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
