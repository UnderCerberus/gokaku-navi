import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He explained what I would be doing / She told me where we would be staying → 何をすることになるか・どこに滞在するか（節の中の would be -ing は過去から見た未来。「しているか」にしない）
rep("""    if (vg.prog) { p = noDouble(p); name('progressive'); }""",
    """    if (vg.prog && vg.modal === 'would' && o.sub && !vg.perfect && !vg.passive && verbal(p) && !T.slice(vg.idx).some((x) => x.k === 'w' && /^(?:now|currently|still)$/.test(x.w))) vg = Object.assign({}, vg, { prog: false });   // what I would be doing → 何をすることになるか
    if (vg.prog) { p = noDouble(p); name('progressive'); }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
