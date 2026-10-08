import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/(深刻な|大きな|新たな|重大な)?挑戦をもたらす/g, (m0, a0) => (a0 || '') + '課題をもたらす');"
assert s.count(old) == 1
s = s.replace(old, old + """
    ja = ja.replace(/(施行される|完成する|開業する|開通する|開始される|オープンする|発売される|開催される)と期待されている/g, '$1予定だ').replace(/前の(研究|調査|実験|報告)/g, '以前の$1');   // are expected to come into effect next spring → 施行される予定だ / previous studies → 以前の研究
    if (tokens.some((x) => /^(?:drought|droughts|climate|global|warming|weather|summer|summers|heat|ice|glaciers|heatwave|heatwaves|crops|rainfall)$/.test(x.w || ''))) ja = ja.replace(/温度の上昇/g, '気温の上昇').replace(/上昇する温度/g, '上昇する気温');   // Rising temperatures have led to more frequent droughts → 気温の上昇""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
