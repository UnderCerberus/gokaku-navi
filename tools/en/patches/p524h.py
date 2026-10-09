import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the last train back to her hometown → 故郷へ戻る終電 / the road back to the village → 村へ戻る道 / the last train to Osaka → 大阪行きの終電
rep("""      // came from Asian countries such as China and South Korea → 中国や韓国のようなアジアの国から（such as は前置詞の目的語の中でも名詞にかける）""",
    """      if (!o.noPost && !node.pron && node.head && t.k === 'w' && /(?:^| )(?:train|trains|bus|buses|flight|flights|plane|planes|ship|ships|boat|boats|ferry|ferries|road|roads|way|path|trip|trips|journey|ride|drive|ticket|tickets|route)$/.test(node.head) && j + 1 < lim) {
        const vehBk = /(?:^| )(?:train|trains|bus|buses|flight|flights|plane|planes|ship|ships|boat|boats|ferry|ferries)$/.test(node.head);
        if (isW(t, 'back') && isW(T[j + 1], 'home') && (j + 2 >= lim || T[j + 2].k === 'p' || !!PREP[T[j + 2].w] || /^(?:and|but|so|because|when|if)$/.test(T[j + 2].w || ''))) { node = Object.assign({}, node, { ja: '家に帰る' + node.ja, end: j + 2 }); continue; }
        const kBk = isW(t, 'back') && isW(T[j + 1], 'to') ? j + 2 : (vehBk && isW(t, 'to') ? j + 1 : -1);
        if (kBk > 0 && kBk < lim && T[kBk].k === 'w' && !(!!vc(T[kBk], ['base']) && !nounC(T[kBk]) && DET[T[kBk].w] === undefined)) {
          const mBk = mark();
          const nBk = np(kBk, lim, { noRel: true, noCoord: true });
          if (nBk && !nBk.pron && !nBk.an && !nBk.time) { node = Object.assign({}, node, { ja: nBk.ja + (kBk === j + 2 ? 'へ戻る' : '行きの') + node.ja, end: nBk.end }); continue; }
          fail(mBk);
        }
      }
      // came from Asian countries such as China and South Korea → 中国や韓国のようなアジアの国から（such as は前置詞の目的語の中でも名詞にかける）""")

# on my way back to school → 学校へ戻る途中で / on my way back from the library → 図書館からの帰り道で / on the way back home → 帰り道で
rep("""    // a reservation for tonight / a cake for tomorrow → 今夜の・明日のために""",
    """    if (!idi && key === 'on' && j + 2 < lim && T[j].k === 'w' && /^(?:my|his|her|our|their|your|the)$/.test(T[j].w) && isW(T[j + 1], 'way') && isW(T[j + 2], 'back')) {
      if (isW(T[j + 3], 'home') && j + 3 < lim) return { ja: '帰り道で', adn: '帰り道の', end: j + 4, kind: 'other', prep: key, obj: null };
      if (/^(?:to|from)$/.test((T[j + 3] || {}).w || '') && j + 4 < lim) {
        const mWb = mark();
        const nWb = np(j + 4, lim, { noRel: true, noCoord: o.noCoord });
        if (nWb && !nWb.pron) { const wWb = T[j + 3].w === 'to' ? nWb.ja + 'へ戻る途中' : nWb.ja + 'からの帰り道'; return { ja: wWb + 'で', adn: wWb + 'の', end: nWb.end, kind: 'other', prep: key, obj: nWb }; }
        fail(mWb);
      }
    }
    // a reservation for tonight / a cake for tomorrow → 今夜の・明日のために""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
