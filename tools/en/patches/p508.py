import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 共起（コロケーション）の表: 動詞 + 目的語・形容詞 + 名詞・副詞 + 動詞 の語義をデータで選ぶ（入試の説明文に多い組み合わせ）
rep("""  const newSt = (vg) => ({ neg: false, vgNeg: !!(vg && vg.neg), exp: false, never: false, cont: false, just: false, also: false, times: false,
    once: false, agent: '', freq: [], time: [], other: [], manner: [] });""",
    """  const newSt = (vg) => ({ neg: false, vgNeg: !!(vg && vg.neg), exp: false, never: false, cont: false, just: false, also: false, times: false,
    once: false, agent: '', freq: [], time: [], other: [], manner: [], lemma: vg && vg.lemma ? vg.lemma : '' });
  const COLL = (lines, key) => {
    const tbl = Object.create(null);
    lines.forEach((ln) => {
      const f = ln.split('|');
      const re = new RegExp('(?:^| )(?:' + f[1].trim().split(/\\s+/).join('|') + ')$');
      (tbl[f[0]] = tbl[f[0]] || []).push(key === 'v' ? { re: re, particle: f[2], core: f[3] } : { re: re, ja: f[2] });
    });
    return tbl;
  };
  // 動詞|目的語の主要語|助詞|訳（受け身では主語の主要語で引く）
  const VOBJ = COLL([
    'produce|result results outcome outcomes|を|出す', 'produce|effect effects|を|生む',
    'build|machine machines robot robots device devices model models engine engines tool tools boat boats instrument instruments computer computers|を|作る',
    'build|relationship relationships trust friendship friendships reputation career careers society community future bond bonds|を|築く',
    'make|money fortune|を|稼ぐ',
    'conduct|survey surveys study studies research experiment experiments investigation investigations interview interviews test tests analysis|を|行う',
    'do|research experiment experiments survey surveys|を|行う', 'do|harm damage|を|与える',
    'pose|threat threats risk risks danger dangers problem problems challenge challenges|を|もたらす', 'pose|question questions|を|投げかける',
    'raise|awareness|を|高める', 'raise|child children kid kids family families|を|育てる', 'raise|money funds fund|を|集める',
    'raise|price prices tax taxes fee fees wage wages salary salaries rent rents|を|上げる',
    'meet|need needs demand demands requirement requirements standard standards expectation expectations condition conditions|を|満たす',
    'meet|deadline deadlines|を|守る', 'meet|goal goals target targets|を|達成する',
    'address|problem problems issue issues challenge challenges concern concerns|に|取り組む',
    'tackle|problem problems issue issues challenge challenges|に|取り組む',
    'draw|conclusion conclusions|を|引き出す', 'draw|attention|を|引く', 'attract|attention|を|集める', 'receive|attention|を|集める',
    'save|life lives|を|救う',
    'take|medicine medicines medication medications pill pills drug drugs|を|飲む', 'take|risk risks|を|冒す', 'run|risk|を|冒す',
    'take|measure measures step steps|を|講じる',
    'keep|promise promises secret secrets|を|守る', 'break|promise promises|を|破る', 'break|rule rules law laws|を|破る', 'break|record records|を|破る',
    'set|record records|を|樹立する', 'set|goal goals target targets|を|設定する',
    'give|speech speeches presentation presentations lecture lectures talk talks|を|する', 'deliver|speech speeches lecture lectures|を|する',
    'receive|education training treatment care|を|受ける', 'get|education training treatment|を|受ける',
    'present|information data evidence result results finding findings idea ideas argument arguments fact facts view views plan plans proposal proposals theory theories|を|提示する',
    'publish|result results finding findings study studies research report reports|を|発表する',
    'launch|campaign campaigns project projects program programs initiative|を|開始する', 'launch|satellite satellites rocket rockets|を|打ち上げる', 'launch|product products service services|を|発売する',
    'implement|policy policies plan plans measure measures program programs system systems|を|実施する',
    'pass|law laws bill bills|を|可決する', 'enforce|law laws rule rules|を|施行する',
    'win|award awards prize prizes medal medals|を|獲得する',
    'miss|opportunity opportunities chance chances|を|逃す', 'seize|opportunity opportunities chance chances|を|つかむ',
    'lead|life lives|を|送る', 'live|life lives|を|送る', 'earn|money income|を|稼ぐ', 'earn|living|を|立てる',
    'catch|attention eye|を|引く', 'fill|gap gaps|を|埋める', 'bridge|gap gaps|を|埋める', 'close|gap gaps|を|縮める', 'narrow|gap gaps|を|縮める', 'widen|gap gaps|を|広げる',
    'broaden|horizon horizons|を|広げる', 'boost|economy sales confidence morale|を|高める',
    'form|habit habits|を|身につける', 'form|relationship relationships friendship friendships bond bonds|を|築く', 'establish|relationship relationships|を|築く',
    'keep|balance|を|保つ', 'maintain|balance|を|保つ', 'strike|balance|を|とる',
    'cast|doubt|を|投げかける', 'serve|purpose purposes|を|果たす', 'fulfill|role roles duty duties|を|果たす', 'perform|task tasks|を|こなす',
    'perform|experiment experiments surgery operation operations|を|行う',
    'express|opinion opinions view views|を|述べる', 'voice|opinion opinions concern concerns|を|表明する',
    'play|role roles part|を|果たす', 'hold|election elections referendum|を|行う',
    'cross|border borders|を|越える', 'overcome|difficulty difficulties problem problems challenge challenges obstacle obstacles fear fears|を|克服する',
    'bear|responsibility|を|負う', 'take|responsibility|を|負う', 'accept|responsibility|を|引き受ける',
    'reach|consensus|に|達する', 'follow|trend trends|に|従う', 'adapt|environment|に|適応する',
  ], 'v');
  // 形容詞|名詞の主要語|形容詞の訳（連体形）
  const ADJN = COLL([
    'sharp|decline declines increase increases rise rises drop drops fall falls growth reduction reductions change changes|急激な',
    'rapid|growth increase increases decline change changes development progress expansion|急速な',
    'steep|decline increase rise drop fall|急激な',
    'heavy|reliance burden burdens losses investment use|大きな',
    'leading|cause causes|主な',
    'significant|impact impacts effect effects role number amount increase decrease difference differences change changes|大きな',
    'close|relationship relationships connection connections link links|密接な', 'close|friend friends|親しい',
    'healthy|diet diets lifestyle lifestyles habit habits|健康的な', 'balanced|diet diets|バランスのとれた',
    'tight|schedule schedules budget budgets|厳しい', 'private|sector company companies business businesses|民間の',
    'wide|range variety|幅広い', 'broad|range variety|幅広い', 'vast|majority|大',
    'poor|health|健康状態の悪い', 'poor|quality performance|低い',
    'strong|wind winds|強い', 'great|deal|大',
    'early|stage stages|初期の', 'late|stage stages|後期の',
  ], 'a');
  // 副詞|動詞の原形|訳
  const ADVV = COLL([
    'heavily|invest rely depend borrow bet lean spend|大きく', 'heavily|smoke drink|大量に',
    'sharply|rise fall drop increase decrease decline climb jump|急激に',
    'highly|recommend|強く', 'highly|value regard rate praise|高く',
    'closely|watch monitor examine follow study observe|注意深く', 'closely|work cooperate|緊密に',
    'badly|need want|どうしても', 'widely|use believe accept know|広く',
  ], 'a');""")

# 副詞 + 動詞（invested heavily → 大きく投資した / rose sharply → 急激に上がった）
rep("""  function addAdv(st, a, w) {
    if (!a) return;""",
    """  function addAdv(st, a, w) {
    if (!a) return;
    if (st.lemma && ADVV[w]) { const hv = ADVV[w].find((x) => x.re.test(st.lemma)); if (hv) a = Object.assign({}, a, { ja: hv.ja }); }""")

# 形容詞 + 名詞（a sharp decline → 急激な減少）
rep("""    if (!cnt) return fail(m);
    return { ja: pre + ja, end: j, head: head, pl: pl, an: an, time: time, c: lastC, sup: sup, proper: proper, bareJa: ja, preJa: pre, n: cnt };""",
    """    if (!cnt) return fail(m);
    for (let x = i; x < j - 1 && head; x++) {
      const aN = T[x].k === 'w' ? adjC(T[x]) : null;
      const hN = aN && ADJN[aN.lemma] ? ADJN[aN.lemma].find((y) => y.re.test(head)) : null;
      if (!hN || !aN.e) continue;
      const a0 = en.jp.adj(aN.e.ja).attr;
      if (a0 && pre.indexOf(a0) >= 0) pre = pre.replace(a0, hN.ja);
    }
    return { ja: pre + ja, end: j, head: head, pl: pl, an: an, time: time, c: lastC, sup: sup, proper: proper, bareJa: ja, preJa: pre, n: cnt };""")

# 動詞 + 目的語（produce better results → よりよい結果を出す）: 既存の個別規則より先に表を引く
rep("""      if (L === 'pass' && /(?:^| )(?:exam|exams|examination|examinations|test|tests|interview|audition)$/.test(oh)) sense = { particle: 'に', core: '合格する', tr: true };""",
    """      const vob = !vg.passive && VOBJ[L] && oh ? VOBJ[L].find((x) => x.re.test(oh)) : null;
      if (vob) sense = { particle: vob.particle, core: vob.core, tr: true };
      else if (L === 'pass' && /(?:^| )(?:exam|exams|examination|examinations|test|tests|interview|audition)$/.test(oh)) sense = { particle: 'に', core: '合格する', tr: true };""")

# 受け身（Information is presented … → 提示される / Studies were conducted → 行われた）: 主語の主要語で表を引く
rep("""    if (vg.passive && L === 'delay' && !objs.length && o.subj && !o.subj.an) {""",
    """    if (vg.passive && !objs.length && o.subj && VOBJ[L] && !(o.subj.pron && /^(?:i|you|he|she|we|they|me|him|her|us|them)$/.test(o.subj.pron))) {
      const vobP = VOBJ[L].find((x) => x.re.test(plainSubj(o.subj).head || ''));
      if (vobP && vobP.particle === 'を') { name('passive'); return done(vg, P(vobP.core), st, j, 'SV', o, [], { noStative: true }); }
    }
    if (vg.passive && L === 'delay' && !objs.length && o.subj && !o.subj.an) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
