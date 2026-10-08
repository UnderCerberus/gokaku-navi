import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# becoming less popular → 人気がなくなってきている（become / get + less + 形容詞）
rep("""        else if (/^(?:become|get|grow|turn|go|come|fall)$/.test(L)) core = becomeP(f);""",
    """        else if (/^(?:become|get|grow)$/.test(L) && /より少なく$/.test(ap.deg || '')) {   // is becoming less popular → 人気がなくなってきている
          ap.deg = ap.deg.replace(/より少なく$/, '');
          core = f.kind === 'v' && /がある$/.test(f.pred.plain()) ? P(f.pred.plain().replace(/がある$/, 'がなくなる'), 'v5') : (f.kind === 'i' ? P('あまり' + f.adv.replace(/く$/, '') + 'くなくなる', 'v5') : P('あまり' + (f.stem != null ? f.stem : f.pred.plain().replace(/だ$/, '')) + 'でなくなる', 'v5'));
        }
        else if (/^(?:become|get|grow|turn|go|come|fall)$/.test(L)) core = becomeP(f);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
