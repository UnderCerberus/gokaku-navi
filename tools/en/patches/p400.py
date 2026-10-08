import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/^((?:私たちの|私の|その|この)?(?:町|村|市|学校|地域|国|地方))は((?:毎年|毎週|毎月)?[^、。]{0,14}?(?:祭り|イベント|行事|お祭り|花火大会|大会|マラソン)がある)/, '$1では$2').replace(/を着ていて、(?=[^。]*?(?:踊|歌|歩|走|遊|行|参加))/, 'を着て、');   // Our town has a famous festival → 私たちの町では有名な祭りがある / wear … and dance → 着て、踊る\n    if (tokens.some((x) => x.w === 'held') && !tokens.some((x) => /^(?:hand|hands|arm|arms|bag|baby|breath|hostage|hostages|tight|tightly)$/.test(x.w || ''))) ja = ja.replace(/持たれて(いる|いた)/g, '行われて$1').replace(/持たれ(る|た)/g, '行われ$1');   // It is held to pray for a good harvest → 豊作を祈るために行われている\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
