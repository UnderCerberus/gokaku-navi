import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# being busy is the same as being productive → 生産的であることと同じだ（the same as + 動名詞）
rep("""        else { const nX = np(kSm + 3, lim, { noRel: true }); if (nX) { nSm = nX; endSm = nX.end; } }
        if (nSm && endSm > 0) { name('idiom');""",
    """        else { const nX = np(kSm + 3, lim, { noRel: true }); if (nX) { nSm = nX; endSm = nX.end; } }
        if ((!nSm || endSm < lim) && T[kSm + 3] && T[kSm + 3].k === 'w' && !!vc(T[kSm + 3], ['ing']) && (isW(T[kSm + 3], 'being') || ingVerb(kSm + 3, lim))) {
          const gSm = vpNonfin(kSm + 3, lim, 'ing', {});
          if (gSm && gSm.end > endSm) { nSm = { ja: vpJoin(gSm, 'attr').replace(/な$/, 'である') + 'こと' }; endSm = gSm.end; }
        }
        if (nSm && endSm > 0) { name('idiom');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
