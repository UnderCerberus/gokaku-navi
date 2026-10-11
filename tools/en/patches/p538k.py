import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# pupils … scored lower on reading tests than pupils at a quieter school → 読解テストで、より静かな学校の生徒より低く得点した
# （比較級の副詞 + 前置詞句 + than は下の「比較級の副詞 + 前置詞句 + than」で読む。「もっと低く」で先に切らない）
rep("""    if (vg && t.k === 'w' && /^(?:louder|quieter|slower|clearer|closer|higher|lower|nearer|deeper|wider|softer)$/.test(t.w) && (j + 1 >= lim || T[j + 1].k === 'p' || (T[j + 1].k === 'w' && (!!PREP[T[j + 1].w] || !!SUB[T[j + 1].w] || /^(?:so|and|or|but|please)$/.test(T[j + 1].w))))) {""",
    """    if (vg && t.k === 'w' && /^(?:louder|quieter|slower|clearer|closer|higher|lower|nearer|deeper|wider|softer)$/.test(t.w) && (j + 1 >= lim || T[j + 1].k === 'p' || (T[j + 1].k === 'w' && (!!PREP[T[j + 1].w] || !!SUB[T[j + 1].w] || /^(?:so|and|or|but|please)$/.test(T[j + 1].w)))) &&
      !(j + 1 < lim && T[j + 1].k === 'w' && !!PREP[T[j + 1].w] && T.slice(j + 2, lim).some((x) => isW(x, 'than')))) {""")

# Pupils at a school located near a busy airport scored lower … → located は分詞の後置修飾（located + 前置詞 + 後ろの過去形の動詞なら、主節の動詞の候補を後回しにする）
rep("""      const dfr = !!tp && tp.k === 'w' && /^(?:kept|held|placed|put|raised|fed|given|trained|brought|found|made|sold|built|grown|caught|collected|stored|shown|taken|chosen|hidden|seen|left)$/.test(tp.w)""",
    """      const dfr = !!tp && tp.k === 'w' && /^(?:kept|held|placed|put|raised|fed|given|trained|brought|found|made|sold|built|grown|caught|collected|stored|shown|taken|chosen|hidden|seen|left|located|situated|based)$/.test(tp.w)""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
