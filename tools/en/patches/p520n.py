import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# their の先行詞を所有される名詞で選ぶ
#  ・their skins / tusks / behavior（動物の体・習性）→ 前の動物の名詞（products made from their skins → それらの皮。Scientists study animals to understand their behavior → それらの行動）
#  ・their families / parents / jobs（人の家族・仕事など）→ 物の名詞は飛ばして人の名詞（far from their families → crowded conditions ではなく people）
rep("""  function pluralAntecedent(i) {
""",
    """  const ANIMAL_N = /^(?:animals?|species|creatures?|wildlife|mammals?|birds?|fish|fishes|insects?|reptiles?|elephants?|rhinos?|rhinoceros(?:es)?|tigers?|lions?|bears?|wolves|wolf|whales?|sharks?|dolphins?|seals?|turtles?|snakes?|crocodiles?|alligators?|deer|fox|foxes|rabbits?|monkeys?|apes?|gorillas?|chimpanzees?|pandas?|leopards?|cheetahs?|horses?|cows?|cattle|pigs?|sheep|goats?|chickens?|dogs?|cats?|mice|mouse|rats?|bats?|bees?|honeybees?|ants?|butterfly|butterflies|frogs?|penguins?|owls?|eagles?|parrots?|crows?|octopus|octopuses|squids?|crabs?|salmon|tuna|corals?|minks?|beavers?|otters?|giraffes?|zebras?|camels?|kangaroos?|koalas?|pets?|livestock|prey|predators?)$/;
  const ANIMAL_POSS = /^(?:skin|skins|bones|fur|furs|feathers|horns|tusks|shells|meat|eggs|teeth|ivory|wings|tails|hides|scales|behavior|behaviour|behaviors|behaviours|habitat|habitats|instincts|nests|young|migration|diet|diets|populations|offspring|fins|beaks|claws|paws|antlers|venom)$/;
  const PERSON_POSS = /^(?:family|families|parents|children|kids|friends|relatives|homes|lives|jobs|careers|feelings|emotions|minds|wives|husbands|sons|daughters|siblings|classmates|colleagues|names|opinions|thoughts|decisions|salaries|incomes|savings|hometowns?|grandparents|spouses|partners|neighbors|neighbours|teachers|bosses|employers)$/;
  // their + 動物の体・習性の名詞: 前にある動物の名詞の位置（なければ -1）
  function theirAnimal(i) {
    if (!isW(T[i], 'their') || !T[i + 1] || !ANIMAL_POSS.test(T[i + 1].w || '')) return -1;
    for (let x = i - 1; x >= 0; x--) if (T[x].k === 'w' && ANIMAL_N.test(T[x].w) && !!nounC(T[x])) return x;
    return -1;
  }
  function pluralAntecedent(i) {
    if (theirAnimal(i) >= 0) return 'inan';   // products made from their skins → それらの皮（動物）
    const needAn = isW(T[i], 'their') && !!T[i + 1] && PERSON_POSS.test(T[i + 1].w || '');   // far from their families → 人の名詞を探す
""")
rep("""      const c = cand(t, '名', ['pl']);
      if (!c || PRON[t.w]) continue;
      if (vc(t, ['3sg', 'past']) && T[x + 1] && T[x + 1].k === 'w' && /^(?:them|it|him|her|us|me)$/.test(T[x + 1].w)) continue;   // and loves them の loves は動詞""",
    """      const c = cand(t, '名', ['pl']);
      if (!c || PRON[t.w]) continue;
      if (needAn && !(isPerson(c) || PERSONS[c.lemma] || ORG[c.lemma])) continue;   // crowded conditions far from their families の their は conditions ではない
      if (vc(t, ['3sg', 'past']) && T[x + 1] && T[x + 1].k === 'w' && /^(?:them|it|him|her|us|me)$/.test(T[x + 1].w)) continue;   // and loves them の loves は動詞""")
# mkClause: 主語が動物でないとき、動物の体・習性の their（それらの）を「自分の」にしない
rep("""    if (subj && subj.pron === 'they' && T.some((x) => isW(x, 'their')) && !T.some((x) => isW(x, 'those'))) cl.parts = cl.parts.map((x) => x.split('それらの').join('自分の'));""",
    """    const thAn = T.some((x, q) => theirAnimal(q) >= 0) && !(subj && subj.head && ANIMAL_N.test(String(subj.head).split(' ').pop()));   // some countries … products made from their skins → 自分の にしない
    if (subj && subj.pron === 'they' && T.some((x) => isW(x, 'their')) && !T.some((x) => isW(x, 'those')) && !thAn) cl.parts = cl.parts.map((x) => x.split('それらの').join('自分の'));""")
rep("""    if (subj && !subj.pron && (subj.pl || subj.coord) && !subj.clause && !subj.gerund && T.some((x) => isW(x, 'their'))) cl.parts = cl.parts.map((x) => x.replace(/^(?:それらの|彼らの)/, '自分の').replace(/^彼ら自身の/, '自分自身の'));""",
    """    if (subj && !subj.pron && (subj.pl || subj.coord) && !subj.clause && !subj.gerund && T.some((x) => isW(x, 'their')) && !thAn) cl.parts = cl.parts.map((x) => x.replace(/^(?:それらの|彼らの)/, '自分の').replace(/^彼ら自身の/, '自分自身の'));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
