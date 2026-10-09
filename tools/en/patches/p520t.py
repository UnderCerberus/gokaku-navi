import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The town's economy, once dependent on fishing → 漁業（経済・産業・町の文脈の fishing は 漁業）
rep("""    if (nom.head === 'pattern' && nom.preJa && /型$/.test(ja)) ja = ja.replace(/型$/, 'パターン');""",
    """    if (nom.head === 'pattern' && nom.preJa && /型$/.test(ja)) ja = ja.replace(/型$/, 'パターン');
    if (nom.head === 'fishing' && /釣り$/.test(ja) && T.some((x) => x.k === 'w' && /^(?:economy|economies|industry|industries|dependent|depend|depends|depended|rely|relies|relied|town|towns|village|villages|coastal|coast|fishermen|fisherman|tourism|agriculture|farming|jobs|livelihood|income|port|ports)$/.test(x.w))) ja = ja.replace(/釣り$/, '漁業');   // dependent on fishing → 漁業に頼っていた""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
