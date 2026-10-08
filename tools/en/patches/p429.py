import io
p = r'C:\Claude\gokaku-navi\js\data\idioms.js'
s = io.open(p, encoding='utf-8').read()
old = "    ['attribute A to B', 'AをBのせいにする', 3],"
assert s.count(old) == 1
s = s.replace(old, "    ['attribute A to B', 'AをBによるものだと考える; AをBのせいにする', 3],")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)

p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# many consumers remain hesitant to buy them → まだ…をためらっている（remain + 形容詞 + to は be still + 形容詞 + to として読む）
rep("""    // 呼びかけ: Ken, come here.""",
    """    if (b > 4 && !tokens.__remAdj) {
      const kRm = T.findIndex((x, q) => q >= 1 && /^(?:remain|remains|remained)$/.test(x.w || '') && T[q + 1] && T[q + 1].k === 'w' && /^(?:hesitant|reluctant|unwilling|willing|eager|ready|unable|able|afraid|likely|unlikely|determined|committed|free|open|skeptical|cautious)$/.test(T[q + 1].w || '') && isW(T[q + 2], 'to'));
      if (kRm > 0) {
        const wRm = T[kRm].w === 'remained' ? (T[kRm - 1] && (T[kRm - 1].w === 'i' || T[kRm - 1].w === 'he' || T[kRm - 1].w === 'she' || T[kRm - 1].w === 'it' || !/s$/.test(T[kRm - 1].w || '')) ? 'was' : 'were') : (T[kRm].w === 'remains' ? 'is' : 'are');
        const tRm = tokens.slice(0, kRm).concat([Object.assign({}, tokens[kRm], { w: wRm, s: wRm, raw: wRm }), Object.assign({}, tokens[kRm], { w: 'still', s: 'still', raw: 'still' })]).concat(tokens.slice(kRm + 1)).map((x, k) => Object.assign({}, x, { i: k }));
        tRm.__remAdj = true;
        const rRm = translate1(tRm);
        reset(tokens);
        if (rRm && rRm.ok) return rRm;
      }
    }
    // 呼びかけ: Ken, come here.""")

rep("""    ja = ja.replace(/世界の(多くの|一部の|さまざまな|ほかの|他の|あらゆる)部分/g, '世界の$1地域');""",
    """    ja = ja.replace(/世界の(多くの|一部の|さまざまな|ほかの|他の|あらゆる)部分/g, '世界の$1地域');
    ja = ja.replace(/危険を(下げ|減ら|高め|上げ|減少させ|増加させ)/g, 'リスクを$1').replace(/ためにほとんどしない(だろう)?/g, (m0, a0) => 'のにほとんど役立たない' + (a0 || '')).replace(/遠く離れた仕事/g, 'リモートワーク');   // lower the risk of dementia → 認知症のリスクを下げる / will do little to reduce inequality → 不平等を減らすのにほとんど役立たないだろう""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
