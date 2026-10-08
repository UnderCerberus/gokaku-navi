import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（EX: 第 296 組、回帰 6,574 文）: **テクノロジー・ネット**（ウェブサイトは今ダウンしている（be down。これまでは 今権利を下ってある）・コンピューターはまたフリーズした（これまでは 凍った）・ネットで拡散した（go viral を熟語に）・"
         "1万人以上のフォロワーがいる・データをバックアップする（これまでは 支援する）・後であなたにメッセージを送る（text を動詞として辞書に。これまでは null）・スマートフォンに通知が来た・チャンネル登録してください・スクリーンショットを撮りなさい・"
         "サーバー・通知・インフルエンサーなどネットの語 18 語を辞書に（Bluetooth は英字のまま残す））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
