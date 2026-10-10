import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Ms. Baker is leaving our school at the end of this month → 今月末に学校を去る（at the end of this / next … / this weekend も近い未来の予定の進行形）
rep("""k|call|work|finish|end|launch|release|hold)$/.test(vg.lemma) && T.some((x) => x.k === 'w' && /^(?:tomorrow|tonight|next)$/.test(x.w)) && !T.some((x) => x.k === 'w' && /^(?:now|currently|still|already|right)$/.test(x.w))) vg = Object.assign({}, vg, { prog: false });""",
    """k|call|work|finish|end|launch|release|hold)$/.test(vg.lemma) && (T.some((x) => x.k === 'w' && /^(?:tomorrow|tonight|next)$/.test(x.w)) || T.some((x, q) => seq(q, ['at', 'the', 'end', 'of']) && /^(?:this|the)$/.test((T[q + 4] || {}).w || '')) || T.some((x, q) => isW(x, 'this') && /^(?:weekend|evening|afternoon|saturday|sunday|friday)$/.test((T[q + 1] || {}).w || ''))) && !T.some((x) => x.k === 'w' && /^(?:now|currently|still|already|right)$/.test(x.w))) vg = Object.assign({}, vg, { prog: false });""")

# Have you heard that Ms. Baker is leaving … → 出ると聞きましたか（that 節の中の予定の進行形も）
rep("""    if (vg.prog && !vg.past && !vg.perfect && !vg.passive && !vg.modal && !o.sub && verbal(p) && /^(?:leave|come|go|arrive|meet|see|visit|start|begin|fly|travel|move|return|have|play|give|take|stay|marry|open|close|hold|perform|sing|eat|watch|drive|attend|join|celebrate|throw|get|fly|ride|bring""",
    """    if (vg.prog && !vg.past && !vg.perfect && !vg.passive && !vg.modal && (!o.sub || o.reported !== undefined) && verbal(p) && /^(?:leave|come|go|arrive|meet|see|visit|start|begin|fly|travel|move|return|have|play|give|take|stay|marry|open|close|hold|perform|sing|eat|watch|drive|attend|join|celebrate|throw|get|fly|ride|bring""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
