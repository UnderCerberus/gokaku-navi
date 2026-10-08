import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Could you be quiet? → 静かにしていただけませんか
rep("""    // 依頼・申し出の決まった形
    const sp0 = T[s0];""",
    """    // Could you be quiet? → 静かにしていただけませんか / Can you be careful? → 気をつけてくれますか
    if (!wh && !negQ && /^(?:could|would|can|will)$/.test(aux.w) && isW(T[s0], 'you') && isW(T[s0 + 1], 'be') && s0 + 3 === b && T[s0 + 2].k === 'w' && adjC(T[s0 + 2])) {
      const aBe = adjC(T[s0 + 2]);
      const fBe = aBe && aBe.e ? en.jp.adj(aBe.lemma === 'careful' ? '注意深い' : aBe.e.ja) : null;
      if (fBe && (fBe.kind === 'i' || fBe.kind === 'na')) {
        pick(s0 + 2, aBe.e);
        const advBe = aBe.lemma === 'careful' ? '気をつけて' : fBe.adv + 'して';
        return Fx(advBe + (aux.w === 'will' ? 'くれませんか' : (aux.w === 'can' ? 'くれますか' : 'いただけませんか')), 'SVC');
      }
    }
    // 依頼・申し出の決まった形
    const sp0 = T[s0];""")

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    if (tokens.some((x) => x.w === 'should') && tokens.some((x) => /^(?:soon|anytime|tomorrow|tonight)$/.test(x.w || '') || (x.w === 'by' && tokens.some((y) => y.k === 'num'))) && !/^(?:i|you|we)$/.test((tokens[0] || {}).w || '')) ja = ja.replace(/(到着|帰宅|終了)するべきだ(?=。|$)/, '$1するはずだ').replace(/(来る|戻る|着く|終わる|届く)べきだ(?=。|$)/, '$1はずだ');   // He should arrive soon → もうすぐ到着するはずだ
    if (tokens[0] && tokens[0].w === 'you' && tokens[1] && tokens[1].w === 'may' && tokens[2] && tokens[2].w !== 'be' && tokens[2].w !== 'have') ja = ja.replace(/^(?:あなたは)?(.*?)([一-龠ァ-ヶー]+する|[一-龠][ぁ-ん]{0,2}(?:る|う|く|ぐ|す|つ|ぬ|ぶ|む))かもしれない(?=。|$)/, (m0, a0, v0) => { try { const pM = P(v0); return verbal(pM) ? a0 + pM.form('te') + 'もよい' : m0; } catch (eM) { return m0; } });   // You may go home now → 今帰宅してもよい
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
