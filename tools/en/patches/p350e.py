import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# They built the castle over ten years → 10年かけて城を建てた（over + 数 + 期間 は目的語にしない）
rep("""      if (advOnly) { k = modOther(j0, lim, st, o, vg); if (k > 0) { j = k; continue; } }""",
    """      if (advOnly) { k = modOther(j0, lim, st, o, vg); if (k > 0) { j = k; continue; } }
      if (isW(t, 'over') && approxNum && T[j0 + 2] && !!DURUNIT[(T[j0 + 2].w || '').replace(/ies$/, 'y').replace(/s$/, '')] && !/^(?:take|spend|cost|last|need|require|wait|have|give|save|lose|earn|pay|be|stay|live|work|study)$/.test(L)) {
        const stOv = newSt(vg);
        const kOv = tail(j0, j0 + 3, stOv, o, vg);
        if (kOv === j0 + 3 && stOv.other.concat(stOv.time).length) { stOv.other.concat(stOv.time).forEach((x) => st.other.push(x)); j = j0 + 3; continue; }
      }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
