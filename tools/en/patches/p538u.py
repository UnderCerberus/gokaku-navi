import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I am planning to study abroad again when I enter university, and … → 大学に入るときもう一度留学するつもりで（again は後ろの時の節より後に置く。「もう一度大学に入るとき」にしない）
rep("""      st.time = st.time.map((x) => (x === '再び' ? agJ : x));
      if (agJ === '二度と') st.never = false;""",
    """      st.time = st.time.map((x) => (x === '再び' ? agJ : x));
      const isClT = (x) => x.length > 4 && /(?:とき|ときに|たら|前に|後で|後に|までに|間に|際に)、?$/.test(x);
      const kAg = st.time.indexOf(agJ);
      const kAgO = kAg >= 0 ? st.other.findIndex(isClT) : -1;
      if (kAg >= 0 && st.time.slice(kAg + 1).some(isClT)) { st.time.splice(kAg, 1); st.time.push(agJ); }
      else if (kAgO >= 0) { st.time.splice(kAg, 1); st.other.splice(kAgO + 1, 0, agJ); }
      if (agJ === '二度と') st.never = false;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
