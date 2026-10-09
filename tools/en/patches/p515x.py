import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# was able to finish the work and go home → 仕事を終えて、早く帰宅できた（過去の 1 回の出来事は 〜たり〜たり でなく て形でつなぐ）
rep("""      if (mw === 'can') {   // 〜たり〜たりできる
""", """      if (mw === 'can' && ablePast && (!x.form || x.form === 'end') && rest.every((r) => r.pred && verbal(r.pred))) {
        const lR = rest[rest.length - 1];
        let sA = c0.out({ form: 'te', part: x.part, omit: x.omit }) + '、';
        rest.slice(0, -1).forEach((r) => { sA += r.out({ form: 'te', omit: sp }) + '、'; });
        return sA + (lR.parts || []).join('') + lR.pred.aux('can').end({ past: true, polite: !!x.polite });
      }
      if (mw === 'can') {   // 〜たり〜たりできる
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
