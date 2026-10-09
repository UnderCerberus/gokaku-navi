import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I like red apples more than green ones → 緑のりんごよりも赤いりんごが好きだ（好き・大切の動詞は物でも よりも）
# Children who read books learn more than the ones who don't / He earns more than me → 〜より多く学ぶ・私より多く稼ぐ（人と比べる more than は 以上 にしない）
rep("""      if (anyThMt || anyOneMt || (degMt && (obj.pron || obj.an || !!PN_JA[obj.ja]))) {
        const ja3 = anyThMt ? '何よりも' : (anyOneMt ? '誰よりも' : obj.ja + 'よりも');""",
    """      const degMt2 = degMt && T.slice(Math.max(0, i - 5), i).some((x) => x.k === 'w' && /^(?:like|likes|liked|love|loves|loved|hate|hates|hated|prefer|prefers|preferred|value|values|valued|miss|misses|missed|enjoy|enjoys|enjoyed|trust|trusts|trusted|respect|respects|respected|fear|fears|feared|admire|admires|admired|appreciate|appreciates|appreciated|treasure|treasures|treasured|cherish|cherishes|cherished)$/.test(x.w));
      const anMt = obj.pron || obj.an || !!PN_JA[obj.ja];
      if (anyThMt || anyOneMt || (degMt && anMt) || degMt2 || (anMt && !(/^(?:that|this|it|these|those|one)$/.test(obj.pron || '') && !obj.an))) {
        const ja3 = anyThMt ? '何よりも' : (anyOneMt ? '誰よりも' : obj.ja + (degMt || degMt2 ? 'よりも' : 'より多く'));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
