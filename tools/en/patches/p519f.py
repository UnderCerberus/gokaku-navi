import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Unlike his brother, who loves sports, he prefers reading → スポーツが大好きな兄とは違って、（文頭の前置詞句 + , who / which … , ）
rep("""          if (pp.prep === 'inside' && !exist) pp.ja = pp.ja.replace(/の中に$/, 'の中で');   // Inside a storm cloud, strong winds carry … → 嵐の雲の中では""",
    """          if (pp.prep === 'inside' && !exist) pp.ja = pp.ja.replace(/の中に$/, 'の中で');   // Inside a storm cloud, strong winds carry … → 嵐の雲の中では
          let relEndL = -1;
          if (isP(T[pp.end], ',') && T[pp.end + 1] && /^(?:who|which)$/.test(T[pp.end + 1].w || '') && pp.obj && pp.obj.ja && pp.ja.indexOf(pp.obj.ja) >= 0) {
            const c2L = T.findIndex((x, q) => q > pp.end + 2 && q < b - 2 && isP(x, ','));
            if (c2L > 0) {
              const mRl = mark();
              const rL = predOnly(pp.end + 2, c2L, { subj: pp.obj, sub: true });
              if (rL && rL.out) { name('relative'); const iO = pp.ja.indexOf(pp.obj.ja); pp.ja = pp.ja.slice(0, iO) + rL.out({ form: 'attr' }) + pp.ja.slice(iO); relEndL = c2L; } else fail(mRl);   // Unlike their parents, who often stayed …,
            }
          }""")
rep("""          st0.other.push((exist && pp.kind === 'place' ? pp.ja.replace(/で$/, 'に') : pp.ja) + (pp.kind === 'place' && /[でに]$/.test(pp.ja) ? 'は' : ''));
          k = pp.end;""",
    """          st0.other.push((exist && pp.kind === 'place' ? pp.ja.replace(/で$/, 'に') : pp.ja) + (pp.kind === 'place' && /[でに]$/.test(pp.ja) ? 'は' : ''));
          k = relEndL > 0 ? relEndL : pp.end;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
