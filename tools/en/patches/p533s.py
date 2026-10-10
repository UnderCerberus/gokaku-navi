import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Maybe we could make a video → ビデオを作れるかもしれない / …, because each person could record … → 録音できるので（現在の主節の理由の節）（提案・可能性の could を「できた」にしない）
rep("""      case 'could':
        if (!vg.perfect && !neg && !o.subjunctive && !o.wish && !o.q && verbal(p) && (T.some((x, q) => x.k === 'w' && (/^(?:future|someday|eventually|soon|tomorrow)$/.test(x.w)""",
    """      case 'could':
        if (!vg.perfect && !o.subjunctive && !o.wish && !o.q && verbal(p) && !T.some((x, q) => q !== vg.idx && x.k === 'w' && (/^(?:yesterday|ago|then|last|when)$/.test(x.w) || (!!vc(x, ['past']) && !vc(x, ['base', '3sg', 'pp']) && !MODAL[x.w]))) &&
          (T.slice(0, vg.idx).some((x) => x.k === 'w' && /^(?:maybe|perhaps)$/.test(x.w)) || o.mainPresent)) { p = canP(p); if (!o.mainPresent && !neg) p = P(p.plain() + 'かもしれない', 'i'); past = false; break; }
        if (!vg.perfect && !neg && !o.subjunctive && !o.wish && !o.q && verbal(p) && (T.some((x, q) => x.k === 'w' && (/^(?:future|someday|eventually|soon|tomorrow)$/.test(x.w)""")
rep("""      let sc4 = mn4 ? sentence(j + s2.len, b, { sub: true }) : null;""",
    """      let sc4 = mn4 ? sentence(j + s2.len, b, { sub: true, mainPresent: !mn4.past && !mn4.perfect && /^(?:because|since|as|so that|although|though|even though)$/.test(s2.key) }) : null;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
