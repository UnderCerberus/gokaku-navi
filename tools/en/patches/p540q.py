import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# She is not very interested in sports → スポーツにあまり興味がない / I am not so afraid of dogs → 犬をそれほど恐れていない
# （be + 形容詞の熟語の前の not very / not so は「あまり・それほど」）
rep("""&& T[kk].w !== 'too') { deg0 += DEGX[T[kk].w] && !(ADV[T[kk].w] && ADV[T[kk].w][1] === 'd') ? DEGX[T[kk].w] : ADV[T[kk].w][0]; kk++; }""",
    """&& T[kk].w !== 'too') { deg0 += vg.neg && /^(?:very|so)$/.test(T[kk].w) ? (T[kk].w === 'so' ? 'それほど' : 'あまり') : (DEGX[T[kk].w] && !(ADV[T[kk].w] && ADV[T[kk].w][1] === 'd') ? DEGX[T[kk].w] : ADV[T[kk].w][0]); kk++; }""")

# I am less afraid of dogs now → 犬をあまり恐れていない / much less afraid of speaking in public → 人前で話すことをあまり恐れていない
# （be + less + 形容詞の熟語（than なし）は「あまり〜ない」。「犬のあまり恐れていない」にしない）
rep("""      if (kD + 1 < lim && !!adjC(T[kD + 1]) && !nounC(T[kD + 1])) { degP = T[kD].w === 'most' ? '最も' : 'より'; lessP = T[kD].w === 'less'; kk = kD + 1; }
    }""",
    """      if (kD + 1 < lim && !!adjC(T[kD + 1]) && !nounC(T[kD + 1])) { degP = T[kD].w === 'most' ? '最も' : 'より'; lessP = T[kD].w === 'less'; kk = kD + 1; }
    }
    let lessN = false;
    if (!degP && kk + 2 < lim && isW(T[kk], 'less') && !isW(T[kk + 1], 'likely') && !!adjC(T[kk + 1]) && !nounC(T[kk + 1]) && !vg.neg && !T.some((x) => isW(x, 'than'))) { degP = 'あまり'; lessN = true; kk++; if (/^(?:ずっと|はるかに)$/.test(deg0)) deg0 = ''; }""")

rep("""        if (!obj.ja && !/〜/.test(jaK)) core = P(deg0 + degP + jaK);
        end = obj.end;""",
    """        if (!obj.ja && !/〜/.test(jaK)) core = P(deg0 + degP + jaK);
        if (lessN) core = core.aux('neg');
        end = obj.end;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
