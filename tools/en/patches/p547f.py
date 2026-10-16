import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I will call you after work → 仕事の後にあなたに電話する（電話の call の after は「〜にちなんで」にしない。名前をつける call A B after C のときだけ）
rep("""    if (vg.lemma === 'name' || vg.lemma === 'call') { const nm = (x) => (/の後に$/.test(x) ? x.replace(/の後に$/, 'にちなんで') : x); st.other = st.other.map(nm); st.time = st.time.map(nm); }""",
    """    if (vg.lemma === 'name' || (vg.lemma === 'call' && !/電話/.test(p.plain()))) { const nm = (x) => (/の後に$/.test(x) && !/^(?:仕事|学校|授業|夕食|昼食|朝食|練習|試合|会議)の後に$/.test(x) ? x.replace(/の後に$/, 'にちなんで') : x); st.other = st.other.map(nm); st.time = st.time.map(nm); }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
