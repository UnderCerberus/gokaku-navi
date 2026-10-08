import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "&& !!nounC(T[j + fx[k].toks.length]) && !PREP[T[j + fx[k].toks.length].w] && !vc(T[j + fx[k].toks.length], ['3sg', 'past'])) continue;   // in public places → 公共の場所で"
new = "&& !!nounC(T[j + fx[k].toks.length]) && !PREP[T[j + fx[k].toks.length].w]) continue;   // in public places → 公共の場所で"
assert s.count(old) == 1
s = s.replace(old, new)
old2 = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old2) == 1
s = s.replace(old2, "    if (tokens.some((x) => /^(?:invest|invests|invested|investing)$/.test(x.w || ''))) ja = ja.replace(/([^、。]{1,12}?)で(もっと|さらに|多く|大きく)?投資/g, '$1に$2投資');   // invest more in renewable energy → 再生可能エネルギーにもっと投資する\n" + old2)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
