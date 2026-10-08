import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# on your right → 右手に / on the left → 左側に
rep("""      ['in this light', 'この観点から'], ['in that light', 'その観点から'],""",
    """      ['on your right', '右手に'], ['on your left', '左手に'], ['on the right', '右側に'], ['on the left', '左側に'], ['on my right', '私の右側に'], ['on my left', '私の左側に'], ['on the right side', '右側に'], ['on the left side', '左側に'], ['on your right side', '右側に'], ['on your left side', '左側に'],
      ['in this light', 'この観点から'], ['in that light', 'その観点から'],""")

# How can I get to the museum? → 博物館へはどうやって行けばいいですか
rep("""    // How far is it from here to the airport? → ここから空港までどのくらいの距離ですか""",
    """    if (isW(T[a], 'how') && a + 5 < b && T[a + 1].k === 'w' && /^(?:can|do|should|could|would)$/.test(T[a + 1].w) && T[a + 2].k === 'w' && /^(?:i|we)$/.test(T[a + 2].w) && isW(T[a + 3], 'get') && isW(T[a + 4], 'to')) {
      const mGt = mark();
      const nGt = np(a + 5, b, { noRel: true });
      if (nGt && nGt.end === b) { name('question'); return Fx(nGt.ja + 'へはどうやって行けばいいですか', 'SV'); }
      fail(mGt);
    }
    // How far is it from here to the airport? → ここから空港までどのくらいの距離ですか""")

# get off at Ueno → 上野で降りる / Do you have a smaller one? → もっと小さいものはありますか
rep("""    ja = ja.replace(/(あそこ|向こう)まで(走って|歩いて|踊って|泳いで|遊んで|散歩して|ジョギングして)いる/g, '$1で$2いる');""",
    """    ja = ja.replace(/(あそこ|向こう)まで(走って|歩いて|踊って|泳いで|遊んで|散歩して|ジョギングして)いる/g, '$1で$2いる');
    if (tokens.some((x, q) => x.w === 'off' && tokens[q - 1] && /^(?:get|got|gets|getting)$/.test(tokens[q - 1].w || '') && tokens[q + 1] && tokens[q + 1].w === 'at')) ja = ja.replace(/([^、。]{1,10}?)に降り(?=[なるたてまよれろりら])/, '$1で降り');   // get off at Ueno → 上野で降りる
    if (tokens[0] && tokens[0].w === 'do' && tokens[1] && tokens[1].w === 'you' && tokens[2] && tokens[2].w === 'have' && tokens.some((x) => /^(?:one|ones|size|sizes|color|colors|colour|colours)$/.test(x.w || '') || (x.w === 'in' && tokens.some((y) => /^(?:blue|red|black|white|green|yellow|brown|pink|purple|gray|grey|orange|navy|beige|small|medium|large|size)$/.test(y.w || ''))))) ja = ja.replace(/^あなたは(青|赤|黒|白|緑|黄色|茶色|ピンク|紫|灰色|オレンジ|紺|ベージュ|[^、。]{1,6}サイズ)でこれを持っていますか/, 'これの$1はありますか').replace(/^あなたは(.+?)を持っていますか/, (m0, a0) => a0.replace(/^より(?=(?:小さ|大き|安|長|短|軽|明る|暗))/, 'もっと') + 'はありますか');   // Do you have a smaller one? → もっと小さいものはありますか""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
