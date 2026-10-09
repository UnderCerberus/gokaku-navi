import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# those who speak only one → 1つしか話さない人々 / I have only one → 1つしか持っていない（only one が代名詞の目的語。唯一のもの にしない）
rep("""      if (t.k === 'w' && t.w === 'only' && j0 === j && objs.length === 0 && !vg.passive && !vg.neg && j0 + 1 < lim && T[j0 + 1].k === 'w' && (DET[T[j0 + 1].w] !== undefined""",
    """      if (t.k === 'w' && t.w === 'only' && j0 === j && objs.length === 0 && !vg.passive && !vg.neg && isW(T[j0 + 1], 'one') && (j0 + 2 >= lim || T[j0 + 2].k === 'p' || /^(?:than|because|when|if|and|but|or|so|before|after|in|at|on|for|with|from|to|now|today|then|left|anymore)$/.test(T[j0 + 2].w || ''))) {
        if (/^(?:and|but|or)$/.test(T[j0 + 2] ? T[j0 + 2].w || '' : '')) objs.push({ ja: '1つだけ', end: j0 + 2, head: 'one', pron: 'one' });   // bought only one and left → 1つだけ買って
        else { objs.push({ ja: '1つ', end: j0 + 2, head: 'one', pron: 'one', shika: true }); st.neg = true; }
        j = j0 + 2; continue;
      }
      if (t.k === 'w' && t.w === 'only' && j0 === j && objs.length === 0 && !vg.passive && !vg.neg && j0 + 1 < lim && T[j0 + 1].k === 'w' && (DET[T[j0 + 1].w] !== undefined""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
