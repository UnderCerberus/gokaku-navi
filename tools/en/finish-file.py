"""finish-group.py の回帰文をファイルから渡す（文が多いとき用）:
  python tools/en/finish-file.py 直前コード 新コード 組番号 "回帰の見出し" 文のファイル "PROGRESS の本文" [--accept]
  文のファイル: 1 行 1 文。# で始まる行と空行は読み飛ばす（tools/en/heldout/*.txt をそのまま渡せる）
  PROGRESS の本文を @ファイル名 にすると、そのファイルの中身を本文にする（シェルの引用符で ' が落ちるのを避ける）"""
import io
import os
import subprocess
import sys

here = os.path.dirname(os.path.abspath(__file__))
prev, code, num, head, path, text = sys.argv[1:7]
if text.startswith('@'):
    text = io.open(text[1:], encoding='utf-8').read().strip()
sents = [l.strip() for l in io.open(path, encoding='utf-8').read().split('\n') if l.strip() and not l.strip().startswith('#')]
args = [sys.executable, os.path.join(here, 'finish-group.py'), prev, code, num, head, '|'.join(sents), text] + sys.argv[7:]
sys.exit(subprocess.call(args, cwd=os.path.join(here, '..', '..')))
