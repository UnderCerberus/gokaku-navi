import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) remember + 子ども時代 は 〜ing（思い出しながら）のときだけ 思い出す（I remember my childhood well は 覚えている）
rep("""    'make|money fortune|を|稼ぐ', 'remember|childhood youth past days school-days|を|思い出す',""",
    """    'make|money fortune|を|稼ぐ',""")
rep("""      if (L === 'save' && /^(?:part|half|some|most|much|all|portion|percent)$/.test(oh)""",
    """      if (L === 'remember' && /^(?:childhood|youth|past|days)$/.test(oh) && !vg.passive && T[vg.idx] && /ing$/.test(T[vg.idx].w || '')) sense = { particle: 'を', core: '思い出す', tr: true };   // remembering her childhood → 思い出しながら
      if (L === 'save' && /^(?:part|half|some|most|much|all|portion|percent)$/.test(oh)""")

# 2) time to spend with my family（time は空所なしを先に試すが、spend / waste の目的語になる time は空所で読む）
rep("""      const inf0 = noGap2 || firstN ? vpNonfin(j + 1, e, 'base', {}) : null;""",
    """      const inf0 = (noGap2 && !(node.head === 'time' && /^(?:spend|waste|kill|save|share|enjoy|find)$/.test(T[j + 1].w || ''))) || firstN ? vpNonfin(j + 1, e, 'base', {}) : null;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
