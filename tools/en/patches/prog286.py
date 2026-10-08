import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（EN: 第 286 組、回帰 6,318 文）: **依頼・申し出と数量の語順**（7時に迎えに行きましょうか（Why don't I …?。これまでは 私はなぜ…行きませんか）・"
         "お茶はいかがですか／お茶をもう1杯いかがですか（Would you care for …? / another cup of。これまでは …のために気にかけていただけませんか）・私たちに加わりませんか（Would you care to …?）・"
         "窓を開けましょうか（Do you want me to …?）・お金を貸してもらえないでしょうか（Do you think you could …?）・コーヒーを1杯どうですか（What do you say to + 名詞）・"
         "助言をいただけないでしょうか（I wonder if you could give me。これまでは くれていただけない）・お願いしてもいいですか（May I ask you a favor?。これまでは 好意を尋ねて）・"
         "お茶をいれた／いれましょう（make tea。これまでは いれった・いれりましょう＝作る の五段活用のまま置き換えていた）・パスワードを変更したい（change + 予約・パスワードなど）・"
         "もう行かなければならない（have to go now）。数量の語順: 名詞を前に出す（コーヒーを1杯飲んだ・本を2、3冊買った・紙が3枚必要だ。杯・本・枚・切れ・箱・袋・缶・冊・足・台・通・曲）、"
         "ケーキを2切れ（piece of cake）・炭酸飲料を4缶（can）・手紙を3通（letter）・彼の本のうち2冊（two of his books）。"
         "道具: 一時パッチは `tools/en/patches/` に置く（scratchpad は消える）。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
