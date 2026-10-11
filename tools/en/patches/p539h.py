import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# … but I was much happier for him → 彼のためにずっとうれしかった（感情の形容詞 + for + 人は「〜にとって」にしない: happy for him は彼のことを喜ぶ）
rep("""    if (vg.lemma === 'be' && !verbal(p) && !vg.passive) st.other = st.other.map((x) => x.replace(/^(人間|人々|子ども|""",
    """    if (vg.lemma === 'be' && !verbal(p) && !vg.passive && !/(?:うれし|喜ん|幸せ|満足|悲し|残念|気の毒|誇らし)/.test(p.plain())) st.other = st.other.map((x) => x.replace(/^(人間|人々|子ども|""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
