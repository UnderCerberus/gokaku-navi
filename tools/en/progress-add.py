# 使い方: python tools/en/progress-add.py "直前の見出しコード（例 GX）" "追加する行（先頭の '   - ' は自動）"
import io, sys
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
prev, text = sys.argv[1], sys.argv[2]
lines = io.open(p, encoding='utf-8').read().split('\n')
idx = [i for i, l in enumerate(lines) if ('（' + prev + ': ') in l][0]
lines.insert(idx + 1, '   - ' + text)
io.open(p, 'w', encoding='utf-8', newline='\n').write('\n'.join(lines))
print('ok')
