import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The train is arriving soon → まもなく到着する（移動の動詞 + soon / in N minutes は近い未来）
rep("""|throw|get|fly|ride|bring|pick|call|work|finish|end|launch|release|hold)$/.test(vg.lemma) && T.some((x) => x.k === 'w' && /^(?:tomorrow|tonight|next)$/.test(x.w)) && !T.some((x) => x.k === 'w' && /^(?:now|currently|still|already|right)$/.test(x.w))) vg = Object.assign({}, vg, { prog: false });""",
    """|throw|get|fly|ride|bring|pick|call|work|finish|end|launch|release|hold)$/.test(vg.lemma) && T.some((x) => x.k === 'w' && /^(?:tomorrow|tonight|next)$/.test(x.w)) && !T.some((x) => x.k === 'w' && /^(?:now|currently|still|already|right)$/.test(x.w))) vg = Object.assign({}, vg, { prog: false });
    else if (vg.prog && !vg.past && !vg.perfect && !vg.passive && !vg.modal && !o.sub && verbal(p) && /^(?:leave|arrive|depart|start|begin|come|close|open|end|finish|land|take)$/.test(vg.lemma) && T.some((x, q) => x.k === 'w' && (x.w === 'soon' || (x.w === 'in' && T[q + 1] && (T[q + 1].k === 'num' || NUMW[T[q + 1].w] !== undefined || /^(?:a|an|five|ten|a few)$/.test(T[q + 1].w || '')) && T.slice(q + 1, q + 4).some((y) => /^(?:minute|minutes|hour|hours|second|seconds|moment)$/.test(y.w || ''))))) && !T.some((x) => x.k === 'w' && /^(?:now|currently|still|already|right)$/.test(x.w))) vg = Object.assign({}, vg, { prog: false });   // The train is arriving soon → まもなく到着する""")

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'i am coming': '今行きます', 'coming': '今行きます', """)

rep("""    ja = ja.replace(/中国の万里の長城/g, '万里の長城');""",
    """    ja = ja.replace(/中国の万里の長城/g, '万里の長城');
    if (tokens.some((x) => x.w === 'soon') && tokens.some((x) => /^(?:arriving|leaving|departing|starting|closing|landing)$/.test(x.w || ''))) ja = ja.replace(/すぐに(到着|出発|開始|閉店|着陸|始ま|閉ま)/, 'まもなく$1');   // The train is arriving soon → まもなく到着する""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
