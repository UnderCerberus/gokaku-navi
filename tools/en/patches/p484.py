import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Prices are high in Tokyo（be high in ~ =「〜が多い」は栄養・成分の名詞のときだけ）
rep("""  const BLOCK_OK = { 'run for ~': """,
    """  const BLOCK_OK = { 'be high in ~': /^(?:vitamin|vitamins|protein|proteins|fat|fats|sugar|sugars|salt|sodium|calories|calorie|fiber|fibre|iron|calcium|cholesterol|carbohydrates|carbohydrate|nutrients|antioxidants|caffeine|alcohol|minerals|acid|oil|water|energy)$/,
    'be low in ~': /^(?:vitamin|vitamins|protein|proteins|fat|fats|sugar|sugars|salt|sodium|calories|calorie|fiber|fibre|iron|calcium|cholesterol|carbohydrates|carbohydrate|nutrients|caffeine|alcohol|oil|water|energy)$/,
    'run for ~': """)
rep("""  const BLOCK = set0(['come to ~', """,
    """  const BLOCK = set0(['be high in ~', 'be low in ~', 'come to ~', """)

# commit a crime → 犯罪を犯す
rep("""      else if (L === 'save' && (/(?:^| )(?:seat|seats""",
    """      else if (L === 'commit' && /(?:^| )(?:crime|crimes|murder|murders|fraud|offense|offence|offenses|offences|sin|sins|robbery|robberies|theft|thefts|violence|act|acts|atrocity|atrocities|error|errors|mistake|mistakes|foul|fouls|burglary|assault)$/.test(oh)) sense = { particle: 'を', core: '犯す', tr: true };   // He committed a crime → 犯罪を犯した
      else if (L === 'commit' && /(?:^| )(?:suicide)$/.test(oh)) sense = { particle: '', core: '自殺する', tr: false, noParticle: true };
      else if (L === 'save' && (/(?:^| )(?:seat|seats""")

rep("""    ja = ja.replace(/財政で([^、。]{0,8}?)(仕事|職)/g, '金融業界で$1$2');""",
    """    ja = ja.replace(/財政で([^、。]{0,8}?)(仕事|職)/g, '金融業界で$1$2').replace(/学校から追放され/g, '退学処分になっ').replace(/自殺を犯/g, '自殺し');   // He was expelled from school → 退学処分になった""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
