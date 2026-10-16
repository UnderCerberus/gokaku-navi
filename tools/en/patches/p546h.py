import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# take only thirty-six pictures with one roll → 1本のフィルムで / two rolls of film → 2本のフィルム
# （写真・カメラ・フィルムの文の roll はフィルム。「ロールパン」にしない。roll of ~ は単位の「本」。カメラ・現像の文の film は「フィルム」）
rep("""    if (nom.head === 'class' && !nom.pl && !nom.preJa && /^(?:my|our|your|their|his|her)$/.test(detW) && /授業$/.test(ja)) ja = ja.replace(/授業$/, 'クラス');""",
    """    if (nom.head === 'roll' && /ロールパン$/.test(ja) && !isW(T[nom.end], 'of') && T.some((x) => x.k === 'w' && /^(?:picture|pictures|photo|photos|photograph|photographs|film|films|camera|cameras|shot|shots)$/.test(x.w))) ja = ja.replace(/(?:[0-9０-９]+)つの(?=ロールパン$)/, (m0) => m0.replace(/つの$/, '本の')).replace(/ロールパン$/, 'フィルム');
    if (nom.head === 'film' && /映画$/.test(ja) && T.some((x, q) => x.k === 'w' && (/^(?:camera|cameras|roll|rolls|load|loads|loaded|develop|develops|developed|negative|negatives|shot|shots)$/.test(x.w) || (/^(?:take|took|taken)$/.test(x.w) && T.slice(q, q + 4).some((y) => /^(?:picture|pictures|photo|photos)$/.test(y.w || '')))))) ja = ja.replace(/映画$/, 'フィルム');
    if (nom.head === 'class' && !nom.pl && !nom.preJa && /^(?:my|our|your|their|his|her)$/.test(detW) && /授業$/.test(ja)) ja = ja.replace(/授業$/, 'クラス');""")
rep("""bottle: '本', slice: '切れ',""", """bottle: '本', roll: '本', rolls: '本', slice: '切れ',""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
