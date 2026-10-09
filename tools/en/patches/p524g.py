import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# We were halfway across the bridge → 橋の途中にいた / He was halfway through his speech → スピーチの途中だった / We are halfway there → 道半ばだ
rep("""    if (vg.lemma === 'be' && !vg.passive) {
      let kSm = i, degSm = '';""",
    """    if (vg.lemma === 'be' && !vg.passive && isW(T[i], 'halfway') && i + 1 < lim) {
      if (isW(T[i + 1], 'there') && (i + 2 >= lim || T[i + 2].k === 'p' || /^(?:when|and|but|so|now|already)$/.test(T[i + 2].w || ''))) return fin(P('道半ばだ', 'da'), tail(i + 2, lim, st, o, vg), 'SVC', []);
      if (/^(?:to|up|down|through|across|along|into|around)$/.test(T[i + 1].w || '')) {
        const mHw = mark();
        const pHw = parsePP(i, lim, {});
        if (pHw && pHw.prep === 'halfway' && pHw.adn) {
          const wHw = pHw.adn.replace(/の$/, '');
          return fin(isW(T[i + 1], 'through') ? P(wHw + 'だ', 'da') : P(wHw + 'に' + (anim ? 'いる' : 'ある'), anim ? 'v1' : 'aru'), tail(pHw.end, lim, st, o, vg), 'SVC', []);
        }
        fail(mHw);
      }
    }
    if (vg.lemma === 'be' && !vg.passive) {
      let kSm = i, degSm = '';""")

# in the middle of the bridge → 橋の真ん中に（既存の置換に場所の名詞を足す）
rep("""(部屋|道路|道|通り|都市|町|湖|海|森|野原|砂漠|川|公園|広場|テーブル|円|ページ|舞台|村|島|庭|畑|教室|ステージ)の最中に""",
    """(部屋|道路|道|通り|都市|町|湖|海|森|野原|砂漠|川|公園|広場|テーブル|円|ページ|舞台|村|島|庭|畑|教室|ステージ|橋|交差点|線路|校庭|グラウンド|池|街|市場|写真|絵|画面)の最中に""")

# He lives halfway around the world → 地球の裏側に住んでいる（住む・ある などの所在の動詞は に）
rep("""        return { ja: wHw + 'で', adn: wHw + 'の', kind: 'place', end: pHw.end, prep: 'halfway', obj: pHw.obj };""",
    """        return { ja: wHw + (o.stative ? 'に' : 'で'), adn: wHw + 'の', kind: 'place', end: pHw.end, prep: 'halfway', obj: pHw.obj };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
