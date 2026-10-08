import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""(?:多くの人々|人々|科学者|専門家|多くの科学者|多くの専門家|研究者|一部の人々|多くの研究者)は.+)と信じている(。?)$/, '$1と考えている$2')""",
    """(?:多くの人々|人々|科学者|専門家|多くの科学者|多くの専門家|研究者|一部の人々|多くの研究者|支持者|批評家|反対者|多くの支持者)は.+)と信じている(。?)$/, '$1と考えている$2')""")

rep("""    ja = ja.replace(/私的な生活/g, '私生活')""",
    """    ja = ja.replace(/さもなければ捨てられる/g, '本来なら捨てられてしまう').replace(/さもなければ無駄になる/g, '本来なら無駄になってしまう');   // food that would otherwise be thrown away → 本来なら捨てられてしまう食べ物
    ja = ja.replace(/私的な生活/g, '私生活')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
