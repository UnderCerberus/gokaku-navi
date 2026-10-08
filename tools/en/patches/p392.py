import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Bread came second → パンは2番目だった（come + 順位）
rep("""    // Hi, Ken. → こんにちは、ケン""",
    """    {
      const kCm = T.findIndex((x, q) => q > 0 && /^(?:came|comes|come)$/.test(x.w || '') && T[q + 1] && /^(?:first|second|third|fourth|fifth|last)$/.test(T[q + 1].w || '') && (q + 2 === b || (T[q + 2] && /^(?:in|place)$/.test(T[q + 2].w || ''))));
      if (kCm > 0) {
        const nCm = np(0, kCm, {});
        const rkCm = ({ first: '1位', second: '2位', third: '3位', fourth: '4位', fifth: '5位', last: '最下位' })[T[kCm + 1].w];
        if (nCm && nCm.end === kCm) {
          let eCm = kCm + 2;
          let inCm = '';
          if (eCm < b && isW(T[eCm], 'in')) { const pCm = np(eCm + 1, b, {}); if (pCm && pCm.end === b) { inCm = pCm.ja + 'で'; eCm = b; } }
          if (eCm === b) return { ok: true, ja: nCm.ja + 'は' + inCm + rkCm + (T[kCm].w === 'came' ? 'だった' : 'だ') + '。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
        }
        reset(tokens);
      }
    }
    // Hi, Ken. → こんにちは、ケン""")

rep("""    ja = ja.replace(/^((?:[^、。]{1,8}、)?)((?:私たちの|私の|その)?クラス)は([^、。]*?)討論をした/, '$1$2で$3討論をした')""",
    """    ja = ja.replace(/^((?:[^、。]{1,8}、)?)((?:私たちの|私の|その)?クラス)は([^、。]*?)(討論|調査|アンケート|発表|話し合い)をした/, '$1$2で$3$4をした')""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/(羊|牛|馬|犬|ネコ|猫|鶏|ニワトリ|鳥|魚|動物|ペット|豚|ヤギ|ウサギ|金魚|カメ)に(?:食べ物|えさ)を与え(る|た|て|るの)/g, (m0, a0, b0) => a0 + 'にえさをや' + ({ 'る': 'る', 'た': 'った', 'て': 'って', 'るの': 'るの' })[b0]).replace(/決してそこで(経験|生活|思い出|日々|時間)を/, 'そこでの$1を決して').replace(/(そこ|あそこ)で(経験|生活|思い出|日々)を/g, '$1での$2を');   // feed the sheep → 羊にえさをやる / I will never forget my experience there → そこでの経験を決して忘れない
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
