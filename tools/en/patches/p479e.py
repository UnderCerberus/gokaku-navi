import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# contributed to major social changes, including the Reformation（文末まで続く , including … も名詞にかける → 宗教改革を含む大きな社会変化）
rep("""        let e3 = -1;
        for (let x = j + 3; x < lim; x++) { if (isP(T[x], ',')) { e3 = x; break; } }
        if (e3 > 0) {
          const mIc = mark();
          const nIc = np(j + 2, e3, { noRel: o.noRel });
          if (nIc && nIc.end === e3) { node = Object.assign({}, node, { ja: (nIc.coord && (nIc.ja.match(/と/g) || []).length === 1 ? nIc.ja.replace('と', 'や') : nIc.ja) + 'を含む' + node.ja, end: e3 + 1 }); continue; }
          fail(mIc);
        }""", """        let e3 = -1;
        for (let x = j + 3; x < lim; x++) { if (isP(T[x], ',')) { e3 = x; break; } }
        const lastIc = e3 < 0 && (lim >= T.length || T[lim].k === 'p');   // 文末までの including …
        if (e3 > 0 || lastIc) {
          const eIc = e3 > 0 ? e3 : lim;
          const mIc = mark();
          const nIc = np(j + 2, eIc, { noRel: o.noRel });
          if (nIc && nIc.end === eIc) { node = Object.assign({}, node, { ja: (nIc.coord && (nIc.ja.match(/と/g) || []).length === 1 ? nIc.ja.replace('と', 'や') : nIc.ja) + 'を含む' + node.ja, end: e3 > 0 ? e3 + 1 : eIc }); continue; }
          fail(mIc);
        }""")

rep("""    ja = ja.replace(/^かつてないほど多くの([^、。をがは]{1,10}?)は/, 'かつてないほど多くの$1が');""",
    """    ja = ja.replace(/^かつてないほど多くの([^、。をがは]{1,10}?)は/, 'かつてないほど多くの$1が');
    ja = ja.replace(/への(?:その|それらの)(同様の|大きな|大きい|直接の|悪い|良い)?影響/g, 'への$1影響');   // its impact on the environment → 環境への影響""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
