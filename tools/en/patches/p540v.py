import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# this reward makes the student more likely to repeat the behavior → 学生が行動を繰り返す可能性を高める
# （make + 目的語 + (more / less) likely to do は「〜が…する可能性を高める・下げる」。「学生をよりありそうにする」にしない）
rep("""        let os = objStr(ob, 'を', st);
        const cmpA2 = adjC(T[ap2.idx]);""",
    """        if (L === 'make' && ap2.lemma === 'likely' && isW(T[ap2.end], 'to') && ap2.end + 1 < lim && !!vc(T[ap2.end + 1], ['base'])) {
          const mLk = mark();
          const iLk = vpNonfin(ap2.end + 1, lim, 'base', { subj: ob });
          if (iLk && verbal(iLk.pred)) {
            const lessLk = T.slice(j, ap2.idx).some((x) => isW(x, 'less'));
            pick(ap2.idx, ap2.e);
            name('svoc');
            return done(vg, P((ob.pron === 'it' ? '' : ob.ja + 'が') + vpJoin(iLk, 'dict') + '可能性を' + (lessLk ? '下げる' : '高める'), 'v1'), st, tail(iLk.end, lim, st, o, vg), 'SVO', o, [], { noStative: true });
          }
          fail(mLk);
        }
        let os = objStr(ob, 'を', st);
        const cmpA2 = adjC(T[ap2.idx]);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
