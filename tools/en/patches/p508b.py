import io
# 記録（適用済み）:
# 1) 辞書 present（動）の語順: 〜を提示する; 〜を贈る; 〜を発表する（説明文では「提示する」が多い。贈るは present A with B の熟語と VOBJ で）
# 2) over + distance(s) / kilometers → 〜を越えて（over distances of thousands of kilometers → 何千キロメートルもの距離を越えて）
# 3) 熟語: find one's way home / find one's way back（idiom-new.py）
p = r'C:\Claude\gokaku-navi\js\data\dict-m-z.js'
s = io.open(p, encoding='utf-8').read()
old = "    ['present', '動', '〜を贈る; 〜を提示する', 2],"
if s.count(old) == 1:
    s = s.replace(old, "    ['present', '動', '〜を提示する; 〜を贈る; 〜を発表する', 2],")
    io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """      case 'over':
        // over thousands of years / over the years / over five years → 〜にわたって（期間の over）"""
if s.count(old) == 1:
    s = s.replace(old, """      case 'over':
        if (!obj.pron && obj.head && /^(?:distance|distances|kilometer|kilometers|kilometre|kilometres|mile|miles)$/.test(obj.head)) return R(n + 'を越えて', 'other');   // over distances of thousands of kilometers → 何千キロもの距離を越えて
        // over thousands of years / over the years / over five years → 〜にわたって（期間の over）""")
    io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
