import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""        else if (xb + 2 === lim && /^(?:yesterday|before|once)$/.test(T[xb + 1].w || '')) tj = ({ yesterday: '昨日', before: '以前', once: 'かつて' })[T[xb + 1].w];
        if (tj) {
          const sjT = subject(i, xb);
          if (sjT && sjT.end === xb) return sjT.pron && (sjT.pron === 'it' || (mainSj && samePerson(mainSj.pron, sjT.pron))) ? tj : tj + 'の' + sjT.ja;
        }""",
    """        else if (xb + 2 === lim && /^(?:yesterday|before|once)$/.test(T[xb + 1].w || '')) tj = ({ yesterday: '昨日', before: '以前', once: 'かつて' })[T[xb + 1].w];
        else if (xb + 3 === lim && isW(T[xb + 1], 'in') && T[xb + 2].k === 'num' && /^1[0-9]{3}$|^20[0-9]{2}$/.test(T[xb + 2].w || '')) tj = T[xb + 2].w + '年';   // than it was in 1990 → 1990年より
        if (tj) {
          const sjT = subject(i, xb);
          // 主節と同じもの（it / they / 同じ人）なら 時 だけ: Prices are higher than they were last year → 昨年より
          if (sjT && sjT.end === xb) return sjT.pron && (/^(?:it|they|those|that|these|this)$/.test(sjT.pron) || !mainSj || samePerson(mainSj.pron, sjT.pron)) ? tj : tj + 'の' + sjT.ja;
        }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
