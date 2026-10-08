import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 2,000 は年ではない（カンマつきの数）
rep("""        const yr = num.val >= 1000 && num.val <= 2100 && !num.pct && T[num.end - 1].k === 'num' && !num.ord;""",
    """        const yr = num.val >= 1000 && num.val <= 2100 && !num.pct && T[num.end - 1].k === 'num' && !num.ord && !/,/.test(T[num.end - 1].s || '');   // increased from 2,000 to 5,000 の 2,000 は年ではない""")

# account for 10 percent → 10%を占める / a small number of people answered no / remained the same / said yes in a survey
rep("""      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };""",
    """      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };
      else if (L === 'account' && (objs[0].num || /(?:^| )(?:percent|percentage|half|third|thirds|quarter|quarters|majority|share|portion|part|fraction|proportion|most)$/.test(oh))) sense = { particle: 'を', core: '占める', tr: true };   // Japan accounts for about 10 percent of the total → 合計の約10%を占める""")

rep("""    ja = ja.replace(/中国の万里の長城/g, '万里の長城');""",
    """    ja = ja.replace(/中国の万里の長城/g, '万里の長城');
    ja = ja.replace(/同じもののままで(い|あ)(た|る)(?=。|$)/, (m0, a0, b0) => '同じままだ' + (b0 === 'た' ? 'った' : '')).replace(/同じもののままだった/, '同じままだった');   // The rate remained the same for three years → 3年間同じままだった
    if (tokens.some((x) => /^(?:respondents|respondent|survey|surveyed|questionnaire|poll|asked|answered)$/.test(x.w || ''))) ja = ja.replace(/いいよと言った/g, '「はい」と答えた').replace(/いやだと言った/g, '「いいえ」と答えた');   // More than half of the respondents said yes → 「はい」と答えた
    if (tokens.some((x) => x.w === 'account' || x.w === 'accounts' || x.w === 'accounted')) ja = ja.replace(/を説明(する|した)(?=。|$)/, (m0, a0) => (a0 === 'する' ? 'を占める' : 'を占めた'));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
