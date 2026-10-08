import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 名前の判定を関数にして、修飾語のループでも使う
rep("""      if (cnt === 0 && t.k === 'w' && KATA_N[t.w] && (t.cap || t.first)) {
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
      }""",
    """      if (cnt === 0) {
        const kn = kataName(j, lim);
        if (kn) {
          ja += kn.ja;
          lastC = { lemma: kn.head, e: null, form: 'base', proper: true }; head = kn.head; pl = false; an = false; time = false; prevProper = true; proper = true;
          j = kn.end; cnt++;
          continue;
        }
      }""")

rep("""  function nominal(i, lim, hasDet) {
    const m = mark();""",
    """  // Green Hill Tennis Club → グリーンヒル・テニスクラブ / Blue Sky Hotel → ブルースカイ・ホテル（カタカナ名 + 種目 + Club / Hotel など）
  const SPK2 = { tennis: 'テニス', soccer: 'サッカー', baseball: '野球', basketball: 'バスケットボール', volleyball: 'バレーボール', swimming: 'スイミング', golf: 'ゴルフ', running: 'ランニング', book: 'ブック', music: 'ミュージック', art: 'アート', english: 'イングリッシュ', dance: 'ダンス', chess: 'チェス', cooking: 'クッキング', science: 'サイエンス', drama: 'ドラマ', computer: 'コンピューター', photo: 'フォト' };
  const TLK = { club: 'クラブ', team: 'チーム', school: 'スクール', center: 'センター', centre: 'センター', hotel: 'ホテル', cafe: 'カフェ', restaurant: 'レストラン', academy: 'アカデミー', company: 'カンパニー', bakery: 'ベーカリー', shop: 'ショップ', store: 'ストア', market: 'マーケット', festival: 'フェスティバル', farm: 'ファーム', mall: 'モール', gym: 'ジム', studio: 'スタジオ', theater: 'シアター', theatre: 'シアター', band: 'バンド' };
  function kataName(j, lim) {
    if (!T[j] || T[j].k !== 'w' || !KATA_N[T[j].w] || !(T[j].cap || T[j].first)) return null;
    let kK = j, katK = '';
    while (kK < lim && T[kK].k === 'w' && KATA_N[T[kK].w] && (T[kK].cap || (kK === j && T[kK].first))) { katK += KATA_N[T[kK].w]; kK++; }
    const spK = kK < lim && T[kK].k === 'w' && T[kK].cap && SPK2[T[kK].w] ? SPK2[T[kK].w] : '';
    const kT = spK ? kK + 1 : kK;
    if (kK > j && kT < lim && T[kT].k === 'w' && T[kT].cap && TLK[T[kT].w] && !(kK - j === 1 && !spK && FACIL[T[kT].w])) return { ja: katK + '・' + spK + TLK[T[kT].w], end: kT + 1, head: T[kT].w };
    return null;
  }
  function nominal(i, lim, hasDet) {
    const m = mark();""")

rep("""      if (T[j].k === 'w' && KATA_N[T[j].w] && (T[j].cap || T[j].first) && j + 1 < lim && T[j + 1].k === 'w' && T[j + 1].cap && FACIL[T[j + 1].w]) break;   // Green Park""",
    """      if (T[j].k === 'w' && KATA_N[T[j].w] && (T[j].cap || T[j].first) && j + 1 < lim && T[j + 1].k === 'w' && T[j + 1].cap && FACIL[T[j + 1].w]) break;   // Green Park
      if (kataName(j, lim)) break;   // Green Hill Tennis Club""")

rep(""".replace(/([^、。]{1,6})に([^、。]{1,8})の前に(返|置|入)/, '$2の前の$1に$3');""",
    """.replace(/([^、。はがを]{1,6})に([^、。はがを]{1,8})の前に(返|置|入)/, '$2の前の$1に$3');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
