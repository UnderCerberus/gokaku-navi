import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# went back to the shop to pick up the prints → 写真を受け取りに（店で受け取る物の pick up は「受け取る」。prints は焼き増しの「写真」。「活字を拾う」にしない）
rep("""          else if (/^(?:speed|pace|momentum)$/.test(obj.head)) jaT = '〜を上げる';
        }""",
    """          else if (/^(?:speed|pace|momentum)$/.test(obj.head)) jaT = '〜を上げる';
          else if (/^(?:print|prints|photo|photos|order|orders|parcel|parcels|laundry|prescription|prescriptions|repair|repairs)$/.test(obj.head)) { jaT = '〜を受け取る'; if (/^prints?$/.test(obj.head)) obj = Object.assign({}, obj, { ja: obj.ja.replace(/活字$/, '写真') }); }
        }""")

# She showed me patiently → 根気よく教えてくれた（2 つ目の目的語がない show + 人 + 様態の副詞は「教える」。「私を見せて」にしない）
rep("""    if (L === 'look' && objs.length === 0 && j === i && !vg.passive) sense = { particle: '', core: '見える', tr: false };      // as he looks""",
    """    if (L === 'look' && objs.length === 0 && j === i && !vg.passive) sense = { particle: '', core: '見える', tr: false };      // as he looks
    if (L === 'show' && objs.length === 1 && /^(?:me|us|him|her|them|you)$/.test(objs[0].pron || '') && !vg.passive && (objs[0].end >= lim || (T[objs[0].end] && T[objs[0].end].k === 'w' && /ly$/.test(T[objs[0].end].w) && !!advC(T[objs[0].end])))) sense = { particle: 'に', core: '教える', tr: true };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
