import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Her last class is on the twenty-eighth → 彼女の最後の授業（her + last / next / first + 時の単位でない名詞は所有格。I saw her last week は目的格のまま）
rep("""    const nomNext = !!nx && nx.k !== 'p' && nx.k !== 'pos' && !PRON_ONLY[nx.w] && !(t.w === 'her' && (NO_COMPOUND[nx.w] || /^(?:yesterday|today|tomorrow|tonight|now|then|again|too|also|first|later|soon|already|every|last|next|this|once|twice)$/.test(nx.w))) &&""",
    """    const herOrd = t.w === 'her' && !!nx && /^(?:last|next|first)$/.test(nx.w) && !!T[i + 2] && T[i + 2].k === 'w' && !!nounC(T[i + 2]) && !/^(?:week|weeks|month|months|year|years|night|nights|time|times|summer|winter|spring|autumn|fall|weekend|weekends|morning|evening|afternoon|day|days|sunday|monday|tuesday|wednesday|thursday|friday|saturday|semester|term|season|century|decade|minute|hour)$/.test(T[i + 2].w) && (i === 0 || !(T[i - 1].k === 'w' && !!vc(T[i - 1], ['base', 'past', '3sg']) && !nounC(T[i - 1])));
    const nomNext = !!nx && nx.k !== 'p' && nx.k !== 'pos' && !PRON_ONLY[nx.w] && !(t.w === 'her' && !herOrd && (NO_COMPOUND[nx.w] || /^(?:yesterday|today|tomorrow|tonight|now|then|again|too|also|first|later|soon|already|every|last|next|this|once|twice)$/.test(nx.w))) &&""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
