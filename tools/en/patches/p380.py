import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, """    ja = ja.replace(/^何人かの([^、。]{1,10}?)(?:たち)?が([^。]+?、[^。]+?)(?:。)?$/, (m0, a0, b0) => (/(?:る|う|く|ぐ|す|つ|ぬ|ぶ|む|ない|た)$/.test(b0) ? b0 + a0.replace(/(?:たち|人々)$/, '') + 'もいる' : m0));   // Some students use them late at night and don't get enough sleep → …十分な睡眠をとらない学生もいる
    if (tokens.some((x) => /^(?:spend|spends|spent|spending|waste|wasted|wastes)$/.test(x.w || '')) && tokens.some((x, q) => x.w === 'hours' && !(tokens[q - 1] && (tokens[q - 1].k === 'num' || NUMW[tokens[q - 1].w] !== undefined || /^(?:two|three|many|several|few|the)$/.test(tokens[q - 1].w || ''))))) ja = ja.replace(/時間を/, '何時間も');   // Others spend hours on social media → 何時間もSNSに費やす
    ja = ja.replace(/(看護師|医者|先生|祖母|祖父|母|父|おば|おじ|友達|彼女|彼)(?:さん)?(が|は)私の世話をした/, '$1$2私の世話をしてくれた');   // a nurse took care of me → 看護師が私の世話をしてくれた
""" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
