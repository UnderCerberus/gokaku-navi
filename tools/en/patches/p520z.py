import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# how difficult life was for the families who first settled in the area → …家族たちにとってどれほど難しかったか（形容詞の述語 + for + 人。修飾語つきの名詞・家族・住民なども）
rep("""    if (vg.lemma === 'be' && !verbal(p) && !vg.passive) st.other = st.other.map((x) => x.replace(/^(人間|人々|子ども|子どもたち|私たち|私|あなた|彼|彼女|彼ら|学生|学生たち|高齢者|老人|お年寄り|動物|若者|若い人々|初心者|外国人)のために$/, '$1にとって'));""",
    """    if (vg.lemma === 'be' && !verbal(p) && !vg.passive) st.other = st.other.map((x) => x.replace(/^(人間|人々|子ども|子どもたち|私たち|私|あなた|彼|彼女|彼ら|学生|学生たち|高齢者|老人|お年寄り|動物|若者|若い人々|初心者|外国人|家族|家族たち|住民|住民たち|労働者|労働者たち|農民|農民たち|移民|移民たち|患者|患者たち)のために$/, '$1にとって').replace(/^([^、。]{2,30}?(?:した|する|している|していた|の|な|い))(人々|人たち|家族|家族たち|住民|住民たち|移民|移民たち|労働者|労働者たち|農民|農民たち|子ども|子どもたち|生徒|生徒たち|学生|学生たち|女性|女性たち|男性|男性たち|患者|患者たち|兵士|兵士たち|開拓者|開拓者たち|入植者|入植者たち)のために$/, '$1$2にとって'));""")

# the families who first settled in the area → 地域に定住した（settle in も「に」）
rep("""  const STATIVE_LOC = set('be live stay exist remain sit stand lie arrive put place keep hide appear stop enter go come move return get fall rise');""",
    """  const STATIVE_LOC = set('be live stay exist remain sit stand lie arrive put place keep hide appear stop enter go come move return get fall rise settle');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
