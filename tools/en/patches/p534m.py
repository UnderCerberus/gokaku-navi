import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# A single Bible could take a skilled writer more than a year to complete / The project took us three years to finish → 熟練した作家が完成させるのに1年以上かかることもあった（take + 人 + 期間 + to 不定詞）
rep("""    if (L === 'take' && i + 2 < lim && o.subj && !(o.subj.pron === 'it')) {
      const mTk = mark();
      const dTk = np(i, lim, { noRel: true, noPost: true, noCoord: true });""",
    """    if (L === 'take' && i + 2 < lim && o.subj && !(o.subj.pron === 'it')) {
      const mTk = mark();
      let whoTk = null, iD = i;
      { const mWk = mark(); const wTk = np(i, lim, { noRel: true, noPost: true, noCoord: true }); if (wTk && (wTk.an || /^(?:me|us|him|her|them|you)$/.test(wTk.pron || '')) && !wTk.dur && wTk.end < lim) { whoTk = wTk; iD = wTk.end; } else fail(mWk); }
      const dTk = np(iD, lim, { noRel: true, noPost: true, noCoord: true });""")
rep("""          return done(canTk ? Object.assign({}, vg, { modal: '' }) : vg, P(vpJoin(iTk, 'dict').replace(/^到着する$/, '届く') + 'のに' + dJa + (canTk ? (vg.modal === 'could' ? 'かかることもあった' : 'かかることもある') : 'かかる'), canTk ? 'fix' : 'v5'), st, lim, 'SVO', o, [], { noStative: true });""",
    """          const whoJ = whoTk ? (({ me: '私', us: '私たち', him: '彼', her: '彼女', them: '彼ら', you: 'あなた' })[whoTk.pron] || whoTk.ja) + 'が' : '';
          return done(canTk ? Object.assign({}, vg, { modal: '' }) : vg, P(whoJ + vpJoin(iTk, 'dict').replace(/^到着する$/, '届く') + 'のに' + dJa + (canTk ? (vg.modal === 'could' ? 'かかることもあった' : 'かかることもある') : 'かかる'), canTk ? 'fix' : 'v5'), st, lim, 'SVO', o, [], { noStative: true });""")
rep("""        const iTk = vpNonfin(dTk.end + 1, lim, 'base', {});""",
    """        const iTk = vpNonfin(dTk.end + 1, lim, 'base', { gap: { type: 'np', rel: true, used: false } });   // took us three years to finish → 終える（主語が目的語の穴）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
