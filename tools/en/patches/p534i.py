import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# they could be allowed to take them out → 取り出すことを許されてもよい（過去の目印のない could + be allowed to は提案。「許されることができた」にしない）
rep("""      case 'could':
""",
    """      case 'could':
        if (/^(?:allow|permit)$/.test(vg.lemma) && !neg && !vg.perfect && !o.subjunctive && /許される$/.test(p.plain()) && !T.some((x, q) => q !== vg.idx && x.k === 'w' && (/^(?:yesterday|ago|then|once)$/.test(x.w) || (!!vc(x, ['past']) && !vc(x, ['base', '3sg', 'pp']) && !MODAL[x.w])))) { p = P(p.plain().replace(/許される$/, '許されてもよい'), 'i'); past = false; break; }
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
