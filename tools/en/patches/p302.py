import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# study hard when they are young の when は副詞節（間接疑問にしない）
rep("""    if (WHV[L] && (WH[T[iw].w] || T[iw].w === 'whether' || T[iw].w === 'if')) {
      WH_MAINPAST = !!vg.past;""",
    """    if (WHV[L] && (WH[T[iw].w] || T[iw].w === 'whether' || T[iw].w === 'if') && !(T[iw].w === 'when' && !/^(?:know|wonder|ask|tell|understand|remember|recall|decide|explain|see|show|forget|guess|say|check|find|realize|realise|notice|predict|determine|discover|confirm|learn|teach|care|mind|doubt|matter|depend|choose|clarify|verify|report|record|announce)$/.test(L))) {
      WH_MAINPAST = !!vg.past;""")

# We should respect different cultures → 異なる文化を尊重するべきだ
rep("""    if (objs.length === 1 && !vg.passive && /^(?:achieve|realize|realise|fulfill|fulfil)$/.test(L)""",
    """    if (objs.length === 1 && !vg.passive && L === 'respect' && /(?:^| )(?:culture|cultures|right|rights|opinion|opinions|rule|rules|privacy|decision|decisions|difference|differences|wish|wishes|choice|choices|tradition|traditions|custom|customs|nature|environment|law|laws|idea|ideas|view|views|feelings|value|values|diversity)$/.test(objs[0].head || '')) sense = { particle: 'を', core: '尊重する', tr: true };   // We should respect different cultures → 異なる文化を尊重するべきだ
    if (objs.length === 1 && !vg.passive && /^(?:achieve|realize|realise|fulfill|fulfil)$/.test(L)""")

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    ja = ja.replace(/正しい側(で|に|を)/g, '右側$1').replace(/夏の間にそして年の終わりに/g, '夏と年末に').replace(/年の終わりに/g, '年末に').replace(/贈り物を与え(る|た|て|ない|ること)/g, (m0, a0) => '贈り物を' + ({ 'る': 'する', 'た': 'した', 'て': 'して', 'ない': 'しない', 'ること': 'すること' })[a0]);   // drive on the right side → 右側で / give gifts → 贈り物をする
    ja = ja.replace(/(国|人|地域|文化|家庭|学校|時代)に\\1と(異なる|違う|さまざまだ)/g, '$1によって$2').replace(/^いくつかの国では/, '国によっては').replace(/人々を指す/g, '人を指さす').replace(/([^、。]{1,6}?)の悪い礼儀(ではない|だ)/, '$1では行儀が悪いこと$2');   // Customs differ from country to country → 国によって異なる
    if (tokens.some((x, q) => x.w === 'one' && tokens[q + 1] && tokens[q + 1].w === 'country') && tokens.some((x) => x.w === 'another')) ja = ja.replace(/1か国で/, 'ある国で').replace(/もう1つ(?:に|で)/, '別の国では');   // What is considered polite in one country may be rude in another
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
