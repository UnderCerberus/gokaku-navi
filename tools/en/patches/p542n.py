import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Before our first tour, we spent two weekends … → 最初のツアーの前に、（会議・ツアー・試合などの出来事の before は「〜の前に」。時代の「〜以前は」にしない）
rep("""!/^(?:noon|dawn|midnight|sunrise|sunset|dinner|lunch|breakfast|school|class|bed|work|then|now|today|tomorrow|yesterday)$/.test(pp.obj.head || '')) pp.ja = pp.obj.ja + '以前は';""",
    """!/^(?:noon|dawn|midnight|sunrise|sunset|dinner|lunch|breakfast|school|class|bed|work|then|now|today|tomorrow|yesterday|meeting|meetings|tour|tours|trip|trips|game|games|match|matches|test|tests|exam|exams|examination|party|parties|concert|concerts|lesson|lessons|speech|speeches|contest|contests|interview|interviews|wedding|ceremony|race|races|flight|flights|departure|visit|visits|performance|performances|presentation|presentations|festival|festivals|show|competition|event|events|trip|journey|game|surgery|operation|start|beginning|end|holiday|holidays|vacation)$/.test(pp.obj.head || '')) pp.ja = pp.obj.ja + '以前は';""")

# The tour went smoothly / Not every tour has gone perfectly → 順調に進んだ・完全にうまくいった（物事が主語の go + smoothly / well / perfectly / badly は「進む・いく」。「なめらかに行った」にしない）
rep("""    if (vg.lemma === 'remember' && vg.past && !vg.perfect""",
    """    if (vg.lemma === 'go' && !vg.passive && sj && !anim && !st.other.some((x) => /(?:に|へ|まで)$/.test(x)) && st.manner.some((x) => /^(?:ずっと|はるかに|より|もっと|とても)*(?:なめらかに|順調に|完全に|完璧に|うまく|上手に|よく|悪く|ひどく|計画通りに|予定通りに)$/.test(x))) {
      const degGo = st.manner.some((y) => /^(?:ずっと|はるかに)$/.test(y));
      st.manner = st.manner.map((x) => x.replace(/^ずっともっと/, 'ずっと').replace(/^もっと/, degGo ? '' : 'もっと').replace(/なめらかに$/, '順調に').replace(/^完全に$/, '完璧に'));
      p = P(st.manner.some((x) => /順調に$/.test(x)) ? '進む' : 'いく', 'v5');
    }
    if (vg.lemma === 'remember' && vg.past && !vg.perfect""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
