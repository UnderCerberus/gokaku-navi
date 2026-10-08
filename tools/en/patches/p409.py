import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, """    ja = ja.replace(/より多くの(頻繁な|深刻な|重要な|効率的な|便利な|高価な|一般的な|強力な|正確な|安全な|複雑な|人気のある)/g, 'より$1').replace(/支えを提供/g, '支援を提供').replace(/([^、。]{1,10}?)ために(合意|協定|条約)に署名/g, '$1ための協定に署名').replace(/(橋|道路|道|トンネル)は([^、。]*?)今閉まっている/, '$1は$2現在通行止めになっている').replace(/選手権を獲得/g, '優勝');   // more frequent heat waves → より頻繁な熱波 / signed an agreement to protect the ocean → 海を守るための協定に署名した / the bridge is now closed → 現在通行止めになっている
    ja = ja.replace(/([^、。]{1,16}?)のより気づいている状態にな(っている|った|る)/, '$1をより意識するようにな$2').replace(/([^、。]{1,16}?)の気づいている状態にな(っている|った|る)/, '$1を意識するようにな$2').replace(/(?:彼らの)?毎日の費やすこと/g, '毎日の支出').replace(/(支出|出費|お金の使い方)を追跡/g, '$1を記録');   // Consumers are becoming more aware of environmental issues → 環境問題をより意識するようになっている / track their daily spending → 毎日の支出を記録する
""" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
