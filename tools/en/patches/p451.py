import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/誰かより(?!も)/g, '誰よりも')"
assert s.count(old) == 1
s = s.replace(old, "    if (tokens.some((x, q) => x.w === 'as' && tokens[q + 1] && /^(?:a|an)$/.test(tokens[q + 1].w || '') && tokens[q + 2] && /^(?:child|kid|boy|girl|teenager|student)$/.test(tokens[q + 2].w || ''))) ja = ja.replace(/(子ども|少年|少女|10代の若者|学生)として(?![^、。]{0,6}(?:扱|見な|知られ|働|参加))/g, '$1のころに');   // I remember visiting this place as a child → 子どものころにこの場所を訪れたこと\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
