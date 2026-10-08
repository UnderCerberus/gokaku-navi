import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/([^、。]{2,20}?)について(あなたの学校|あなたの会社|あなたの店|あなたのホテル|御社|貴校)で(お尋ね|お聞き|お問い合わせ)/, '$2の$1について$3').replace(/どのくらいがかかる/g, 'いくらかかる').replace(/いくつかの地域で/g, '一部の地域で').replace(/(?:自分の|彼らの)(日常生活|毎日の生活)/g, '$1').replace(/より少ない(雨|雪|水)を引き起こ(す|した)/g, (m0, a0, a1) => a0 + 'が少なくなる原因とな' + (a1 === 'す' ? 'る' : 'った'));   // ask about the summer course at your school → あなたの学校の夏のコースについてお尋ね / how much the course costs → コースがいくらかかるか / causes less rain in some areas → 一部の地域で雨が少なくなる原因となる
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
