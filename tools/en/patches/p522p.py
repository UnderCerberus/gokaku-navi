import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# her boss asked her to stay and finish the report → 残って / Can you stay after class? → 授業の後に残れますか
#（場所・期間のない stay は 残る。滞在する は場所か期間があるとき）
rep("""    if (/^(?:begin|start)$/.test(vg.lemma) && /^始まる$/.test(p.plain()) && vg.nonfin && !sj && !vg.passive && T.some((x) => isW(x, 'it') || isW(x, 'time'))) p = P('始める', 'v1');""",
    """    if (/^(?:begin|start)$/.test(vg.lemma) && /^始まる$/.test(p.plain()) && vg.nonfin && !sj && !vg.passive && T.some((x) => isW(x, 'it') || isW(x, 'time'))) p = P('始める', 'v1');
    if (vg.lemma === 'stay' && /^滞在する$/.test(p.plain()) && !vg.passive && !st.other.some((x) => /(?:に|で|へ)$/.test(x) && !/(?:ために|ように|ときに|後に|前に|までに|中に)$/.test(x)) && !st.time.concat(st.other).some((x) => /(?:間|日|週|か月|年|晩|泊|夏|冬|春|秋)$/.test(x)) && !vg.prog && !T.some((x) => /^(?:hotel|hotels|house|home|inn|country|city|town|abroad|overnight|night|nights|week|weeks|month|months|year|years|days|where|long|place|places|somewhere|anywhere|room|accommodation|guest|guests|visit|visitor|visitors|trip)$/.test(x.w || ''))) p = P('残る', 'v5');   // asked her to stay and finish → 残って""")
# He stayed late to finish his work → 遅くまで残った（遅いままでいた にしない）
rep("""        else core = P(f.attr + 'ままでいる', 'v1');
        if (ap.deg && /^(?:become|get|grow|turn|go|come|fall)$/.test(L)) st.manner.push(ap.deg);""",
    """        else if (L === 'stay' && ap.lemma === 'late') core = P('遅くまで残る', 'v5');
        else core = P(f.attr + 'ままでいる', 'v1');
        if (ap.deg && /^(?:become|get|grow|turn|go|come|fall)$/.test(L)) st.manner.push(ap.deg);""")
# The museum in which the famous painting is kept → 有名な絵画が保管されている博物館（保たれている にしない）
rep("""    'meet|deadline deadlines|を|守る', 'meet|goal goals target targets|を|達成する',""",
    """    'meet|deadline deadlines|を|守る', 'meet|goal goals target targets|を|達成する',
    'keep|painting paintings document documents record records collection collections treasure treasures artwork artworks file files sample samples specimen specimens manuscript manuscripts|を|保管する',""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
