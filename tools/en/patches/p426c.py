import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# every Tuesday and Thursday → 毎週火曜日と木曜日に
rep("""    // every first Sunday of the month（毎月第1日曜日に）
""",
    """    if (isW(t, 'every') && j + 3 < lim && T[j + 1].k === 'w' && /^(?:sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/.test(T[j + 1].w) && (isW(T[j + 2], 'and') || isW(T[j + 2], 'or')) && T[j + 3] && T[j + 3].k === 'w' && /^(?:sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/.test(T[j + 3].w)) {
      const WDJ = { monday: '月', tuesday: '火', wednesday: '水', thursday: '木', friday: '金', saturday: '土', sunday: '日' };
      st.time.push('毎週' + WDJ[T[j + 1].w] + '曜日' + (isW(T[j + 2], 'or') ? 'か' : 'と') + WDJ[T[j + 3].w] + '曜日に');
      return j + 4;
    }
    // every first Sunday of the month（毎月第1日曜日に）
""")

rep("""    ja = ja.replace(/夜の空/g, '夜空');""",
    """    ja = ja.replace(/夜の空/g, '夜空');
    ja = ja.replace(/(?:すべての|あらゆる)(?:水準|段階)の/g, 'あらゆるレベルの').replace(/^([^、。]{1,10})は([^、。]{1,10}?)に利用できる(。?)$/, '$2は$1を利用できる$3').replace(/テニスの裁判所|テニスの法廷/g, 'テニスコート');   // players of all levels → あらゆるレベルの選手 / Rackets are available for beginners → 初心者はラケットを利用できる""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
