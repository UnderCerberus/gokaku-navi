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
      else if (L === 'keep' && !vg.passive && (/^(?:cat|cats|dog|dogs|pet|pets|bird|birds|hamster|hamsters|rabbit|rabbits|horse|horses|turtle|turtles|goldfish|parrot|parrots|puppy|puppies|kitten|kittens|chicken|chickens|cow|cows|pig|pigs|sheep|goat|goats|bee|bees|animal|animals)$/.test(oh) || (objs[0].pron === 'it' && T.some((x) => /^(?:pet|pets|kitten|puppy|dog|cat|care)$/.test(x.w || ''))))) sense = { particle: 'を', core: '飼う', tr: true };   // keep a dog → 犬を飼う / they could keep it if he took care of it → それを飼える""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/それが雨がや/g, '雨がや');   // if it stopped raining → 雨がやんだら
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
