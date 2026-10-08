import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# a big broken window / a free guided tour（形容詞のあとの分詞 + 名詞・複数語の見出し語も名詞句に続ける）
rep("""      const more = !!nx && nx.k === 'w' && (!NO_COMPOUND[nx.w] ||""",
    """      // a big broken window / a long guided tour（形容詞 + 分詞 + 名詞。the poor needed help の needed は動詞）
      const ppNext = !!nx && nx.k === 'w' && !!vc(nx, ['pp', 'ing']) && !vc(nx, ['base']) && !nounC(nx) && !adjC(nx) && md.end + 1 < lim && T[md.end + 1].k === 'w' && !!nounC(T[md.end + 1]) && !PREP[T[md.end + 1].w] && DET[T[md.end + 1].w] === undefined && !PRON[T[md.end + 1].w] &&
        !(i > 0 && isW(T[i - 1], 'the') && /^(?:poor|rich|young|old|elderly|sick|homeless|unemployed|blind|deaf|dead|injured|wealthy|weak|strong|brave|disabled|wounded)$/.test(T[j].w || ''));
      const more = ppNext || (!!nx && nx.k === 'w' && !!multiAt(md.end, lim) && !PREP[nx.w]) || !!nx && nx.k === 'w' && (!NO_COMPOUND[nx.w] ||""")

# free tours / a free shuttle bus → 無料の
rep("""|lesson|lessons|class|classes|ride|rides|pass|passes)$/.test(T[j + 1].w)) { pick(j, a.e); return { ja: '無料の', end: j + 1 }; }""",
    """|lesson|lessons|class|classes|ride|rides|pass|passes|tour|tours|guided|bus|buses|shuttle|shuttles|entry|event|events|workshop|workshops|seminar|seminars|consultation|consultations|checkup|checkups|breakfast|refill|refills|internet|access|map|maps|brochure|brochures|guide|guides|admission|tickets|game|games|course|courses|tuition|medical|health|transportation)$/.test(T[j + 1].w)) { pick(j, a.e); return { ja: '無料の', end: j + 1 }; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
