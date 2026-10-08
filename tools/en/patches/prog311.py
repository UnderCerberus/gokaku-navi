import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（FM: 第 311 組、回帰 6,828 文）: **学校生活と表の重複キーの整理**（学級新聞を担当している（これまでは 授業の新聞）・学級会・昨日学校を欠席した（これまでは 欠席していた）・京都へ修学旅行に行く・受けられなかった試験の追試を受け・学級委員長に選ばれた（これまでは として選ばれた）・"
         "月曜日以外は毎日練習する（except。これまでは 毎日月曜日を除いて）・得意な教科（best subject）。"
         "道具: `node tools/en/fixed-dups.js` で FIXED_SENT / TIMEPH / LEAD2 / PN / NAME_JA の重複キーを数える、`python tools/en/fixed-dedupe.py` で効いていない前のキーを消す（後のキーが勝つので動作は変わらない。43 件を削除、回帰の変化 0））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
