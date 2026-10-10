import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# lowers performance on tests / students' performance in school → 成績（学業・試験の文脈の performance。演技 にしない）/ the performance of the engine → 性能
rep("""    if (nom.head === 'space' && /宇宙$/.test(ja) && !detW && i > 0 && T[i - 1].k === 'w' && /^(?:of|empty|open|extra|free|enough|much|more|little|storage|parking|living|office|work)$/.test(T[i - 1].w)) ja = ja.replace(/宇宙$/, '空間');""",
    """    if (nom.head === 'space' && /宇宙$/.test(ja) && !detW && i > 0 && T[i - 1].k === 'w' && /^(?:of|empty|open|extra|free|enough|much|more|little|storage|parking|living|office|work)$/.test(T[i - 1].w)) ja = ja.replace(/宇宙$/, '空間');
    if (nom.head === 'performance' && /演技$/.test(ja) && !T.some((x) => x.k === 'w' && /^(?:stage|actor|actors|actress|concert|play|plays|theater|theatre|audience|dancer|dancers|singer|musician|musicians|show|piano|violin|perform|performed|performing|movie|film|drama|role|judges|judge|dance|bee|bees)$/.test(x.w))) {
      if (T.some((x) => x.k === 'w' && /^(?:test|tests|exam|exams|school|student|students|class|classes|study|studies|academic|grades|learning|homework)$/.test(x.w))) ja = ja.replace(/演技$/, '成績');
      else if (isW(T[nom.end], 'of') && T.slice(nom.end + 1, Math.min(lim, nom.end + 4)).some((x) => x.k === 'w' && /^(?:engine|engines|computer|computers|machine|machines|car|cars|battery|batteries|device|devices|system|systems|phone|phones|chip|chips|software)$/.test(x.w))) ja = ja.replace(/演技$/, '性能');
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
