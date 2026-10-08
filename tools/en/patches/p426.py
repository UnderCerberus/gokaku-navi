import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) Green Hill Tennis Club → グリーンヒル・テニスクラブ（カタカナ名 + 種目 + Club / Team など）
rep("""      if (cnt === 0 && t.k === 'w' && KATA_N[t.w] && (t.cap || t.first) && j + 1 < lim && T[j + 1].k === 'w' && T[j + 1].cap && FACIL[T[j + 1].w] && !(t.first && !/^[A-Z]/.test(T[j + 1].s || ''))) {""",
    """      if (cnt === 0 && t.k === 'w' && KATA_N[t.w] && (t.cap || t.first)) {
        const SPK2 = { tennis: 'テニス', soccer: 'サッカー', baseball: '野球', basketball: 'バスケットボール', volleyball: 'バレーボール', swimming: 'スイミング', golf: 'ゴルフ', running: 'ランニング', book: 'ブック', music: 'ミュージック', art: 'アート', english: 'イングリッシュ', dance: 'ダンス', chess: 'チェス', cooking: 'クッキング', science: 'サイエンス', drama: 'ドラマ', computer: 'コンピューター', photo: 'フォト' };
        const TLK = { club: 'クラブ', team: 'チーム', school: 'スクール', center: 'センター', centre: 'センター', hotel: 'ホテル', cafe: 'カフェ', restaurant: 'レストラン', academy: 'アカデミー', company: 'カンパニー', bakery: 'ベーカリー', shop: 'ショップ', store: 'ストア', market: 'マーケット', festival: 'フェスティバル', farm: 'ファーム', mall: 'モール', gym: 'ジム', studio: 'スタジオ', theater: 'シアター', theatre: 'シアター', band: 'バンド' };
        let kK = j, katK = '';
        while (kK < lim && T[kK].k === 'w' && KATA_N[T[kK].w] && (T[kK].cap || (kK === j && T[kK].first))) { katK += KATA_N[T[kK].w]; kK++; }
        const spK = kK < lim && T[kK].k === 'w' && T[kK].cap && SPK2[T[kK].w] ? SPK2[T[kK].w] : '';
        const kT = spK ? kK + 1 : kK;
        if (kK > j && kT < lim && T[kT].k === 'w' && T[kT].cap && TLK[T[kT].w] && !(kK - j === 1 && !spK && FACIL[T[kT].w])) {
          ja += katK + '・' + spK + TLK[T[kT].w];
          lastC = { lemma: T[kT].w, e: null, form: 'base', proper: true }; head = T[kT].w; pl = false; an = false; time = false; prevProper = true; proper = true;
          j = kT + 1; cnt++;
          continue;
        }
      }
      if (cnt === 0 && t.k === 'w' && KATA_N[t.w] && (t.cap || t.first) && j + 1 < lim && T[j + 1].k === 'w' && T[j + 1].cap && FACIL[T[j + 1].w] && !(t.first && !/^[A-Z]/.test(T[j + 1].s || ''))) {""")

# 2) Attention, all students. → 生徒の皆さんにお知らせします
rep("""    // 頻度だけの答え: Every fifteen minutes.""",
    """    if (isW(T[0], 'attention') && isP(T[1], ',') && b >= 3 && b <= 6) {
      const wA = T.slice(2, b).filter((x) => x.k === 'w').map((x) => x.w).join(' ');
      const ATT = { 'all students': '生徒の皆さんにお知らせします', 'students': '生徒の皆さんにお知らせします', 'everyone': '皆さんにお知らせします', 'all': '皆さんにお知らせします', 'passengers': '乗客の皆様にお知らせします', 'all passengers': '乗客の皆様にお知らせします', 'shoppers': 'お客様にお知らせいたします', 'customers': 'お客様にお知らせいたします', 'all customers': 'お客様にお知らせいたします', 'visitors': 'ご来場の皆様にお知らせします', 'all visitors': 'ご来場の皆様にお知らせします', 'please': 'お知らせします', 'ladies and gentlemen': '皆様にお知らせします', 'all members': '会員の皆様にお知らせします', 'parents': '保護者の皆様にお知らせします' };
      if (ATT[wA]) return { ok: true, ja: ATT[wA] + '。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
    }
    // 頻度だけの答え: Every fifteen minutes.""")

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'we are sorry for any inconvenience': 'ご迷惑をおかけして申し訳ありません', 'we apologize for any inconvenience': 'ご迷惑をおかけして申し訳ありません', 'sorry for the inconvenience': 'ご迷惑をおかけしてすみません', 'we are sorry for the inconvenience': 'ご迷惑をおかけして申し訳ありません', 'we apologize for the inconvenience': 'ご迷惑をおかけして申し訳ありません', """)

rep("""    ja = ja.replace(/シティ(図書館|博物館|美術館|動物園|病院|公園|プール|体育館|ホール)/g, '市立$1');   // the City Library → 市立図書館""",
    """    ja = ja.replace(/シティ(図書館|博物館|美術館|動物園|病院|公園|プール|体育館|ホール)/g, '市立$1');   // the City Library → 市立図書館
    if (tokens.some((x, q) => /^(?:do|did|does|doing|done)$/.test(x.w || '') && tokens[q + 1] && tokens[q + 1].w === 'so')) ja = ja.replace(/とても(する|した|して|し)/, 'そう$1');   // should do so by this Friday → 今度の金曜日までにそうするべきだ
    ja = ja.replace(/(図書館|博物館|美術館)は([^、。]*?)閉じられる(?:だろう)?(?=。|$)/, '$1は$2休館になる').replace(/(図書館|博物館|美術館)は([^、。]*?)閉じられている(?=。|$)/, '$1は$2休館している').replace(/([^、。]{1,6})に([^、。]{1,8})の前に(返|置|入)/, '$2の前の$1に$3');   // The library will be closed next Monday → 休館になる / returned to the box in front of the library → 図書館の前の箱に返せる""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
