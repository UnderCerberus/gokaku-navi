import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# snap diff の見直し（第 512 組）
# 1) have + 影響 の「への → に」は既存の文末処理（大きい → 大きな・似ている → 同様の もそろえる）に任せる。p517l の組み替えは外す
rep("""      if (L === 'have' && /^(?:effect|effects|impact|impacts|influence|influences)$/.test(oh) && !vg.passive && objs.length === 1) {
        const mOnI = /^(.+?)への(.+)$/.exec(objs[0].ja || '');
        if (mOnI) { objs[0] = Object.assign({}, objs[0], { ja: mOnI[2] }); st.other.push(mOnI[1] + 'に'); }
        sense = { particle: 'を', core: '与える', tr: true };   // has a negative impact on health → 健康に悪い影響を与える
      }
""", "")

# 2) 10人に1人だけ（→ しか）には が を付けない
rep("""(sj.bare ? (/だけ$/.test(sj.ja) && !o.part && !cl.neg && !cl.also ? 'が' : '') :""",
    """(sj.bare ? (/だけ$/.test(sj.ja) && !/[0-9０-９]+(?:人|匹|頭|羽|台|冊|つ)だけ$/.test(sj.ja) && !o.part && !cl.neg && !cl.also ? 'が' : '') :""")

# 3) , as the theory of relativity predicts（予測する・言う などの as 節）は理由にしない（〜とおり・ように）
rep("""        if (typeof sc.end === 'number' && typeof mn.end === 'number' && sc.end > mn.end && T.some(""",
    """        if (typeof sc.end === 'number' && typeof mn.end === 'number' && sc.end > mn.end && !(sc.pred && /^(?:予測|予想|言|示|述|説明|期待|見|知|分か|想像|思|示唆|指摘|主張|予言|教え|書|呼|報告)/.test(sc.pred.s)) && T.some(""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
