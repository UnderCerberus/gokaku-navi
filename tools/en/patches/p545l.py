import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The boy stopped as he saw the dog → 犬を見たとき、少年は立ち止まった（過去の知覚・発見の as は「とき」。目的語のある as … saw は「見たように」にしない）
rep("""        if (sc.past && sc.pred && verbal(sc.pred) && !sc.neg && !sc.perfect && !sc.passive && /^(?:入る|近づく|通る|帰る|着く|出る|渡る|開ける|曲がる|戻る|降りる|上がる)$/""",
    """        if (sc.past && sc.pred && verbal(sc.pred) && !sc.neg && !sc.perfect && !sc.passive && (sc.parts || []).some((x) => /を$/.test(x)) && /^(?:見る|見つける|気づく|聞く|目にする)$/.test(sc.pred.plain())) return S('attr', true) + 'とき、';
        if (sc.past && sc.pred && verbal(sc.pred) && !sc.neg && !sc.perfect && !sc.passive && /^(?:入る|近づく|通る|帰る|着く|出る|渡る|開ける|曲がる|戻る|降りる|上がる)$/""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
