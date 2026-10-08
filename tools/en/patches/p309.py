import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Let's have some tea → お茶を飲みましょう
rep("""      else if (L === 'have' && /^(?:breakfast|lunch|dinner|supper)$/.test(oh)) sense = { particle: 'を', core: '食べる', tr: true };""",
    """      else if (L === 'have' && /^(?:breakfast|lunch|dinner|supper)$/.test(oh)) sense = { particle: 'を', core: '食べる', tr: true };
      else if (L === 'have' && !vg.passive && (vg.imp || vg.past || vg.modal || vg.nonfin || vg.semi || (o.subj && /^(?:let|we)$/.test(o.subj.pron || ''))) && /(?:^| )(?:coffee|tea|juice|milk|water|beer|wine|soda|drink|drinks|cocoa|cola|soup)$/.test(oh) && !/(?:^| )(?:a lot of)$/.test(objs[0].det || '')) sense = { particle: 'を', core: oh === 'soup' ? '飲む' : '飲む', tr: true };   // Let's have some tea → お茶を飲みましょう""")

rep("""'for half an hour': '30分間', """, """'for half an hour': '30分間', 'every other day': '1日おきに', 'every other week': '1週間おきに', 'every other month': '1か月おきに', 'every other year': '1年おきに', 'for ages': '長い間', 'around the clock': '24時間ずっと', 'round the clock': '24時間ずっと', 'in a minute': 'すぐに', 'in a second': 'すぐに', 'in a moment': 'すぐに', """)

rep("""  const LEAD2 = dic({ """, """  const LEAD2 = dic({ 'up to now': 'これまでのところ', 'in the meantime': 'その間に', """)

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    ja = ja.replace(/今今週/g, '今週').replace(/今今月/g, '今月').replace(/今今年/g, '今年');   // by the end of this week → 今週中に
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
