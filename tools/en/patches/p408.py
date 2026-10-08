import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };""",
    """      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };
      else if (L === 'recall' && /(?:^| )(?:car|cars|product|products|item|items|device|devices|vehicle|vehicles|toy|toys|phone|phones|batteries|battery|model|models|food|foods)$/.test(oh)) sense = { particle: 'を', core: '回収する', tr: true };   // recall thousands of cars → 何千台もの車を回収する""")

# in public places（in public の決まり文句を名詞句の前では使わない）
rep("""      if (/^on (?:your|the|my) (?:right|left)$/.test(fx[k].toks.join(' ')) && j + fx[k].toks.length < lim && /^(?:side|hand|lane|bank|wing)$/.test(T[j + fx[k].toks.length].w || '')) continue;""",
    """      if (/^on (?:your|the|my) (?:right|left)$/.test(fx[k].toks.join(' ')) && j + fx[k].toks.length < lim && /^(?:side|hand|lane|bank|wing)$/.test(T[j + fx[k].toks.length].w || '')) continue;
      if (/^in (?:public|private|general|person|time)$/.test(fx[k].toks.join(' ')) && j + fx[k].toks.length < lim && T[j + fx[k].toks.length].k === 'w' && !!nounC(T[j + fx[k].toks.length]) && !PREP[T[j + fx[k].toks.length].w] && !vc(T[j + fx[k].toks.length], ['3sg', 'past'])) continue;   // in public places → 公共の場所で""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/より古い(労働者|人々|人|世代|社員|住民|従業員)/g, '高齢の$1').replace(/に対して差別す/g, 'を差別す').replace(/貧しい家族(?:たち)?の/g, '貧しい家庭の').replace(/(大学|学校|高校|専門学校|授業)に出席す/g, (m0, a0) => (/^(?:大学|学校|高校|専門学校)$/.test(a0) ? a0 + 'に通' : a0 + 'に出席す'));   // older workers → 高齢の労働者 / students from poor families to attend university → 貧しい家庭の学生が大学に通う
    ja = ja.replace(/かで(?:重要|大き)な影響を与え/g, 'かに大きな影響を与え').replace(/(?:彼ら|彼|彼女)自身を見る/g, '自分自身を見る').replace(/同意なしで終わ/g, '合意に至らないまま終わ').replace(/(?:運動選手|選手)は([^、。]*?)一時停止され/g, (m0, a0) => m0.replace(/一時停止され/, '出場停止になっ')).replace(/を使うために出場停止/, 'を使ったことで出場停止');   // impact on how young people view themselves → 自分自身をどう見るかに大きな影響を与える
    if (tokens.some((x) => /^(?:clinical|patients|patient|disease|diseases|medical|doctor|doctors|cancer|hospital|cure)$/.test(x.w || ''))) ja = ja.replace(/新しい扱い/g, '新しい治療法').replace(/扱いは/g, '治療法は');   // The new treatment has shown promising results in clinical trials → 新しい治療法
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
