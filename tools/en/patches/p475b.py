import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      else if (L === 'bring' && !vg.passive && /(?:^| )(?:problem|problems|benefit|benefits""",
    """      else if (L === 'bring' && !vg.passive && objs.length === 1 && (objs[0].an || /^(?:him|her|them|me|us)$/.test(objs[0].pron || '')) && !/(?:^| )(?:pet|pets|dog|dogs|cat|cats|animal|animals)$/.test(oh) || (L === 'bring' && !vg.passive && /(?:^| )(?:dog|dogs|pet|pets|children|child|kids|friend|friends|family|guest|guests|sister|brother|son|daughter|wife|husband)$/.test(oh))) sense = { particle: 'を', core: '連れてくる', tr: true };   // She brought her friend to the party → 友達を連れてきた
      else if (L === 'bring' && !vg.passive && /(?:^| )(?:problem|problems|benefit|benefits""")

rep("""    ja = ja.replace(/一方で、また/g, '一方で、');""",
    """    ja = ja.replace(/一方で、また/g, '一方で、');
    if (tokens.some((x) => x.w === 'felt') && tokens.some((x) => /^(?:effect|effects|impact|impacts|consequence|consequences|influence|presence|shock|loss)$/.test(x.w || ''))) ja = ja.replace(/思われ/g, '感じられ');   // The effects will be felt for years → 影響は何年にもわたって感じられるだろう""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
