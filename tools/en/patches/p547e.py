import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Some experts suggest that students should instead be taught how to … → 学生は…を教わるべきだと提案する専門家もいる
# （suggest / recommend の that 節に should があれば「〜ように勧める」にせず「〜べきだと提案する」。「教えられるべきだように」にしない）
rep("""        if (mand || mand2) { tStr = tStr.replace(/^(彼女|彼ら|彼|あなた|""",
    """        if ((mand || mand2) && /べきだ$/.test(tStr)) { name('that-clause'); return done(vg, P(/^(?:recommend|advise|urge)$/.test(L) ? '勧める' : '提案する', /^(?:recommend|advise|urge)$/.test(L) ? 'v1' : 'suru'), st, tc.end, 'SVO', o, [tStr + 'と']); }
        if (mand || mand2) { tStr = tStr.replace(/^(彼女|彼ら|彼|あなた|""")

# should be taught how to manage their sleep → 睡眠の管理の仕方（睡眠・時間・ストレス・お金などの manage は「管理する」）
rep("""      else if (L === 'control' && /^(?:temperature|temperatures|light|humidity|heat|speed|volume|flow|pressure|level|levels|amount|brightness)$/.test(oh)) sense = { particle: 'を', core: '調節する', tr: true };""",
    """      else if (L === 'control' && /^(?:temperature|temperatures|light|humidity|heat|speed|volume|flow|pressure|level|levels|amount|brightness)$/.test(oh)) sense = { particle: 'を', core: '調節する', tr: true };
      else if (L === 'manage' && /^(?:sleep|time|stress|money|budget|emotions|emotion|anger|feelings|weight|risk|risks|health|diet|energy|resources|workload|schedule|data|information)$/.test(oh)) sense = { particle: 'を', core: '管理する', tr: true };""")

# practiced every day after school until it was almost dark（after / before + school・work・lunch など冠詞のない名詞は前置詞句。従属節の after にしない）
rep("""    if (/^(?:until|till|since|before|after)$/.test(t.w) && T[j + 1] && T[j + 1].k === 'w' && /^(?:then|now|today|tomorrow|yesterday|recently|lately|midnight|noon)$/.test(T[j + 1].w) && (j + 2 >= b || T[j + 2].k === 'p')) return null;""",
    """    if (/^(?:until|till|since|before|after)$/.test(t.w) && T[j + 1] && T[j + 1].k === 'w' && /^(?:then|now|today|tomorrow|yesterday|recently|lately|midnight|noon)$/.test(T[j + 1].w) && (j + 2 >= b || T[j + 2].k === 'p')) return null;
    if (/^(?:before|after)$/.test(t.w) && T[j + 1] && /^(?:school|class|work|lunch|dinner|breakfast|dark|sunset|sunrise|midnight|noon|graduation|practice)$/.test(T[j + 1].w || '') && !(T[j + 2] && T[j + 2].k === 'w' && (!!BE[T[j + 2].w] || !!MODAL[T[j + 2].w] || (!!vc(T[j + 2], ['past', '3sg']) && !nounC(T[j + 2]))))) return null;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
