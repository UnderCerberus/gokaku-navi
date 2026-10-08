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
      else if (L === 'launch' && /(?:^| )(?:product|products|service|services|app|apps|brand|model|models|campaign|campaigns|program|programs|website|game|games|book|magazine|line)$/.test(oh)) sense = { particle: 'を', core: /(?:campaign|program|website|service)/.test(oh) ? '開始する' : '発売する', tr: true };   // launched a new product → 新しい製品を発売した""")

# More tourists means more income for local businesses → 観光客が増えれば、地元の企業の収入が増える
rep("""    // Hi, Ken. → こんにちは、ケン""",
    """    if (isW(T[0], 'more') && b > 4) {
      const kMn = T.findIndex((x, q) => q > 1 && /^(?:means|mean|meant)$/.test(x.w || '') && isW(T[q + 1], 'more'));
      if (kMn > 0) {
        const mMn = mark();
        const n1Mn = np(1, kMn, {});
        const n2Mn = n1Mn && n1Mn.end === kMn ? np(kMn + 2, b, {}) : null;
        if (n2Mn && n2Mn.end === b) return { ok: true, ja: n1Mn.ja + 'が増えれば、' + n2Mn.ja.replace(/のための(収入|お金|仕事|利益)$/, 'の$1') + 'も増える。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
        fail(mMn);
      }
    }
    // Hi, Ken. → こんにちは、ケン""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/(?:より多くの|もっと)運動を得る/g, 'もっと運動する').replace(/運動を得(る|た)/g, (m0, a0) => '運動す' + (a0 === 'る' ? 'る' : 'た')).replace(/の意識を上げ/g, 'への意識を高め').replace(/意識を上げ/g, '意識を高め').replace(/(?:彼女の|彼の)?([^、。]{1,8}?)のために賞を(受け|もらっ|獲得し)/, '$1で賞を$2').replace(/生徒会の大統領/g, '生徒会長').replace(/(クラブ|委員会|協会|学会|部)の大統領/g, '$1の会長').replace(/会社の大統領/g, '会社の社長');   // get more exercise → もっと運動する / raise awareness → 意識を高める / received an award for her research → 研究で賞を受けた / president of the student council → 生徒会長
    if (tokens.some((x) => x.w === 'turned') && tokens.some((x) => x.w === 'into')) ja = ja.replace(/に向けられ/g, 'に変えられ');   // The old factory was turned into a shopping mall → ショッピングモールに変えられた
    if (tokens.some((x) => /^(?:imported|import|imports|price|prices|country|countries|energy|crude|barrel|barrels|fuel|reserves|spill)$/.test(x.w || '')) && tokens.some((x) => x.w === 'oil')) ja = ja.replace(/油/g, '石油').replace(/大きく(輸入された石油)に頼/, '$1に大きく頼');   // relies heavily on imported oil → 輸入された石油に大きく頼る
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
