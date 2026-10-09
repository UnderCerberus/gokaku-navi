import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the more difficult it becomes to solve → 解決するのがますます難しくなる（more + 形容詞 + it + become / get + to 不定詞）
rep("""    const adjHalf = (k, e, aj) => {
      // the less likely they are to fail（主語 + be + to 不定詞）""",
    """    const adjHalf = (k, e, aj) => {
      if (isW(T[k], 'it') && T[k + 1] && /^(?:becomes|became|gets|got)$/.test(T[k + 1].w || '') && isW(T[k + 2], 'to') && k + 3 < e) {
        const mBi = mark();
        const infBi = vpNonfin(k + 3, e, 'base', {});
        if (infBi && infBi.end === e) return { adj: aj, subj: { ja: '', pron: 'it' }, become: true, past: /^(?:became|got)$/.test(T[k + 1].w), infGa: infBi, forJ: '' };   // the more difficult it becomes to solve
        fail(mBi);
      }
      // the less likely they are to fail（主語 + be + to 不定詞）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
