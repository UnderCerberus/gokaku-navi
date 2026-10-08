import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      if (destM) s = destM + 'への' + (inf.vg.lemma === 'come' ? '来方' : '行き方');   // how to get to the station → 駅への行き方
      else if (t.w === 'how' && wh.end === j + 1) s =""",
    """      if (destM) s = destM + 'への' + (inf.vg.lemma === 'come' ? '来方' : '行き方');   // how to get to the station → 駅への行き方
      else if (t.w === 'how' && wh.end === j + 1 && inf.pred.cls !== 'suru' && /.する$/.test(inf.pred.plain()) && !/(?:でいる|ている|である|になる)$/.test(inf.pred.plain())) s = vpJoin(inf, 'dict') + '方法';   // how to work together with robots → ロボットと協力する方法（「協力し方」にしない）
      else if (t.w === 'how' && wh.end === j + 1) s =""")

rep("""ja.replace(/^いくつかの([^、。]{1,8})では、/, '一部の$1では、').replace(/^他の人たちは(.+?)と(言う|考える|思う|信じている|主張する|感じる|考えている)。$/, '$1と$2人もいる。');""",
    """ja.replace(/^いくつかの([^、。]{1,8})では、/, '一部の$1では、').replace(/^他の人たちは(.+?)と(言う|考える|思う|信じている|主張する|感じる|考えている)(。?)$/, '$1と$2人もいる$3');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
