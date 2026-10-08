import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Can you say that again? → もう一度言ってくれますか（依頼の can you に say を加える）
rep("""/^(?:help|tell|show|give|lend|pass|bring|open|close|shut|turn|wait|call|explain|repeat|send|take|hold|carry|check|sign|fill|move|teach|keep|buy|get|find|pick|wake|lower|stop|come|clean|wash|fix|answer|drive)$/.test(T[s0 + 1].w)""",
    """/^(?:help|tell|show|give|lend|pass|bring|open|close|shut|turn|wait|call|explain|repeat|send|take|hold|carry|check|sign|fill|move|teach|keep|buy|get|find|pick|wake|lower|stop|come|clean|wash|fix|answer|drive|say|speak|write|spell|read)$/.test(T[s0 + 1].w)""")

# How do you say 'kaban' in English? → 「kaban」は英語で何と言いますか
rep("""    // Hi, Ken. → こんにちは、ケン""",
    """    // How do you say 'kaban' in English? → 「kaban」は英語で何と言いますか
    if (seq(0, ['how', 'do', 'you', 'say']) && b >= 7 && isW(T[b - 2], 'in') && T[b - 1].k === 'w' && PN[T[b - 1].w] && /語$/.test(PN[T[b - 1].w])) {
      const wsS = T.slice(4, b - 2).filter((x) => x.k === 'w' || x.k === 'num');
      if (wsS.length >= 1 && wsS.length <= 4) {
        const nS = wsS.length === 1 || T.slice(4, b - 2).some((x) => x.k === 'p' && /['"‘’“”]/.test(x.s || x.w || '')) ? null : (() => { const r0 = np(4, b - 2, {}); return r0 && r0.end === b - 2 ? r0 : null; })();
        const qS = nS ? nS.ja : wsS.map((x) => x.s || x.w).join(' ');
        return { ok: true, ja: '「' + qS + '」は' + PN[T[b - 1].w] + 'で何と言いますか。', sp: '', names: ['question', 'fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      }
    }
    // Hi, Ken. → こんにちは、ケン""")

rep("""    ja = ja.replace(/ということは哀れみだ/g, 'のは残念だ')""",
    """    const clsT = tokens.some((x) => /^(?:board|blackboard|whiteboard)$/.test(x.w || '')) && tokens.some((x) => /^(?:picture|pictures|write|wrote|written|look|read|copy|chalk|teacher|class|answer|answers|sentence|sentences|word|words|name|draw|drew|see|erase|map|diagram)$/.test(x.w || '')) && !tokens.some((x) => /^(?:cutting|ironing|bulletin|notice|surf|diving|chess|game|games|of|members|member|directors|wooden|plank)$/.test(x.w || ''));
    if (clsT) ja = ja.replace(/板の上で([^、。]{1,10}?)を(見|読|写)/, '黒板の$1を$2').replace(/板の上に/g, '黒板に').replace(/板の上の/g, '黒板の').replace(/(^|[^黒白])板(?=に|の|を|で)/g, '$1黒板');   // Look at the picture on the board → 黒板の絵を見なさい
    if (tokens.some((x) => x.w === 'passage') && tokens.some((x) => /^(?:read|reads|reading|aloud|answer|title|according|following|paragraph|paragraphs|writer|author|summary|summarize|main)$/.test(x.w || ''))) ja = ja.replace(/通路/g, '文章');   // Read the passage aloud → 文章を声に出して読みなさい
    if (tokens.some((x) => x.w === 'pass') && tokens.some((x) => x.w === 'back') && tokens.some((x) => /^(?:handout|handouts|papers|sheets|worksheets|copies|tests|these|them|this|it)$/.test(x.w || ''))) ja = ja.replace(/^戻って(.+?)を渡し/, '$1を後ろに回し');   // Pass these handouts back → これらのプリントを後ろに回しなさい
    ja = ja.replace(/([0-9０-９]+)つのグループを作/g, '$1人ずつのグループを作').replace(/(ノート|紙|黒板)の中に(.+?)をコピーし/, '$2を$1に書き写し');   // Make groups of four → 4人ずつのグループを作りなさい / Copy the sentences into your notebook → 文をノートに書き写しなさい
    ja = ja.replace(/ということは哀れみだ/g, 'のは残念だ')""")

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', "time 's up": '時間です', 'any volunteers': 'やってくれる人はいますか', 'who wants to go first': '最初にやりたい人はいますか', 'who wants to try': 'やってみたい人はいますか', 'who knows the answer': '答えがわかる人はいますか', """)

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
