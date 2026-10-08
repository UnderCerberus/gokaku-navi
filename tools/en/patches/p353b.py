import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)
rep("""    ja = ja.replace(/中国の万里の長城/g, '万里の長城');""",
    """    ja = ja.replace(/中国の万里の長城/g, '万里の長城');
    ja = ja.replace(/^([^、。]*?)(あなた|みんな|彼|彼女|あなたたち|皆さん)に会うことは(?:すてき|良|よ|すばらし)(?:かった|だった)(?=。|$)/, '$1$2に会えてよかった').replace(/^([^、。]*?)(あなた|みんな|彼|彼女|あなたたち|皆さん)に会うことは(?:すてきだ|良い|よい|すばらしい)(?=。|$)/, '$1$2に会えてうれしい').replace(/^(これ|それ|今回)は最後の時間(だ|だった)(?=。|$)/, '$1が最後$2');   // It was nice to see you last week → 先週あなたに会えてよかった / This is the last time → これが最後だ""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
