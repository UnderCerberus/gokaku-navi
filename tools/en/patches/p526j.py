import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The reason … remains a mystery to everyone → 誰にとっても謎のままだ（物が主語の remain + 名詞は のままだ。謎・驚き・問題などの名詞 + to + 人 は にとって）
rep("""          core = L === 'become' ? P(n.ja + 'になる', 'v5') : (L === 'remain' ? P(n.ja + 'のままでいる', 'v1') : (L === 'prove' ? P(n.ja + 'だと分かる', 'v5') : P(n.ja + 'のようだ', 'da')));
          return done(vg, core, st, tail(n.end, lim, st, o, vg), 'SVC', o, [], { noStative: true });""",
    """          const inanR = L === 'remain' && o.subj && !o.subj.an && !(o.subj.pron && /^(?:i|you|he|she|we|they)$/.test(o.subj.pron));
          let toR = '', endR = n.end;
          if (/^(?:mystery|puzzle|secret|surprise|shock|problem|challenge|threat|mystery|question|riddle|wonder|joy|comfort|relief)$/.test(n.head || '') && isW(T[n.end], 'to') && n.end + 1 < lim) {
            const mTo = mark();
            const nTo = np(n.end + 1, lim, { noRel: true });
            if (nTo && (nTo.an || /^(?:everyone|everybody|anyone|anybody|me|us|him|her|them|you)$/.test(T[n.end + 1].w || ''))) { toR = (/^(?:everyone|everybody|anyone|anybody)$/.test(T[n.end + 1].w || '') ? '誰' : nTo.ja) + 'にとって' + (/^(?:everyone|everybody|anyone|anybody)$/.test(T[n.end + 1].w || '') ? 'も' : ''); endR = nTo.end; }
            else fail(mTo);
          }
          core = L === 'become' ? P(n.ja + 'になる', 'v5') : (L === 'remain' ? (inanR ? P(toR + n.ja + 'のままだ', 'da') : P(toR + n.ja + 'のままでいる', 'v1')) : (L === 'prove' ? P(n.ja + 'だと分かる', 'v5') : P(n.ja + 'のようだ', 'da')));
          return done(vg, core, st, tail(endR, lim, st, o, vg), 'SVC', o, [], { noStative: true });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
