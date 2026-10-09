import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The town has turned to tourism → 観光業に転換した / He turned to his friends for help → 友達に頼った（turn to ~ は 回る にしない）
rep("""    if (vg.lemma === 'stay' && /^滞在する$/.test(p.plain())""",
    """    if (vg.lemma === 'turn' && /^回る$/.test(p.plain()) && !vg.passive && isW(T[vg.idx + 1], 'to') && vg.idx + 2 < T.length) {
      const personTo = T.slice(vg.idx + 2, Math.min(T.length, vg.idx + 6)).some((x) => x.k === 'w' && /^(?:friend|friends|family|families|parents|parent|mother|father|teacher|teachers|doctor|doctors|god|government|neighbor|neighbors|neighbour|neighbours|others|him|her|them|me|us|police|expert|experts|internet|religion|counselor|counselors|lawyer|lawyers)$/.test(x.w));
      const abstrTo = T.slice(vg.idx + 2, Math.min(T.length, vg.idx + 6)).some((x) => x.k === 'w' && /^(?:tourism|farming|agriculture|industry|industries|technology|technologies|energy|alternatives|renewable|solar|coal|oil|gas|science|crime|violence|drugs|alcohol|politics|teaching|business|trade|manufacturing|services|online|digital|computers|machines|robots|automation|nuclear|wind|organic|fishing|mining|exports|imports|writing|art|music|methods|strategies|strategy|cars|bicycles|public|transport|transportation)$/.test(x.w));
      if (personTo) p = P('頼る', 'v5'); else if (abstrTo) p = P('転換する', 'suru');   // turned to tourism → 観光業に転換した
    }
    if (vg.lemma === 'stay' && /^滞在する$/.test(p.plain())""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
