import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, """    ja = ja.replace(/どのように([^、。]{1,10}?)られているか/g, 'どのように$1られるか');   // Do you know how chocolate is made? → どのように作られるか
    if (tokens.some((x) => /^(?:picked|pick|picks|picking)$/.test(x.w || '')) && tokens.some((x) => /^(?:beans|bean|tea|fruit|fruits|apples|apple|leaves|flowers|berries|strawberries|grapes|cotton|mushrooms|vegetables|they|them)$/.test(x.w || '')) && tokens.some((x) => /^(?:after|then|dried|grow|grown|harvest|harvested|tree|trees|farm|farms|field|fields)$/.test(x.w || ''))) ja = ja.replace(/選ばれ/g, '摘まれ');   // After they are picked → 摘まれた後
    ja = ja.replace(/(られ|され|まれ)ていた後で、/, '$1た後、').replace(/(^|、)彼らは([^、。]{0,12}?)(摘まれ|乾かされ|送られ|作られ|育てられ|収穫され|加工され|運ばれ|包まれ|焼かれ|洗われ|切られ)/g, '$1$2$3');   // they are dried in the sun → 日なたで乾かされる（物を受ける they は訳さない）
    if (tokens.some((x) => /^(?:after|then|next|finally|first)$/.test(x.w || ''))) ja = ja.replace(/(乾かされ|送られ|運ばれ|加工され|焼かれ|洗われ|包まれ|摘まれ|収穫され)ている(?=。|$)/, '$1る');   // Then they are sent to factories → それから、工場に送られる（作り方の手順）
    ja = ja.replace(/(木|つる)で(成長|育)(する|つ)(?=。|$)/, '$1になる');   // The beans grow on trees → 豆は木になる
    if (tokens.some((x) => x.w === 'much') && tokens.some((x) => /^(?:not|didn't|doesn't|don't|never)$/.test(x.w || ''))) ja = ja.replace(/ずっと([^、。]{1,8}?)(なかった|ない)(?=。|$)/, 'あまり$1$2');   // She didn't talk much in class → あまり話さなかった
""" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
