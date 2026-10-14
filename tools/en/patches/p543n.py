import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# dogs that saw their owners pay attention to a toy dog behaved in ways … → …のを見た犬は…振る舞った
# （受け身にならない自動詞（behave / happen / arrive …）の過去形を名詞の後置修飾の過去分詞にしない。「振る舞われたおもちゃ」にしない）
rep("""    if (form && (!node.pron || (/^(?:someone|somebody|anyone|anybody|everyone|everybody|nobody)$/.test(node.pron) && form === 'ing')) && !o.noPart) {
      const v = vpNonfin(j, e, form, { subj: node });""",
    """    if (form && (!node.pron || (/^(?:someone|somebody|anyone|anybody|everyone|everybody|nobody)$/.test(node.pron) && form === 'ing')) && !o.noPart && !(form === 'pp' && /^(?:behaved|happened|arrived|died|existed|occurred|appeared|disappeared|remained|slept|laughed|cried|smiled|went|came|fell|rose|emerged|belonged|consisted|mattered|seemed|looked|barked|jumped|ran|walked|swam|flew|lived|stayed|waited|worked|played|agreed|succeeded|failed)$/.test(t.w || ''))) {
      const v = vpNonfin(j, e, form, { subj: node });""")

# behaved in ways that suggested jealousy / The results suggest a link → 嫉妬をうかがわせる・関連を示唆する（物事が主語で名詞が目的語の suggest は「示唆する」。「提案する」にしない）
rep("""      else if (L === 'open' && !vg.passive && !objs[0].num""",
    """      else if (L === 'suggest' && !vg.passive && o.subj && !o.subj.an && !(o.subj.pron && /^(?:i|you|he|she|we|they)$/.test(o.subj.pron)) && !objs[0].gerund && !objs[0].clause) sense = { particle: 'を', core: '示唆する', tr: true };
      else if (L === 'open' && !vg.passive && !objs[0].num""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
