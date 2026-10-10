import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He may know the answer → 知っているかもしれない / we may not remember anything → 何も覚えていないかもしれない
# （推量の may / might では状態の語義（知っている・覚えている・持っている など）を動作の形に戻さない。知るかもしれない は「知ることになるかもしれない」）
rep("""    if ((vg.nonfin || (vg.modal && vg.modal !== 'usedto') || vg.semi) && UNSTATIVE[core.s]) core = P(UNSTATIVE[core.s]);""",
    """    const mayStative = /^(?:may|might)$/.test(vg.modal || '') && !vg.perfect && !vg.nonfin && !vg.semi && !vg.passive && /^(?:知っている|覚えている|持っている|信じている|似ている|属している)$/.test(core.s);
    if ((vg.nonfin || (vg.modal && vg.modal !== 'usedto') || vg.semi) && UNSTATIVE[core.s] && !mayStative) core = P(UNSTATIVE[core.s]);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
