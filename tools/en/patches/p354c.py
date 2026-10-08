import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)
rep("""        else if (vg.lemma === 'be' && !vg.passive && !vg.prog && !verbal(p) && !neg && sj && (anim || (sj.pron && PRON[sj.pron] && PRON[sj.pron].an)) && /(?:い|だ)$/.test(p.plain()) && !/(?:ない|たい|らしい|ようだ|そうだ)$/.test(p.plain())) p = P((/い$/.test(p.plain()) ? p.plain().replace(/い$/, 'く') : p.plain().replace(/だ$/, 'に')) + 'なれる', 'v1');""",
    """        else if (vg.lemma === 'be' && !vg.passive && !vg.prog && !verbal(p) && !neg && sj && (anim || (sj.pron && PRON[sj.pron] && PRON[sj.pron].an) || /^(?:i|you|he|she|we|they|anyone|everyone|anybody|everybody|someone|somebody)$/.test(sj.pron || '')) && /(?:い|だ|である)$/.test(p.plain()) && !/(?:ない|たい|らしい|ようだ|そうだ|ここにいる|そこにいる)$/.test(p.plain()) && !/(?:ここ|そこ|あそこ|家|学校)に(?:いる|ある)$/.test(p.plain())) p = P((/い$/.test(p.plain()) ? p.plain().replace(/い$/, 'く') : p.plain().replace(/(?:だ|である)$/, 'に')) + 'なれる', 'v1');""")
rep("""    ja = ja.replace(/中国の万里の長城/g, '万里の長城');""",
    """    ja = ja.replace(/中国の万里の長城/g, '万里の長城');
    ja = ja.replace(/(ここ|こちら)にいることができる/, '$1に来られる');   // She can be here by noon → 正午までにここに来られる""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
