import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""  const LEAD = dic({
    however: 'しかしながら', """, """  const LEAD = dic({
    someday: 'いつか', sometime: 'いつか', however: 'しかしながら', """)

rep("""    ja = ja.replace(/電話に答え/g, '電話に出')""",
    """    ja = ja.replace(/一生懸命に雨が/g, '激しく雨が').replace(/雨が一生懸命に/g, '雨が激しく').replace(/同じもの(を|は)(する|した|して)/g, '同じこと$1$2').replace(/単にほほえ/g, 'ただほほえ');   // It was raining hard → 激しく雨が降っていた / do the same → 同じことをする
    ja = ja.replace(/離れて歩いて([0-9０-９]+分)(だった|だ)/g, (m0, a0, b0) => '歩いて' + a0 + 'のところに' + (b0 === 'だった' ? 'あった' : 'ある'));   // the nearest station was a ten-minute walk away → 最寄りの駅は歩いて10分のところにあった
    ja = ja.replace(/([^、。をがは]{1,10})と(?:彼|彼女)?の?傘を共有しよう/g, '$1を傘に入れてあげよう');   // offered to share his umbrella with her → 彼女を傘に入れてあげようと申し出た
    if (tokens.some((x, k) => x.w === 'just' && tokens[k + 1] && tokens[k + 1].w === 'as')) ja = ja.replace(/^ちょうど(.+?)のと同じように、/, 'ちょうど$1とき、');   // Just as she was about to start running, … → ちょうど彼女が走り出そうとしたとき、
    ja = ja.replace(/電話に答え/g, '電話に出')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
