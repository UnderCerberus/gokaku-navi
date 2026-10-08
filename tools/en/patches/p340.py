import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It's almost noon. → もうすぐ正午だ / It's almost time for dinner. → もうすぐ夕食の時間だ / It's nearly ten o'clock. → もうすぐ10時だ
rep("""    // Hi, Ken. → こんにちは、ケン""",
    """    // It's almost noon → もうすぐ正午だ / It's almost time for dinner → もうすぐ夕食の時間だ / It's nearly ten o'clock → もうすぐ10時だ
    if (isW(T[0], 'it') && T[1] && /^(?:is|was)$/.test(T[1].w || '') && T[2] && /^(?:almost|nearly|just|already)$/.test(T[2].w || '') && b >= 4) {
      const advIt = ({ almost: 'もうすぐ', nearly: 'もうすぐ', just: 'ちょうど', already: 'もう' })[T[2].w];
      const pastIt = T[1].w === 'was';
      let xIt = null;
      const wIt = T.slice(3, b).filter((x) => x.k !== 'p').map((x) => x.w);
      const nIt = (w) => (/^\\d{1,2}$/.test(w || '') ? Number(w) : NUMW[w]);
      if (wIt.length === 1 && /^(?:noon|midday)$/.test(wIt[0])) xIt = '正午';
      else if (wIt.length === 1 && wIt[0] === 'midnight') xIt = '真夜中';
      else if (wIt.length >= 1 && nIt(wIt[0]) >= 1 && nIt(wIt[0]) <= 12 && (wIt.length === 1 || (wIt.length === 2 && /^o'?clock$/.test(wIt[1])) || (wIt.length === 3 && wIt[1] === 'o' && wIt[2] === 'clock'))) xIt = nIt(wIt[0]) + '時';
      else if (isW(T[3], 'time') && isW(T[4], 'for') && b > 5) { const nTf = np(5, b, {}); if (nTf && nTf.end === b) xIt = nTf.ja + 'の時間'; else reset(tokens); }
      else if (isW(T[3], 'time') && isW(T[4], 'to') && b > 5) { const vTt = vpNonfin(5, b, 'base', {}); if (vTt && vTt.end === b) xIt = vpJoin(vTt, 'dict') + '時間'; else reset(tokens); }
      if (xIt) return { ok: true, ja: advIt + xIt + (pastIt ? 'だった' : 'だ') + '。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
    }
    // Hi, Ken. → こんにちは、ケン""")

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    ja = ja.replace(/^([^、。]{1,10}?)は(学生|子ども|子どもたち|高齢者|会員|大人|小学生|中学生|高校生)にとって自由だ/, '$1は$2なら無料だ').replace(/(学生たち|生徒たち|人々|メンバー|子どもたち|乗客)の残りは/, '残りの$1は');   // The museum is free for students → 博物館は学生なら無料だ / The rest of the students → 残りの学生たちは
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
