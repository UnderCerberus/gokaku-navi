import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# over many centuries → 何世紀にもわたって / built over ten years → 10年かけて / stretches for thousands of kilometers → 何千キロメートルにもわたって
rep("""    if (key === 'over' && obj.dur && /(?:間|年|か月|世紀)$/.test(n)) return R(n + 'にわたって', 'dur', n + 'にわたる');""",
    """    if (key === 'over' && /^何(?:十|百|千)?(?:年|世紀|か月|日|週間|世代)(?:間)?も$/.test(n)) return R(n.replace(/(?:間)?も$/, '') + 'にもわたって', 'dur', n.replace(/(?:間)?も$/, '') + 'にもわたる');
    if (key === 'over' && obj.head && /^(?:years|centuries|decades|generations)$/.test(obj.head) && /^(?:多くの|いくつかの)/.test(n)) { const uOv = ({ years: '年', centuries: '世紀', decades: '十年', generations: '世代' })[obj.head]; return R(/^多くの/.test(n) ? '何' + uOv + 'にもわたって' : '数' + uOv + 'にわたって', 'dur'); }
    if (key === 'over' && (obj.dur || (obj.num && obj.head && DURUNIT[obj.head])) && /(?:間|年|か月|世紀|日|週間)$/.test(n) && T.some((x) => /^(?:built|build|builds|building|made|make|makes|created|create|developed|develop|constructed|construct|completed|complete|written|write|painted|paint|carved|formed)$/.test(x.w || ''))) return R(n.replace(/間$/, '') + 'かけて', 'dur', n.replace(/間$/, '') + 'かけた');   // The castle was built over ten years → 10年かけて
    if (key === 'over' && obj.dur && /(?:間|年|か月|世紀)$/.test(n)) return R(n + 'にわたって', 'dur', n + 'にわたる');
    if (key === 'for' && /^何(?:十|百|千|万)?(?:キロメートル|メートル|マイル|キロ)も$/.test(n)) return R(n.replace(/も$/, '') + 'にもわたって', 'dur', n.replace(/も$/, '') + 'にもわたる');   // stretches for thousands of kilometers → 何千キロメートルにもわたって
    if (key === 'for' && obj.num && obj.head && /^(?:kilometers|kilometres|miles|meters|metres|km|kilometer|mile|meter)$/.test(obj.head) && T.some((x) => /^(?:stretch|stretches|stretched|extend|extends|extended|run|runs|ran|continue|continues|continued|walk|walked|walks|drive|drove|drives|swim|swam|swims)$/.test(x.w || ''))) return R(n + 'にわたって', 'dur', n + 'にわたる');   // The road stretches for ten kilometers → 10キロメートルにわたって""")

# The castle was built over ten years（受け身の build に over + 数 の目的語を取らない）
rep("""      if (objs.length < (vg.passive ? 1 : 2) && j0 === j && !(t.k === 'w' && PREP[t.w] && !NOUN_OK[t.w] && !approxAt(j, lim) &&""",
    """      if (objs.length < (vg.passive ? 1 : 2) && j0 === j && !(vg.passive && approxAt(j, lim) && isW(t, 'over') && !/^(?:give|send|show|teach|tell|offer|ask|award|pay|lend|grant|promise|charge|fine|allow|deny)$/.test(vg.lemma)) && !(t.k === 'w' && PREP[t.w] && !NOUN_OK[t.w] && !approxAt(j, lim) &&""")

# Japan is located on several plates → いくつかのプレートの上に位置している
rep("""    ja = ja.replace(/(右|左)の側(?=[にでのをはが])/g, '$1側');""",
    """    ja = ja.replace(/(右|左)の側(?=[にでのをはが])/g, '$1側');
    if (tokens.some((x) => /^(?:earthquake|earthquakes|tectonic|located|continent|continents|crust|volcano|volcanoes|move|moves|moving)$/.test(x.w || '')) && tokens.some((x) => /^(?:plate|plates)$/.test(x.w || ''))) ja = ja.replace(/皿/g, 'プレート');   // Japan is located on several plates → プレート
    ja = ja.replace(/お互いと話/g, '互いに話');   // Dolphins use sounds to talk to each other → 互いに話すために
    if (tokens.some((x, q) => x.w === 'in' && tokens[q + 1] && tokens[q + 1].w === 'case' && tokens[q + 2] && tokens[q + 2].w === 'of') && tokens.some((x) => /^(?:prepare|prepared|prepares|ready|store|stored|keep|kept|carry|buy|bought|pack|packed)$/.test(x.w || ''))) ja = ja.replace(/([^、。]{1,12}?)の場合には/, '$1に備えて');   // prepare emergency kits in case of disasters → 災害に備えて""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
