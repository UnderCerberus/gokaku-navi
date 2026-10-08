import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I am writing to … の訳を文全体の決まり文句にせず、node として返す（文末の置き換えを通す）
rep("""    if ((seq(0, ['i', 'am', 'writing', 'to']) || seq(0, ['we', 'are', 'writing', 'to'])) && b > 5 && T[4].k === 'w' && !!vc(T[4], ['base'])) {
      const L4w = vc(T[4], ['base']).lemma;
      const okW = (jaW) => ({ ok: true, ja: jaW + 'たく、ご連絡しました。', sp: '', names: ['inf-adv', 'fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() });""",
    """    let wrNode = null;
    if ((seq(0, ['i', 'am', 'writing', 'to']) || seq(0, ['we', 'are', 'writing', 'to'])) && b > 5 && T[4].k === 'w' && !!vc(T[4], ['base'])) {
      const L4w = vc(T[4], ['base']).lemma;
      const okW = (jaW) => { name('inf-adv'); return { out: () => jaW + 'たく、ご連絡しました', sp: 'SV', q: false }; };""")
rep("""          if (nW && nW.end === b && !nW.pron) return okW(nW.ja.replace(/^(?:私の|私たちの)/, '').replace(/^あなたの/, '') + (L4w === 'thank' ? 'のお礼を申し上げ' : 'をおわびし'));
          reset(tokens);
        }
      }
      const vW = vpNonfin(4, b, 'base', { subj: { ja: '私', pron: 'i', an: true } });""",
    """          if (nW && nW.end === b && !nW.pron) wrNode = okW(nW.ja.replace(/^(?:私の|私たちの)/, '').replace(/^あなたの/, '') + (L4w === 'thank' ? 'のお礼を申し上げ' : 'をおわびし'));
          else reset(tokens);
        }
      }
      const vW = wrNode ? null : vpNonfin(4, b, 'base', { subj: { ja: '私', pron: 'i', an: true } });""")
rep("""        return okW(vW.parts.filter((x) => !/^(?:あなたに|あなたたちに|みなさんに)$/.test(x)).join('').replace(/^(?:私の|私たちの)/, '') + (HONW[plW] || vW.pred.form('stem')));
      }
      reset(tokens);
    }""",
    """        wrNode = okW(vW.parts.filter((x) => !/^(?:あなたに|あなたたちに|みなさんに)$/.test(x)).join('').replace(/^(?:私の|私たちの)/, '') + (HONW[plW] || vW.pred.form('stem')));
      } else if (!wrNode) reset(tokens);
    }""")
rep("""    let node = null;
    try {
      if (q) {
        node = question(0, b);""",
    """    let node = wrNode;
    try {
      if (q && !node) {
        node = question(0, b);""")

# contact me は文末のときだけ ご連絡ください
rep("""    ja = ja.replace(/(?:遠慮なく)?私と連絡をとってください/g, (m0) => (/^遠慮なく/.test(m0) ? '遠慮なく' : '') + 'ご連絡ください');""",
    """    if (tokens.length > 1 && tokens[tokens.length - 1].w === 'me' && tokens[tokens.length - 2].w === 'contact') ja = ja.replace(/(?:遠慮なく)?私と連絡をとってください/g, (m0) => (/^遠慮なく/.test(m0) ? '遠慮なく' : '') + 'ご連絡ください');""")

# Hikari Beach → ひかりビーチ / Midori Park → みどり公園
rep("""ja = ja.replace(/([ぁ-んァ-ヶーA-Za-z一-龠]{1,10})の(高校|中学校|小学校|高等学校)/, '$1$2');""",
    """ja = ja.replace(/([ぁ-んァ-ヶーA-Za-z一-龠]{1,10})の(高校|中学校|小学校|高等学校)/, '$1$2');
    if (tokens.some((x, q) => x.cap && /^(?:beach|park|station)$/.test(x.w || '') && q > 0 && tokens[q - 1].cap && NAME_JA[tokens[q - 1].w])) ja = ja.replace(/([ぁ-ん]{2,6})の(浜辺|公園|駅)/, (m0, n0, p0) => n0 + ({ '浜辺': 'ビーチ', '公園': '公園', '駅': '駅' })[p0]);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
