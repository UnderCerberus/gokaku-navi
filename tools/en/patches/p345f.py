import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# My bike was fixed yesterday → 修理された（fixed は形容詞「決まった」もあるが、出来事・修理できる物なら受け身）
rep("""    if (isAdjHead(T[r.idx])) return false;             // tired / interested / surprised は形容詞として扱う""",
    """    if (T[r.idx].w === 'fixed' && (T.some((x) => /^(?:yesterday|ago|last|soon|already|tomorrow|quickly|immediately|finally|will|been|be|being|needs|need|must|should|can)$/.test(x.w || '')) || T.slice(0, r.idx).some((x) => /^(?:bike|bikes|bicycle|bicycles|car|cars|computer|computers|roof|window|windows|door|doors|machine|machines|phone|phones|smartphone|watch|tv|television|light|lights|road|roads|bridge|bridges|fence|toilet|pipe|pipes|engine|printer|elevator|clock|radio|camera|heater|leak|problem|problems|bug|bugs|error|errors|lock|sink|shower|air|conditioner|washing|refrigerator|fridge)$/.test(x.w || '')))) return true;   // My bike was fixed yesterday → 修理された（The price is fixed は 決まっている）
    if (isAdjHead(T[r.idx])) return false;             // tired / interested / surprised は形容詞として扱う""")

# The cat lay on the sofa → ソファーに横たわっていた / The book lay on the table → テーブルの上にあった
rep("""    else if (vg.lemma === 'lay' && !vg.passive && !o.hasObj && T[vg.idx] && T[vg.idx].w === 'lay' && sj && anim && /^置く$/.test(p.plain())) { p = P('横たわる', 'v5'); past = true; }""",
    """    else if (vg.lemma === 'lay' && !vg.passive && !o.hasObj && T[vg.idx] && T[vg.idx].w === 'lay' && sj && anim && /^置く$/.test(p.plain())) { p = P('横たわる', 'v5'); past = true; }
    else if (vg.lemma === 'lay' && !vg.passive && !o.hasObj && !vg.modal && !vg.nonfin && T[vg.idx] && T[vg.idx].w === 'lay' && sj && !sj.pron && /^置く$/.test(p.plain()) && (vg.idx + 1 >= lim || T[vg.idx + 1].k === 'p' || (T[vg.idx + 1].k === 'w' && (!!PREP[T[vg.idx + 1].w] || /^(?:there|here|still|quietly|asleep|awake|motionless|silent|dead)$/.test(T[vg.idx + 1].w))))) {
      if (/^(?:cat|cats|dog|dogs|puppy|puppies|kitten|kittens|lion|lions|tiger|tigers|horse|horses|cow|cows|bear|bears|deer|pig|pigs|sheep|fox|foxes|wolf|wolves|rabbit|rabbits|animal|animals|pet|pets|snake|snakes|seal|seals|baby|babies|body|bodies)$/.test(sj.head || '')) p = P('横たわっている', 'v1');
      else p = P('ある', 'v5');
      past = true;
    }   // The cat lay on the sofa（3 単現でない lay は lie の過去形）""")

# in the sun → 日なたで / take a tour → ツアーに参加する / Have some cookies → クッキーをどうぞ
rep("""    ja = ja.replace(/(朝食|昼食|夕食|夜食|おやつ|デザート)のために([^、。]{1,16}?)を(食べ|飲)/g, '$1に$2を$3');""",
    """    ja = ja.replace(/(朝食|昼食|夕食|夜食|おやつ|デザート)のために([^、。]{1,16}?)を(食べ|飲)/g, '$1に$2を$3');
    ja = ja.replace(/太陽の中で/g, '日なたで').replace(/太陽の中に/g, '日なたに');   // The dog lay in the sun → 日なたで横たわっていた
    if (tokens.some((x) => /^(?:take|took|taken|taking|takes|join|joined|joins|joining)$/.test(x.w || '')) && tokens.some((x) => /^(?:tour|tours)$/.test(x.w || ''))) ja = ja.replace(/(工場|博物館|美術館|学校|城|寺|施設|キャンパス|宮殿|お城|神社|大学|会社|工房)の(?:旅行|ツアー)を(?:取|と|撮)(?=[っらりるれろ])/, '$1見学ツアーに参加し').replace(/(ツアー|旅行)を(?:取|と|撮)(っ|ら|り|る|れ|ろ)/, (m0, a0, b0) => (a0 === '旅行' ? 'ツアー' : a0) + 'に参加' + ({ 'っ': 'し', 'ら': 'しな', 'り': 'し', 'る': 'する', 'れ': 'すれ', 'ろ': 'しろ' })[b0]).replace(/見学ツアーに参加しった/, '見学ツアーに参加した').replace(/に参加しった/g, 'に参加した').replace(/に参加して(?=た)/, 'に参加し');   // We took a guided tour → ガイド付きツアーに参加した
    if (tokens[0] && tokens[0].w === 'have' && tokens[1] && tokens[1].w === 'some') ja = ja.replace(/を(?:食べ|飲み)なさい(?=。|$)/, 'をどうぞ');   // Have some cookies → クッキーをどうぞ""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
