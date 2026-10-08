import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    if (L === 'leave' && !objs.length && !vg.passive && o.subj && /^(?:train|trains|bus|buses|plane|planes|flight|flights|ship|ships|ferry|boat|boats|shinkansen|express)$/.test(plainSubj(o.subj).head || '')) sense = { particle: '', core: '出発する', tr: false };""",
    """    if (L === 'move' && !objs.length && !vg.passive && o.subj && (o.subj.an || /^(?:i|you|he|she|we|they)$/.test(o.subj.pron || '') || /^(?:family|families)$/.test(o.subj.head || '')) && T[vg.idx + 1] && /^(?:here|there|abroad|overseas|away)$/.test(T[vg.idx + 1].w || '') && !T.slice(vg.idx + 2, lim).some((x) => /^(?:to|toward|towards)$/.test(x.w || ''))) sense = { particle: '', core: T[vg.idx + 1].w === 'here' ? '引っ越してくる' : '引っ越す', tr: false };   // They moved here in 2010 → 2010年にここに引っ越してきた
    if (L === 'leave' && !objs.length && !vg.passive && o.subj && /^(?:train|trains|bus|buses|plane|planes|flight|flights|ship|ships|ferry|boat|boats|shinkansen|express)$/.test(plainSubj(o.subj).head || '')) sense = { particle: '', core: '出発する', tr: false };""")

rep("""    ja = ja.replace(/知識の隙間/g, '知識の空白')""",
    """    ja = ja.replace(/の中に引っ越/g, 'に引っ越');   // moved into a new house → 新しい家に引っ越した
    ja = ja.replace(/知識の隙間/g, '知識の空白')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
