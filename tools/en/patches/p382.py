import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# tell you about my favorite place の you に前置詞句をかけない（人称代名詞は後置修飾を取らない）
rep("""      // those inside a car / those in need（〜の人々）
      if (node.pron === 'those' && t.k === 'w' && PREP[t.w]""",
    """      if (node.pron && /^(?:i|you|he|she|we|they|me|him|her|us|them)$/.test(node.pron) && t.k === 'w' && PREP[t.w] && t.w !== 'of' && !o.pp) break;   // I want to tell you about my favorite place
      // those inside a car / those in need（〜の人々）
      if (node.pron === 'those' && t.k === 'w' && PREP[t.w]""")

# Some zoos in Japan are open → 開いている動物園もある（Some + 施設の名詞）
rep("""|hotel|hotels|family|families|website|websites|app|apps|animal|animals|bird|birds|fish|fishes|insect|insects|species|plant|plants|tree|trees|book|books|museum|museums|library|libraries|village|villages|region|regions)$/.test(sj.head || '') && cl.pred && verbal(cl.pred))) &&""",
    """|hotel|hotels|family|families|website|websites|app|apps|animal|animals|bird|birds|fish|fishes|insect|insects|species|plant|plants|tree|trees|book|books|museum|museums|library|libraries|village|villages|region|regions|zoo|zoos|park|parks|aquarium|aquariums|cafe|cafes|station|stations|beach|beaches|temple|temples)$/.test(sj.head || '') && cl.pred && (verbal(cl.pred) || /(?:ている|てある)$/.test(cl.pred.s || '')))) &&""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    if (tokens[0] && tokens[0].w === 'you' && tokens[1] && tokens[1].w === 'can' && tokens[2] && /^(?:see|find|enjoy|buy|get|try|visit|eat)$/.test(tokens[2].w || '')) ja = ja.replace(/^あなたは/, '').replace(/^([^、。]+?)が見える(?=。|$)/, '$1を見ることができる');   // You can see animals that sleep during the day → 日中眠る動物を見ることができる（一般の you）
    if (tokens.some((x) => /^(?:cafe|shop|store|restaurant|bakery|bar|hotel|inn)$/.test(x.w || '')) || tokens.some((x) => /^(?:pancakes|coffee|cakes|bread)$/.test(x.w || ''))) ja = ja.replace(/所有者/g, '店主');   // The owner (of the cafe) → 店主
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
