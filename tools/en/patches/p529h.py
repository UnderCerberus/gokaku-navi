import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

SHARE = "grow|raise|produce|make|cook|wash|clean|prepare|build|design|write|read|buy|sell|collect|sort|pack|store|process|transport|deliver|plant|harvest|recycle|reuse|repair|fix|test|record|edit|print|publish|develop|share|study|analyze|analyse|catch|dry|cut|boil|fry|bake|paint|check|count|measure|copy|save|keep|carry|load|ship|import|export|use|eat"

# They grow and sell vegetables → 彼らは野菜を育てて売る / to grow and transport the food → 食べ物を育てて輸送する
# （V1 and V2 + 目的語: 左の動詞に目的語がなく右にあるなら、左も同じ目的語の他動詞として読む。成長して にしない）
rep("""      if (left.cont || left.pred.cls === 'fix') return left.out(lo) + '、そして' + right.out(ro);
      return left.out(Object.assign(lo, { form: 'te' })) + '、' + right.out(ro);""",
    """      if (left.cont || left.pred.cls === 'fix') return left.out(lo) + '、そして' + right.out(ro);
      const vcL = typeof left.end === 'number' && left.end > 0 && T[left.end - 1] && T[left.end - 1].k === 'w' && isW(T[left.end], 'and') ? vc(T[left.end - 1], ['base', '3sg', 'past']) : null;
      if (w === 'and' && !(left.parts || []).length && vcL && vcL.e && /^(?:""" + SHARE + """)$/.test(vcL.lemma || '') && left.pred && verbal(left.pred) && !left.neg && !right.neg && !left.modal && (pron || !right.subj || right.subj === left.subj) && (right.parts || []).some((x) => /を$/.test(x))) {
        const objIs = right.parts.findIndex((x) => /を$/.test(x));
        const trSs = en.jp.senses(vcL.e.ja).find((x) => x.tr);
        const trCs = trSs ? String(trSs.core).replace(/^[〜…](?:を|に)?/, '').replace(/[〜…]/g, '') : '';
        if (trCs) {
          const partsSs = right.parts.slice(); partsSs.splice(objIs + 1, 0, P(trCs).form('te'));
          return mkClause(left.subj, Object.assign({}, right, { parts: partsSs }), left.lead).out(o);
        }
      }
      return left.out(Object.assign(lo, { form: 'te' })) + '、' + right.out(ro);""")

rep("""        else vp3.parts = [vpJoin(vp, 'te') + '、'].concat(vp3.parts);""",
    """        else {
          const objI3 = (vp3.parts || []).findIndex((x) => /を$/.test(x));
          const trS3 = !(vp.parts || []).length && objI3 >= 0 && vp.vg && vp.vg.e && /^(?:""" + SHARE + """)$/.test(vp.vg.lemma || '') ? en.jp.senses(vp.vg.e.ja).find((x) => x.tr) : null;
          const trC3 = trS3 ? String(trS3.core).replace(/^[〜…](?:を|に)?/, '').replace(/[〜…]/g, '') : '';
          if (trC3 && !vp.neg) { vp3.parts = vp3.parts.slice(); vp3.parts.splice(objI3 + 1, 0, P(trC3).form('te')); }
          else vp3.parts = [vpJoin(vp, 'te') + '、'].concat(vp3.parts);
        }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
