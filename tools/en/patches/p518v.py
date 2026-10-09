import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) more time to spend with my family / the days we spent together → 家族と過ごす時間（時の先行詞の spend は 過ごす）
rep("""      if (L === 'give' && /^(?:example|examples|reason|reasons|instance|excuse|excuses)$/.test(gaA)) sense = { particle: 'を', core: '挙げる', tr: true };""",
    """      if (L === 'give' && /^(?:example|examples|reason|reasons|instance|excuse|excuses)$/.test(gaA)) sense = { particle: 'を', core: '挙げる', tr: true };
      else if (L === 'spend' && /^(?:time|day|days|hour|hours|weekend|weekends|evening|evenings|holiday|holidays|vacation|summer|night|nights|week|weeks|year|years|life|childhood|moment|moments)$/.test(gaA) && !T.some((x) => x.k === 'w' && /^(?:money|dollars|yen|budget)$/.test(x.w))) { sense = { particle: 'を', core: '過ごす', tr: true }; st.other = st.other.map((x) => x.replace(/と一緒に$/, 'と')); }   // time to spend with my family → 家族と過ごす時間""")

# 2) remembering her childhood → 子ども時代を思い出しながら（過去の時期を remember する → 思い出す）
rep("""    'make|money fortune|を|稼ぐ',""",
    """    'make|money fortune|を|稼ぐ', 'remember|childhood youth past days school-days|を|思い出す',""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
