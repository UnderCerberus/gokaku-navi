import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# After the airport moved to a different location → 空港が別の場所に移転した後（施設・会社の主語 + move to は「移転する」。「動いた」「引っ越した」にしない）
rep("""    if (vg.lemma === 'move' && p.plain() === '動く' && anim && st.other.some((x) => /(?:都市|町|家|国|村""",
    """    if (vg.lemma === 'move' && /^(?:動く|引っ越す)$/.test(p.plain()) && !vg.passive && !o.hasObj && sj && !sj.pron && /(?:^| )(?:airport|airports|school|schools|company|companies|office|offices|factory|factories|store|stores|shop|shops|restaurant|restaurants|hospital|hospitals|museum|museums|library|libraries|station|stations|headquarters|business|businesses|firm|firms|bank|banks|clinic|clinics|university|universities|college|colleges|embassy|zoo|zoos|market|markets|theater|theaters|theatre|studio|studios|church|churches|temple|temples|shrine|shrines|bakery|bakeries|cafe|cafes|hotel|hotels|club|clubs)$/.test(sj.head || '') && st.other.some((x) => /に$/.test(x))) p = P('移転する', 'suru');
    if (vg.lemma === 'move' && p.plain() === '動く' && anim && st.other.some((x) => /(?:都市|町|家|国|村""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
