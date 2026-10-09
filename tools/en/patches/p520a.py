import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# When asked why they had chosen …, most of the respondents … / When asked about it, he … / If given the chance, many people …
# （接続詞 + 過去分詞の省略節: 後ろの疑問詞節・that 節の中は調べない。前置詞・分詞の後ろの代名詞は目的語。主節の主語が名詞なら代名詞を補い、訳では省く）
rep("""      const cE = tokens.findIndex((x, q) => q > 1 && q < 6 && x.k === 'p' && x.w === ',');
      if (cE > 1 && !tokens.slice(1, cE).some((x) => x.k === 'w' && (BE[x.w] || MODAL[x.w] || DO[x.w] || HAVE[x.w] || (PRON[x.w] && PRON[x.w].sub) || """,
    """      const ppE = tokens[1] && tokens[1].k === 'w' && !!vc(tokens[1], ['pp']) && !BE[tokens[1].w];
      const cE = tokens.findIndex((x, q) => q > 1 && q < (ppE ? 24 : 6) && x.k === 'p' && x.w === ',');
      const kWhE = ppE && cE > 2 ? tokens.findIndex((x, q) => q > 1 && q < cE && x.k === 'w' && /^(?:why|what|how|where|when|whether|if|that|who|which)$/.test(x.w)) : -1;
      if (cE > 1 && !tokens.slice(1, kWhE > 0 ? kWhE : cE).some((x, q) => x.k === 'w' && (BE[x.w] || MODAL[x.w] || DO[x.w] || HAVE[x.w] || (PRON[x.w] && PRON[x.w].sub && !(tokens[q] && tokens[q].k === 'w' && (PREP[tokens[q].w] || (q > 0 && !!vc(tokens[q], ['pp']))))) || """)
rep("""        const subjE = itE ? 'it' : (tokens[cE + 1] && tokens[cE + 1].k === 'w' && PRON[tokens[cE + 1].w] && PRON[tokens[cE + 1].w].sub && /^(?:i|you|he|she|we|they|it)$/.test(tokens[cE + 1].w) ? tokens[cE + 1].w : null);
        if (subjE) {""",
    """        let subjE = itE ? 'it' : (tokens[cE + 1] && tokens[cE + 1].k === 'w' && PRON[tokens[cE + 1].w] && PRON[tokens[cE + 1].w].sub && /^(?:i|you|he|she|we|they|it)$/.test(tokens[cE + 1].w) ? tokens[cE + 1].w : null);
        let nounE = false;
        if (!subjE && ppE) {   // 主節の主語が名詞: most of the respondents → they / the bridge → it / the man → he
          for (let q = cE + 1; q < Math.min(b, cE + 8); q++) {
            const x = tokens[q];
            if (x.k !== 'w') break;
            if ((DET[x.w] !== undefined && !PRON[x.w]) || /^(?:of|most|many|some|all|few|several|both|each)$/.test(x.w) || (!!adjC(x) && !nounC(x))) continue;
            const ncE = nounC(x);
            if (ncE && !PRON[x.w] && !MODAL[x.w] && !BE[x.w]) { subjE = /^(?:people|children|men|women|police)$/.test(x.w) || (!!cand(x, '名', ['pl']) && !cand(x, '名', ['base'])) || /^(?:most|many|some|all|few|several|both)$/.test(tokens[cE + 1].w || '') ? 'they' : (isPerson(ncE) ? 'he' : 'it'); nounE = true; }
            break;
          }
        }
        if (subjE) {""")
rep("""          if (rE && rE.ok) return Object.assign({}, rE, { ja: rE.ja.replace(/^もしそれが必要だったら、/, '必要なら、')""",
    """          if (rE && rE.ok && nounE) rE.ja = rE.ja.replace(new RegExp('^(?:もし)?' + ({ they: '彼ら', he: '彼', it: 'それ' })[subjE] + '(?:が|は)、?'), (m0) => (/^もし/.test(m0) ? 'もし' : ''));
          if (rE && rE.ok) return Object.assign({}, rE, { ja: rE.ja.replace(/^もしそれが必要だったら、/, '必要なら、')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
