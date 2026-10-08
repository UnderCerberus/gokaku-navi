import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""仕事で行く予定だ / I'm going to the library → 図書館に行くところだ
""",
    """仕事で行く予定だ / I'm going to the library → 図書館に行くところだ
    // 進行形の come（予定・接近）: She is coming to Japan → 日本に来る / Are you coming to the party? → パーティーに来ますか / They are coming home now → 今家に向かっているところだ
    if (tokens.some((x, q) => x.w === 'coming' && tokens.slice(Math.max(0, q - 3), q).some((y) => /^(?:am|is|are)$/.test(y.w || '')) && !tokens.slice(Math.max(0, q - 3), q).some((y) => /^(?:was|were|been)$/.test(y.w || '')) && (!tokens[q + 1] || tokens[q + 1].k !== 'w' || /^(?:to|home|back|here|over|tomorrow|tonight|next|this|soon|later|with)$/.test(tokens[q + 1].w || '')) && !(tokens[q + 1] && tokens[q + 1].w === 'to' && tokens[q + 2] && /^(?:an|see|visit|help|pick|meet|stay|play|join|talk|get|watch|be|the end)$/.test(tokens[q + 2].w || '')))) {
      const nowC = tokens.some((x) => /^(?:now)$/.test(x.w || '')) && !tokens.some((x) => /^(?:tomorrow|tonight|next|soon|later|weekend)$/.test(x.w || ''));
      const futC = tokens.some((x) => /^(?:tomorrow|tonight|next|soon|later|weekend|summer|winter|spring|autumn|fall|vacation|holiday|holidays|monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/.test(x.w || ''));
      if (nowC) ja = ja.replace(/今帰宅している(?=。|$)/, '今家に向かっているところだ').replace(/今([^、。]*?)(?:に|へ)来ている(?=。|$)/, '今$1に向かっているところだ');
      else ja = ja.replace(/帰宅している(?=。|$)/, futC ? '帰宅する予定だ' : '帰ってくる').replace(/帰宅していますか(?=。|$)/, '帰ってきますか').replace(/(に|へ)([^、。]*?)来ている(?=。|$)/, (m0, a0, b0) => a0 + b0 + (futC ? '来る予定だ' : '来る')).replace(/来ていますか(?=。|$)/, '来ますか').replace(/^([^、。]{1,10}?)は来ている(?=。|$)/, '$1は来る');
    }
""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/階段を下(って|る|った)/g, (m0, a0) => '階段を下' + ({ 'って': 'りて', 'る': 'りる', 'った': 'りた' })[a0]).replace(/階段を下りて歩い(た|て)/g, '歩いて階段を下り$1').replace(/階段を下りて行ってい(た|る)/g, '階段を下りてい$1').replace(/階段を下りて来ている(?=。|$)/, '階段を下りているところだ');   // walked down the stairs → 歩いて階段を下りた / was going down the stairs → 階段を下りていた
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
