import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I do not like the way he talks to his younger brother → 彼の弟への話し方（the way + S + V + 相手の句 → 〜への話し方）
rep("""      if (cw && cw.pred && WAYV[cw.pred.s] && !(cw.parts || []).length && !cw.neg && cw.subj && cw.subj.ja && !cw.modal) { name('rel-adv'); return Object.assign({}, node, { ja: cw.subj.ja + 'の' + WAYV[cw.pred.s], end: e, rel: true }); }""",
    """      if (cw && cw.pred && WAYV[cw.pred.s] && !(cw.parts || []).length && !cw.neg && cw.subj && cw.subj.ja && !cw.modal) { name('rel-adv'); return Object.assign({}, node, { ja: cw.subj.ja + 'の' + WAYV[cw.pred.s], end: e, rel: true }); }
      if (cw && cw.pred && WAYV[cw.pred.s] && (cw.parts || []).length === 1 && /[^のでを](?:に|と)$/.test(cw.parts[0]) && /^(?:話す|振る舞う|行動する|接する)$/.test(cw.pred.s) && !cw.neg && cw.subj && cw.subj.ja && !cw.modal) { name('rel-adv'); return Object.assign({}, node, { ja: cw.subj.ja + 'の' + cw.parts[0].replace(/^自分の/, '').replace(/(?:に|と)$/, 'への') + WAYV[cw.pred.s], end: e, rel: true }); }   // the way he talks to his brother → 彼の弟への話し方""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
