import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the less we may be able to recall it → ますます思い出せなくなるかもしれない（助動詞の部分を外してから「〜なくなる」にする）
rep("""      const p2 = c2.pred.aux('neg');
      nodeL.out = () => first() + 'ますます' + h2.pre + (c2.parts || []).join('') + p2.plain().replace(/ない$/, 'なくなる');""",
    """      const mdL = /(かもしれない|だろう|に違いない|はずだ)$/.exec(c2.pred.plain());
      const p2 = (mdL ? P(c2.pred.plain().slice(0, -mdL[1].length)) : c2.pred).aux('neg');
      nodeL.out = () => first() + 'ますます' + h2.pre + (c2.parts || []).join('') + p2.plain().replace(/ない$/, 'なくなる') + (mdL ? mdL[1] : '');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
