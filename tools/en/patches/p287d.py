import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    ja = ja.replace(/^(チェックアウト|チェックイン)は""",
    """    {
      const qPk = tokens.findIndex((x) => x.w === 'picked');
      if (qPk > 0 && tokens[qPk + 1] && tokens[qPk + 1].w === 'up' && tokens.slice(0, qPk).some((x) => /^(?:is|are|was|were|be|been|being)$/.test(x.w || ''))) {   // 受け身の pick up: 人 → 迎えに来てもらう / ごみ → 回収される
        if (tokens.slice(0, qPk).some((x) => /^(?:garbage|trash|rubbish|waste|recycling|bins|bottles|cans|newspapers)$/.test(x.w || ''))) ja = ja.replace(/拾われている/g, '回収される').replace(/拾われ/g, '回収され');
        else if (/^(?:i|he|she|we|they|you)$/.test(tokens[0].w || '') || tokens.slice(0, qPk).some((x) => /^(?:children|child|kids|kid|students|student|son|daughter|brother|sister|guests|guest|passengers|tourists|friends|friend|boy|girl|boys|girls|baby|patients|patient)$/.test(x.w || ''))) ja = ja.replace(/拾われ(る|た|ている|ていた)/g, (m0, e0) => '迎えに来てもら' + ({ 'る': 'う', 'た': 'った', 'ている': 'っている', 'ていた': 'っていた' })[e0]).replace(/拾える/g, '引き取れる').replace(/拾われることができる/g, '引き取れる');
      }
    }
    ja = ja.replace(/^(チェックアウト|チェックイン)は""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
