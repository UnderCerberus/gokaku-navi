import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    if (FIXED_SENT[key]) return { ok: true, ja: FIXED_SENT[key] + (q ? '。' : '。'), sp: '', names: ['fixed'], sel: {}, unknown: [], idioms: [] };""",
    """    if (key === 'hello' && q) return { ok: true, ja: 'もしもし。', sp: '', names: ['fixed'], sel: {}, unknown: [], idioms: [] };   // Hello?（電話の第一声）→ もしもし
    if (FIXED_SENT[key]) return { ok: true, ja: FIXED_SENT[key] + (q ? '。' : '。'), sp: '', names: ['fixed'], sel: {}, unknown: [], idioms: [] };""")

rep("""    if (b === 1 && isW(T[0], 'hello') && tokens[1] && isP(tokens[1], '?')) return { ok: true, ja: 'もしもし。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };   // Hello? → もしもし
""", "")

rep("""        return { ok: true, ja: (sMd ? sMd.ja + 'は' : '') + cMd.out({ form: 'attr', part: 'が' }).replace(/だ$/, 'である') + 'ことを確かめた。',""",
    """        return { ok: true, ja: (sMd ? sMd.ja + 'は' : '') + cMd.out({ form: 'attr', part: 'が', past: false }).replace(/だ$/, 'である') + 'ことを確かめた。',""")

rep("""ja = ja.replace(/(?:1分間|一瞬|1秒間|少しの間)(?:あなたと)?(話|待|来|借|見|使|座|い)/, (m0, a0) => 'ちょっと' + (a0 === '話' ? 'お話し' : a0)).replace(/ちょっとお話して/, 'ちょっとお話しして');""",
    """ja = ja.replace(/(?:1分間|一瞬|1秒間|少しの間)/, 'ちょっと').replace(/ちょっと(?:あなたと)?話(し)?/, 'ちょっとお話し');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
