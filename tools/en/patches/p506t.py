import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the first impression we make on others → 私たちが他の人に与える第一印象 / the progress we have made → 遂げた進歩 / the difference it makes → もたらす違い
rep("""      else if (L === 'make' && /^(?:effort|efforts|decision|decisions|speech|promise|promises|choice|choices|call|calls|trip|trips)$/.test(gaA)) sense = { particle: 'を', core: 'する', tr: true };""",
    """      else if (L === 'make' && /^(?:impression|impressions)$/.test(gaA)) sense = { particle: 'を', core: '与える', tr: true };
      else if (L === 'make' && /^(?:progress|advance|advances|breakthrough|breakthroughs)$/.test(gaA)) sense = { particle: 'を', core: '遂げる', tr: true };
      else if (L === 'make' && /^(?:difference|differences)$/.test(gaA)) sense = { particle: 'を', core: 'もたらす', tr: true };
      else if (L === 'make' && /^(?:decision|decisions)$/.test(gaA)) sense = { particle: 'を', core: '下す', tr: true };
      else if (L === 'make' && /^(?:contribution|contributions)$/.test(gaA)) sense = { particle: 'を', core: '果たす', tr: true };
      else if (L === 'make' && /^(?:effort|efforts|speech|promise|promises|choice|choices|call|calls|trip|trips)$/.test(gaA)) sense = { particle: 'を', core: 'する', tr: true };""")
rep("""      case 'on':
        if (time) return R(n + 'に', 'time', n + 'の');""",
    """      case 'on':
        if (time) return R(n + 'に', 'time', n + 'の');
        if (o && o.lemma === 'make' && (obj.an || /^(?:others|people|everyone|him|her|them|me|us|you)$/.test(obj.pron || obj.head || ''))) return R(n + 'に', 'other', n + 'への');   // the impression we make on others → 他の人に与える印象""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
