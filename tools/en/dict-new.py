"""add-dict.py の NEW を差し替えて実行する: python tools/en/dict-new.py "word|品詞|訳|level" "word|品詞|訳|level" …
（Bash の heredoc で正規表現を書くとバックスラッシュが壊れるので、この道具を使う）"""
import io
import os
import re
import subprocess
import sys

here = os.path.dirname(os.path.abspath(__file__))
p = os.path.join(here, 'add-dict.py')
items = []
for arg in sys.argv[1:]:
    w, pos, ja, lv = arg.split('|')
    items.append("    ['%s', '%s', '%s', %d]," % (w.replace("'", "\\'"), pos, ja.replace("'", "\\'"), int(lv)))
s = io.open(p, encoding='utf-8').read()
s = re.sub(r"NEW = \[.*?\n\]", lambda m: "NEW = [\n" + '\n'.join(items) + "\n]", s, count=1, flags=re.S)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
subprocess.run([sys.executable, p], check=True)
