import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      else if (L === 'join' && /(?:^| )(?:club|clubs|team|teams|band|circle|company|army|navy|union|party|group|society|choir|orchestra)$/.test(oh)) sense = { particle: 'に', core: '入る', tr: true };   // join the tennis club → テニス部に入る""",
    """      else if (L === 'join' && /(?:^| )(?:club|clubs|team|teams|band|circle|company|army|navy|union|party|group|society|choir|orchestra)$/.test(oh)) sense = { particle: 'に', core: '入る', tr: true };   // join the tennis club → テニス部に入る
      else if (L === 'join' && /(?:^| )(?:program|programs|programme|event|events|tour|tours|activity|activities|campaign|campaigns|project|projects|contest|contests|competition|competitions|race|races|festival|festivals|meeting|meetings|discussion|discussions|game|games|class|classes|lesson|lessons|course|courses|workshop|workshops|camp|camps|ceremony|march|parade|protest|protests|cleanup|conversation|debate|trip|trips|session|sessions|survey|study|research|experiment|experiments|movement|exchange)$/.test(oh)) sense = { particle: 'に', core: '参加する', tr: true };   // joined a volunteer program → ボランティアのプログラムに参加した""")

rep("""    else if (core.s === '経営する' && !vg.past && !vg.passive && !vg.prog && !vg.modal && !vg.semi && !vg.nonfin && !vg.perfect && !o.sub) core = noDouble(core);   // My uncle runs a bakery → パン屋を経営している""",
    """    else if (core.s === '経営する' && !vg.past && !vg.passive && !vg.prog && !vg.modal && !vg.semi && !vg.nonfin && !vg.perfect && !o.sub) core = noDouble(core);   // My uncle runs a bakery → パン屋を経営している
    // 今では・最近の習慣（現在形の動作動詞）→ ている: Now, many people use smartphones → 今では多くの人々がスマートフォンを使っている
    else if (!vg.past && !vg.passive && !vg.prog && !vg.modal && !vg.semi && !vg.nonfin && !vg.perfect && !o.sub && !o.q && !vg.neg && o.subj && verbal(core) && T[0] && (/^(?:now|nowadays)$/.test(T[0].w || '') || (T[0].w === 'these' && isW(T[1], 'days')) || (T[0].w === 'today' && isP(T[1], ',') && !!o.subj.pl)) && !T.some((x) => x.k === 'w' && /^(?:every|usually|often|always|sometimes|tomorrow|tonight|soon)$/.test(x.w)) && /^(?:use|enjoy|shop|attract|play|work|study|eat|drink|buy|sell|read|watch|visit|travel|wear|carry|take|produce|grow|spend|send|communicate|rely|depend|help|run|teach|learn|practice|write|keep|raise|export|import|provide|offer|serve|recycle|save|protect|support|choose|join|participate|volunteer|cook|ride|drive|walk|commute|exercise|share|post|order|pay|rent|hire|employ|earn|collect|receive|attend)$/.test(vg.lemma)) core = noDouble(core);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
