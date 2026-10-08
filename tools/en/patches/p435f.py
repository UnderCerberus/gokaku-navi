import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Interestingly, → 興味深いことに、（コンマつきの文頭）
rep("""    fortunately: '幸運にも', unfortunately: '残念ながら', surprisingly: '驚いたことに', actually: '実は', now: 'さて', today: '今日',""",
    """    fortunately: '幸運にも', unfortunately: '残念ながら', surprisingly: '驚いたことに', interestingly: '興味深いことに', luckily: '幸運にも', sadly: '悲しいことに', strangely: '奇妙なことに', amazingly: '驚くべきことに', actually: '実は', now: 'さて', today: '今日',""")

# banned women from performing → 女性が演じることを禁止した
rep("""      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };""",
    """      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };
      else if (L === 'perform' && !objs.length && T.some((x) => /^(?:kabuki|theater|theatre|stage|play|plays|drama|concert|audience|actor|actors|actress|performer|performers|roles|role|dancers|musicians|band)$/.test(x.w || ''))) sense = { particle: '', core: '演じる', tr: false };""")

rep("""    ja = ja.replace(/世紀の最中に/g, '世紀半ばに').replace(/世紀の終わりに/g, '世紀末に');""",
    """    ja = ja.replace(/世紀の最中に/g, '世紀半ばに').replace(/世紀の終わりに/g, '世紀末に');
    if (tokens.some((x) => /^(?:ban|bans|banned|banning|prohibit|prohibited|prohibits)$/.test(x.w || '')) && tokens.some((x) => x.w === 'from')) ja = ja.replace(/([^、。]{1,8}?)することから([^、。]{1,10}?)を禁止(し|す)/, '$2が$1することを禁止$3').replace(/([^、。]{1,8}?)ることから([^、。]{1,10}?)を禁止(し|す)/, '$2が$1ることを禁止$3');   // banned women from performing → 女性が演じることを禁止した""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
