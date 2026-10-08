import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, """    if (tokens.some((x, q) => /^(?:mr|ms|mrs)$/.test(x.w || '') && tokens[q + 1] && tokens[q + 1].cap) && tokens.some((x) => /^(?:teach|teaches|taught|teacher|teachers|class|classes|school|students|lesson|lessons|homework|retire|retires|retired)$/.test(x.w || ''))) ja = ja.replace(/^([^、。]{1,8}?)さん(?=は|が|の|に|を|と)/, '$1先生');   // Mr. Tanaka has been working at this school → 田中先生は
    if (tokens.some((x) => /^(?:teach|teaches|taught|teacher|class|classes|school|lesson|lessons|subject|subjects|homework|test|exam)$/.test(x.w || ''))) ja = ja.replace(/科学を教え/g, '理科を教え').replace(/科学の(授業|先生|宿題|テスト|試験)/g, '理科の$1');   // He teaches science → 理科を教える
    ja = ja.replace(/(?:彼らの|彼の|彼女の|私の|自分の)?お気に入りの(先生|人|選手|歌手|作家|俳優)/g, '一番好きな$1').replace(/世界の周りの/g, '世界中の').replace(/(彼ら|彼|彼女)自身の/g, '自分の');   // their favorite teacher → 一番好きな先生 / people around the world → 世界中の人々
    if (tokens.some((x) => /^(?:teacher|teachers|school|work|job|company|office|teaches|working)$/.test(x.w || '')) || tokens.some((x, q) => /^(?:mr|ms|mrs)$/.test(x.w || ''))) ja = ja.replace(/引退するつもりだ/g, '退職する予定だ');   // He is going to retire next March → 退職する予定だ
""" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
