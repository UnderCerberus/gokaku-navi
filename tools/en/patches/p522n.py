import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# today's teenagers spend far less time reading books for pleasure → 楽しみのために本を読む時間がはるかに少ない
# They spend much more time playing games → ゲームをする時間がずっと多い（説明の文は 時間が少ない・多い。助言・命令は従来どおり 減らす・増やす）
rep("""        if (it.it && it.it.phrase === 'spend A doing' && /^(?:time|hours)$/.test(a2.head || '') && /^より(?:少ない|多くの)/.test(a2.ja)) {   // spend less time worrying about money → お金を心配する時間を減らす""",
    """        const degSp = /^(?:はるかに|ずっと|さらに|多くのより|かなり)/.test(a2.ja) ? (/^(?:はるかに)/.test(a2.ja) ? 'はるかに' : (/^さらに/.test(a2.ja) ? 'さらに' : 'ずっと')) : '';
        if (it.it && it.it.phrase === 'spend A doing' && /^(?:time|hours)$/.test(a2.head || '') && /^(?:はるかに|ずっと|さらに|多くの|かなり)?より(?:少ない|多くの)/.test(a2.ja) && !vg.modal && !o.imp && !vg.nonfin && !vg.neg) {
          r = done(vg, P(vpJoin(v2a, 'dict') + '時間が' + degSp + (/より少ない/.test(a2.ja) ? '少ない' : '多い'), 'i'), st, v2.end, 'SVC', o, [], { noStative: true });
          if (r) { useIdiom(it.it); name('idiom'); return r; }
        }
        if (it.it && it.it.phrase === 'spend A doing' && /^(?:time|hours)$/.test(a2.head || '') && /^より(?:少ない|多くの)/.test(a2.ja)) {   // spend less time worrying about money → お金を心配する時間を減らす""")
rep("""    'next door': '隣に', 'right now': '今すぐ', 'no longer': 'もはや',""",
    """    'next door': '隣に', 'right now': '今すぐ', 'no longer': 'もはや', 'for pleasure': '楽しみのために',""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
