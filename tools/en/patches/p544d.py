import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# A man named Tom decided to study it → トムという名前の男性はそれを研究することに決めた
# （受け身で to 不定詞をとらない動詞の過去分詞 + to は後置修飾にしない。「勉強するために決められたトムを名づけた」にしない）
rep("""appeared|disappeared|remained|slept|laughed|cried|smiled|went|came|fell|rose|emerged|belonged|consisted|mattered|seemed|looked|barked|jumped|ran|walked|swam|flew|lived|stayed|waited|worked|played|agreed|succeeded|failed)$/.test(t.w || ''))) {""",
    """appeared|disappeared|remained|slept|laughed|cried|smiled|went|came|fell|rose|emerged|belonged|consisted|mattered|seemed|looked|barked|jumped|ran|walked|swam|flew|lived|stayed|waited|worked|played|agreed|succeeded|failed)$/.test(t.w || '')) && !(form === 'pp' && isW(T[j + 1], 'to') && /^(?:decided|hoped|tried|attempted|managed|wanted|wished|refused|pretended|longed|struggled|vowed|volunteered|threatened|dared|tended|happened|began|started|continued|learned|learnt|promised|offered|planned)$/.test(t.w || '') && j + 2 < e && T[j + 2].k === 'w' && !!vc(T[j + 2], ['base']))) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
