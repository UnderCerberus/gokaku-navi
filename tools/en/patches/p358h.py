import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

start = s.index("    ja = ja.replace(/^((?:あなた|あなたたち)は)?([^、。]*?)")
end = s.index('\n', start) + 1
line = s[start:end]
s = s[:start] + s[end:]
anchor = "    ja = ja.replace(/^([^、。]+?)は許されていない(?=。|$)/, '$1は禁止されている')"
i0 = s.index(anchor)
i1 = s.index('\n', i0) + 1
s = s[:i1] + line.replace("ことは禁止されている(?=。|$)/", "ことは(?:禁止されている|許されていない)(?=。|$)/") + s[i1:]
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
