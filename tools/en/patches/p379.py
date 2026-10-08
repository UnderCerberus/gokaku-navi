import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Ms. Green → グリーンさん / Mr. Brown → ブラウンさん（よくある英語の姓をカタカナに）
rep("""        ja += (NAME_JA[T[j + 1].w] || T[j + 1].s || T[j + 1].w) + TITLE[t.w];""",
    """        ja += (NAME_JA[T[j + 1].w] || EN_SURNAME_KANA[T[j + 1].w] || T[j + 1].s || T[j + 1].w) + TITLE[t.w];""")
rep("""  const JP_SURNAME = set(""",
    """  const EN_SURNAME_KANA = dic({ green: 'グリーン', brown: 'ブラウン', white: 'ホワイト', black: 'ブラック', smith: 'スミス', jones: 'ジョーンズ', taylor: 'テイラー', wilson: 'ウィルソン', davis: 'デイビス', miller: 'ミラー', johnson: 'ジョンソン', williams: 'ウィリアムズ', moore: 'ムーア', clark: 'クラーク', lee: 'リー', king: 'キング', hill: 'ヒル', wood: 'ウッド', baker: 'ベイカー', cook: 'クック', bell: 'ベル', carter: 'カーター', parker: 'パーカー', evans: 'エバンズ', walker: 'ウォーカー', young: 'ヤング', allen: 'アレン', scott: 'スコット', adams: 'アダムズ', hall: 'ホール', ford: 'フォード', grant: 'グラント', hunt: 'ハント', kelly: 'ケリー', lewis: 'ルイス', martin: 'マーティン', mason: 'メイソン', murphy: 'マーフィー', nelson: 'ネルソン', price: 'プライス', reed: 'リード', rose: 'ローズ', ross: 'ロス', stone: 'ストーン', turner: 'ターナー', ward: 'ウォード', webb: 'ウェッブ', wells: 'ウェルズ', west: 'ウエスト', fox: 'フォックス', gray: 'グレイ', grey: 'グレイ', lane: 'レーン', long: 'ロング', may: 'メイ', page: 'ペイジ', rich: 'リッチ', short: 'ショート', swift: 'スウィフト', bond: 'ボンド', bush: 'ブッシュ', field: 'フィールド', ford: 'フォード', jackson: 'ジャクソン', thomas: 'トーマス', robinson: 'ロビンソン', anderson: 'アンダーソン', thompson: 'トンプソン', harris: 'ハリス', lopez: 'ロペス', garcia: 'ガルシア', kim: 'キム', wang: 'ワン', chen: 'チェン', park: 'パク' });   // Ms. Green → グリーンさん
  const JP_SURNAME = set(""")

# have a debate → 討論をする
rep("""      else if (L === 'have' && !vg.passive && /^(?:picnic|picnics|barbecue|barbecues|chat|talk|discussion|fight|quarrel|look|try|rest|walk|swim|nap)$/.test(oh)) sense = { particle: 'を', core: 'する', tr: true };""",
    """      else if (L === 'have' && !vg.passive && /^(?:picnic|picnics|barbecue|barbecues|chat|talk|discussion|fight|quarrel|look|try|rest|walk|swim|nap|debate|debates|discussions|conversation|conversations|meeting|meetings|rehearsal|rehearsals)$/.test(oh) && !(oh === 'meeting' || oh === 'meetings') ) sense = { particle: 'を', core: 'する', tr: true };""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/^((?:私たちの|私の|その)?クラス)は([^、。]*?)討論をした/, '$1で$2討論をした').replace(/勉強することに集中/g, '勉強に集中').replace(/(生活|暮らし|学校生活|天気|文化|食べ物|人々|歴史|自然|仕事)について([^、。]{1,10}?)で((?:私たち|私|彼ら|みんな|生徒たち)に)?(話|教え|説明)/, '$2での$1について$3$4');   // our class had a debate → クラスで討論をした / tells us about life in Australia → オーストラリアでの生活について私たちに話す
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

# But it was a good chance to … → しかし、それは〜良い機会だった
rep("""    if (tokens[0] && tokens[0].w === 'it' && tokens.some((x, q) => /^(?:way|place|chance|opportunity|method|means)$/.test(x.w || '') && tokens[q + 1] && tokens[q + 1].w === 'to')) ja = ja.replace(/^([^。]+?)ことは""",
    """    if (tokens.some((x, q) => x.w === 'it' && (q === 0 || (q === 1 && /^(?:but|and|so|also|still|yet)$/.test(tokens[0].w || '')) || (q === 2 && isP(tokens[1], ','))) && tokens[q + 1] && /^(?:is|was)$/.test(tokens[q + 1].w || '')) && tokens.some((x, q) => /^(?:way|place|chance|opportunity|method|means)$/.test(x.w || '') && tokens[q + 1] && tokens[q + 1].w === 'to')) ja = ja.replace(/^((?:しかし|でも|そして|だから|また)、)?([^。]+?)ことは""")
rep("""(方法|場所|機会|チャンス|手段)(だ|だった)(?=。|$)/, (m0, a0, d0, n0, e0) => 'それは' + (n0 === '場所' ? a0.replace(/生きる$/, '住む') + 'のに' : a0.replace(/、/g, '')) + d0 + n0 + e0);""",
    """(方法|場所|機会|チャンス|手段)(だ|だった)(?=。|$)/, (m0, l0, a0, d0, n0, e0) => (l0 || '') + 'それは' + (n0 === '場所' ? a0.replace(/生きる$/, '住む') + 'のに' : a0.replace(/、/g, '')) + d0 + n0 + e0);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
