import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# in one culture … in another → 別の文化では（another の後ろの名詞を前の one + 名詞から補う）
rep("""    if (key === 'within' && !idi && j + 3 < lim) {""",
    """    if (!idi && /^(?:in|to|from|at|for)$/.test(key || '') && isW(T[j], 'another') && (j + 1 >= lim || T[j + 1].k === 'p' || /^(?:so|and|but|while)$/.test(T[j + 1].w || ''))) {
      for (let x = j - 2; x >= 0; x--) {
        if (!(isW(T[x], 'one') && T[x + 1] && T[x + 1].k === 'w' && !!nounC(T[x + 1]))) continue;
        const mAn = mark();
        const nAn = np(x + 1, x + 2, { noRel: true, noCoord: true });
        if (nAn && nAn.ja) { const pj = { in: 'では', to: 'に', from: 'から', at: 'では', for: 'にとって' }[key]; const pa = { in: 'での', to: 'への', from: 'からの', at: 'での', for: 'にとっての' }[key]; return { ja: '別の' + nAn.ja + pj, adn: '別の' + nAn.ja + pa, kind: 'other', end: j + 1, prep: key, obj: Object.assign({}, nAn, { ja: '別の' + nAn.ja }) }; }
        fail(mAn);
        break;
      }
    }
    if (key === 'within' && !idi && j + 3 < lim) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
