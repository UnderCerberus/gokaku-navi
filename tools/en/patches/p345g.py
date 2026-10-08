import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# fix the problem → 問題を解決する / fix the bug → バグを修正する / fix dinner → 夕食を作る
rep("""      else if (L === 'provide' && /(?:^| )(?:evidence|proof|clue|clues|hint|hints|example|examples|insight|insights)$/.test(oh)) sense = { particle: 'を', core: '示す', tr: true };""",
    """      else if (L === 'provide' && /(?:^| )(?:evidence|proof|clue|clues|hint|hints|example|examples|insight|insights)$/.test(oh)) sense = { particle: 'を', core: '示す', tr: true };
      else if (L === 'provide' && /(?:^| )(?:water|electricity|energy|power|oxygen|gas|fuel|nutrients|nutrient|heat|blood|nutrition|food|minerals|vitamins)$/.test(oh)) sense = { particle: 'を', core: '供給する', tr: true };   // Plants provide oxygen → 酸素を供給する（ほかは 提供する）
      else if (L === 'fix' && /(?:^| )(?:problem|problems|issue|issues|situation|trouble|conflict)$/.test(oh)) sense = { particle: 'を', core: '解決する', tr: true };
      else if (L === 'fix' && /(?:^| )(?:bug|bugs|error|errors|mistake|mistakes|typo|typos|grammar|spelling|code|program|software)$/.test(oh)) sense = { particle: 'を', core: '修正する', tr: true };
      else if (L === 'fix' && /(?:^| )(?:dinner|lunch|breakfast|meal|meals|sandwich|sandwiches|snack|snacks|drink|drinks|coffee|tea)$/.test(oh)) sense = { particle: 'を', core: '作る', tr: true };   // I'll fix you some lunch → 昼食を作る
      else if (L === 'fix' && /(?:^| )(?:hair|makeup|tie|collar)$/.test(oh)) sense = { particle: 'を', core: '整える', tr: true };""")

rep("""    ja = ja.replace(/太陽の中で/g, '日なたで').replace(/太陽の中に/g, '日なたに');""",
    """    ja = ja.replace(/太陽の中で/g, '日なたで').replace(/太陽の中に/g, '日なたに');
    if (tokens.some((x) => /^(?:fixed|fix|fixes|fixing)$/.test(x.w || ''))) ja = ja.replace(/(問題|課題|トラブル)は([^、。]{0,10}?)修理され/, '$1は$2解決され').replace(/(?:虫|バグ)は([^、。]{0,10}?)修理され/, 'バグは$1修正され').replace(/(誤り|間違い|エラー|ミス)は([^、。]{0,10}?)修理され/, '$1は$2修正され');   // The problem will be fixed soon → 問題はすぐに解決される""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
