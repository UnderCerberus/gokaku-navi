import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    if (seq(0, ['how', 'do', 'you', 'say']) && b >= 7 && isW(T[b - 2], 'in') && T[b - 1].k === 'w' && PN[T[b - 1].w] && /語$/.test(PN[T[b - 1].w])) {
      const wsS = T.slice(4, b - 2).filter((x) => x.k === 'w' || x.k === 'num');
      if (wsS.length >= 1 && wsS.length <= 4) {
        const nS = wsS.length === 1 || T.slice(4, b - 2).some((x) => x.k === 'p' && /['"‘’“”]/.test(x.s || x.w || '')) ? null : (() => { const r0 = np(4, b - 2, {}); return r0 && r0.end === b - 2 ? r0 : null; })();
        const qS = nS ? nS.ja : wsS.map((x) => x.s || x.w).join(' ');
        return { ok: true, ja: '「' + qS + '」は' + PN[T[b - 1].w] + 'で何と言いますか。', sp: '', names: ['question', 'fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      }
    }""",
    """    const LANGS = { english: '英語', japanese: '日本語', french: 'フランス語', chinese: '中国語', spanish: 'スペイン語', korean: '韓国語', german: 'ドイツ語', italian: 'イタリア語' };
    if (seq(0, ['how', 'do', 'you', 'say']) && b >= 7 && isW(T[b - 2], 'in') && T[b - 1].k === 'w' && LANGS[T[b - 1].w]) {
      const wsS = T.slice(4, b - 2).filter((x) => x.k === 'w' || x.k === 'num');
      if (wsS.length >= 1 && wsS.length <= 4) {
        const quoted = T.slice(4, b - 2).some((x) => x.k !== 'w' && x.k !== 'num');
        const pronS = !quoted && wsS.length === 1 && ({ this: 'これ', that: 'それ', it: 'それ' })[wsS[0].w];
        const nS = quoted || pronS || wsS.length === 1 ? null : (() => { const r0 = np(4, b - 2, {}); return r0 && r0.end === b - 2 ? r0 : null; })();
        const qS = pronS || (nS ? nS.ja : '「' + wsS.map((x) => x.s || x.w).join(' ') + '」');
        return { ok: true, ja: qS + 'は' + LANGS[T[b - 1].w] + 'で何と言いますか。', sp: '', names: ['question', 'fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      }
    }""")

rep("""ja = ja.replace(/(2人1組|グループ)で働(きなさい|いて|く|きましょう)/g,""",
    """ja = ja.replace(/((?:[0-9０-９]+)人1組|グループ)で働(きなさい|いて|く|きましょう)/g,""")

rep("""'for half an hour': '30分間', """, """'for half an hour': '30分間', 'in groups of two': '2人1組で', 'in groups of three': '3人1組で', 'in groups of four': '4人1組で', 'in groups of five': '5人1組で', 'in groups of six': '6人1組で', """)

rep("""    ja = ja.replace(/([0-9０-９]+)つのグループを作/g, '$1人ずつのグループを作')""",
    """    ja = ja.replace(/もう一度それを言って/g, 'もう一度言って').replace(/と一緒に([^、。]{1,8}?)を(交換|取り替え)/g, 'と$1を$2');   // Can you say that again? → もう一度言ってくれますか / Swap papers with your partner → 相手と紙を交換しなさい
    ja = ja.replace(/([0-9０-９]+)つのグループを作/g, '$1人ずつのグループを作')""")

# The board met yesterday → 委員会は昨日集まった
rep("""    if (L === 'pass' && !objs.length && !vg.passive && o.subj && !o.subj.an""",
    """    if (L === 'meet' && !objs.length && !vg.passive && o.subj && /(?:^| )(?:board|board of directors|committee|committees|council|councils|club|group|groups|team|members|leaders|ministers|delegates|class|parliament|congress|staff)$/.test(plainSubj(o.subj).head || '') && !T.slice(vg.idx + 1, lim).some((x) => isW(x, 'with'))) sense = { particle: '', core: '集まる', tr: false };   // The committee met yesterday → 委員会は昨日集まった
    if (L === 'pass' && !objs.length && !vg.passive && o.subj && !o.subj.an""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
