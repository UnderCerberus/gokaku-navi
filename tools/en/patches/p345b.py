import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# a carefully planned trip / a newly built house / freshly baked bread（副詞 + 過去分詞 + 名詞）
rep("""    let j = i, pre = '';
    while (j < lim - 1 && T[j].k === 'w' && ((ADV[T[j].w] && ADV[T[j].w][1] === 'd') ||""",
    """    if (allowPart && i + 2 < lim && T[i + 1].k === 'w' && T[i + 2].k === 'w' && (/^(?:well|badly|poorly|newly|recently|freshly)$/.test(t.w) || (/ly$/.test(t.w) && !!advC(t) && !adjC(t))) && !!vc(T[i + 1], ['pp']) && !vc(T[i + 1], ['base']) && !nounC(T[i + 1]) && !adjC(T[i + 1]) && !!nounC(T[i + 2]) && !PREP[T[i + 2].w] && DET[T[i + 2].w] === undefined && !PRON[T[i + 2].w]) {
      const pAp = vc(T[i + 1], ['pp']);
      if (pAp && pAp.e) {
        pick(i + 1, pAp.e);
        if (t.w === 'newly' && pAp.lemma === 'build') return { ja: '新築の', end: i + 2 };
        if (t.w === 'freshly' && /^(?:bake|make|brew|cut|paint|squeeze|pick|cook|grind)$/.test(pAp.lemma)) return { ja: ({ bake: '焼きたての', make: '作りたての', brew: 'いれたての', cut: '切りたての', paint: '塗りたての', squeeze: 'しぼりたての', pick: '摘みたての', cook: 'できたての', grind: 'ひきたての' })[pAp.lemma], end: i + 2 };
        if (t.w === 'well' && /^(?:know|make|pay|dress|educate|plan|organize|organise|design|write|keep|balance|prepare|train|behave|deserve)$/.test(pAp.lemma)) return { ja: ({ know: 'よく知られた', make: 'よくできた', pay: '給料のよい', dress: '身なりのよい', educate: '教養のある', plan: 'よく計画された', organize: 'よく整理された', organise: 'よく整理された', design: 'よく設計された', write: 'よく書けた', keep: '手入れの行き届いた', balance: 'バランスのとれた', prepare: '十分に準備された', train: 'よく訓練された', behave: '行儀のよい', deserve: '当然の' })[pAp.lemma], end: i + 2 };
        const aAp = t.w === 'well' ? 'よく' : (t.w === 'badly' ? 'ひどく' : (t.w === 'poorly' ? '不十分に' : (t.w === 'newly' ? '新しく' : (t.w === 'recently' ? '最近' : (t.w === 'freshly' ? '新たに' : (advC(t) || {}).ja)))));
        if (aAp) {
          const vAp = verbSense(pAp.e, true);
          return { ja: aAp + en.jp.P(vAp.core).aux('pass').form('past'), end: i + 2 };
        }
      }
    }
    let j = i, pre = '';
    while (j < lim - 1 && T[j].k === 'w' && ((ADV[T[j].w] && ADV[T[j].w][1] === 'd') ||""")

# 名詞の前の過去分詞: fallen → 落ちた / broken → 壊れた・割れた・折れた / boiled → ゆでた（自動詞は受け身にしない）
rep("""    if (pp && !vc(t, ['base']) && !cand(t, '名', ['base'])) {
      pick(i, pp.e);
      return { ja: en.jp.P(verbSense(pp.e, true).core).aux('pass').form('past'), end: i + 1 };
    }""",
    """    if (pp && !vc(t, ['base']) && !cand(t, '名', ['base'])) {
      pick(i, pp.e);
      const nPa = T[i + 1] && T[i + 1].k === 'w' ? T[i + 1].w : '';
      if (pp.lemma === 'break') return { ja: /^(?:window|windows|glass|glasses|cup|cups|plate|plates|bottle|bottles|mirror|mirrors|egg|eggs|dish|dishes|vase|vases|screen|screens)$/.test(nPa) ? '割れた' : (/^(?:bone|bones|leg|legs|arm|arms|branch|branches|pencil|pencils|finger|fingers|rib|ribs|nose|wrist|ankle|toe|toes)$/.test(nPa) ? '折れた' : (/^(?:heart|hearts)$/.test(nPa) ? '傷ついた' : (/^(?:english|japanese|french|chinese|german|spanish|korean)$/.test(nPa) ? '片言の' : (/^(?:promise|promises|rule|rules|law|laws|record|records)$/.test(nPa) ? '破られた' : '壊れた')))), end: i + 1 };
      if (pp.lemma === 'fall') return { ja: /^(?:tree|trees|pole|poles|wall|walls|log|logs)$/.test(nPa) ? '倒れた' : '落ちた', end: i + 1 };
      const adnPa = ({ fade: '色あせた', retire: '引退した', melt: '溶けた', rot: '腐った', swell: '腫れた', sink: '沈んだ', escape: '逃げた', vanish: '消えた', disappear: '消えた', expire: '期限切れの', fail: '失敗した', boil: 'ゆでた', fry: '揚げた', grill: '焼いた', bake: '焼いた', roast: '焼いた', smoke: '燻製の', lock: '鍵のかかった', injure: 'けがをした', wound: '負傷した', damage: '損傷した', spoil: '傷んだ', wilt: 'しおれた', wither: '枯れた', dry: '乾燥した', freeze: /^(?:food|foods|vegetable|vegetables|meat|fish|pizza|dinner|dinners|meal|meals)$/.test(nPa) ? '冷凍の' : '凍った', hide: '隠された', slice: '薄切りの', chop: '刻んだ', grate: 'すりおろした', mash: 'つぶした' })[pp.lemma];
      if (adnPa) return { ja: adnPa, end: i + 1 };
      return { ja: en.jp.P(verbSense(pp.e, true).core).aux('pass').form('past'), end: i + 1 };
    }""")

# broken English / fallen trees（限定詞なしでも名詞の前の分詞を認める）
rep("""(?:imported|exported|processed|frozen|canned|recycled|dried|boiled|fried|grilled|baked|cooked|packaged|printed|polluted|limited|advanced|developed|educated|skilled|trained|written|spoken|stolen|shared|unexpected|unwanted|unused|mixed|paid|unpaid|reduced|improved|selected|registered|renewed|genetically)$/""",
    """(?:imported|exported|processed|frozen|canned|recycled|dried|boiled|fried|grilled|baked|cooked|packaged|printed|polluted|limited|advanced|developed|educated|skilled|trained|written|spoken|stolen|shared|unexpected|unwanted|unused|mixed|paid|unpaid|reduced|improved|selected|registered|renewed|genetically|broken|fallen|hidden|rotten|faded|roasted|smoked|sliced|chopped|mashed|whipped|grated|injured|wounded|damaged|abandoned|melted|expired)$/""")

# He has a broken arm → 腕を骨折している / She has a broken heart → 心が傷ついている
rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    ja = ja.replace(/^([^、。]{1,10}?は)(?:骨折した|折れた)(腕|足|脚|指|骨|鼻|手首|足首|肋骨|つま先)を持って(いる|いた)/, '$1$2を骨折して$3').replace(/^([^、。]{1,10}?は)(?:傷心|傷ついた心)を持って(いる|いた)/, '$1心が傷ついて$2');
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
