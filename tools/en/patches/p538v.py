import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# If you ever come to Japan, please let me know → もしいつか日本に来たら（完了形でない if 節の ever は「いつか」。「今までに」にしない）
rep("""    if (!vg.perfect && /^(?:would|will|could|can|might|may)$/.test(vg.modal || '') && st.freq.indexOf('今までに') >= 0) {""",
    """    const ifEv = !vg.perfect && vg.idx > 0 && st.freq.indexOf('今までに') >= 0 && (() => { for (let q = vg.idx - 1; q >= 0; q--) { if (T[q].k === 'w' && SUB[T[q].w]) return T[q].w === 'if'; if (isP(T[q], ',')) return false; } return false; })();
    if ((!vg.perfect && /^(?:would|will|could|can|might|may)$/.test(vg.modal || '') && st.freq.indexOf('今までに') >= 0) || ifEv) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
