import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# with their meanings slightly changed → 意味が少し変わって / with his eyes slightly closed → 目を少し閉じて
#（with + 名詞 + 副詞 + 過去分詞。体の部分でない名詞は「〜が（自動詞・受け身）て」。主語の動作ではない）
rep("""      const tx = T[x];
      const ppW = tx.k === 'w' ? vc(tx, ['pp']) : null;
      const ajW = tx.k === 'w' ? adjC(tx) : null;
      if (ppW && !ajW && x + 1 === lim) {""",
    """      let tx = T[x], advWj = '';
      if (tx.k === 'w' && /^(?:slightly|partly|partially|completely|fully|half|still|wide|firmly|tightly|carefully|neatly|largely|greatly|totally|entirely)$/.test(tx.w) && x + 2 === lim && T[x + 1].k === 'w' && !!vc(T[x + 1], ['pp'])) {
        const aWx = advC(tx);
        advWj = ({ slightly: '少し', partly: '一部', partially: '一部', completely: '完全に', fully: '完全に', half: '半分', still: 'まだ', wide: '大きく', firmly: 'しっかり', tightly: 'しっかり', carefully: '注意深く', neatly: 'きちんと', largely: '大きく', greatly: '大きく', totally: '完全に', entirely: '完全に' })[tx.w] || (aWx && aWx.ja) || '';
        x++; tx = T[x];
      }
      const ppW = tx.k === 'w' ? vc(tx, ['pp']) : null;
      const ajW = tx.k === 'w' ? adjC(tx) : null;
      const bodyW = /^(?:eye|eyes|mouth|arm|arms|leg|legs|hand|hands|head|fist|fists|finger|fingers|lip|lips|teeth|knee|knees|back|face|hair)$/.test(nW.head || '');
      if (ppW && !bodyW && !nW.an && x + 1 === lim && (advWj || /^(?:their|its)$/.test(T[i + 1].w || ''))) {
        pick(x, ppW.e);
        const coreW = P(verbSense(ppW.e, true).core);
        const INTR = { '変える': '変わる', '閉める': '閉まる', '開ける': '開く', '止める': '止まる', '消す': '消える', '壊す': '壊れる', '曲げる': '曲がる', '上げる': '上がる', '下げる': '下がる', '燃やす': '燃える', '溶かす': '溶ける', '集める': '集まる', '広げる': '広がる', '減らす': '減る', '増やす': '増える' };
        const pW = INTR[coreW.plain()] ? P(INTR[coreW.plain()]) : coreW.aux('pass');
        return { ja: nW.ja.replace(/^(?:それらの|彼らの|自分の|その|彼の|彼女の)/, '') + 'が' + advWj + pW.form('te'), end: lim };   // with their meanings slightly changed → 意味が少し変わって
      }
      if (ppW && !ajW && x + 1 === lim) {""")
rep("""        return { ja: nWj + 'を' + (sp || P(verbSense(ppW.e, true).core).form('te')), end: lim };""",
    """        return { ja: nWj + 'を' + advWj + (sp || P(verbSense(ppW.e, true).core).form('te')), end: lim };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
