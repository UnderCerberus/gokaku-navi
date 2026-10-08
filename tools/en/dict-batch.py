"""語彙の一括追加: python tools/en/dict-batch.py ファイル
ファイルは 1 行 1 語「word|品詞|訳|level」（# で始まる行と空行は読み飛ばす）。中で dict-new.py を呼ぶ"""
import io
import os
import subprocess
import sys

here = os.path.dirname(os.path.abspath(__file__))
src = sys.argv[1]
items = []
for line in io.open(src, encoding='utf-8'):
    line = line.strip()
    if not line or line.startswith('#'):
        continue
    if line.count('|') != 3:
        raise SystemExit('bad line: ' + line)
    items.append(line)
subprocess.run([sys.executable, os.path.join(here, 'dict-new.py')] + items, check=True)
print('batch', len(items))
