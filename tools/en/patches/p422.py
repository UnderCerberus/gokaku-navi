import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# only during certain times, such as lunch breaks → 昼休みのような特定の時間にだけ（前置詞の目的語のあとの , such as はその名詞にかける）
rep("""    // 呼びかけ: Ken, come here.""",
    """    if (b > 6 && !tokens.__saC) {
      const kSa = T.findIndex((x, q) => q >= 3 && isP(x, ',') && isW(T[q + 1], 'such') && isW(T[q + 2], 'as') && T[q - 1].k === 'w' && !!nounC(T[q - 1]) && T.slice(Math.max(0, q - 4), q - 1).some((y) => y.k === 'w' && PREP[y.w] && y.w !== 'of') && !T.slice(Math.max(0, q - 4), q - 1).some((y) => y.k === 'w' && !!vc(y, ['base', '3sg', 'past']) && !nounC(y) && !adjC(y) && !PREP[y.w]));
      if (kSa > 0) {
        const tSa = tokens.slice(0, kSa).concat(tokens.slice(kSa + 1)).map((x, k) => Object.assign({}, x, { i: k }));
        tSa.__saC = true;
        const rSa = translate1(tSa);
        reset(tokens);
        if (rSa && rSa.ok) return rSa;
      }
    }
    // 呼びかけ: Ken, come here.""")

rep("""'by the way': 'ところで', 'either way': 'いずれにせよ',""",
    """'by the way': 'ところで', 'either way': 'いずれにせよ', 'this way': 'こうすれば', 'that way': 'そうすれば',""")

rep("""      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };""",
    """      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };
      else if (L === 'allow' && objs.length === 1 && !objs[0].an && !objs[0].pron && /(?:^| )(?:smartphone|smartphones|phone|phones|pet|pets|dog|dogs|food|drink|drinks|camera|cameras|photography|smoking|parking|swimming|fishing|camping|cooking|eating|drinking|bicycle|bicycles|bike|bikes|car|cars|visitor|visitors|use|access|entry|games|music|gum|alcohol|tattoos|uniform|uniforms|makeup|jewelry)$/.test(oh)) sense = { particle: 'を', core: '許可する', tr: true };   // schools should allow smartphones → スマートフォンを許可するべきだ""")

rep("""    ja = ja.replace(/夜の空/g, '夜空');""",
    """    ja = ja.replace(/夜の空/g, '夜空');
    if (tokens.some((x, q) => x.w === 'certain' && tokens[q + 1] && /^(?:times|areas|places|foods|types|kinds|days|hours|situations|conditions|people|groups|subjects|countries|cases|rules|words|animals|plants)$/.test(tokens[q + 1].w || ''))) ja = ja.replace(/ある(時間|地域|場所|食べ物|種類|日|状況|条件|人々|グループ|教科|国|場合|規則|言葉|動物|植物)/g, '特定の$1');   // certain times → 特定の時間
    ja = ja.replace(/(利益|恩恵|利点)を楽しめる/g, '恩恵を受けられる').replace(/(利益|恩恵|利点)を楽しむ/g, '恩恵を受ける');   // enjoy the benefits → 恩恵を受ける
    if (tokens.some((x) => /^(?:smartphone|smartphones|social|online|video|computer|computers|internet|app|apps|phone|phones|screen|screens)$/.test(x.w || ''))) ja = ja.replace(/試合とSNS/g, 'ゲームとSNS').replace(/SNSと試合/g, 'SNSとゲーム');   // distracted by games and social media → ゲームとSNS""")

rep("""ja.replace(/^いくつかの([^、。]{1,8})では、/, '一部の$1では、').replace(/^他の人たちは(.+?)と(言う|考える|思う|信じている|主張する|感じる|考えている)(。?)$/, '$1と$2人もいる$3');""",
    """ja.replace(/^いくつかの([^、。]{1,8})では、/, '一部の$1では、').replace(/^((?:[^、。]{1,8}、)?)他の人たちは(.+?)と(言う|考える|思う|信じている|主張する|感じる|考えている|心配する|心配している|恐れている|主張している)(。?)$/, '$1$2と$3人もいる$4');""")

rep("""    if (/^(?:[^、。]{0,12}、)?(?:人々|多くの人々|一部の人々)は/.test(ja)) ja = ja.replace(/彼らの(?=[^、。]{1,10}を)/g, '');""",
    """    if (/^(?:[^、。]{0,12}、)?(?:人々|多くの人々|一部の人々|生徒|学生|子どもたち|若者|多くの生徒|多くの学生)は/.test(ja)) ja = ja.replace(/彼らの(?=[^、。]{1,10}(?:を|と))/g, '');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
