import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# at prices low enough to compete → 競争できるほど低い価格で / a box big enough to hold all the books → すべての本を入れるほど大きい箱
# （名詞 + 形容詞 + enough + to do は後置修飾。「価格で…十分な量を低く」にしない）
rep("""      // a box full of toys / a country rich in natural resources""",
    """      if (!node.pron && T[j] && T[j].k === 'w' && !!adjC(T[j]) && !nounC(T[j]) && isW(T[j + 1], 'enough') && isW(T[j + 2], 'to') && j + 3 < lim && T[j + 3].k === 'w' && !!vc(T[j + 3], ['base'])) {
        const mEn = mark();
        const aEn = adjC(T[j]);
        const iEn = aEn && aEn.e ? vpNonfin(j + 3, lim, 'base', {}) : null;
        if (iEn && verbal(iEn.pred)) { pick(j, aEn.e); node = Object.assign({}, node, { ja: vpJoin(iEn, 'dict') + 'ほど' + en.jp.adj(aEn.e.ja).attr + node.ja, end: iEn.end }); continue; }
        fail(mEn);
      }
      // a box full of toys / a country rich in natural resources""")

# compete with those grown outdoors → 屋外で育てられたもの（those + 分詞の後置修飾。前の名詞が物なら「もの」）
rep("""    if (form && (!node.pron || (/^(?:someone|somebody|anyone|anybody|everyone|everybody|nobody)$/.test(node.pron) && form === 'ing'))""",
    """    if (form && (!node.pron || node.pron === 'those' || (/^(?:someone|somebody|anyone|anybody|everyone|everybody|nobody)$/.test(node.pron) && form === 'ing'))""")
rep("""const hJa = /^(?:picture|pictures)$/.test(node.head || '') && /撮(?:る|った|っていた|っている|ってきた)$/.test(str) ? headJa.replace(/絵$/, '写真') : headJa;""",
    """let hJa = /^(?:picture|pictures)$/.test(node.head || '') && /撮(?:る|った|っていた|っている|ってきた)$/.test(str) ? headJa.replace(/絵$/, '写真') : headJa;
      if (node.pron === 'those' && nm === 'participle-mod' && hJa === '人々') { for (let x = node.end - 2; x >= 0; x--) { const cTh = T[x].k === 'w' && /s$/.test(T[x].w) && DET[T[x].w] === undefined && !PRON[T[x].w] ? cand(T[x], '名', ['pl']) : null; if (cTh && cTh.e) { if (!isPerson(cTh) && !PERSONS[cTh.lemma] && !ANIMAL_N.test(T[x].w)) hJa = 'もの'; break; } } }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
