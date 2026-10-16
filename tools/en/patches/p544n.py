import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# words they are likely to forget → 彼らが忘れそうな語（接触節の主語の they は直前の先行詞を受けない。物の複数名詞 + they + 動詞なら人の they）
rep("""  function pluralAntecedent(i) {
    if (theirAnimal(i) >= 0) return 'inan';   // products made from their skins → それらの皮（動物）""",
    """  function pluralAntecedent(i) {
    if (theirAnimal(i) >= 0) return 'inan';   // products made from their skins → それらの皮（動物）
    if (T[i].w === 'they' && i > 1 && T[i - 1].k === 'w' && DET[T[i - 1].w] === undefined && !PRON[T[i - 1].w] && /s$/.test(T[i - 1].w) && !!cand(T[i - 1], '名', ['pl']) && !vc(T[i - 1], ['past', 'base']) &&
      T[i + 1] && T[i + 1].k === 'w' && (!!BE[T[i + 1].w] || !!MODAL[T[i + 1].w] || !!HAVE[T[i + 1].w] || !!DO[T[i + 1].w] || !!vc(T[i + 1], ['past', 'base']))) return 'an';""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
