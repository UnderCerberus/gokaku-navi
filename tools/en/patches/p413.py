import io
p = r'C:\Claude\gokaku-navi\js\data\idioms.js'
s = io.open(p, encoding='utf-8').read()
old = "    ['give away ~', '〜をただで与える; 〜を暴露する', 3],"
assert s.count(old) == 1
s = s.replace(old, "    ['give away ~', '〜を人にあげる; 〜を配る; 〜を漏らす', 3],")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)

p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""        if (it.it && /^pick up ~$|^pick ~ up$/.test(it.it.phrase) && (obj.an || (obj.pron && PRON[obj.pron] && PRON[obj.pron].an))) jaT = '〜を迎えに行く';                // picked them up at their doors → 彼らを迎えに行った""",
    """        if (it.it && /^pick up ~$|^pick ~ up$/.test(it.it.phrase) && (obj.an || (obj.pron && PRON[obj.pron] && PRON[obj.pron].an))) jaT = /^(?:me|us)$/.test(obj.pron || '') ? '〜を迎えに来る' : '〜を迎えに行く';                // picked them up at their doors → 彼らを迎えに行った / Can you pick me up? → 私を迎えに来てくれますか
        // turn down / turn up + 音・暖房（断る・現れる ではない）
        if (it.it && /^turn (?:down ~|~ down|up ~|~ up)$/.test(it.it.phrase) && /^(?:volume|sound|music|radio|tv|television|stereo|heat|heater|heaters|heating|conditioner|temperature|thermostat|fire|gas|flame)$/.test(obj.head || '')) {
          const upT = /up/.test(it.it.phrase.replace(/^turn /, ''));
          jaT = /^(?:volume|sound)$/.test(obj.head) ? '〜を' + (upT ? '上げる' : '下げる') : (/^(?:heat|heater|heaters|heating|conditioner|temperature|thermostat|fire|gas|flame)$/.test(obj.head) ? '〜を' + (upT ? '強める' : '弱める') : '〜の音量を' + (upT ? '上げる' : '下げる'));
        }
        // gave away his old clothes → 古い服を人にあげた / gave away free samples → 無料の見本を配った / gave away the secret → 秘密を漏らした
        if (it.it && /^give (?:away ~|~ away)$/.test(it.it.phrase)) jaT = /(?:^| )(?:secret|secrets|answer|answers|ending|plan|plans|location|position|identity|surprise|password)$/.test(obj.head || '') ? '〜を漏らす' : (/^無料の/.test(obj.ja || '') || /(?:^| )(?:sample|samples|ticket|tickets|flyer|flyers|leaflet|leaflets|prize|prizes|coupon|coupons|balloon|balloons|brochure|brochures|pamphlet|pamphlets)$/.test(obj.head || '') ? '〜を配る' : (T[obj.end] && T[obj.end].w === 'to' ? '〜をあげる' : '〜を人にあげる'));""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    if (tokens.some((x) => x.w === 'volume') && tokens.some((x) => x.w === 'turn' || x.w === 'turned' || x.w === 'turns')) ja = ja.replace(/(?<!音)量を(上げ|下げ)/g, '音量を$1');   // Turn up the volume → 音量を上げなさい
    ja = ja.replace(/(ホテル|旅館)でチェックイン/g, '$1にチェックイン').replace(/(ホテル|旅館|部屋)の([^、。]{0,8}?)チェックアウト(し|す)/g, '$2$1をチェックアウト$3').replace(/(駅|空港|学校|家)で(私|私たち)を迎えに来/g, '$1まで迎えに来');   // check in at the hotel → ホテルにチェックインする / checked out of the hotel early → 早くホテルをチェックアウトした / pick me up at the station → 駅まで迎えに来て
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
