import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# on a first-come, first-served basis → 先着順で
rep(""".replace(/\\bonce in a blue moon\\b/gi, 'bluemoonadv')""",
    """.replace(/\\bonce in a blue moon\\b/gi, 'bluemoonadv').replace(/\\bon a first[- ]come,? first[- ]served basis\\b/gi, 'firstcomeadv').replace(/\\bfirst[- ]come,? first[- ]served\\b/gi, 'firstcomeadv')""")
rep("""    const SURF = { bluemoonadv: 'once in a blue moon',""", """    const SURF = { firstcomeadv: 'on a first-come, first-served basis', bluemoonadv: 'once in a blue moon',""")
rep("""bluemoonadv: ['ごくまれに', 'f'],""", """bluemoonadv: ['ごくまれに', 'f'], firstcomeadv: ['先着順で', 'm'],""")

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'please keep your voice down': 'もう少し小さな声で話してください', 'keep your voice down': '声を小さくしなさい', """)

# No talking in the library → 図書館で話すのは禁止だ
rep("""    // Hi, Ken. → こんにちは、ケン""",
    """    // No talking in the library → 図書館で話すのは禁止だ / No running in the hallway → 廊下を走るのは禁止だ
    if (isW(T[0], 'no') && b >= 2 && T[1].k === 'w' && /ing$/.test(T[1].w) && !!vc(T[1], ['ing'])) {
      const gNo = vpNonfin(1, b, 'ing', {});
      if (gNo && gNo.end === b && verbal(gNo.pred)) return { ok: true, ja: vpJoin(gNo, 'dict') + 'のは禁止だ。', sp: '', names: ['fixed', 'gerund'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      reset(tokens);
    }
    // Hi, Ken. → こんにちは、ケン""")

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    ja = ja.replace(/(?:入り口|入口)のところで(?:確かめ|調べ)なければならない/, '入り口で検査を受けなければならない').replace(/(ひも|リード)の上に保たなければならない/, '$1につないでおかなければならない').replace(/^([^、。]{1,10}?)を使うことを控えてください/, '$1はご遠慮ください').replace(/(自転車|荷物|かばん|ごみ)は([^、。]{1,10}?)に残っていてはいけない/, '$2に$1を置いてはいけない');   // All bags must be checked / Dogs must be kept on a leash / refrain from using / Bicycles must not be left
    ja = ja.replace(/([一-龠ァ-ヶー]+する|[一-龠][ぁ-ん]{1,2})ことになっていない(?=。|$)/, (m0, v0) => { try { const pV = P(v0); return verbal(pV) ? pV.form('te') + 'はいけないことになっている' : m0; } catch (eV) { return m0; } });   // You are not supposed to park here → ここに駐車してはいけないことになっている
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
