import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Sleep improves students' performance in school → 生徒の成績（所有格のあとの performance も同じ語義の選択）
rep("""      if (nx2.head === 'core' && /核心$/.test(nx2.ja) && /^(?:earth|planet|sun|moon|mars|star)$/.test(node.head || '')) nx2.ja = nx2.ja.replace(/核心$/, '核');   // the Earth's core → 地球の核""",
    """      if (nx2.head === 'core' && /核心$/.test(nx2.ja) && /^(?:earth|planet|sun|moon|mars|star)$/.test(node.head || '')) nx2.ja = nx2.ja.replace(/核心$/, '核');   // the Earth's core → 地球の核
      if (nx2.head === 'performance' && /演技$/.test(nx2.ja) && !T.some((x) => x.k === 'w' && /^(?:stage|actor|actors|actress|concert|play|plays|theater|theatre|audience|dancer|dancers|singer|musician|musicians|show|piano|violin|perform|performed|performing|movie|film|drama|role)$/.test(x.w)) && T.some((x) => x.k === 'w' && /^(?:test|tests|exam|exams|school|student|students|class|classes|study|studies|academic|grades|learning|homework)$/.test(x.w))) nx2.ja = nx2.ja.replace(/演技$/, '成績');   // students' performance in school → 生徒の成績""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
