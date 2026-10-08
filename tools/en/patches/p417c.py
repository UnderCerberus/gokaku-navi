import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "ja = ja.replace(/(?:1分間|一瞬|1秒間|少しの間)/, 'ちょっと').replace(/ちょっと(?:あなたと)?話(し)?/, 'ちょっとお話し');"
assert s.count(old) == 1
s = s.replace(old, "ja = ja.replace(/(?:1分間|一瞬|1秒間|少しの間|ちょっとの間)/, 'ちょっと').replace(/ちょっと(?:あなたと)?話せ/, 'ちょっとお話しでき').replace(/ちょっと(?:あなたと)?話(し|す)/, (m0, a0) => 'ちょっとお話し' + (a0 === 'し' ? 'し' : 'する'));")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
