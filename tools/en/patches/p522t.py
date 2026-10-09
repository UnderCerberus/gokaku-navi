import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Women have higher rates of depression than men → うつ病（心の病気の文脈。不況 にしない）
# The paper has been cited thousands of times → 論文（引用・研究・発表の文脈。紙 にしない）
rep("""    if (nom.head === 'cause' && /原因$/.test(ja) && nom.end < lim && isW(T[nom.end], 'for')) ja = ja.replace(/原因$/, '理由');
""",
    """    if (nom.head === 'cause' && /原因$/.test(ja) && nom.end < lim && isW(T[nom.end], 'for')) ja = ja.replace(/原因$/, '理由');
    if (nom.head === 'depression' && /不況$/.test(ja) && !T.some((x) => x.k === 'w' && /^(?:economy|economic|economies|market|markets|unemployment|prices|banks|business|businesses|1930s|great|global|financial|trade|industry)$/.test(x.w)) && T.some((x) => x.k === 'w' && /^(?:anxiety|mental|patient|patients|symptom|symptoms|suffer|suffers|suffered|suffering|stress|treatment|diagnosed|rates|rate|women|men|teenagers|people|loneliness|lonely|therapy|sleep|mood|feel|feeling|feelings|sad|sadness)$/.test(x.w))) ja = ja.replace(/不況$/, 'うつ病');   // rates of depression → うつ病
    if (nom.head === 'paper' && !nom.pl && /紙$/.test(ja) && /^(?:a|an|the|this|that|his|her|their|our|my|your|its)$/.test(detW || '') && T.some((x) => x.k === 'w' && /^(?:cited|cite|cites|published|publish|publishes|journal|journals|researcher|researchers|scientist|scientists|study|studies|wrote|written|author|authors|reviewed|submitted|academic|research)$/.test(x.w)) && !T.some((x) => x.k === 'w' && /^(?:cup|cups|bag|bags|fold|folded|cut|recycle|recycled|sheet|sheets|piece|pieces|plastic|wood|trees|tree|pulp|towel|towels|wrap|wrapped|screen|screens|digital|printed|print)$/.test(x.w))) ja = ja.replace(/紙$/, '論文');   // the paper has been cited → 論文
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
