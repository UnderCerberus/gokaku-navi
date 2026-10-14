import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I have come to appreciate my own town → 自分の町の良さが分かるようになった（町・都市・国・故郷・地域などの appreciate も「〜の良さが分かる」。「正しく評価する」にしない）
rep("""    'appreciate|food foods meal meals cooking cuisine dish dishes music art arts painting paintings nature culture cultures poetry literature novel novels film films movie movies taste flavor flavors tradition traditions life|の|良さが分かる',""",
    """    'appreciate|food foods meal meals cooking cuisine dish dishes music art arts painting paintings nature culture cultures poetry literature novel novels film films movie movies taste flavor flavors tradition traditions life town towns city cities country countries hometown home community communities neighborhood neighbourhood place places school language languages|の|良さが分かる',""")

# 目的語が「〜の」で終わる（〜の良さが分かる）ときは様態の副詞を目的語の前に置く（自分の町のずっと以前より…良さが分かる にしない）
rep("""    (objStrs || []).forEach((x) => { if (x) parts.push(x); });
    st.other.forEach((x) => { if (aftO.indexOf(x) >= 0) parts.push(x); });
    if (st.once && vg.perfect && !vg.past) parts.push('一度');
    st.manner.forEach((x) => parts.push(x));""",
    """    const genObj = (objStrs || []).some((x) => x && /[^のも]の$/.test(x)) && /^良さ/.test(f.pred && f.pred.s ? f.pred.s : '');
    if (genObj && st.manner.length) parts.push(st.manner.join('').replace(/^(ずっと|はるかに)(.+?より)(?:多く|もっと)$/, '$2$1').replace(/より(?:多く|もっと)$/, 'より'));   // much more than before → 以前よりずっと
    (objStrs || []).forEach((x) => { if (x) parts.push(x); });
    st.other.forEach((x) => { if (aftO.indexOf(x) >= 0) parts.push(x); });
    if (st.once && vg.perfect && !vg.past) parts.push('一度');
    if (!genObj) st.manner.forEach((x) => parts.push(x));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
