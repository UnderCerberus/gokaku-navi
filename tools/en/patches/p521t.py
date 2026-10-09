import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He loves her more than anything → 何よりも彼女を愛している / I like Tom more than him → 彼よりもトムが好きだ（好き・大切の動詞の more than は比べる相手。以上 は数量だけ）
rep("""    if (!obj) return fail(m);
    if (idi) {
      useIdiom(idi.it);
      const ja2 = idi.ja.replace('〜', obj.ja);""",
    """    if (!obj) return fail(m);
    if (idi && idi.toks.join(' ') === 'more than' && obj.end > j + 1 && /^(?:anything|everything|anyone|anybody|everyone|everybody)$/.test(T[j].w || '') && isW(T[j + 1], 'to')) { const mMt = mark(); const o1Mt = np(j, j + 1, {}); if (o1Mt) obj = o1Mt; else fail(mMt); }   // wanted more than anything to become … → 何よりも
    if (idi && idi.toks.join(' ') === 'more than' && !obj.num && !obj.dur && !obj.frac && !obj.qof) {
      const wMt = obj.end === j + 1 ? T[j].w : '';
      const anyThMt = /^(?:anything|everything)$/.test(wMt), anyOneMt = /^(?:anyone|anybody|everyone|everybody)$/.test(wMt);
      const degMt = T.slice(Math.max(0, i - 5), i).some((x) => x.k === 'w' && /^(?:like|likes|liked|love|loves|loved|hate|hates|hated|prefer|prefers|preferred|value|values|valued|miss|misses|missed|enjoy|enjoys|enjoyed|trust|trusts|trusted|respect|respects|respected|fear|fears|feared|admire|admires|admired|appreciate|appreciates|appreciated|treasure|treasures|treasured|cherish|cherishes|cherished|want|wants|wanted|need|needs|needed|care|cares|cared)$/.test(x.w));
      if (anyThMt || anyOneMt || (degMt && (obj.pron || obj.an || !!PN_JA[obj.ja]))) {
        const ja3 = anyThMt ? '何よりも' : (anyOneMt ? '誰よりも' : obj.ja + 'よりも');
        return { ja: ja3, adn: adnOf(ja3), end: obj.end, kind: 'other', prep: 'more than', obj: obj };
      }
    }
    if (idi) {
      useIdiom(idi.it);
      const ja2 = idi.ja.replace('〜', obj.ja);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
