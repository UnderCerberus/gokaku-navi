import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 「の」入りの日本の歴史上の名前は 1 語にする（Sen no Rikyu → 千利休）
rep(""".replace(/\\bU\\.K\\./g, 'UK').replace(/\\bU\\.N\\./g, 'UN').replace(/\\bE\\.U\\./g, 'EU')   // the U.S. → アメリカ""",
    """.replace(/\\bU\\.K\\./g, 'UK').replace(/\\bU\\.N\\./g, 'UN').replace(/\\bE\\.U\\./g, 'EU').replace(/\\b(Sen|Minamoto|Fujiwara|Ono|Taira|Abe|Ki|Sugawara) no (Rikyu|Yoritomo|Yoshitsune|Michinaga|Komachi|Kiyomori|Seimei|Tsurayuki|Michizane)\\b/g, '$1no$2')   // the U.S. → アメリカ / Sen no Rikyu → 千利休""")

rep("""  const NAME_JA = dic({ max: 'マックス',""",
    """  const NAME_JA = dic({ sennorikyu: '千利休', minamotonoyoritomo: '源頼朝', minamotonoyoshitsune: '源義経', fujiwaranomichinaga: '藤原道長', ononokomachi: '小野小町', tairanokiyomori: '平清盛', abenoseimei: '安倍晴明', kinotsurayuki: '紀貫之', sugawaranomichizane: '菅原道真', max: 'マックス',""")

rep("""    ja = ja.replace(/私的な生活/g, '私生活')""",
    """    if (tokens.some((x) => x.w === 'introduced') && tokens.some((x) => x.w === 'from')) ja = ja.replace(/から紹介された/g, 'から伝えられた');   // It was introduced from China → 中国から伝えられた
    ja = ja.replace(/まだ練習されている/g, '今でも行われている').replace(/今日まだ行われている/g, '今でも行われている').replace(/(客|相手|他人|お年寄り|高齢者|先生|両親|自然)への尊敬/g, '$1への敬意');   // still practiced today → 今でも行われている / respect for guests → 客への敬意
    ja = ja.replace(/私的な生活/g, '私生活')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
