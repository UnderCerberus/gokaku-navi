import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# On hot summer days → 暑い夏の日々に（修飾語のある複数の期間の名詞は「数日」にしない）
rep("""    const few = obj.pl && !obj.num && obj.head && DURUNIT[obj.head] && !obj.det && key !== 'for' && UNIT[obj.head] && !/^(?:何|多くの|数|長い)/.test(obj.ja || '');""",
    """    const few = obj.pl && !obj.num && obj.head && DURUNIT[obj.head] && !obj.det && key !== 'for' && UNIT[obj.head] && !/^(?:何|多くの|数|長い)/.test(obj.ja || '') && /^(?:日|週|週間|月|か月|年|時間|分|秒|日々|世紀|10年間?)$/.test(obj.ja || '');""")

# Once a tree is removed, … / If the wrong kind of tree is chosen, …（前に置いた once / if / when の節の現在の受け身は「〜されると」。取り除かれていると にしない）
rep("""        const sc = sentence(s0, c, { sub: true });
        const mn = sc ? (sentence(c + 1, b, mainOpt(sc, sb.key))""",
    """        const sc = sentence(s0, c, { sub: true, subKey: sb.key });
        const mn = sc ? (sentence(c + 1, b, mainOpt(sc, sb.key))""")
rep("""    else if (vg.passive && !vg.past && !vg.modal && !vg.semi && !vg.perfect && !vg.nonfin && !(/^(?:throw|drop|release""",
    """    else if (vg.passive && !vg.past && !vg.modal && !vg.semi && !vg.perfect && !vg.nonfin && !/^(?:once|if|when|whenever|as soon as|before|after|until|unless|even if)$/.test(o.subKey || '') && !(/^(?:throw|drop|release""")

# It can take decades for a new one to grow → 新しい木が育つのに何十年もかかることがある（数のない複数の期間は「何十年も」。can + かかる は かかれる にしない）
rep("""          const vp = done(vg, P('かかる', 'v5'), st, b, 'SVO', o, [(who ? who.ja + 'が' : '') + infJ + 'のに', n2.ja + (!n2.num && !n2.instant && (/時間$/.test(n2.ja) || n2.coord) ? 'が' : '')], { noStative: true });""",
    """          const kDu = who && n2 !== n1 ? k : j;   // 期間の名詞句の先頭
          const bareDur = !n2.num && !n2.det && T[kDu] && /^(?:decades|years|months|weeks|days|hours|centuries|minutes)$/.test(T[kDu].w || '');
          const n2ja = bareDur ? ({ decades: '何十年', years: '何年', months: '何か月', weeks: '何週間', days: '何日', hours: '何時間', centuries: '何世紀', minutes: '何分' })[T[kDu].w] + 'も' : n2.ja;
          const canTk = /^(?:can|could|may|might)$/.test(vg.modal || '');
          const vp = done(canTk ? Object.assign({}, vg, { modal: '' }) : vg, canTk ? P('かかることがある', 'aru') : P('かかる', 'v5'), st, b, 'SVO', o, [(who ? who.ja + 'が' : '') + infJ + 'のに', n2ja + (!bareDur && !n2.num && !n2.instant && (/時間$/.test(n2.ja) || n2.coord) ? 'が' : '')], { noStative: true });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
