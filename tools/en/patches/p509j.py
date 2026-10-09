import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# something to be ashamed of → 恥ずべきこと（前置詞が後ろに残る不定詞で to be + 形容詞 + 前置詞 も読む）
rep("""    if (w === 'to' && j + 2 < e && vc(T[j + 1], ['base']) && !node.time && !node.dur && !node.clause) {
      let pS = -1;""",
    """    if (w === 'to' && j + 2 < e && (vc(T[j + 1], ['base']) || isW(T[j + 1], 'be')) && !node.time && !node.dur && !node.clause) {
      let pS = -1;""")
rep("""          const sPs = (prepPs === 'with' && anPs ? '一緒に' : '') + vpJoin(infPs, 'dict').replace(/^生きる$/, '住む').replace(/着ている$/, '着る') + (prepPs === 'with' && !anPs && !node.pron ? 'ための' : '');""",
    """          const sPs = (prepPs === 'with' && anPs ? '一緒に' : '') + vpJoin(infPs, 'dict').replace(/^生きる$/, '住む').replace(/着ている$/, '着る').replace(/^恥じている$/, '恥ずべき').replace(/^誇りに思っている$/, '誇るべき') + (prepPs === 'with' && !anPs && !node.pron ? 'ための' : '');
          if (node.pron && /^(?:something|anything)$/.test(node.pron) && /べき$/.test(sPs)) { name('inf-adj'); return Object.assign({}, node, { ja: sPs + 'こと', end: pS + 1, bare: false, infS: sPs }); }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
