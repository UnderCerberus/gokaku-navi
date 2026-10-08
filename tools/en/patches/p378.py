import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/^(春|夏|秋|冬)に、/, '$1には、');"
assert s.count(old) == 1
s = s.replace(old, old + """
    if (tokens[0] && tokens[0].w === 'it' && tokens.some((x, q) => /^(?:way|place|chance|opportunity|method|means)$/.test(x.w || '') && tokens[q + 1] && tokens[q + 1].w === 'to')) ja = ja.replace(/^([^。]+?)ことは((?:良い|いい|すばらしい|最高の|最善の|一番いい|簡単な|安全な|楽しい|効果的な|大切な)?)(方法|場所|機会|チャンス|手段)(だ|だった)(?=。|$)/, (m0, a0, d0, n0, e0) => 'それは' + (n0 === '場所' ? a0.replace(/生きる$/, '住む') + 'のに' : a0.replace(/、/g, '')) + d0 + n0 + e0);   // It is a good way to relax → それはくつろぐ良い方法だ / It is a good place to live → それは住むのに良い場所だ
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要').replace(/速く変わ/g, '急に変わ').replace(/彼らを((?:とても|もっと)?上手に)?使(え|う|っ)/g, (m0, a0, b0) => 'それらを' + (a0 || '') + '使' + b0).replace(/彼らの使い方/g, 'その使い方');   // you need to be careful → 気をつける必要がある / use them → それらを使う""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
