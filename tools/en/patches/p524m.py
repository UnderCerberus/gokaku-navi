import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# any of the N（否定の目的語）→ どの N も / any of the students → 生徒たちの誰も（どれか を読まなかった にしない）
rep("""          return { ja: inner2.ja + suf, end: inner2.end, head: inner2.head, an: inner2.an, neg: ng, bare: ng, qof: suf, pl: plQ };""",
    """          return { ja: inner2.ja + suf, end: inner2.end, head: inner2.head, an: inner2.an, neg: ng, bare: ng, qof: suf, pl: plQ, anyIn: t.w === 'any' ? inner2.ja : undefined };""")

rep("""    if (n.notOnlyB && particle && !/^(?:を|が|は)$/.test(particle)) return n.notOnlyA + 'だけでなく' + n.notOnlyB + particle + 'も';
    if (n.bare) return n.ja;""",
    """    if (n.notOnlyB && particle && !/^(?:を|が|は)$/.test(particle)) return n.notOnlyA + 'だけでなく' + n.notOnlyB + particle + 'も';
    if (n.anyIn && (st.neg || st.vgNeg)) { const pAn = /^(?:に|と|から|で|について)$/.test(particle || '') ? particle : ''; return n.an ? n.anyIn + 'の誰' + pAn + 'も' : (/^(?:これら|それら|あれら|この|その|あの)|の/.test(n.anyIn) ? n.anyIn + 'のどれ' + pAn + 'も' : 'どの' + n.anyIn + pAn + 'も'); }   // could hardly see any of the paintings → ほとんどどの絵画も見えなかった
    if (n.bare) return n.ja;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
