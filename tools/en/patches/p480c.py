import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 語注に出ない語（order）を作らないよう、in an attempt to の置き換えはやめて、構文で読む（〜しようとして）
rep(r"""
      .replace(/\b([Ii])n an? (?:attempt|effort|bid) to\b/g, '$1n order to')   // in an attempt to slow inflation → インフレを抑えるために""", "")

rep("""    const inf0 = isW(t, 'to') ? j + 1 : ((seq(j, ['in', 'order', 'to']) || seq(j, ['so', 'as', 'to'])) ? j + 3 : -1);""",
    """    const tryInf = seq(j, ['in', 'an', 'attempt', 'to']) || seq(j, ['in', 'an', 'effort', 'to']) || seq(j, ['in', 'a', 'bid', 'to']);   // in an attempt to slow inflation → インフレを抑えようとして
    const inf0 = isW(t, 'to') ? j + 1 : ((seq(j, ['in', 'order', 'to']) || seq(j, ['so', 'as', 'to'])) ? j + 3 : (tryInf ? j + 4 : -1));""")

rep("""      if (inf) { name('inf-adv'); st.other.push(inf.neg ? vpJoin(inf, 'neg') + 'ように' : vpJoin(inf, 'dict') + 'ために'); return inf.end; }
      fail(m);""",
    """      if (inf && tryInf && !inf.neg && verbal(inf.pred)) { name('inf-adv'); st.other.push(inf.parts.join('') + inf.pred.form('vol') + 'として'); return inf.end; }
      if (inf) { name('inf-adv'); st.other.push(inf.neg ? vpJoin(inf, 'neg') + 'ように' : vpJoin(inf, 'dict') + 'ために'); return inf.end; }
      fail(m);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
