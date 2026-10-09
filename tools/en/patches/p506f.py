import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# how much she had depended on her family / how much she had taken … for granted（目的語の空所がない節 → how much は程度の副詞: どれほど）
rep("""    // how simple ideas from science can become a tool: how + 形容詞 + 名詞 … が節にならないとき、how（どのように）だけを疑問詞にして読み直す""",
    """    if ((!cl2 || !gap.used) && t.w === 'how' && isW(T[j + 1], 'much') && wh.type === 'np' && wh.end === j + 2) {
      fail(m);
      gap = { type: 'adv', ja: 'どれほど', used: false };
      cl2 = clause(j + 2, lim, { gap: gap, sub: true });
    }
    // how simple ideas from science can become a tool: how + 形容詞 + 名詞 … が節にならないとき、how（どのように）だけを疑問詞にして読み直す""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
