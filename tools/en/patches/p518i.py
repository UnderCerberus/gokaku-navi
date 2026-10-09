import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) He showed little interest in the plan → 計画にほとんど関心を示さなかった（few / little + 名詞 の目的語は動詞を否定にする）
rep("""      const vob = !vg.passive && VOBJ[L] && (oh || objs[0].pron) ? VOBJ[L].find((x) => x.re.test(oh || objs[0].pron || '')) : null;""",
    """      if (objs[0].fewNeg && objs.length === 1 && !vg.neg && !vg.passive && !st.neg && !st.never && !/^(?:have|be|need|want|require|take|cost)$/.test(L) && !o.sub) { st.neg = true; st.manner.unshift('ほとんど'); objs[0] = Object.assign({}, objs[0], { ja: objs[0].ja.replace(/^ほとんどの/, ''), fewNeg: false }); }   // showed little interest → ほとんど関心を示さなかった
      const vob = !vg.passive && VOBJ[L] && (oh || objs[0].pron) ? VOBJ[L].find((x) => x.re.test(oh || objs[0].pron || '')) : null;""")

# 2) little + concern / respect / sympathy なども量の little（小さい にしない）
rep("""help|information|news|danger|risk|effect|influence|importance|change|choice|connection|contact|desire|sign|signs)$/.test(T[i + 1].w))) {
      const mL = mark();
      const nomL = nominal(i + 1, lim, true);""",
    """help|information|news|danger|risk|effect|influence|importance|change|choice|connection|contact|desire|sign|signs|concern|respect|sympathy|regard|consideration|enthusiasm|patience|confidence|trust|curiosity|thought|care|light|sleep|rain|snow)$/.test(T[i + 1].w))) {
      const mL = mark();
      const nomL = nominal(i + 1, lim, true);""")

# 3) show interest / concern → 示す
rep("""    'make|money fortune|を|稼ぐ',""",
    """    'make|money fortune|を|稼ぐ', 'show|interest concern sympathy respect enthusiasm|を|示す',""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
