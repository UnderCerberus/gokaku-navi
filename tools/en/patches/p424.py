import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };""",
    """      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };
      else if (L === 'finish' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper|sandwich|food|cake|soup|ice cream)$/.test(oh) && !vg.passive) sense = { particle: 'を', core: '食べ終える', tr: true };   // She has just finished her lunch → 昼食を食べ終えたところだ""")

rep("""    ja = ja.replace(/夜の空/g, '夜空');""",
    """    ja = ja.replace(/夜の空/g, '夜空');
    ja = ja.replace(/(塩|こしょう|砂糖|しょうゆ|ソース|パン|バター)を(?:私に)?渡して/g, '$1を取って').replace(/自分の(昼食|夕食|朝食)を食べ終え/g, '$1を食べ終え');   // pass me the salt → 塩を取って""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
