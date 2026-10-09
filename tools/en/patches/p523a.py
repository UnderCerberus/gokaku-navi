import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Hardly had the plane taken off when … → 飛行機が離陸したとたん、…（完了の ている を辞書形に戻すと 離陸しる になる。た形 + とたん にする）
rep("""          node.out = (o) => (strip ? head1.replace(/ている$/, 'る') : head1) + 'か' + negI + 'かのうちに、' + c2.out(Object.assign({}, o || {}, { part: (o && o.part) || (c2.subj && !c2.subj.pron ? 'が' : undefined) }));""",
    """          if (/[てで]いる$/.test(head1)) node.out = (o) => head1.replace(/([てで])いる$/, (m0, a0) => (a0 === 'て' ? 'た' : 'だ')) + 'とたん、' + c2.out(Object.assign({}, o || {}, { part: (o && o.part) || (c2.subj && !c2.subj.pron ? 'が' : undefined) }));   // 離陸したとたん
          else node.out = (o) => head1 + 'か' + negI + 'かのうちに、' + c2.out(Object.assign({}, o || {}, { part: (o && o.part) || (c2.subj && !c2.subj.pron ? 'が' : undefined) }));""")
# There is no point in worrying …, so … → 心配しても無駄なので（だ + ので → なので）
rep("""        if (gNp && gNp.end === b) { name('there'); name('idiom'); const pastNp = T[a + 1].w === 'was'; return { out: () => vpJoin(gNp, 'te').replace(/で$/, 'でも').replace(/て$/, 'ても') + (pastNp ? '無駄だった' : '無駄だ'), sp: 'SV', past: pastNp }; }""",
    """        if (gNp && gNp.end === b) { name('there'); name('idiom'); const pastNp = T[a + 1].w === 'was'; return { out: (y) => vpJoin(gNp, 'te').replace(/で$/, 'でも').replace(/て$/, 'ても') + (pastNp ? (y && y.form === 'te' ? '無駄で' : '無駄だった') : (y && (y.form === 'attr' || y.form === 'node') ? '無駄な' : (y && y.form === 'te' ? '無駄で' : '無駄だ'))), sp: 'SV', past: pastNp, pred: P(pastNp ? '無駄だった' : '無駄だ', 'da') }; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
