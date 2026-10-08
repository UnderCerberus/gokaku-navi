import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Experts suggest that it may be the most effective solution → …かもしれないと示唆している（suggest + 直説法の that 節）
rep("""        const mkT = inanS || findS || showS ? 'ことを' : thatMark(vg, L);""",
    """        const suggInd = L === 'suggest' && !inanS && !!tc.cl && (/^(?:may|might|could|can|will|would|must)$/.test(tc.cl.modal || '') || (!!tc.cl.past && !vg.past));
        if (suggInd) { name('that-clause'); return done(vg, P('示唆する', 'suru'), st, tc.end, 'SVO', o, [tStr.replace(/だ$/, 'だ') + 'と']); }
        const mkT = inanS || findS || showS ? 'ことを' : thatMark(vg, L);""")

rep("""      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };""",
    """      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };
      else if (L === 'present' && /(?:^| )(?:challenge|challenges|problem|problems|difficulty|difficulties|opportunity|opportunities|risk|risks|threat|threats|obstacle|obstacles)$/.test(oh)) sense = { particle: 'を', core: 'もたらす', tr: true };   // it also presents new challenges → 新しい課題をもたらす
      else if (L === 'introduce' && /(?:^| )(?:system|systems|meeting|meetings|policy|policies|rule|rules|technology|technologies|program|programs|measure|measures|service|services|plan|plans|tax|taxes|law|laws|method|methods|device|devices|machine|machines|uniform|uniforms|fee|fees)$/.test(oh)) sense = { particle: 'を', core: '導入する', tr: true };   // introduced regular online meetings → 定期的なオンライン会議を導入した""")

rep("""'by the way': 'ところで', 'either way': 'いずれにせよ',""",
    """'by the way': 'ところで', 'either way': 'いずれにせよ', 'in response': 'これを受けて',""")

rep("""    ja = ja.replace(/(リスク|危険|費用|コスト|ストレス|量|ごみ)を(減らす|下げる|抑える)ことがある/g, '$1を$2ことができる')""",
    """    ja = ja.replace(/より偉大な/g, 'より大きな').replace(/規則的な(オンラインの|オンライン)?(会議|ミーティング)/g, '定期的な$1$2');   // greater flexibility → より大きな柔軟性 / regular online meetings → 定期的なオンライン会議
    ja = ja.replace(/(リスク|危険|費用|コスト|ストレス|量|ごみ)を(減らす|下げる|抑える)ことがある/g, '$1を$2ことができる')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
