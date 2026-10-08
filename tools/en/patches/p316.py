import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# right here / right over there / right in front of → 強めの right は落とす / right after → just after
rep(""".replace(/\\b([Rr])ight now\\b/g, (m0, r0) => (r0 === 'R' ? 'Rightnowadv' : 'rightnowadv'))""",
    """.replace(/\\b([Rr])ight now\\b/g, (m0, r0) => (r0 === 'R' ? 'Rightnowadv' : 'rightnowadv')).replace(/\\bright (after|before)\\b/g, 'just $1').replace(/\\bright (?=(?:here|there|over there|in front of|behind|next to|on time|in the middle|beside|across from|under|above|outside|inside)\\b)/g, '')""")

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    ja = ja.replace(/ちょうど([^、。はがを]{1,10}?)の後に/, '$1の直後に').replace(/ちょうど([^、。はがを]{1,10}?)の前に/, '$1の直前に').replace(/時間どおりに(いる|いた)(?=。|$)/, (m0, a0) => '時間どおりだ' + (a0 === 'いた' ? '' : '')).replace(/すぐに来ている(?=。|$)/, 'すぐに行く');   // right after the game → 試合の直後に / We're right on time → 時間どおりだ / I'm coming right away → すぐに行く
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
