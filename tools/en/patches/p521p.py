import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the lost tourist → 道に迷った観光客 / a lost child → 迷子の子ども / my lost wallet → なくした財布（失われた にしない）
rep("""      if (pp.lemma === 'fall') return { ja: /^(?:tree|trees|pole|poles|wall|walls|log|logs)$/.test(nPa) ? '倒れた' : '落ちた', end: i + 1 };
""",
    """      if (pp.lemma === 'fall') return { ja: /^(?:tree|trees|pole|poles|wall|walls|log|logs)$/.test(nPa) ? '倒れた' : '落ちた', end: i + 1 };
      if (pp.lemma === 'lose' && /^(?:tourist|tourists|traveler|travelers|traveller|travellers|hiker|hikers|climber|climbers|visitor|visitors|driver|drivers|stranger|strangers|foreigner|foreigners)$/.test(nPa)) return { ja: '道に迷った', end: i + 1 };
      if (pp.lemma === 'lose' && /^(?:child|children|boy|boys|girl|girls|kid|kids|dog|dogs|cat|cats|kitten|kittens|puppy|puppies|pet|pets|lamb|lambs)$/.test(nPa)) return { ja: '迷子の', end: i + 1 };
      if (pp.lemma === 'lose' && /^(?:wallet|wallets|key|keys|umbrella|umbrellas|bag|bags|phone|phones|ring|rings|watch|passport|passports|ticket|tickets|purse|purses|glove|gloves)$/.test(nPa)) return { ja: 'なくした', end: i + 1 };
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
