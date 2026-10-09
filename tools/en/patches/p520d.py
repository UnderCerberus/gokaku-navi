import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# which psychologists have studied for decades → 心理学者が何十年も研究してきた（研究者の主語の study は 研究する）
rep("""    if (usedGap && o.gap && o.gap.rel && !objs.length && !vg.passive) {   // 関係詞の穴が目的語のとき、先行詞で語義を選ぶ: the reason he gave → 彼が挙げた理由 / the bus I took → 私が乗ったバス
      const gaA = o.gap.ante || '';
""",
    """    if (L === 'study' && !vg.passive && (objs.length === 1 || (usedGap && o.gap && o.gap.rel && !objs.length)) && o.subj && /(?:^| )(?:scientists?|researchers?|psychologists?|biologists?|economists?|linguists?|historians?|scholars?|sociologists?|anthropologists?|physicists?|chemists?|astronomers?|geologists?|neuroscientists?|ecologists?|zoologists?|archaeologists?|archeologists?|experts?|specialists?|team|teams)$/.test(plainSubj(o.subj).head || '')) sense = { particle: 'を', core: '研究する', tr: true };   // psychologists have studied it → 研究してきた
    if (usedGap && o.gap && o.gap.rel && !objs.length && !vg.passive) {   // 関係詞の穴が目的語のとき、先行詞で語義を選ぶ: the reason he gave → 彼が挙げた理由 / the bus I took → 私が乗ったバス
      const gaA = o.gap.ante || '';
""")
# the ability to swim, which many people lack → 多くの人々にはない泳ぐ能力（既存の置換で、間に修飾語があってもよい）
rep("""ja = ja.replace(/([^、。をがは]{1,10})が欠けている(戦略|能力|技能|知識|経験|もの|資源|道具)/g, '$1にはない$2')""",
    """ja = ja.replace(/([^、。をがは]{1,10})が欠けている([^、。をがは]{0,8}?)(戦略|能力|技能|知識|経験|もの|資源|道具)/g, '$1にはない$2$3')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
