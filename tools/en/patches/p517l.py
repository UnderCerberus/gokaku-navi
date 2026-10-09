import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) negative / positive impact → 悪い・良い影響
rep("""    'leading|cause causes|主な',""",
    """    'leading|cause causes|主な',
    'negative|impact impacts effect effects influence influences consequence consequences|悪い',
    'positive|impact impacts effect effects influence influences|良い',""")

# 2) has a negative impact on health → 健康に悪い影響を与える（have + 影響 の on は動詞にかける）
rep("""      if (L === 'get' && oh === 'exercise' && !vg.passive) {""",
    """      if (L === 'have' && /^(?:effect|effects|impact|impacts|influence|influences)$/.test(oh) && !vg.passive && objs.length === 1) {
        const mOnI = /^(.+?)への(.+)$/.exec(objs[0].ja || '');
        if (mOnI) { objs[0] = Object.assign({}, objs[0], { ja: mOnI[2] }); st.other.push(mOnI[1] + 'に'); }
        sense = { particle: 'を', core: '与える', tr: true };   // has a negative impact on health → 健康に悪い影響を与える
      }
      if (L === 'get' && oh === 'exercise' && !vg.passive) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
