import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# he left me an old film camera → 私に古いフィルムカメラを残してくれた（2 つ目的語の leave は「残す」。「去ってくれた」にしない）
rep("""        if (L === 'give' && (objs[0].pron === 'me' || objs[0].pron === 'us')) core = P('くれる', 'v1');""",
    """        if (L === 'leave' && !vg.passive && !/(?:置|残)/.test(core.plain())) core = P('残す', 'v5');
        if (L === 'give' && (objs[0].pron === 'me' || objs[0].pron === 'us')) core = P('くれる', 'v1');""")

# vertical farming is not without its problems → 垂直農業に問題がないわけではない（be not without + 名詞句）
rep("""  function parseBe(vg, i, lim, o) {
    const m = mark();
    const st = newSt(vg);""",
    """  function parseBe(vg, i, lim, o) {
    const m = mark();
    const st = newSt(vg);
    if (vg.neg && isW(T[i], 'without') && i + 1 < lim && !o.gap) {
      const mWo = mark();
      const nWo = np(i + 1, lim, { noRel: true });
      if (nWo && nWo.end === lim && !nWo.pron) { name('idiom'); st.neg = false; return done(Object.assign({}, vg, { neg: false }), P(nWo.ja.replace(/^(?:その|それの|それらの|彼の|彼女の|彼らの)/, '') + 'がないわけではない', 'i'), st, lim, 'SVC', o, [], { noStative: true }); }
      fail(mWo);
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
