import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Thank you, but how will you get home? → ありがとう。でも、どうやって家に帰るのですか
rep("""    // Hi, Ken. → こんにちは、ケン""",
    """    {
      const thx = seq(0, ['thank', 'you']) ? 2 : (isW(T[0], 'thanks') ? 1 : 0);
      let kTh = thx;
      if (thx && (isW(T[kTh], 'very') || isW(T[kTh], 'so')) && isW(T[kTh + 1], 'much')) kTh += 2;
      if (thx && isP(T[kTh], ',') && isW(T[kTh + 1], 'but') && kTh + 2 < b) {
        const tTh = T.slice(kTh + 2).map((x, k) => Object.assign({}, x, { i: k, first: k === 0 }));
        const rTh = translate1(tTh);
        reset(tokens);
        if (rTh && rTh.ok) return { ok: true, ja: (kTh > thx ? 'どうもありがとう' : 'ありがとう') + '。でも、' + rTh.ja, sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      }
    }
    // Hi, Ken. → こんにちは、ケン""")

# offer an umbrella → 傘を差し出す / offer a seat → 席を譲る
rep("""      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };""",
    """      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };
      else if (L === 'offer' && /(?:^| )(?:umbrella|umbrellas|hand|handkerchief|tissue|tissues|cup|towel|jacket|coat)$/.test(oh)) sense = { particle: 'を', core: '差し出す', tr: true };   // offered me her umbrella → 傘を差し出してくれた
      else if (L === 'offer' && /(?:^| )(?:seat|seats)$/.test(oh)) sense = { particle: 'を', core: '譲る', tr: true };""")

rep("""    ja = ja.replace(/中国の万里の長城/g, '万里の長城');""",
    """    ja = ja.replace(/中国の万里の長城/g, '万里の長城');
    if (tokens[0] && tokens[0].w === 'how' && tokens[1] && tokens[1].w === 'will' && tokens[2] && tokens[2].w === 'you') ja = ja.replace(/^あなたはどのように/, 'どうやって').replace(/帰宅するでしょうか(?=。|$)/, '家に帰るのですか').replace(/でしょうか(?=。|$)/, 'のですか');   // How will you get home? → どうやって家に帰るのですか
    if (tokens.some((x, q) => x.w === 'around' && tokens[q + 1] && tokens[q + 1].w === 'the' && tokens[q + 2] && tokens[q + 2].w === 'corner')) ja = ja.replace(/^((?:私の|彼の|彼女の|あなたの|私たちの|その|この)?(?:家|駅|店|学校|病院|公園|銀行|図書館|レストラン|ホテル|事務所|会社|博物館|カフェ|郵便局|バス停|コンビニ|スーパー|ホテル|映画館|本屋|パン屋))はもうすぐだ/, '$1はすぐそこにある');   // My house is just around the corner → 家はすぐそこにある
    ja = ja.replace(/それを行かせ(る|た|て)(?!ください|なさい)/g, (m0, a0) => 'それを放してや' + ({ 'る': 'る', 'た': 'った', 'て': 'って' })[a0]);   // decided to let it go → それを放してやることに決めた
    ja = ja.replace(/(?:その|彼の|彼女の)?(翼|羽|足|脚|腕|前足|後ろ足)が傷つけられた/, '$1をけがしていた').replace(/(?:自分の|彼の|彼女の)?窓の外側(で|に|から)/g, '窓の外$1').replace(/外に見(て|た|る)/g, '外を見$1');   // its wing was hurt → 翼をけがしていた / outside his window → 窓の外で / looked out → 外を見た
    if (tokens.some((x) => x.w === 'since') && tokens.some((x) => /^(?:has|have)$/.test(x.w || '')) && tokens.some((x) => /^(?:every|always)$/.test(x.w || ''))) ja = ja.replace(/(訪ね|電話し|会いに来|手紙を書い|話し|練習し|走っ|歩い|勉強し)(?:た)(?=。|$)/, (m0, a0) => a0 + (a0 === '訪ね' ? 'てくる' : (/[っい]$/.test(a0) ? (a0.slice(-1) === 'い' && /[書歩]い$/.test(a0) ? 'ている' : 'ている') : 'ている'))).replace(/会いに来ている(?=。|$)/, '会いに来る');   // Since then, the bird has visited him every morning → 毎朝彼を訪ねてくる""")

# Let it go. → もう気にしないで
rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'let it go': 'もう気にしないで', """)

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
