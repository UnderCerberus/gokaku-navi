import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Yamada Taro / Natsume Soseki（姓が先に書かれた日本人の名前は入れ替えない）
rep("""      if (cnt > 0 && lastC && lastC.person && c.person && /^[一-龥々]+$/.test(w)) { ja = w + ja;""",
    """      if (cnt > 0 && lastC && lastC.person && c.person && /^[一-龥々]+$/.test(w) && JP_SURNAME[lastC.lemma] && !JP_SURNAME[c.lemma]) { ja = ja + w; pl = false; an = true; time = false; head = c.lemma; lastC = c; prevProper = false; proper = true; j++; cnt++; if (cnt >= 4) break; continue; }   // Yamada Taro / Natsume Soseki → 山田太郎・夏目漱石（姓が先）
      if (cnt > 0 && lastC && lastC.person && c.person && /^[一-龥々]+$/.test(w)) { ja = w + ja;""")

rep("""  const NAME_JA = dic({""",
    """  const JP_SURNAME = set('sato suzuki takahashi tanaka watanabe ito nakamura kobayashi kato yoshida yamada sasaki yamaguchi matsumoto inoue kimura hayashi shimizu yamazaki mori abe ikeda hashimoto ishikawa ogawa okada goto hasegawa murakami kondo ishii sakamoto endo aoki fujii nishimura fukuda ota miura fujiwara okamoto matsuda nakagawa nakano harada ono tamura takeuchi kaneko wada nakayama ishida ueda morita hara shibata sakai kudo yokoyama miyazaki miyamoto uchida takagi ando taniguchi ohno maruyama imai takada fujita kawasaki murata noguchi natsume oda tokugawa toyotomi katsushika matsuo akutagawa kawabata mishima miyazawa tezuka fukuzawa ohtani osaka yamamoto nakata honda');
  const NAME_JA = dic({""")

# 有名人の名前（姓名どちらの順でも）
rep("""  const PN = dic({ newyearsday: '元日',""",
    """  const PN = dic({ 'oda nobunaga': '織田信長', 'nobunaga oda': '織田信長', 'tokugawa ieyasu': '徳川家康', 'ieyasu tokugawa': '徳川家康', 'toyotomi hideyoshi': '豊臣秀吉', 'hideyoshi toyotomi': '豊臣秀吉', 'sakamoto ryoma': '坂本龍馬', 'ryoma sakamoto': '坂本龍馬', 'natsume soseki': '夏目漱石', 'soseki natsume': '夏目漱石', 'katsushika hokusai': '葛飾北斎', 'matsuo basho': '松尾芭蕉', 'murasaki shikibu': '紫式部', 'sei shonagon': '清少納言', 'noguchi hideyo': '野口英世', 'hideyo noguchi': '野口英世', 'akutagawa ryunosuke': '芥川龍之介', 'ryunosuke akutagawa': '芥川龍之介', 'miyazawa kenji': '宮沢賢治', 'kenji miyazawa': '宮沢賢治', 'tezuka osamu': '手塚治虫', 'osamu tezuka': '手塚治虫', 'miyazaki hayao': '宮崎駿', 'hayao miyazaki': '宮崎駿', 'fukuzawa yukichi': '福沢諭吉', 'yukichi fukuzawa': '福沢諭吉', 'prince shotoku': '聖徳太子', 'haruki murakami': '村上春樹', 'murakami haruki': '村上春樹', 'shohei ohtani': '大谷翔平', 'ohtani shohei': '大谷翔平', 'naomi osaka': '大坂なおみ', 'osaka naomi': '大坂なおみ', 'ichiro suzuki': 'イチロー', newyearsday: '元日',""")

# They are still interesting today → 今でもおもしろい
rep("""    ja = ja.replace(/^(春|夏|秋|冬)に、/, '$1には、');""",
    """    ja = ja.replace(/^(春|夏|秋|冬)に、/, '$1には、');
    ja = ja.replace(/今でも興味を持たせている(?=。|$)/, '今でも興味深い').replace(/数週後に/g, '数週間後に');   // they are still interesting today → 今でも興味深い / after a few weeks → 数週間後に""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
