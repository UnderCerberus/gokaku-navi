import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# What makes this novel so popular … → この小説をとても人気のあるものにするのは / The song made her popular → 彼女を人気者にした（人気があるようにする にしない）
rep("""        const advF = f2.kind === 'i' || f2.kind === 'na' ? f2.adv : (f2.kind === 'no' && f2.stem && !ob.an && !ob.pron ? f2.stem + 'のものに' : f2.pred.plain() + 'ように');
""",
    """        let advF = f2.kind === 'i' || f2.kind === 'na' ? f2.adv : (f2.kind === 'no' && f2.stem && !ob.an && !ob.pron ? f2.stem + 'のものに' : f2.pred.plain() + 'ように');
        if (L === 'make' && !(f2.kind === 'i' || f2.kind === 'na' || f2.kind === 'no') && f2.pred && /がある$/.test(f2.pred.plain())) {
          const anObF = !!ob.an || !!(ob.pron && PRON[ob.pron] && PRON[ob.pron].an);
          if (ap2.lemma === 'popular' && anObF) advF = '人気者に';
          else if (!anObF) advF = f2.pred.plain().replace(/がある$/, 'のある') + 'ものに';
        }
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
