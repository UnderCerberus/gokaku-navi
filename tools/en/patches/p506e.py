import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# take A for granted / take A into account / leave A alone / do A a favor（動詞 + A + 決まった語。これまで索引に載っていなかった）
rep("""        else if (last === 'do' || last === 'doing' || last === 'done') add(IDX.verb, w0, { lit: low.slice(2, -1), ja: ja, shape: 'A' + last, it: it });
      }""",
    """        else if (last === 'do' || last === 'doing' || last === 'done') add(IDX.verb, w0, { lit: low.slice(2, -1), ja: ja, shape: 'A' + last, it: it });
      } else if (nph === 1 && ph[1] === 'A' && isVerb0 && toks.length >= 4 && !/^(?:do|doing|done|~)$/.test(last) && /A/.test(ja)) {
        add(IDX.verb, w0, { lit: low.slice(2), ja: ja, shape: 'Alit', it: it });
      }""")
rep("""      } else if (it.shape === 'Ado' || it.shape === 'Adoing' || it.shape === 'Adone') {""",
    """      } else if (it.shape === 'Alit') {
        let aL = objBefore(i, lim, (x, q) => seq(q, it.lit));
        // the support she had taken for granted（A が関係詞で前に出ている）
        if (!aL && o.gap && o.gap.type === 'np' && !o.gap.used && seq(i, it.lit)) { o.gap.used = true; aL = { ja: o.gap.rel ? '' : o.gap.node.ja, end: i, gap: true }; }
        if (!aL || aL.end + n > lim) { fail(m); continue; }
        const jaL = it.ja.replace(/A(?:を|に|が|と|の)?/, (m0) => (aL.ja ? aL.ja + m0.slice(1) : ''));
        r = done(vg, P(jaL), st, tail(aL.end + n, lim, st, o, vg), 'SVO', o, [], { noStative: true });
      } else if (it.shape === 'Ado' || it.shape === 'Adoing' || it.shape === 'Adone') {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
