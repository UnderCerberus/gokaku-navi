import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Some cultures value honesty, while others value harmony / Whereas some cultures value directness …, others … → ほかの文化は（他の人たち にしない）
rep("""        // A short waggle sends …, while a long one sends … → 短い揺れは…に送るのに対して、長いものは…（対比の while）
        if (s2.key === 'while' && isP(pv, ',') && sc4.pred""",
    """        // A short waggle sends …, while a long one sends … → 短い揺れは…に送るのに対して、長いものは…（対比の while）
        if (s2.key === 'while' && isP(pv, ',') && !(sc4.subj && sc4.subj.pron === 'others' && isW(T[a], 'some')) && sc4.pred""")
rep("""  function joinSub(key, sc, mn) {
    const sp = sc.subj && sc.subj.pron, mp = mn.subj && mn.subj.pron || (mn.imp ? 'you' : null);   // 命令文の主語は you（when you leave the room, turn off … → 部屋を出るとき）
    const same = !!sp && sp === mp && /^(?:i|you|he|she|we|they)$/.test(sp) && !(mn.subj && mn.subj.selfEmph);
    if (key === 'if' && sc.past && /^(?:would|could|might)$/.test(mn.modal || '')) name(sc.perfect ? 'subjunctive-pp' : 'subjunctive-past');
    const node = Object.assign({}, mn);
    node.out = (o) => {
      o = o || {};""",
    """  function joinSub(key, sc, mn) {
    const sp = sc.subj && sc.subj.pron, mp = mn.subj && mn.subj.pron || (mn.imp ? 'you' : null);   // 命令文の主語は you（when you leave the room, turn off … → 部屋を出るとき）
    const same = !!sp && sp === mp && /^(?:i|you|he|she|we|they)$/.test(sp) && !(mn.subj && mn.subj.selfEmph);
    if (key === 'if' && sc.past && /^(?:would|could|might)$/.test(mn.modal || '')) name(sc.perfect ? 'subjunctive-pp' : 'subjunctive-past');
    const node = Object.assign({}, mn);
    node.out = (o) => {
      o = o || {};
      if (/^(?:while|whereas)$/.test(key) && sc.subj && !sc.subj.pron && /^(?:何人かの|一部の|いくつかの)/.test(sc.subj.ja || '') && mn.subj && mn.subj.pron === 'others' && typeof sc.end === 'number' && typeof mn.end === 'number' && sc.end < mn.end) {   // Whereas some cultures value …, others … → ほかの文化は
        const hdW = sc.subj.ja.replace(/^(?:何人かの|一部の|いくつかの)/, '').replace(/たち$/, '');
        return subStr(key, sc, mn, null) + mn.out(o).replace(/^他の人たち/, 'ほかの' + hdW);
      }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
