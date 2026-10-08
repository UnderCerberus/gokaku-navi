import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/(練習|買い物|勉強|散歩|見学|観光|登山|調査|取材|応援)するために(行|来)/g, '$1しに$2')"
assert s.count(old) == 1
s = s.replace(old, "    if (tokens[0] && tokens[0].w === 'it' && tokens[1] && /^(?:sounds|sounded|seems|seemed|looks|looked)$/.test(tokens[1].w || '') && tokens[2] && tokens[2].w === 'like' && tokens[3] && tokens[3].w !== 'it') ja = ja.replace(/^それは(?=[^、。]+よう)/, '');   // It sounds like he is angry → 彼が怒っているようだ\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
