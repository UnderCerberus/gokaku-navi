import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""        const findS = L === 'find' && o.subj && !o.subj.an && /^(?:study|studies|research|survey|surveys|experiment|experiments|report|reports|analysis|test|tests|investigation|investigations|researchers)$/.test(o.subj.head || '');""",
    """        const findS = L === 'find' && o.subj && (/^(?:study|studies|research|survey|surveys|experiment|experiments|report|reports|analysis|test|tests|investigation|investigations|researchers|researcher|scientists|scientist|experts|archaeologists|archaeologist|biologists|astronomers)$/.test(o.subj.head || '')) && (!o.subj.an || /^(?:researchers|researcher|scientists|scientist|experts|archaeologists|archaeologist|biologists|astronomers)$/.test(o.subj.head || ''));""")

rep("""    if (tokens.some((x) => x.w === 'located')) ja = ja.replace(""",
    """    if (tokens.some((x) => /^(?:octopus|octopuses|fish|aquarium|turtle|turtles|goldfish|shark|sharks)$/.test(x.w || ''))) ja = ja.replace(/(?:自分の|それらの|彼らの)?タンク/g, '水槽');   // escape from their tanks → 水槽から逃げる
    if (tokens.some((x) => x.w === 'located')) ja = ja.replace(""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
