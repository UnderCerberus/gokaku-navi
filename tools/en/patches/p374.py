import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/^(春|夏|秋|冬)に、/, '$1には、');"
assert s.count(old) == 1
s = s.replace(old, old + """
    ja = ja.replace(/(帰宅|到着)(?:する|した)とき、/, '$1すると、').replace(/家に(?:帰る|帰った)とき、/, '家に帰ると、');   // When I get home, I do my homework → 帰宅すると、
    ja = ja.replace(/([0-9０-９]+(?:時間|分)(?:間)?)毎(朝|晩|日|週|夕)/g, '毎$2$1');   // She walks for an hour every morning → 毎朝1時間歩く
    ja = ja.replace(/(?:彼女|彼|私|私たち|人)を若く保つ/g, '若さを保つ').replace(/のようであることができる/g, 'のようになれる').replace(/(年をとる|大人になる|大きくなる)とき、/, (m0, a0) => a0.replace(/る$/, 'った') + 'ら、');   // keeps her young → 若さを保つ / I hope I can be like her when I get old → 年をとったら彼女のようになれる
    ja = ja.replace(/より少なくてより少ない([^、。]+?)が(いる|ある)(?=。|$)/, '$1がますます減っている').replace(/^((?:私たちの|私の|その|この)?(?:町|村|市|学校|国|会社|クラス|家族|チーム))は問題がある/, '$1には問題がある');   // There are fewer and fewer young people → 若い人々がますます減っている""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
