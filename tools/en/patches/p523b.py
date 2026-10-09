import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Only by working together can countries hope to solve … → 国は…解決することを望める（主語の名詞のあとの原形 hope は動詞。缶 にしない）
# Only in this way can we … → このようにしてのみ / Only in Japan can you … → 日本でだけ（時の句だけ 〜になって初めて）
rep("""        else { const ppO = parsePP(a + 1, xe, {}); if (ppO && ppO.end === xe) unJa = aux.w === 'by' ? ppO.ja.replace(/(?:によって|で)$/, '') + 'によってのみ' : ppO.ja.replace(/[にで]$/, '') + 'になって初めて'; }
        if (!unJa) { fail(mO); continue; }
        const sjO = np1(x + 1, b, { noRel: true, noPost: true });
        if (!sjO) { fail(mO); continue; }""",
    """        else if (seq(a + 1, ['in', 'this', 'way']) || seq(a + 1, ['in', 'that', 'way']) || seq(a + 1, ['in', 'these', 'ways'])) { if (x === a + 4) unJa = 'このようにしてのみ'; }
        else { const ppO = parsePP(a + 1, xe, {}); if (ppO && ppO.end === xe) unJa = aux.w === 'by' ? ppO.ja.replace(/(?:によって|で)$/, '') + 'によってのみ' : (ppO.kind === 'time' || /^(?:after|when|at)$/.test(aux.w) && ppO.kind !== 'place' ? ppO.ja.replace(/[にで]$/, '') + 'になって初めて' : (ppO.kind === 'place' ? ppO.ja.replace(/に$/, 'で') + 'だけ' : ppO.ja.replace(/(?:によって|で|に)$/, '') + 'によってのみ')); }
        if (!unJa) { fail(mO); continue; }
        let sjO = np1(x + 1, b, { noRel: true, noPost: true });
        if (!sjO) { fail(mO); continue; }
        if ((MODAL[T[x].w] || DO[T[x].w]) && sjO.end - 1 > x + 1 && T[sjO.end - 1].k === 'w' && !!vc(T[sjO.end - 1], ['base'])) { const mS2 = mark(); const sj2 = np1(x + 1, sjO.end - 1, { noRel: true, noPost: true }); if (sj2 && sj2.end === sjO.end - 1) sjO = sj2; else fail(mS2); }   // can countries hope to … の hope は動詞""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
