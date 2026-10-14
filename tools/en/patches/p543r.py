import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# teaching me how to make bread myself → 自分でパンを作る方法（how to + 目的語のあとに副詞句があるときは「〜する方法」。「パンを自分で作り方」にしない）
rep("""      else if (destM) s = destM + 'への' + (inf.vg.lemma === 'come' ? '来方' : '行き方');   // how to get to the station → 駅への行き方""",
    """      else if (destM) s = destM + 'への' + (inf.vg.lemma === 'come' ? '来方' : '行き方');   // how to get to the station → 駅への行き方
      else if (t.w === 'how' && wh.end === j + 1 && (inf.parts || []).length > 1 && inf.parts.some((x) => /を$/.test(x)) && !/を$/.test(inf.parts[inf.parts.length - 1]) && verbal(inf.pred)) s = vpJoin(Object.assign({}, inf, { parts: inf.parts.filter((x) => !/を$/.test(x)).concat(inf.parts.filter((x) => /を$/.test(x))) }), 'dict') + '方法';""")

# I got my first part-time job at a small bakery → 小さいパン屋で初めてのアルバイトを得た（get + 仕事は「得る」。「アルバイトをした」にしない）
rep("""      else if (L === 'suggest' && !vg.passive && o.subj && !o.subj.an""",
    """      else if (L === 'get' && !vg.passive && /(?:^| )(?:job|jobs)$/.test(oh)) sense = { particle: 'を', core: '得る', tr: true };
      else if (L === 'suggest' && !vg.passive && o.subj && !o.subj.an""")

# got my first part-time job at a small bakery → 小さいパン屋で初めてのアルバイトを始めた（既存の置換「アルバイトを得 → アルバイトをし」を「〜でアルバイトを始め」に直す）
rep(""".replace(/アルバイトを得/g, 'アルバイトをし');""",
    """.replace(/(?:([^、。をはが]{1,14})に)?(?:最初の|初めての)?アルバイトを得/g, (m0, a0) => (a0 ? a0 + 'で' : '') + (/(?:最初の|初めての)/.test(m0) ? '初めての' : '') + 'アルバイトを始め');""")

# I was amazed at how quickly his hands moved as he shaped the dough into … → 生地を…の形にしているとき（作る・形作る・焼く などの目的語つきの as も時の as）
rep("""(sc.prog || /(?:^|[をにでと])(?:歩く|走る|運転する""",
    """(sc.prog || /(?:^|[をにでとの])(?:形にする|形作る|作る|焼く|料理する|描く|洗う|掃除する|準備する|歩く|走る|運転する""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
