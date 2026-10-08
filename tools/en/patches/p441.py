import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""'by the way': 'ところで', 'either way': 'いずれにせよ', 'in response': 'これを受けて',""",
    """'by the way': 'ところで', 'either way': 'いずれにせよ', 'in response': 'これを受けて', 'as you know': 'ご存じのように', 'as you may know': 'ご存じかもしれませんが', 'as you can see': 'ご覧のように',""")

# I am pleased to tell you that you passed the exam → あなたが試験に合格したことをお知らせできてうれしく思います
rep("""    // 頻度だけの答え: Every fifteen minutes.""",
    """    if (b > 6 && T[0].k === 'w' && /^(?:i|we)$/.test(T[0].w) && /^(?:am|are)$/.test((T[1] || {}).w || '') && /^(?:pleased|happy|glad|delighted)$/.test((T[2] || {}).w || '') && isW(T[3], 'to') && /^(?:tell|inform|announce|let)$/.test((T[4] || {}).w || '')) {
      let kPl = 5;
      if (T[kPl] && /^(?:you|everyone)$/.test(T[kPl].w || '')) kPl++;
      if (T[4].w === 'let' && isW(T[kPl], 'know')) kPl++;
      if (isW(T[kPl], 'that')) kPl++;
      const cPl = kPl < b ? sentence(kPl, b, { sub: true, reported: false }) : null;
      if (cPl) { name('that-clause'); return { ok: true, ja: cPl.out({ part: 'が', form: 'attr' }).replace(/だ$/, 'である') + 'ことをお知らせできてうれしく思います。', sp: '', names: ['that-clause', 'idiom'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() }; }
      reset(tokens);
    }
    // 頻度だけの答え: Every fifteen minutes.""")

rep(""".replace(/(?:早|速)い返事/g, '早速のお返事')""",
    """.replace(/(?:早|速)い返事/g, '早速のお返事').replace(/ご助け/g, 'ご協力')""")

rep("""    ja = ja.replace(/(?:ミスター)?氏と([^、。]{1,8}?)さん/g, '$1夫妻')""",
    """    ja = ja.replace(/(申し込み|応募|申請)は成功していなかった/g, '$1は通らなかった').replace(/成功していなかった(?=。|$)/, '成功しなかった');   // your application was not successful → 申し込みは通らなかった
    ja = ja.replace(/(?:ミスター)?氏と([^、。]{1,8}?)さん/g, '$1夫妻')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
