import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "/^(?:solve|help|save|cure|prevent|provide|produce|find|reduce|improve|make|create|feed|protect|treat|stop)$/.test(vg.lemma) ? canP(p).plain() : p.plain()"
assert s.count(old) == 1
s = s.replace(old, "/^(?:solve|help|save|cure|prevent|provide|produce|find|reduce|improve|feed|protect|treat|stop)$/.test(vg.lemma) && !/(?:く|に)(?:する|させる|なる)$/.test(p.plain()) ? canP(p).plain() : p.plain()")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
