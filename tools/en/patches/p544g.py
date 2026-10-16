import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# This pattern, now known as the forgetting curve, has been … → 今では忘却曲線として知られているこのパターンは…
# The city, now called Tokyo, was … （副詞 + 過去分詞句の挿入も、過去分詞句の挿入として読む）
rep("""        if (!len && T[x + 1].k === 'w' && vc(T[x + 1], ['pp']) && !vc(T[x + 1], ['base']) && !PREP[T[x + 1].w] && !nounC(T[x + 1]) &&
          !(T[x - 1].k === 'w' && vc(T[x - 1], ['pp']) && !nounC(T[x - 1]))) {           // be wrapped, sorted, loaded …（受動態の分詞の列挙）は挿入ではない
          let y = -1;
          for (let z = x + 2; z < b - 1; z++) { if (isP(T[z], ',')) { y = z; break; } }""",
    """        const ADVQ = { now: '今では', once: 'かつて', formerly: '以前は', originally: 'もともと', still: '今も', widely: '広く', commonly: '一般に', often: 'しばしば', also: 'また', sometimes: '時々', generally: '一般に', popularly: '一般に', usually: '普通', later: 'のちに' };
        const advQ = !len && x + 3 < b && T[x + 1].k === 'w' && ADVQ[T[x + 1].w] && T[x + 2].k === 'w' && !!vc(T[x + 2], ['pp']) && !vc(T[x + 2], ['base']) && !PREP[T[x + 2].w] && !nounC(T[x + 2]) ? 1 : 0;
        if (!len && T[x + 1 + advQ].k === 'w' && vc(T[x + 1 + advQ], ['pp']) && !vc(T[x + 1 + advQ], ['base']) && !PREP[T[x + 1 + advQ].w] && !nounC(T[x + 1 + advQ]) &&
          !(T[x - 1].k === 'w' && vc(T[x - 1], ['pp']) && !nounC(T[x - 1]))) {           // be wrapped, sorted, loaded …（受動態の分詞の列挙）は挿入ではない
          let y = -1;
          for (let z = x + 2 + advQ; z < b - 1; z++) { if (isP(T[z], ',')) { y = z; break; } }""")
rep("""          if (y > 0) {
            const mq = mark();
            const vq = vpNonfin(x + 1, y, 'pp', {});
            if (vq && vq.end === y && verbal(vq.pred)) { len = y - x - 1; ja = !T.slice(a, x)""",
    """          if (y > 0) {
            const mq = mark();
            const vq = vpNonfin(x + 1 + advQ, y, 'pp', {});
            if (vq && vq.end === y && verbal(vq.pred)) { len = y - x - 1; ja = (advQ ? ADVQ[T[x + 1].w] : '') + (!T.slice(a, x)""")
rep("""? vq.pred.form('past') : vq.pred.plain()) + '\\u0002' : vq.parts.join('') + vq.pred.form('te'); }""",
    """? vq.pred.form('past') : vq.pred.plain()) + '\\u0002' : vq.parts.join('') + vq.pred.form('te')); }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
