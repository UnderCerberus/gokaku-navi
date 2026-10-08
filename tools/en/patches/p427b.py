import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "      const left = (je < j && je - a >= 4 && (isW(T[a], 'what') || order[oi][1] === 0 || T.slice(a + 1, je).some((x) => x.k === 'w' && SUB[x.w] && !WH[x.w])) ? sentence(a, je, o) : null) || clause(a, je, o) ||   // 左側に従属節があれば文として読む"
assert s.count(old) == 1
s = s.replace(old, "      const left = (je < j && je - a >= 4 && (isW(T[a], 'what') || order[oi][1] === 0 || T.slice(a + 1, je).some((x) => x.k === 'w' && SUB[x.w] && !WH[x.w]) || (T[a].k === 'w' && /^(?:if|unless|because|although|though|since|once|after|before|while)$/.test(T[a].w) && T.slice(a + 2, je).some((x) => isP(x, ',')))) ? sentence(a, je, o) : null) || clause(a, je, o) ||   // 左側に従属節があれば文として読む（文頭の If …, S V, and S V も）")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
