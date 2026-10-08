import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# What's the weather like today? → 今日の天気はどうですか（like のあとの時の語）
rep("""          if (eLk < b && T[eLk].k === 'w' && PREP[T[eLk].w]) { const pLk = parsePP(eLk, b, {}); if (pLk && pLk.end === b) { preLk = pLk.ja.replace(/(?:で|に)$/, '') + 'の'; eLk = b; } }
          if (eLk === b) {""",
    """          if (eLk < b && T[eLk].k === 'w' && PREP[T[eLk].w]) { const pLk = parsePP(eLk, b, {}); if (pLk && pLk.end === b) { preLk = pLk.ja.replace(/(?:で|に)$/, '') + 'の'; eLk = b; } }
          if (eLk < b && T[eLk].k === 'w' && !PREP[T[eLk].w]) { const mTl = mark(); const stLk = newSt(null); const eTl = tail(eLk, b, stLk, {}, null); if (eTl === b && stLk.time.length && !stLk.other.length && !stLk.manner.length) { preLk = stLk.time.join('').replace(/(?:に|は)$/, '') + 'の'; eLk = b; } else fail(mTl); }
          if (eLk === b) {""")

# What will the weather be like tomorrow? → 明日の天気はどうなるでしょうか / What does he look like? → 彼はどんな外見ですか
rep("""    // How far is it from here to the airport? → ここから空港までどのくらいの距離ですか""",
    """    if (isW(T[a], 'what') && a + 4 < b && T[a + 1].k === 'w' && /^(?:will|would)$/.test(T[a + 1].w)) {
      for (let x = a + 3; x + 1 < b; x++) {
        if (!(isW(T[x], 'be') && isW(T[x + 1], 'like'))) continue;
        const mWl = mark();
        const nWl = np(a + 2, x, { noRel: true });
        if (nWl && nWl.end === x) {
          let preWl = '', eWl = x + 2;
          if (eWl < b && T[eWl].k === 'w' && PREP[T[eWl].w]) { const pWl = parsePP(eWl, b, {}); if (pWl && pWl.end === b) { preWl = pWl.ja.replace(/(?:で|に)$/, '') + 'の'; eWl = b; } }
          if (eWl < b && T[eWl].k === 'w' && !PREP[T[eWl].w]) { const mTw = mark(); const stWl = newSt(null); const eTw = tail(eWl, b, stWl, {}, null); if (eTw === b && stWl.time.length && !stWl.other.length) { preWl = stWl.time.join('').replace(/(?:に|は)$/, '') + 'の'; eWl = b; } else fail(mTw); }
          if (eWl === b) { name('question'); return Fx(preWl + nWl.ja + 'は' + (nWl.an || /^(?:he|she|they)$/.test(nWl.pron || '') ? 'どんな人でしょうか' : 'どうなるでしょうか'), 'SVC'); }
        }
        fail(mWl);
        break;
      }
    }
    if (isW(T[a], 'what') && a + 4 < b && T[a + 1].k === 'w' && DO[T[a + 1].w] && isW(T[b - 1], 'like') && T[b - 2].k === 'w' && /^(?:look|taste|sound|smell|feel)$/.test(T[b - 2].w)) {
      const mDl = mark();
      const nDl = np(a + 2, b - 2, { noRel: true });
      if (nDl && nDl.end === b - 2) {
        const pastDl = T[a + 1].w === 'did';
        const vDl = T[b - 2].w;
        const personDl = nDl.an || /^(?:he|she|they|you|i|we)$/.test(nDl.pron || '');
        const tDl = vDl === 'look' ? (personDl ? 'どんな外見' : 'どんな見た目') + (pastDl ? 'でしたか' : 'ですか') : ({ taste: 'どんな味がし', sound: 'どんな音がし', smell: 'どんなにおいがし', feel: 'どんな感じがし' })[vDl] + (pastDl ? 'ましたか' : 'ますか');
        name('question');
        return Fx(nDl.ja + 'は' + tDl, 'SVC');
      }
      fail(mDl);
    }
    // How far is it from here to the airport? → ここから空港までどのくらいの距離ですか""")

# I was born in Osaka → 大阪で生まれた / Where were you born? → どこで生まれましたか
rep("""    ja = ja.replace(/太陽の中で/g, '日なたで').replace(/太陽の中に/g, '日なたに');""",
    """    ja = ja.replace(/太陽の中で/g, '日なたで').replace(/太陽の中に/g, '日なたに');
    ja = ja.replace(/([^、。0-9０-９年月日紀代頃時族庭家春夏秋冬朝昼夜期末初中前後])に生まれ/g, '$1で生まれ');   // I was born in Osaka → 大阪で生まれた（家庭に・2010年に は そのまま）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
