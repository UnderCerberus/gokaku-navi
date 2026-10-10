import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Ideas … could now reach ordinary people → 普通の人々に届く（考え・作品・本などの主語 + reach + 人 → 届く。着く にしない）
rep("""      else if (L === 'reach' && objs.length === 1 && !vg.passive && o.subj && /^(?:light|sound|sounds|news|message|messages|letter|letters|signal|signals|information|heat|water|rain|radiation|wave|waves|smell|voice)$/.test(plainSubj(o.subj).head || '')) sense = { particle: 'に', core: '届く', tr: true };""",
    """      else if (L === 'reach' && objs.length === 1 && !vg.passive && o.subj && (/^(?:light|sound|sounds|news|message|messages|letter|letters|signal|signals|information|heat|water|rain|radiation|wave|waves|smell|voice|idea|ideas|book|books|work|works|music|song|songs|story|stories|knowledge|word|words|product|products|service|services|campaign|art|culture|religion|technology)$/.test(plainSubj(o.subj).head || '') || (objs[0].an && !o.subj.an && !(o.subj.pron && PRON[o.subj.pron] && PRON[o.subj.pron].an)))) sense = { particle: 'に', core: '届く', tr: true };""")

# With this machine, a small team of workers could produce … → 生産できた（人の集団の名詞 + could は能力。「かもしれない」にしない）
rep("""          !/^(?:ship|ships|boat|boats|car|cars|plane|planes|train|trains|machine|machines|computer|computers|robot|robots|engine|engines|truck|trucks|rocket|rockets)$/.test(sj.head || '')) { p = P(p.plain() + 'かもしれない', 'i'); past = false; break; }""",
    """          !/^(?:ship|ships|boat|boats|car|cars|plane|planes|train|trains|machine|machines|computer|computers|robot|robots|engine|engines|truck|trucks|rocket|rockets|team|teams|group|groups|crew|crews|staff|family|families|class|classes|committee|company|companies|army|government|club|band|choir|audience)$/.test(sj.head || '')) { p = P(p.plain() + 'かもしれない', 'i'); past = false; break; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
