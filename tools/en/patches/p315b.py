import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    const key = T.slice(0, b).filter((t) => t.k !== 'p').map((t) => t.w).join(' ');
    if (FIXED_SENT[key]) return""",
    """    const key = T.slice(0, b).filter((t) => t.k !== 'p').map((t) => (t.w === 'rightnowadv' ? 'right now' : t.w)).join(' ');
    if (FIXED_SENT[key]) return""")
rep("""      const provAt = (k) => { const kk = T.slice(k, b).filter((t) => t.k !== 'p').map((t) => t.w).join(' ');""",
    """      const provAt = (k) => { const kk = T.slice(k, b).filter((t) => t.k !== 'p').map((t) => (t.w === 'rightnowadv' ? 'right now' : t.w)).join(' ');""")
rep("""      if (seq(eDn, ['right', 'now'])) { st.time.push('今'); eDn += 2; }""",
    """      if (seq(eDn, ['right', 'now'])) { st.time.push('今'); eDn += 2; } else if (isW(T[eDn], 'rightnowadv')) { st.time.push('今'); eDn += 1; }""")
rep("""ja = ja.replace(/(?:今)?外に確かめられている/g, (m0) => (/^今/.test(m0) ? '今' : '') + '貸し出し中だ')""",
    """ja = ja.replace(/(?:今)?外に確かめられている/g, (m0) => (/^今/.test(m0) ? '今' : '') + '貸し出し中だ').replace(/(?:今)?調べられている(?=。|$)/, (m0) => (tokens.some((x) => x.w === 'checked') && tokens.some((x) => x.w === 'out') ? (/^今/.test(m0) ? '今' : '') + '貸し出し中だ' : m0))""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
