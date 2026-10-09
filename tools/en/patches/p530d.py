import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the night before a test / the day before the wedding（後ろに名詞句が続く the night before は決まり文句の「前の晩」にしない → 試験の前の晩に）
rep("""        if (key && TIMEPH[key] && !/^(?:next door|the other day|all the time)$/.test(key) && /[日週月年朝晩夜夏冬春秋回近時分秒]/.test(TIMEPH[key]) &&""",
    """        if (key && TIMEPH[key] && !/^(?:next door|the other day|all the time)$/.test(key) && /[日週月年朝晩夜夏冬春秋回近時分秒]/.test(TIMEPH[key]) && !(/^the (?:night|day|morning|evening|week) (?:before|after)$/.test(key) && i + len < lim && T[i + len].k === 'w' && (DET[T[i + len].w] !== undefined || !!nounC(T[i + len]) || T[i + len].cap)) &&""")
rep("""      if (key && TIMEPH[key] && !pastSpan && !(/ of times$/.test(key)""",
    """      if (key && TIMEPH[key] && !pastSpan && !(/^the (?:night|day|morning|evening|week) (?:before|after)$/.test(key) && npNext) && !(/ of times$/.test(key)""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
