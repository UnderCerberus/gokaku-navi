import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# shape who we become far more than the big decisions we make → 大きな決定よりもはるかに形作る / Habits matter more than talent → 才能よりも重要だ
# （形作る・影響する・重要だ などの動詞の more than + 名詞は程度の比較「〜よりも」。「決定以上」にしない）
rep("""      const anMt = obj.pron || obj.an || !!PN_JA[obj.ja];
      if (anyThMt || anyOneMt || (degMt && anMt) || degMt2 ||""",
    """      const anMt = obj.pron || obj.an || !!PN_JA[obj.ja];
      const degMt3 = T.slice(0, i).some((x) => x.k === 'w' && /^(?:shape|shapes|shaped|influence|influences|influenced|affect|affects|affected|determine|determines|determined|define|defines|defined|matter|matters|mattered)$/.test(x.w)) && !obj.num;
      if (degMt3) { const ja3b = obj.ja + 'よりも'; return { ja: ja3b, adn: adnOf(ja3b), end: obj.end, kind: 'other', prep: 'more than', obj: obj }; }
      if (anyThMt || anyOneMt || (degMt && anMt) || degMt2 ||""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
