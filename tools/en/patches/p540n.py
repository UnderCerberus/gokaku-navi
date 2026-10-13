import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# said that my story had moved them → 私の話が彼らを感動させた（話・スピーチ・歌・手紙などが主語の move them は「感動させる」。「それらを動かした」にしない）
rep("""&& !/^(?:them|it)$/.test(objs[0].pron || '')) sense = { particle: 'を', core: '感動させる', tr: true };   // The letter moved me → 私を感動させた（move them into … は移動）""",
    """&& !/^(?:them|it)$/.test(objs[0].pron || '')) sense = { particle: 'を', core: '感動させる', tr: true };   // The letter moved me → 私を感動させた（move them into … は移動）
      else if (L === 'move' && objs[0].pron === 'them' && !vg.passive && o.subj && /^(?:story|stories|speech|speeches|song|songs|words|letter|letters|music|book|books|film|films|movie|movies|performance|performances|poem|poems|kindness|play|message|messages)$/.test(plainSubj(o.subj).head || '') && !T.slice(i, lim).some((x) => x.k === 'w' && /^(?:into|to|from|out|away|around|toward|towards|onto|in|across|back|up|down|closer|forward)$/.test(x.w))) { sense = { particle: 'を', core: '感動させる', tr: true }; objs[0] = Object.assign({}, objs[0], { ja: '彼ら' }); }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
