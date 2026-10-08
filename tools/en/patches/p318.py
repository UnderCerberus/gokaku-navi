import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# (And) here comes the bus! → ほら、バスが来た
rep("""    // Hi, Ken. → こんにちは、ケン""",
    """    // And here comes the family …! → そして、ほら、…家族がやって来た（感嘆符・and つきでも here comes は決まった言い方）
    {
      const kHc = isW(T[0], 'and') ? 1 : 0;
      if (isW(T[kHc], 'here') && (isW(T[kHc + 1], 'comes') || isW(T[kHc + 1], 'come')) && kHc + 2 < b) {
        const nHc = np(kHc + 2, b, {});
        if (nHc && nHc.end === b && !nHc.pron) return { ok: true, ja: (kHc ? 'そして、' : '') + 'ほら、' + nHc.ja + 'がやって来た。', sp: '', names: ['idiom'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
        reset(tokens);
      }
    }
    // Hi, Ken. → こんにちは、ケン""")

rep("""  const NAME_JA = dic({ hanamizuki: 'はなみずき',""", """  const NAME_JA = dic({ michibiki: 'みちびき', hanamizuki: 'はなみずき',""")

rep("""    ja = ja.replace(/衛星の周りに巨大な球/g, '衛星の周りの巨大な球')""",
    """    ja = ja.replace(/^(.+?)は占いをして、(.+?)を選ぶためにそれを使った/, '$1は占いをしたり、$2を選んだりするためにそれを使った').replace(/田舎を横切って彼らをはるかに送る/, '彼らを田舎のはるか遠くへ送る').replace(/(スーパーマーケット|店|市場|コンビニ)から(冷たい|温かい|安い)?食べ物を食べる/, '$1の$2食べ物を食べる').replace(/決して再現しなくて、再び創造する/, '決して再現するのではなく、作り直すのだ');   // to tell fortunes and to choose / far across the countryside / food from the supermarket / It never reproduces; it re-creates
    ja = ja.replace(/衛星の周りに巨大な球/g, '衛星の周りの巨大な球')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
