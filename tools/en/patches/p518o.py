import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Hardly had we arrived at the station when … → 駅に到着するかしないかのうちに（否定の側は動詞だけ繰り返す）
SH = ".replace(/^.*[をにがでと](?=[^をにがでと]{2,}$)/, '').replace(/^(?:[^をにがでと]+)しない$/, (m0) => (c1.pred.cls === 'suru' ? 'しない' : m0))"
rep("""        const negH = c1.pred && verbal(c1.pred) ? c1.pred.aux('neg').plain() : 'しない';   // 寝るか寝ないかのうちに""",
    """        const negH = c1.pred && verbal(c1.pred) ? c1.pred.aux('neg').plain()""" + SH + """ : 'しない';   // 寝るか寝ないかのうちに / 駅に到着するかしないかのうちに""")
rep("""          const negI = c1.pred && verbal(c1.pred) ? c1.pred.aux('neg').plain().replace(/ていない$/, 'ない') : 'しない';   // 寝るか寝ないかのうちに""",
    """          const negI = c1.pred && verbal(c1.pred) ? c1.pred.aux('neg').plain().replace(/ていない$/, 'ない')""" + SH + """ : 'しない';   // 寝るか寝ないかのうちに""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
