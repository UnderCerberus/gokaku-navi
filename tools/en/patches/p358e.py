import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'everyone is welcome': 'どなたでも歓迎します', 'everybody is welcome': 'どなたでも歓迎します', 'all are welcome': 'どなたでも歓迎します', 'all welcome': 'どなたでも歓迎します', 'help wanted': '従業員募集', 'no experience necessary': '経験不要', 'no experience required': '経験不要', 'no experience is necessary': '経験は不要です', 'no experience is required': '経験は不要です', 'free admission': '入場無料', 'admission free': '入場無料', 'sold out': '売り切れ', 'staff only': '関係者以外立ち入り禁止', 'no smoking': '禁煙', 'no parking': '駐車禁止', 'out of order': '故障中', """)

# Volunteers wanted! → ボランティア募集！
rep("""    // Hi, Ken. → こんにちは、ケン""",
    """    if (b === 2 && T[1].k === 'w' && T[1].w === 'wanted' && T[0].k === 'w' && !!nounC(T[0]) && !PRON[T[0].w]) {
      const nWt = np(0, 1, {});
      if (nWt && nWt.end === 1) return { ok: true, ja: nWt.ja + '募集' + (tokens[b] && isP(tokens[b], '!') ? '！' : '。'), sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      reset(tokens);
    }
    // Hi, Ken. → こんにちは、ケン""")

rep("""    ja = ja.replace(/中国の万里の長城/g, '万里の長城');""",
    """    ja = ja.replace(/中国の万里の長城/g, '万里の長城');
    ja = ja.replace(/(掃除|清掃|修理|点検|改装|工事|メンテナンス|改修)するために(休館|休業|閉鎖|閉店|休み|閉鎖され|閉め)/g, '$1のため$2').replace(/掃除のため(休館|休業|閉鎖|閉店)/g, '清掃のため$1');   // The library will be closed on Monday for cleaning → 清掃のため休館する
    ja = ja.replace(/^([^、。]+?)は許されていない(?=。|$)/, '$1は禁止されている').replace(/^どの([^、。]{1,10}?)も必要(?:は)?ない(?=。|$)/, '$1は不要だ');   // Food and drinks are not allowed → 禁止されている / No experience is necessary → 経験は不要だ
    if (tokens.some((x) => /^(?:festival|festivals|fair|event|party|carnival|celebration)$/.test(x.w || ''))) ja = ja.replace(/(売店|屋台)と試合と/g, '$1とゲームと').replace(/、試合、/g, '、ゲーム、');   // food stands, games, and live music → 屋台とゲームと生演奏""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
