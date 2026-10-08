import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（FC: 第 301 組、回帰 6,666 文）: **将来の夢・仕事**（夢をかなえるために（achieve / realize + dream。これまでは 私の夢を達成する）・歌手になるという夢をかなえた・小さかった頃から、看護師になりたいとずっと思っている（have wanted … since。これまでは なりたい）・"
         "オリンピックで金メダルを獲得すること（Olympics を固有名詞に。これまでは Olympicsに）・科学者になることが夢だった（Being a scientist was my dream。これまでは 科学者であることは私の夢だった））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
