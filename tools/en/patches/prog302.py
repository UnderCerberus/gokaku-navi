import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（FD: 第 302 組、回帰 6,684 文）: **文化の比較**（ウェイターにチップを渡す（tip を動詞として辞書に。これまでは null）・国によっては、人を指さすことは失礼だ（In some countries。several はそのまま）・道路の右側で（これまでは 正しい側）・夏と年末に贈り物をすること・"
         "異なる文化を尊重するべきだ（respect + culture など。これまでは 尊敬する）・習慣は国によって異なる（from country to country。これまでは 国に国と）・ある国で…別の国では失礼かもしれない・日本では行儀が悪いことではない・"
         "学生は、若いとき、一生懸命に勉強するべきだ（study … when を間接疑問にしない＝WHV の when は know / tell などに限る。これまでは 彼らがいつ若いか…研究する。あわせて、べきだ・はずだ などの述語を名詞の補語と見ないようにして、後ろの節の they を主節の主語で受ける）・"
         "日本人は、お互いあいさつするとき、おじぎをする（people / Japanese も they の先行詞に））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
