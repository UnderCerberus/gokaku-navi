import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Cooking, for me, has become … / Music, for many people, is … → 私にとって、料理は…（挿入の for + 人 → 〜にとって）
rep("""        if (!len && isW(T[x + 1], 'for') && /^(?:my|your|his|her|our|their|its)$/.test((T[x + 2] || {}).w || '') && isW(T[x + 3], 'part') && isP(T[x + 4], ',')) { len = 3; ja = '一方'; }""",
    """        if (!len && isW(T[x + 1], 'for') && /^(?:my|your|his|her|our|their|its)$/.test((T[x + 2] || {}).w || '') && isW(T[x + 3], 'part') && isP(T[x + 4], ',')) { len = 3; ja = '一方'; }
        if (!len && isW(T[x + 1], 'for') && x + 3 < b && x > a && T[x - 1].k === 'w' && !!nounC(T[x - 1])) {
          let yF = -1;
          for (let z = x + 3; z < b - 1 && z <= x + 6; z++) { if (isP(T[z], ',')) { yF = z; break; } }
          if (yF > 0 && verbStart(yF + 1)) {
            const mF = mark();
            const nF = np(x + 2, yF, { noRel: true });
            if (nF && nF.end === yF && (nF.an || /^(?:me|us|him|her|them|you|many|most|some)$/.test(T[x + 2].w || ''))) { len = yF - x - 1; ja = nF.ja + 'にとって'; } else fail(mF);
          }
        }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
