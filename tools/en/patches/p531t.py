import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Tom's favorite food / everyone's favorite food → トムの好きな食べ物（ほかの所有格「〜の」のあとでは 私の を補わない。既存の置き換えの修正）
rep(""".replace(/(私の|あなたの|彼の|彼女の)?お気に入りの(教科|科目|食べ物|色|季節|スポーツ|歌手|映画|本|場所|動物)/g, (m0, p0, n0) => (p0 || '私の') + '好きな' + n0)""",
    """.replace(/(私の|あなたの|彼の|彼女の)?お気に入りの(教科|科目|食べ物|色|季節|スポーツ|歌手|映画|本|場所|動物)/g, (m0, p0, n0, off0, str0) => (p0 || (off0 > 0 && str0.charAt(off0 - 1) === 'の' ? '' : '私の')) + '好きな' + n0)""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
