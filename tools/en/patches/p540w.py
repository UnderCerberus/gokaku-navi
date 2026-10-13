import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# You could try a different approach → 違う取り組み方を試してみることもできる / A person who hopes to exercise regularly could begin by doing … → …から始めることもできる
# （過去の手がかりのない文の could（you・一般の人が主語、文のほかの部分が現在）は提案・可能性「〜こともできる」。「試してみられた」「始められた」にしない）
rep("""      case 'could':
""",
    """      case 'could':
        if (!vg.perfect && !neg && !vg.passive && !o.subjunctive && !o.wish && !o.q && !o.sub && verbal(p) && !/^(?:see|hear|feel|smell|taste|understand|know|remember|imagine|tell|find)$/.test(vg.lemma) && !/(?:見える|聞こえる|分かる|できる)$/.test(p.plain()) && sj && (sj.pron === 'you' || /^(?:someone|anyone|everyone|somebody|anybody)$/.test(sj.pron || '') || (!sj.pron && !!sj.an && !sj.proper && !sj.pl)) &&
          (sj.pron === 'you' || T.some((x, q) => q !== vg.idx && x.k === 'w' && (/^(?:is|are|am|do|does|can|will)$/.test(x.w) || (!!vc(x, ['3sg']) && (!nounC(x) || (T[q - 1] && /^(?:who|that|which|he|she|it)$/.test(T[q - 1].w || ''))))))) &&
          !T.some((x, q) => q !== vg.idx && x.k === 'w' && (/^(?:was|were|did|had|yesterday|ago|then|when|once|last|before)$/.test(x.w) || (!!vc(x, ['past']) && !vc(x, ['base', '3sg']) && !MODAL[x.w] && !(T[q - 1] && T[q - 1].k === 'w' && (!!BE[T[q - 1].w] || !!HAVE[T[q - 1].w] || /^(?:been|being|get|got|feel|feels|seem|seems|look|looks|become|becomes)$/.test(T[q - 1].w))))))) { p = P(p.plain() + 'こともできる', 'v1'); past = false; break; }
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
