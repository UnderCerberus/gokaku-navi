import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Good point, so let's ask everyone … / So let's ask everyone → いい指摘だね。それなら、みんなに…頼みましょう（会話の応答・so + 命令文）
rep("""      // For more information, please visit our website. / In case of fire, use the stairs.（前置きの句 + コンマ + 命令文）""",
    """      if (!node && !q && b > 2) {
        let kG = 0, leadG = '';
        for (let len = 3; len >= 2 && !kG; len--) { const keyG = phraseKey(0, len, b); if (keyG && LEAD2[keyG] && isP(T[len], ',')) { kG = len + 1; leadG = LEAD2[keyG]; } }
        if (isW(T[kG], 'so') && isW(T[kG + 1], 'let')) { leadG += (leadG && !/。$/.test(leadG) ? '、' : '') + 'それなら、'; kG++; }
        if (kG > 0 && kG < b) {
          reset(tokens);
          const imG = imperative(kG, b);
          if (imG) { const outG = imG.out; const lg = /[。、]$/.test(leadG) ? leadG : leadG + '、'; node = Object.assign({}, imG, { out: (x) => lg + outG(x) }); }
        }
      }
      // For more information, please visit our website. / In case of fire, use the stairs.（前置きの句 + コンマ + 命令文）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
