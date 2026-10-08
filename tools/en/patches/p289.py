import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I am writing to tell you about my trip → 旅行についてお話ししたく、ご連絡しました
rep("""    // Hi, Ken. → こんにちは、ケン""",
    """    // I am writing to tell you about my trip → 旅行についてお話ししたく、ご連絡しました / I'm writing to thank you for the present → 贈り物のお礼を申し上げたく、ご連絡しました
    if ((seq(0, ['i', 'am', 'writing', 'to']) || seq(0, ['we', 'are', 'writing', 'to'])) && b > 5 && T[4].k === 'w' && !!vc(T[4], ['base'])) {
      const L4w = vc(T[4], ['base']).lemma;
      const okW = (jaW) => ({ ok: true, ja: jaW + 'たく、ご連絡しました。', sp: '', names: ['inf-adv', 'fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() });
      if (/^(?:thank|apologize|apologise)$/.test(L4w)) {
        let kW = 5;
        if (isW(T[kW], 'you') || isW(T[kW], 'everyone')) kW++;
        if (isW(T[kW], 'for') && kW + 1 < b && !(T[kW + 1].k === 'w' && !!vc(T[kW + 1], ['ing']) && !nounC(T[kW + 1]))) {
          const nW = np(kW + 1, b, {});
          if (nW && nW.end === b && !nW.pron) return okW(nW.ja.replace(/^(?:私の|私たちの)/, '').replace(/^あなたの/, '') + (L4w === 'thank' ? 'のお礼を申し上げ' : 'をおわびし'));
          reset(tokens);
        }
      }
      const vW = vpNonfin(4, b, 'base', { subj: { ja: '私', pron: 'i', an: true } });
      if (vW && vW.end === b && verbal(vW.pred)) {
        const HONW = { '尋ねる': 'お尋ねし', '聞く': 'お聞きし', '知らせる': 'お知らせし', '話す': 'お話しし', '伝える': 'お伝えし', '謝る': 'おわびし', '感謝する': 'お礼を申し上げ', '招待する': 'ご招待し', '紹介する': 'ご紹介し', '説明する': 'ご説明し', '確認する': '確認し', '申し込む': '申し込み', '問い合わせる': 'お問い合わせし' };
        const plW = vW.pred.plain();
        return okW(vW.parts.filter((x) => !/^(?:あなたに|あなたたちに|みなさんに)$/.test(x)).join('').replace(/^(?:私の|私たちの)/, '') + (HONW[plW] || vW.pred.form('stem')));
      }
      reset(tokens);
    }
    // Hi, Ken. → こんにちは、ケン""")

rep("""    ja = ja.replace(/ということは哀れみだ/g, 'のは残念だ')""",
    """    ja = ja.replace(/あなたが要請した/g, 'あなたが依頼した').replace(/すぐにあなたに会うことを楽しみに/g, '近いうちにあなたに会えるのを楽しみに').replace(/あなたに会うことを楽しみに/g, 'あなたに会えるのを楽しみに').replace(/(?:私が)?(?:私の)?最後の(メール|手紙)で(?:言及した|述べた|言った)ように/, '前回の$1でお伝えしたように').replace(/より多くの情報を(?=送|教え|ください|いただけ|もらえ)/g, 'もっと詳しい情報を');   // I have attached the file you requested / I'm looking forward to seeing you soon / As I mentioned in my last email
    if (tokens.some((x) => x.w === 'know') && tokens.some((x) => x.w === 'let')) ja = ja.replace(/私に知らせて(?=ください|ね|$|。)/g, '知らせて');   // Please let me know if … → …があったら、知らせてください
    ja = ja.replace(/(?:遠慮なく)?私と連絡をとってください/g, (m0) => (/^遠慮なく/.test(m0) ? '遠慮なく' : '') + 'ご連絡ください');   // Please feel free to contact me → 遠慮なくご連絡ください
    if (tokens.some((x, q) => x.cap && /^(?:high|junior|elementary|middle)$/.test(x.w || '') && q > 0 && tokens[q - 1].cap)) ja = ja.replace(/([ぁ-んァ-ヶーA-Za-z一-龠]{1,10})の(高校|中学校|小学校|高等学校)/, '$1$2');   // Sakura High School → さくら高校（これまでは さくらの高校）
    ja = ja.replace(/ということは哀れみだ/g, 'のは残念だ')""")

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'i hope this email finds you well': 'お元気でお過ごしのことと存じます', 'i hope this letter finds you well': 'お元気でお過ごしのことと存じます', 'i hope this message finds you well': 'お元気でお過ごしのことと存じます', 'i hope all is well': 'お変わりなくお過ごしのことと思います', 'i hope all is well with you': 'お変わりなくお過ごしのことと思います', """)

rep("""  const NAME_JA = dic({ """, """  const NAME_JA = dic({ sakura: 'さくら', midori: 'みどり', aoba: 'あおば', hikari: 'ひかり', wakaba: 'わかば', minami: 'みなみ', asahi: 'あさひ', """)

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
