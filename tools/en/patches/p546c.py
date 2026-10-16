import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# require too much space to be grown indoors → 屋内で育てられるにはスペースを必要としすぎる / I have too much work to go out → 外出するには仕事が多すぎる
# （too much / many + 名詞 + to do の to 不定詞は名詞にかけず、「〜するには」として動詞にかける）
rep("""      if (nomTM) return postMod({ ja: nomTM.head === 'space' ? nomTM.ja.replace(/宇宙$/, 'スペース') : nomTM.ja, end: nomTM.end, head: nomTM.head, pl: nomTM.pl, an: nomTM.an, c: nomTM.c, tooMuch: true }, lim, o);""",
    """      if (nomTM) {
        const ndTM = { ja: nomTM.head === 'space' ? nomTM.ja.replace(/宇宙$/, 'スペース') : nomTM.ja, end: nomTM.end, head: nomTM.head, pl: nomTM.pl, an: nomTM.an, c: nomTM.c, tooMuch: true };
        if (isW(T[nomTM.end], 'to') && nomTM.end + 1 < lim && T[nomTM.end + 1].k === 'w' && (!!vc(T[nomTM.end + 1], ['base']) || isW(T[nomTM.end + 1], 'be'))) return ndTM;
        return postMod(ndTM, lim, o);
      }""")
rep("""      if (inf) { name('inf-adv'); st.other.push(inf.neg ? vpJoin(inf, 'neg') + 'ように' : vpJoin(inf, 'dict') + 'ために'); return inf.end; }""",
    """      const tooTo = j > 2 && T.slice(Math.max(0, j - 7), j).some((x, q, arr) => isW(x, 'too') && arr[q + 1] && /^(?:much|many)$/.test(arr[q + 1].w || ''));
      if (inf) { name('inf-adv'); st.other.push(inf.neg ? vpJoin(inf, 'neg') + 'ように' : vpJoin(inf, 'dict') + (tooTo ? 'には' : 'ために')); return inf.end; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
