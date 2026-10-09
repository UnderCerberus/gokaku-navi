import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# , with NP V-ing … を後ろの文にするとき、述語は文末の形（必要だ）で、時制は主節に合わせる（rose …, with costs increasing → 増えた）
rep("""          const wJa = nWi.ja + 'は' + vpJoin(vWi, 'dict');
          const rWi = translate1(tWi);
          reset(tokens);
          if (rWi && rWi.ok) return Object.assign({}, rWi, { ja: rWi.ja.replace(/。$/, '') + '。' + wJa + '。' });""",
    """          const rWi = translate1(tWi);
          reset(tokens);
          if (rWi && rWi.ok) {
            const wJa = nWi.ja + 'は' + vWi.parts.join('') + vWi.pred.end({ neg: !!vWi.neg, past: /た。?$/.test(rWi.ja) });
            return Object.assign({}, rWi, { ja: rWi.ja.replace(/。$/, '') + '。' + wJa + '。' });
          }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
