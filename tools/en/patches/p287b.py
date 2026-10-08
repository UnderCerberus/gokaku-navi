import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# make one's way to ~ → head to ~ / make one's way through ~ → proceed through ~
rep(""".replace(/\\bU\\.S\\.(?:A\\.)?/g, 'USA')""",
    """.replace(/\\b([Mm]ake|[Mm]akes|[Mm]ade|[Mm]aking) (?:my|your|his|her|our|their) way (?=(?:to|toward|towards|home|back)\\b)/g, (m0, v0) => ({ make: 'head', makes: 'heads', made: 'headed', making: 'heading' })[v0.toLowerCase()].replace(/^h/, v0.charAt(0) === 'M' ? 'H' : 'h') + ' ').replace(/\\b([Mm]ake|[Mm]akes|[Mm]ade|[Mm]aking) (?:my|your|his|her|our|their) way (?=(?:through|across|along|into|down|up|over|out)\\b)/g, (m0, v0) => ({ make: 'proceed', makes: 'proceeds', made: 'proceeded', making: 'proceeding' })[v0.toLowerCase()].replace(/^p/, v0.charAt(0) === 'M' ? 'P' : 'p') + ' ').replace(/\\bU\\.S\\.(?:A\\.)?/g, 'USA')""")

# He was an hour late → 1時間遅刻した（1時 にしない）
rep("""          const durLt = nLt.ja.replace(/間$/, '');""",
    """          const UNLt = { minute: '分', minutes: '分', hour: '時間', hours: '時間', second: '秒', seconds: '秒', day: '日', days: '日', week: '週間', weeks: '週間' };
          const durLt = nLt.num && UNLt[nLt.head] && !/^(?:30分|半日)$/.test(nLt.ja) ? String(nLt.num.ja || nLt.num.val) + UNLt[nLt.head] : nLt.ja.replace(/([^時])間$/, '$1');""")

# I'll be ten minutes late → 10分遅れる（つもり にしない）
rep("""!/(?:必要がある|ことになる)$/.test(p.plain())""", """!/(?:必要がある|ことになる|遅れる|遅刻する|早く着く)$/.test(p.plain())""")

# 文の最後の置き換え
rep("""    ja = ja.replace(/ということは哀れみだ/g, 'のは残念だ')""",
    """    if (tokens.some((x) => x.w === 'passed' || x.w === 'pass' || x.w === 'passes') && tokens.length < 12) ja = ja.replace(/^((?:[0-9０-９]+|数|何|半)(?:時間|分|日|年|週間|か月|秒|世紀)?(?:半)?)は(それ以来|その後|あれから)?過ぎ(た|る|ている)/, (m0, d0, s0, e0) => (s0 || '') + d0 + 'が過ぎ' + (e0 === 'ている' ? 'た' : e0));   // An hour passed → 1時間が過ぎた / Ten years have passed since then → それ以来10年が過ぎた
    if (tokens.some((x, q) => x.w === 'in' && tokens[q + 1] && (tokens[q + 1].k === 'num' || NUMW[tokens[q + 1].w] !== undefined || tokens[q + 1].w === 'a' || tokens[q + 1].w === 'an' || tokens[q + 1].w === 'half'))) ja = ja.replace(/((?:[0-9０-９]+|30)(?:分|時間|日|週間|か月)|1時間|半年)で(?=[^、。]{0,14}?(?:到着|閉ま|開|出発|始ま|戻|帰|来|着陸|離陸|着く|終わ|発車))/, '$1後に');   // The train will arrive in five minutes → 5分後に到着する
    if (tokens[0] && tokens[0].w === 'doors' && tokens.some((x) => x.w === 'open')) ja = ja.replace(/^ドアは((?:午前|午後)?[0-9０-９]+時(?:[0-9０-９]+分|半)?)に開く(?:だろう|予定だ)?/, '開場は$1だ');   // Doors open at 6 p.m. → 開場は午後6時だ
    if (tokens.some((x) => x.w === 'checkout') && !tokens.some((x) => /^(?:hotel|room|rooms|time|check|inn|stay|guests|guest)$/.test(x.w || ''))) ja = ja.replace(/チェックアウト/g, 'レジ');   // Please make your way to the checkout → レジに進んでください
    ja = ja.replace(/([^、。]{1,8}?)でどこにも([^、。]{0,6}?)(許されていない|禁止されている)/, '$1のどこでも$2$3');   // Smoking is not allowed anywhere in the building → 建物のどこでも許されていない
    ja = ja.replace(/ということは哀れみだ/g, 'のは残念だ')""")

# We hope you enjoyed your stay → 滞在を楽しんでいただけたならうれしいです / We apologize for the error → 誤りをおわびします
rep("""    // Hi, Ken. → こんにちは、ケン""",
    """    // We hope you enjoyed your stay → 滞在を楽しんでいただけたならうれしいです / We hope you enjoy the show → ショーをお楽しみください
    if ((seq(0, ['we', 'hope', 'you']) || seq(0, ['i', 'hope', 'you'])) && T[3] && /^(?:enjoy|enjoyed|will)$/.test(T[3].w || '') && b > 4) {
      const kEj = isW(T[3], 'will') ? (isW(T[4], 'enjoy') ? 5 : -1) : 4;
      if (kEj > 0 && kEj < b) {
        const nEj = np(kEj, b, {});
        if (nEj && nEj.end === b && !nEj.an) {
          const objEj = nEj.ja.replace(/^(?:あなたの|あなたたちの|私たちの)/, '');
          const jaEj = isW(T[3], 'enjoyed') ? objEj + 'を楽しんでいただけたならうれしいです' : objEj + 'をお楽しみください';
          return { ok: true, ja: jaEj + '。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
        }
        reset(tokens);
      }
    }
    // We apologize for the error → 誤りをおわびします
    if ((seq(0, ['we', 'apologize', 'for']) || seq(0, ['i', 'apologize', 'for']) || seq(0, ['we', 'apologise', 'for'])) && b > 3 && !(T[3].k === 'w' && !!vc(T[3], ['ing']) && !nounC(T[3]))) {
      const nAp = np(3, b, {});
      if (nAp && nAp.end === b && !nAp.pron) return { ok: true, ja: nAp.ja.replace(/^(?:私たちの|私の)/, '') + 'をおわびします。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      reset(tokens);
    }
    // Hi, Ken. → こんにちは、ケン""")

rep("""  const PN = dic({ """, """  const PN = dic({ 'central station': 'セントラル駅', 'grand central station': 'グランド・セントラル駅', 'union station': 'ユニオン駅', """)

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
