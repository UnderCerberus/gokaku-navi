import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（ET: 第 292 組、回帰 6,473 文）: **前置詞が後ろに残る不定詞と there is no one who**（一緒に遊ぶ友達がいない（friends to play with。これまでは null）・一緒に話す友達がいる・住む家がほしい（a house to live in。want + O + to の読みを、不定詞の最後に前置詞が残るときは止める。これまでは 家が中に住んでほしい）・"
         "書くものが何もない（nothing to write with）・パンを切るためのナイフ・座るいす・頼る人が誰もいない（no one to rely on）・遊ぶ時間がない（time to play。time / chance などは不定詞の目的語の穴なしで先に読む。これまでは する時間）・"
         "食べるものは何もなかった（nothing to eat → もの）・着るものが何もない・何か飲み物がほしい（I'd like something to drink。これまでは 好きだろう）・"
         "私たちを助けられる人は誰もいない／彼の名前を知らない人はいない（There is nobody who … / no one who doesn't …。これまでは 助けられない誰もはいない＝二重否定の誤り）・宿題が好きな生徒はいない・空港に行くバスはない（no doubt that などの同格の that は除く）・"
         "できることは何もない（nothing that I can do。これまでは できるそれがすること））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
