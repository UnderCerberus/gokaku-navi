import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) are known to recognize themselves → 〜すると知られている（知っていられている にしない）
rep("""    return done(vg, L === 'consider' ? P('考える', 'v1') : P(verbSense(vg.e, true).core), st, inf.end, 'SV', o, [body + 'と']);   // is considered to be → 〜だと考えられている""",
    """    return done(vg, L === 'consider' ? P('考える', 'v1') : (L === 'know' ? P('知る', 'v5') : P(verbSense(vg.e, true).core)), st, inf.end, 'SV', o, [body + 'と']);   // is considered to be → 〜だと考えられている / is known to … → 〜と知られている""")

# 2) the cleaner the air is（名詞にもある比較級 cleaner → clean の比較級として読む）
rep("""        const ac = cand(T[k], '副', ['comp']) || cand(T[k], '形', ['comp']);
        if (!ac) return null;
        const aj = cand(T[k], '形', ['comp']);""",
    """        const erBase = !cand(T[k], '形', ['comp']) && /(?:er)$/.test(T[k].w || '') ? (() => { const bw = T[k].w.replace(/er$/, ''); const bc = cand({ k: 'w', w: bw, s: bw }, '形', ['base']) || cand({ k: 'w', w: bw + 'e', s: bw + 'e' }, '形', ['base']); return bc ? Object.assign({}, bc, { form: 'comp' }) : null; })() : null;   // the cleaner the air is（cleaner = 掃除機 にしない）
        const ac = cand(T[k], '副', ['comp']) || cand(T[k], '形', ['comp']) || erBase;
        if (!ac) return null;
        const aj = cand(T[k], '形', ['comp']) || erBase;""")

# 3) The fewer cars there are, … → 車が少なければ少ないほど（the fewer / more + 名詞 + there be）
rep("""        if (nN && nN.end < e && s !== a && !isW(T[k], 'more')) {""",
    """        if (nN && nN.end + 2 === e && isW(T[nN.end], 'there') && T[nN.end + 1].k === 'w' && BE[T[nN.end + 1].w]) { pick(k + 1, null); return { adj: en.jp.adj(isW(T[k], 'more') ? '多い' : '少ない'), subj: { ja: nN.ja.replace(/^(?:より少ない|多くの|たくさんの)/, '') } }; }   // the fewer cars there are → 車が少なければ少ないほど
        if (nN && nN.end < e && s !== a && !isW(T[k], 'more')) {""")

# 4) square（広場）: in / at the square + 集まる・会う など
rep("""      case 'in':
        if (few) return R(n + 'で', 'other', n + 'での');""",
    """      case 'in':
        if (few) return R(n + 'で', 'other', n + 'での');
        if (obj.head === 'square' && /^(?:四角形|正方形)$/.test(n)) return R('広場で', 'place', '広場の');   // gathered in the square → 広場に集まった""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
