import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# young birds kept in a room with an artificial night sky turned in the direction their species normally flies（付帯状況の with + 名詞 + 分詞のあとの前置詞句に関係詞節が続くなら、分詞は主節の動詞: with の付帯状況にしない）
rep("""        if (s && (after >= lim || isP(T[after], ',') || (T[after].k === 'w' && (PREP[T[after].w] || ADV[T[after].w])))) { name('with-oc'); st.manner.push(s); return after; }""",
    """        const ppAfter = s && after < lim && T[after].k === 'w' && !!PREP[T[after].w] && !!vc(tc, ['past']) ? (() => { const mPa = mark(); const pA = parsePP(after, lim, {}); fail(mPa); return pA; })() : null;
        const longAfter = !!ppAfter && !!ppAfter.obj && (!!ppAfter.obj.rel || (ppAfter.end < lim && T[ppAfter.end].k === 'w' && !PREP[T[ppAfter.end].w]));
        if (s && !longAfter && (after >= lim || isP(T[after], ',') || (T[after].k === 'w' && (PREP[T[after].w] || ADV[T[after].w])))) { name('with-oc'); st.manner.push(s); return after; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
