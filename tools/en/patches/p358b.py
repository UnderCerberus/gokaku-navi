import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""        const rTx = body.slice(ci + 1);
        let rL = colonSide(rTx.concat(endP), true);""",
    """        const rTx = body.slice(ci + 1);
        const ONEW = { free: '無料', none: 'なし', yes: 'あり', no: 'なし', required: '必須', optional: '任意', tba: '未定', tbd: '未定', unlimited: '無制限', anyone: 'どなたでも', everyone: 'どなたでも', all: 'すべて' };
        const rW = rTx.filter((x) => x.k === 'w');
        let rL = rW.length === 1 && rTx.filter((x) => x.k !== 'p').length === 1 && ONEW[rW[0].w] ? { ja: ONEW[rW[0].w], sel: {}, names: [], unknown: [], idioms: [] } : colonSide(rTx.concat(endP), true);
        if (!rL && rTx.length && rTx[0].k === 'w' && /^(?:january|february|march|april|may|june|july|august|september|october|november|december|monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/.test(rTx[0].w)) {
          reset(tokens);
          const tOn = tokenize('on ' + rTx.map((x) => x.s || x.w).join(' ') + '.');
          const rOn = tOn && tOn.length ? colonSide(tOn, true) : null;
          if (rOn) rL = Object.assign({}, rOn, { ja: rOn.ja.replace(/に$/, '') });
        }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
