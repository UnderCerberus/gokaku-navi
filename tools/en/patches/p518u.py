import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "/^(.+?[^のでを])(?:と|に)(話す|振る舞う|接する)$/.exec(cw.pred.s) : null;\n      if (mTkW) {"
new = "/^(.+?[^のでを])(?:と|に)(話す|振る舞う|接する)$/.exec(cw.pred.s) : null;\n      if (mTkW && WAYV[mTkW[2]]) {"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
