import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """          const p1 = rM1.ja.replace(/。$/, '').replace(/(?:ことがある|ことができる|かもしれない|だろう)$/, '').replace(/くする$/, 'くし').replace(/する$/, 'し').replace(/([うくぐすつぬぶむる])$/, (m0) => ({ 'う': 'い', 'く': 'き', 'ぐ': 'ぎ', 'す': 'し', 'つ': 'ち', 'ぬ': 'に', 'ぶ': 'び', 'む': 'み', 'る': '' })[m0] || m0);
          if (sj2) return Object.assign({}, rM2, { ja: p1 + '、' + rM2.ja.slice(sj2[0].length) });"""
assert s.count(old) == 1
s = s.replace(old, """          const j1 = rM1.ja.replace(/。$/, '');
          const okEnd = /(?:ことがある|ことができる|かもしれない|だろう)$/.test(j1);
          const base1 = j1.replace(/(?:ことがある|ことができる|かもしれない|だろう)$/, '');
          const REN = { 'う': 'い', 'く': 'き', 'ぐ': 'ぎ', 'す': 'し', 'つ': 'ち', 'ぬ': 'に', 'ぶ': 'び', 'む': 'み' };
          const p1 = /する$/.test(base1) ? base1.replace(/する$/, 'し') : (/[いきぎしじちにひびみりえけげせぜてでねへべめれ]る$/.test(base1) ? base1.replace(/る$/, '') : (/る$/.test(base1) ? base1.replace(/る$/, 'り') : base1.replace(/([うくぐすつぬぶむ])$/, (m0) => REN[m0])));
          if (sj2 && okEnd) return Object.assign({}, rM2, { ja: p1 + '、' + rM2.ja.slice(sj2[0].length) });""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
