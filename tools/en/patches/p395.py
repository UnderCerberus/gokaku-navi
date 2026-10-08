import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# a place where people can meet and relax → 人々が会ったりくつろいだりできる場所（関係副詞の節の中の 助動詞 + 動詞の並列）
rep("""        const cl3 = clause(j + 1, ends[q], { sub: true, relWhere: w === 'where' });
        if (cl3) { e = ends[q]; return fin(cl3.out({ part: 'が', form: 'attr' }), 'rel-adv'); }""",
    """        if (T.slice(j + 1, ends[q]).some((x) => x.k === 'w' && !!MODAL[x.w]) && T.slice(j + 2, ends[q] - 1).some((x, k) => (isW(x, 'and') || isW(x, 'or')) && T[j + 3 + k] && T[j + 3 + k].k === 'w' && !!vc(T[j + 3 + k], ['base']) && !nounC(T[j + 3 + k]))) {
          const mSl = mark();
          const sl3 = sentence(j + 1, ends[q], { sub: true });
          if (sl3 && sl3.out) { e = ends[q]; return fin(sl3.out({ part: 'が', form: 'attr' }), 'rel-adv'); }
          fail(mSl);
        }
        const cl3 = clause(j + 1, ends[q], { sub: true, relWhere: w === 'where' });
        if (cl3) { e = ends[q]; return fin(cl3.out({ part: 'が', form: 'attr' }), 'rel-adv'); }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
