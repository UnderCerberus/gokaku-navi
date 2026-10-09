import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "      if (cw && cw.pred && WAYV[cw.pred.s] && (cw.parts || []).length === 1 &&"
new = """      const mTkW = cw && cw.pred && !(cw.parts || []).length && !cw.neg && !cw.modal && cw.subj && cw.subj.ja ? /^(.+?[^のでを])(?:と|に)(話す|振る舞う|接する)$/.exec(cw.pred.s) : null;
      if (mTkW) { name('rel-adv'); return Object.assign({}, node, { ja: cw.subj.ja + 'の' + mTkW[1].replace(/^自分の/, '') + 'への' + WAYV[mTkW[2]], end: e, rel: true }); }   // the way he talks to his brother（talk to ~ の熟語）
      if (cw && cw.pred && WAYV[cw.pred.s] && (cw.parts || []).length === 1 &&"""
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
