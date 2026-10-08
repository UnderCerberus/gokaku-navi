# 1 組の締めをまとめて行う:
#   python tools/en/finish-group.py 直前コード 新コード 組番号 "回帰の見出し" "文1|文2|…" "PROGRESS の本文（先頭の『続き（…）: 』は自動）"
# 1) add-syn  2) t-syn / t-fail / t-tr / validate / selftest（失敗があればここで止める）
# 3) snap save  4) PROGRESS.md に 1 行追加  5) MEMORY.md の回帰文数を更新
import io, os, re, subprocess, sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
MEM = os.path.expanduser(r'~\.claude\projects\C--Claude\memory\MEMORY.md')

def run(cmd, timeout=600):
    r = subprocess.run(cmd, cwd=ROOT, capture_output=True, encoding='utf-8', errors='replace', timeout=timeout)
    return (r.stdout or '') + (r.stderr or '')

prev, code, num, head, sents, text = sys.argv[1:7]
accept = '--accept' in sys.argv[7:]
# 0) スナップショットとの差分。変化があるときは --accept がないと止める（見落とした退行を保存しないため）
d = run(['node', 'tools/en/snap.js', 'diff'], timeout=300)
mch = re.search(r'changed (\d+)', d)
if not mch or (mch.group(1) != '0' and not accept):
    print('snap diff に変化あり（確認して問題なければ --accept を付けて再実行）:\n' + d[-3000:]); sys.exit(1)
out = run(['python', 'tools/en/add-syn.py', head, sents])
print(out.strip().splitlines()[-1] if out.strip() else '(add-syn no output)')

syn = run(['node', 'tools/en/t-syn.js', 'all'])
m = re.search(r'parsed (\d+) / (\d+)', syn)
if not m or m.group(1) != m.group(2):
    print('t-syn NG:\n' + syn[-2000:]); sys.exit(1)
n = int(m.group(1))
checks = [
    (['node', 'tools/en/t-fail.js'], r'失敗 0'),
    (['node', 'tools/en/t-tr.js', 'all'], r'(\d+) / \1 ok'),
    (['node', 'tools/validate.js', '--all'], r'エラー 0'),
    (['node', 'tools/selftest.js'], r'fail 0'),
]
for cmd, pat in checks:
    o = run(cmd)
    last = o.strip().splitlines()[-1] if o.strip() else ''
    if not re.search(pat, o):
        print('NG', ' '.join(cmd), '\n', o[-2000:]); sys.exit(1)
    print(last)
print(run(['node', 'tools/en/snap.js', 'save'], timeout=300).strip().splitlines()[-1])

ns = '{:,}'.format(n)
p = os.path.join(ROOT, 'PROGRESS.md')
lines = io.open(p, encoding='utf-8').read().split('\n')
idx = [i for i, l in enumerate(lines) if ('（' + prev + ': ') in l][0]
lines.insert(idx + 1, '   - 続き（' + code + ': 第 ' + num + ' 組、回帰 ' + ns + ' 文）: ' + text)
io.open(p, 'w', encoding='utf-8', newline='\n').write('\n'.join(lines))

mem = io.open(MEM, encoding='utf-8').read()
mem2 = re.sub(r'(GOKAKU NAVI[^\n]*?回帰 )[\d,]+( 文)', lambda mm: mm.group(1) + ns + mm.group(2), mem, count=1)
io.open(MEM, 'w', encoding='utf-8', newline='\n').write(mem2)
print('PROGRESS +1 / MEMORY 回帰 ' + ns + ' 文' + ('' if mem2 != mem else '（MEMORY 変化なし）'))
