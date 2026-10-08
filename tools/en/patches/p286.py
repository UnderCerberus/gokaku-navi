import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Why don't I make some tea? → お茶をいれましょうか
rep("""    if (isW(T[a], 'why') && isW(T[a + 1], 'do') && isW(T[a + 2], 'not') && a + 4 < b && (isW(T[a + 3], 'you') || isW(T[a + 3], 'we')) && vc(T[a + 4], ['base'])) {
      const mq = mark();
      const vq = vpNonfin(a + 4, b, 'base', {});
      if (vq && vq.end === b) { name('question'); return Fx(isW(T[a + 3], 'we') && verbal(vq.pred) ? vq.parts.join('') + vq.pred.form('stem') + 'ませんか' : vpJoin(vq, 'te') + 'はどうですか', 'SV'); }""",
    """    if (isW(T[a], 'why') && isW(T[a + 1], 'do') && isW(T[a + 2], 'not') && a + 4 < b && (isW(T[a + 3], 'you') || isW(T[a + 3], 'we') || isW(T[a + 3], 'i')) && vc(T[a + 4], ['base'])) {
      const mq = mark();
      const vq = vpNonfin(a + 4, b, 'base', {});
      if (vq && vq.end === b && isW(T[a + 3], 'i') && verbal(vq.pred)) { name('question'); return Fx(vq.parts.join('').replace(/^あなたを(?=迎え|車で)/, '') + vq.pred.form('stem') + 'ましょうか', 'SV'); }   // Why don't I pick you up at seven? → 7時に迎えに行きましょうか
      if (vq && vq.end === b && isW(T[a + 3], 'i')) { fail(mq); }
      else if (vq && vq.end === b) { name('question'); return Fx(isW(T[a + 3], 'we') && verbal(vq.pred) ? vq.parts.join('') + vq.pred.form('stem') + 'ませんか' : vpJoin(vq, 'te') + 'はどうですか', 'SV'); }""")

# What do you say to a cup of coffee? → コーヒーを1杯どうですか
rep("""      if (gq && gq.end === b) { name('idiom'); return Fx(vpJoin(gq, 'dict') + 'のはどうですか', 'SVO'); }
      fail(mq);
    }""",
    """      if (gq && gq.end === b) { name('idiom'); return Fx(vpJoin(gq, 'dict') + 'のはどうですか', 'SVO'); }
      fail(mq);
    }
    if (seq(a, ['what', 'do', 'you', 'say', 'to']) && a + 5 < b && !ingVerb(a + 5, b)) {   // What do you say to a cup of coffee? → コーヒーを1杯どうですか
      const mq = mark();
      const nq = np(a + 5, b, {});
      if (nq && nq.end === b && !nq.pron) {
        const cupQ = /^((?:もう)?[0-9０-９]+(?:杯|個|切れ|枚|本))の(.+)$/.exec(nq.ja);
        name('idiom');
        return Fx(cupQ ? cupQ[2] + 'を' + cupQ[1] + 'どうですか' : nq.ja.replace(/^(?:いくらかの|いくつかの)/, '') + 'はどうですか', 'SVO');
      }
      fail(mq);
    }""")

# Would you care for some tea? / Would you care to join us? / Do you want me to …? / Do you think you could …?
rep("""    // Would you like some coffee? → コーヒーはいかがですか / Would you like to come with us? → 私たちと一緒に来ませんか / Would you like me to help you? → 手伝いましょうか
    if (!wh && !negQ && aux.w === 'would' && isW(T[s0], 'you') && isW(T[s0 + 1], 'like') && s0 + 2 < b) {""",
    """    // Would you care for some tea? → お茶はいかがですか / Would you care to join us? → 私たちに加わりませんか
    if (!wh && !negQ && aux.w === 'would' && isW(T[s0], 'you') && isW(T[s0 + 1], 'care') && (isW(T[s0 + 2], 'for') || isW(T[s0 + 2], 'to')) && s0 + 3 < b) {
      const mCr = mark();
      if (isW(T[s0 + 2], 'to')) {
        const vCr = vpNonfin(s0 + 3, b, 'base', {});
        if (vCr && vCr.end === b && verbal(vCr.pred)) { name('idiom'); return Fx(vCr.parts.join('') + vCr.pred.form('stem') + 'ませんか', 'SV'); }
      } else {
        const nCr = np(s0 + 3, b, {});
        if (nCr && nCr.end === b && !nCr.pron) {
          const cupCr = /^((?:もう)?[0-9０-９]+(?:杯|個|切れ|枚|本|つ))の(.+)$/.exec(nCr.ja);
          name('idiom');
          return Fx(cupCr ? cupCr[2] + 'を' + cupCr[1] + 'いかがですか' : nCr.ja.replace(/^(?:いくらかの|いくつかの)/, '') + 'はいかがですか', 'SV');
        }
      }
      fail(mCr);
    }
    // Do you want me to open the window? → 窓を開けましょうか
    if (!wh && !negQ && aux.w === 'do' && isW(T[s0], 'you') && isW(T[s0 + 1], 'want') && isW(T[s0 + 2], 'me') && isW(T[s0 + 3], 'to') && s0 + 4 < b && vc(T[s0 + 4], ['base'])) {
      const mWm = mark();
      const vWm = vpNonfin(s0 + 4, b, 'base', {});
      if (vWm && vWm.end === b && verbal(vWm.pred)) { name('idiom'); return Fx((vWm.parts.join('') + vWm.pred.form('stem') + 'ましょうか').replace(/^あなたを(?:助け|手伝い)ましょうか$/, '手伝いましょうか').replace(/^あなたのために/, ''), 'SV'); }
      fail(mWm);
    }
    // Do you think you could lend me some money? → お金を貸してもらえないでしょうか（依頼）
    if (!wh && !negQ && aux.w === 'do' && isW(T[s0], 'you') && isW(T[s0 + 1], 'think') && isW(T[s0 + 2], 'you') && isW(T[s0 + 3], 'could') && s0 + 4 < b && vc(T[s0 + 4], ['base'])) {
      const mTc = mark();
      const vTc = vpNonfin(s0 + 4, b, 'base', { subj: { ja: 'あなた', pron: 'you', an: true } });
      if (vTc && vTc.end === b && verbal(vTc.pred)) { name('polite-request'); return Fx(vpJoin(vTc, 'te').replace(/^(?:私の)+/, '').replace(/^私(?:を|に)/, '').replace(/くれて$/, '') + 'もらえないでしょうか', 'SV'); }
      fail(mTc);
    }
    // Would you like some coffee? → コーヒーはいかがですか / Would you like to come with us? → 私たちと一緒に来ませんか / Would you like me to help you? → 手伝いましょうか
    if (!wh && !negQ && aux.w === 'would' && isW(T[s0], 'you') && isW(T[s0 + 1], 'like') && s0 + 2 < b) {""")

rep("""          const cupW = /^([0-9０-９]+(?:杯|個|切れ|枚|本|つ))の(.+)$/.exec(nW.ja);""",
    """          const cupW = /^((?:もう)?[0-9０-９]+(?:杯|個|切れ|枚|本|つ))の(.+)$/.exec(nW.ja);""")

# I wonder if you could give me some advice → 助言をいただけないでしょうか（くれていただけ にしない）
rep("""        if (vWd && vWd.end === b && verbal(vWd.pred)) return { ok: true, ja: vpJoin(vWd, 'te').replace(/^(?:私の)+/, '').replace(/^私(?:を|に)/, '') + 'いただけないでしょうか。'""",
    """        if (vWd && vWd.end === b && verbal(vWd.pred)) return { ok: true, ja: vpJoin(vWd, 'te').replace(/^(?:私の)+/, '').replace(/^私(?:を|に)/, '').replace(/くれて$/, '') + 'いただけないでしょうか。'""")

# お茶を作る → お茶をいれる（いれる は一段: いれた・いれましょう）
rep(""".replace(/(お茶|コーヒー|紅茶)を作/g, '$1をいれ')""",
    """.replace(/(お茶|コーヒー|紅茶)を作(った|って|られ|らせ|れば|ろう|る|り|ら|れ)/g, (m0, n0, e0) => n0 + 'をいれ' + ({ 'った': 'た', 'って': 'て', 'られ': 'られ', 'らせ': 'させ', 'れば': 'れれば', 'ろう': 'よう', 'る': 'る', 'り': '', 'ら': '', 'れ': 'られ' })[e0])""")

# change + 予約・パスワードなど → 変更する
rep("""      else if (L === 'change' && !vg.passive && objs.length === 1 && /(?:^| )(?:clothes|clothing|shirt|shirts|dress|uniform|outfit|pajamas|socks)$/.test(oh)) sense = { particle: 'を', core: '着替える', tr: true };""",
    """      else if (L === 'change' && !vg.passive && objs.length === 1 && /(?:^| )(?:clothes|clothing|shirt|shirts|dress|uniform|outfit|pajamas|socks)$/.test(oh)) sense = { particle: 'を', core: '着替える', tr: true };
      else if (L === 'change' && !vg.passive && objs.length === 1 && /(?:^| )(?:reservation|reservations|booking|bookings|appointment|appointments|password|passwords|schedule|schedules|flight|flights|address|setting|settings|order|orders|date|dates|itinerary|username)$/.test(oh)) sense = { particle: 'を', core: '変更する', tr: true };   // change my reservation → 予約を変更する""")

# another cup of tea → もう1杯のお茶
rep("""    if ((num || detW === 'a' || detW === 'an') && nom.c && MEASURE[nom.c.lemma] && !nom.preJa && isW(T[nom.end], 'of') && nom.end + 1 < lim && !(num && num.ord)) {""",
    """    if ((num || detW === 'a' || detW === 'an' || detW === 'another') && nom.c && MEASURE[nom.c.lemma] && !nom.preJa && isW(T[nom.end], 'of') && nom.end + 1 < lim && !(num && num.ord)) {""")
rep("""(num ? det + num.ja : (few0 ? '数' : '1')) + MEASURE[nom.c.lemma]);""",
    """(num ? (detW === 'another' ? 'もう' : det) + num.ja : (few0 ? '数' : (detW === 'another' ? 'もう1' : '1'))) + MEASURE[nom.c.lemma]);""")

# 数量の遊離: 1杯のコーヒーを飲んだ → コーヒーを1杯飲んだ / ご自由にどうぞ / もう行かなければ
rep(""".replace(/べきであるのは/g, 'べきなのは').replace(/速い(返事|返信|回答|対応)/g, '早い$1')""",
    """.replace(/べきであるのは/g, 'べきなのは').replace(/速い(返事|返信|回答|対応)/g, '早い$1').replace(/(^|[、はがにで])((?:もう)?[0-9０-９]+(?:杯|本|枚|切れ|箱|袋|缶|瓶|皿|冊|足|台))の([^、。をのがはにでとも「」]{1,10})を/g, '$1$3を$2').replace(/^(?:いくつかの|いくらかの)([^、。]{1,12}?)をご自由にどうぞ/, '$1をご自由にどうぞ').replace(/今(行か|帰ら|出発し)なければならない(?=。|$)/, 'もう$1なければならない')""")

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'may i ask you a favor': 'お願いしてもいいですか', 'can i ask you a favor': 'お願いしてもいいですか', 'could i ask you a favor': 'お願いしてもよろしいですか', 'may i ask a favor': 'お願いしてもいいですか', 'can i ask you something': 'ちょっと聞いてもいいですか', 'may i ask you something': 'ちょっとお聞きしてもいいですか', 'i have to go now': 'もう行かなければならない', 'i must go now': 'もう行かなければならない', 'i must be going': 'そろそろ失礼します', 'i should get going': 'そろそろ行かなくちゃ', 'i have got to go': 'もう行かなくちゃ', """)

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
