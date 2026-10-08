import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "      if (wTs.length > 2 && wTs[wTs.length - 1].w === 'too' && !/^(?:much|many)$/.test(wTs[wTs.length - 2].w || '')"
new = "      if (wTs.length > 2 && wTs[wTs.length - 1].w === 'too' && !/^(?:much|many)$/.test(wTs[wTs.length - 2].w || '') && !wTs.some((x) => /^(?:but|and|so|because|when|if|while|although|though|after|before|first|at)$/.test(x.w || ''))"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
