import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I called him the day before he left → 彼が出発する前の日に、私は彼に電話した（the day / night before / after + 節 は複数語の接続詞。彼を日と呼んだ にしない）
rep("""    'long before', 'long after', 'shortly before', 'shortly after', 'soon after', 'right after', 'just after', 'just before', 'much as',""",
    """    'long before', 'long after', 'shortly before', 'shortly after', 'soon after', 'right after', 'just after', 'just before', 'much as',
    'the day before', 'the day after', 'the night before', 'the morning after', 'the week before', 'the year before',""")
rep("""      case 'long before': return S('attr', false) + 'ずっと前に、';""",
    """      case 'long before': return S('attr', false) + 'ずっと前に、';
      case 'the day before': case 'the night before': case 'the week before': case 'the year before': return S('attr', false) + '前の' + ({ 'the day before': '日', 'the night before': '晩', 'the week before': '週', 'the year before': '年' })[key] + 'に、';
      case 'the day after': case 'the morning after': return S('attr', true) + '次の' + (key === 'the day after' ? '日' : '朝') + 'に、';""")

rep("    for (let k = 0; k < MSUB.length; k++) {\n      const ws = MSUB[k].split(' ');\n      if (ws[0] === t.w && j + ws.length < b && seq(j, ws)",
    "    for (let k = 0; k < MSUB.length; k++) {\n      const ws = MSUB[k].split(' ');\n      if (/^the (?:day|night|week|year|morning) (?:before|after)$/.test(MSUB[k]) && !(T[j + 3] && PRON[T[j + 3].w] && PRON[T[j + 3].w].sub)) continue;   // the night before a test は前置詞句（主語の代名詞が続くときだけ接続詞）\n      if (ws[0] === t.w && j + ws.length < b && seq(j, ws)")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
