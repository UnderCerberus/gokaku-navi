import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（EO: 第 287 組、回帰 6,353 文）: **案内放送・時間の経過・遅刻**（お知らせいたします（Attention, please）・5分後に3番線に到着する（in five minutes + 到着・閉店などは「後に」。finish in は「で」のまま）・"
         "かばんを放置しない（leave ~ unattended）・レジに向かってください（make one's way to → head to。熟語表の one's + ~ は索引に載らないのでトークナイザで書き換え）・次はセントラル駅です・"
         "滞在を楽しんでいただけたならうれしいです（We hope you enjoyed …）・ショーをお楽しみください・誤りをおわびします（We apologize for + 名詞）・"
         "迷子の子どもたちは案内所で引き取れる／母に迎えに来てもらった／ごみは月曜日に回収される（受け身の pick up。これまでは 拾われた）・"
         "30分が過ぎた（Half an hour passed。これまでは null＝TIMEPH の half an hour が主語を食べていた）・それ以来10年が過ぎた・"
         "外側が硬くて、内側が柔らかい（hard on the outside and soft on the inside。既知の残り）・開場は午後6時だ（Doors open at）・チケットを用意しておいてください（have / get ~ ready。これまでは null）・"
         "建物のどこでも許されていない（anywhere in。どこかで→どこにも の置き換えが後段にあるので、その後ろに置く）・彼は10分遅刻した／電車は5分遅れている／10分遅れるだろう（be + 時間 + late。これまでは 遅く10分だった）・"
         "チェックアウトは午前11時だ）。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
