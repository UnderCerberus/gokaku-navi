import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I had only ever taken pictures with my smartphone → スマートフォンでしか写真を撮ったことがなかった
# I have only ever lived in Tokyo → 東京にしか住んだことがない（完了形の only ever は、最後の前置詞句に「しか」を付けて経験を否定にする）
rep("""    if (o.sinceCont && vg.perfect && !st.exp && !st.never) st.cont = true;   // since 節つきの完了は継続""",
    """    if (vg.idx > 1 && isW(T[vg.idx - 1], 'ever') && isW(T[vg.idx - 2], 'only') && vg.perfect && verbal(p) && !vg.passive && !neg && st.other.some((x) => /(?:で|に|から)$/.test(x))) {
      const fx = (x) => !/^(?:ただ|今まで|今までに)$/.test(x);
      st.manner = st.manner.filter(fx); st.time = st.time.filter(fx); st.other = st.other.filter(fx); st.freq = st.freq.filter(fx);
      let kOe = -1;
      st.other.forEach((x, q) => { if (/(?:で|に|から)$/.test(x)) kOe = q; });
      st.other[kOe] = st.other[kOe] + 'しか'; neg = true; st.exp = true;
    }
    if (o.sinceCont && vg.perfect && !st.exp && !st.never) st.cont = true;   // since 節つきの完了は継続""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
