import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# They had adopted him the day before → 前日に彼を引き取っていた（代名詞の目的語の adopt: 文に動物の語があれば「引き取る」、人なら「養子にする」。「採用する」にしない）
rep("""      else if (L === 'adopt' && !vg.passive && objs.length === 1 && /(?:^| )(?:dog|dogs|cat|cats|puppy|puppies|kitten|kittens|pet|pets|animal|animals|rabbit|rabbits|hamster|horse)$/.test(oh)) sense = { particle: 'を', core: '引き取る', tr: true };""",
    """      else if (L === 'adopt' && !vg.passive && objs.length === 1 && /(?:^| )(?:dog|dogs|cat|cats|puppy|puppies|kitten|kittens|pet|pets|animal|animals|rabbit|rabbits|hamster|horse)$/.test(oh)) sense = { particle: 'を', core: '引き取る', tr: true };
      else if (L === 'adopt' && !vg.passive && objs.length === 1 && /^(?:him|her|them)$/.test(objs[0].pron || '')) sense = { particle: 'を', core: T.some((x) => x.k === 'w' && /^(?:dog|dogs|cat|cats|puppy|puppies|kitten|kittens|pet|pets|animal|animals|shelter|cage|cages)$/.test(x.w)) || objs[0].pron === 'them' ? '引き取る' : '養子にする', tr: true };""")

# their own dog had died the previous winter → その前の冬に死んでいた（the previous + 季節・週・月・晩 は時の副詞。「前の冬を」にしない）
rep("""    'each time': '毎回', 'every single time': '毎回',""",
    """    'each time': '毎回', 'every single time': '毎回', 'the previous winter': 'その前の冬に', 'the previous summer': 'その前の夏に', 'the previous spring': 'その前の春に', 'the previous autumn': 'その前の秋に', 'the previous fall': 'その前の秋に',
    'the previous week': '前の週に', 'the previous month': '前の月に', 'the previous night': '前の晩に', 'the previous evening': '前の晩に', 'the previous morning': '前日の朝に', 'the previous weekend': '前の週末に',""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
