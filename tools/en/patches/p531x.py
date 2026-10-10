import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Kindness is passed from one person to another → ある人から別の人へ渡される（移動・受け渡しの動詞なら熟語「人によって」にしない）
rep("""      if (fx[k].toks.join(' ') === 'no matter what' && j + 3 < lim && T[j + 3].k !== 'p') continue;""",
    """      if (fx[k].toks.join(' ') === 'no matter what' && j + 3 < lim && T[j + 3].k !== 'p') continue;
      if (/^from one [a-z]+ to another$/.test(fx[k].toks.join(' ')) && T.some((x) => x.k === 'w' && /^(?:pass|passes|passed|passing|spread|spreads|spreading|move|moves|moved|moving|travel|travels|traveled|travelled|traveling|travelling|transfer|transfers|transferred|jump|jumps|jumped|go|goes|went|carry|carries|carried|hand|handed|transmit|transmits|transmitted|flow|flows|flowed|fly|flies|flew|shift|shifts|shifted|send|sends|sent|migrate|migrates|migrated|switch|switches|switched|walk|walks|walked|run|runs|ran|drive|drives|drove|commute|commutes|wander|wanders|wandered|bounce|bounces|bounced)$/.test(x.w))) continue;""")

# from one place to another → ある場所から別の場所へ（one の訳「ある」を重ねない）
rep("""const nm1 = obj.ja.replace(/^1(?:つ|人|冊|か国)の/, '');""",
    """const nm1 = obj.ja.replace(/^(?:1(?:つ|人|冊|か国)の|ある)/, '');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
