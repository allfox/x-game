export const WORLD_LORE = {
  realmName: '星紋層界',
  summary:
    '在星紋層界，龐大的靈能瀑布交織出浮空城邦與深層藤海，五大元素勢力靠著符石維持平衡。虛空審判者撕裂了星瀑回路，散落的裂隙正讓整個世界緩緩崩落。守護者遠征隊從各派系中召集英雄，以符石戰陣串起新的聯盟。',
  pillars: [
    {
      name: '星瀑回路',
      detail: '將靈能導入城邦與祭壇的巨型水晶脈網，裂痕會讓元素流向失控。'
    },
    {
      name: '靈紋殘響',
      detail: '古老的符文機關會記錄戰鬥波動，能用來預測裂隙開啟的節奏。'
    },
    {
      name: '共鳴誓約',
      detail: '各勢力透過共鳴儀式分享力量，也確保遠征隊的成員遵守盟約。'
    }
  ],
  factions: [
    { name: '燎炬王廷', detail: '以熔爐城邦為根基的火焰帝國，王火驅動無數浮砲與熔鎧。' },
    { name: '潮生議會', detail: '統御海霧航道的水紋學府，善於以潮汐術式編織守護結界。' },
    { name: '蒼藤歌盟', detail: '棲息於雲層古林的吟遊氏族，透過藤歌統御自然靈脈。' },
    { name: '晝耀聖庭', detail: '信奉星耀的光明聯邦，聖衛與祭司維繫城市的秩序。' },
    { name: '幽影契會', detail: '潛伏於裂隙陰影的諜報組織，操縱暗色符鏈追尋禁忌真相。' },
    { name: '守護者遠征隊', detail: '由六勢力共同籌組的多元素小隊，是對抗虛空的最後縱隊。' }
  ],
  storyIntro:
    '劇情模式會帶領你巡行裂隙前線。每一章節都對應一名魔王，勝利後可以見證世界觀推進，也解鎖更嚴苛的挑戰。',
  heroGuild: '守護者遠征隊'
};

export const HERO_LORE = {
  'ember-sovereign': {
    faction: '燎炬王廷',
    role: '熾焰君王',
    tagline: '以熔火鎧甲巡守焦土邊境的孤王。',
    personality: '沉穩而威嚴，對百姓柔軟卻對敵人毫不寬赦。',
    backstory:
      '赫里昂在星瀑崩解時封印三十七道熔脈，阻止虛空燃燒王都。如今他親率王廷援軍，與遠征隊締約共享火焰術式。',
    traits: ['焦土守護', '王焰共鳴', '鎧甲戰略家'],
    quote: '「王火不為毀滅，只為照亮仍在前行的人。」'
  },
  'drake-artillerist': {
    faction: '燎炬王廷',
    role: '龍紋砲術師',
    tagline: '將龍骨砲塔改造為流動火線的天才工匠。',
    personality: '爽朗豪放，對實驗失敗的容忍度極高。',
    backstory:
      '莉菈出生於熔爐工坊，幼時因調校失誤導致砲塔自爆，從此立志打造能自行修復的龍紋砲。她把首座成品拖到裂隙前線，願為遠征隊提供火力支援。',
    traits: ['機巧砲匠', '龍骨彈倉', '前線補給'],
    quote: '「砲管可以燒毀，但靈感永遠在下一輪轟擊裡。」'
  },
  'radiant-vanguard': {
    faction: '燎炬王廷',
    role: '烈煌騎士',
    tagline: '在熾光風暴裡仍能守住陣線的炙熱先鋒。',
    personality: '正直而講究儀節，討厭無謂的殘酷。',
    backstory:
      '羅格曾是王廷儀仗隊長，為保護撤離的村民獨守熔崖三日三夜。遠征隊成立後，他主動請纓，以守護陣列為小隊撐開第一道火光。',
    traits: ['盾陣領航', '熾心鐵衛', '王廷戰旗'],
    quote: '「讓我頂著火焰前進，你們就能看見勝利的出口。」'
  },
  'cinder-ronin': {
    faction: '燎炬王廷',
    role: '灼炭浪人',
    tagline: '以焦炭劍痕記錄旅途的孤傲劍士。',
    personality: '寡言固執，對承諾的信念勝過一切。',
    backstory:
      '炎二曾是邊境傭兵，拒絕為腐敗的城主效力而遠走。虛空裂痕吞沒他的故鄉，他留下唯一的劍譜給遠征隊，希望有人能記住亡城的名字。',
    traits: ['焦炭劍譜', '浪人巡狩', '炙痕見證'],
    quote: '「我已無根可守，只剩一身火刃為你們開路。」'
  },
  'ash-bard': {
    faction: '燎炬王廷',
    role: '炎灰樂師',
    tagline: '將戰火化為節奏的吟遊鼓手。',
    personality: '樂觀幽默，懂得以音律安撫焦慮。',
    backstory:
      '賽茲以灰燼製作樂器，記錄王城遭襲時的節拍，歌聲能同步士兵心跳。他的戰鼓如今隨遠征隊巡迴，用節奏驅散虛空耳語。',
    traits: ['餘燼節奏', '士氣共鳴', '戰場樂章'],
    quote: '「只要節拍還在，火勢就永遠向著希望跳動。」'
  },
  'lava-herder': {
    faction: '燎炬王廷',
    role: '熔潮牧者',
    tagline: '馴服熔岩獸群的火域牧人。',
    personality: '溫柔沉著，對靈獸比對人類更有耐心。',
    backstory:
      '阿崙守護熔潮谷的火蜥群，被裂隙驚擾後牠們差點暴走。為了庇護族群，他帶著熔獸遷徙至遠征隊營地，順勢成為支援部隊的獸使。',
    traits: ['熔獸馭者', '地火緩流', '靈獸同盟'],
    quote: '「火蜥懂得記仇，也懂得感謝。我們亦然。」'
  },
  'crimson-duelist': {
    faction: '燎炬王廷',
    role: '赤紋決鬥家',
    tagline: '以炙紅符陣標記獵物的火線刺客。',
    personality: '好勝直接，視對決為最純粹的語言。',
    backstory:
      '塔恩原是王廷競技場的冠軍，因拒絕假賽被流放。當裂隙逼近，她以個人名義向遠征隊申請參戰，用每一場勝利證明自己的正直。',
    traits: ['赤紋印記', '刃舞決鬥', '榮譽之烙'],
    quote: '「讓火焰作證，勝負永遠寫在正面。」'
  },
  'magmabreaker': {
    faction: '燎炬王廷',
    role: '熔崖破陣者',
    tagline: '背負重錘拆解虛空堡壘的先遣重工。',
    personality: '豪邁大氣，習慣在爆炸聲裡談笑。',
    backstory:
      '夏朵出身熔崖拆除隊，專門摧毀廢棄的熔脈塔。虛空在塔下滋生後，她改以烈焰錘開出疏散通道，遠征隊邀請她負責破除敵方護壁。',
    traits: ['裂岩重錘', '護壁破除', '工程戰術'],
    quote: '「聽我一聲怒吼，城牆就會乖乖向後退。」'
  },
  'pyrolumen': {
    faction: '燎炬王廷',
    role: '焰脈燈塔師',
    tagline: '點亮浮空航道的守燈人。',
    personality: '沉靜內斂，無時無刻在觀察周遭光線。',
    backstory:
      '艾奧維護王廷上空的燈塔網路，能在濃煙中辨識靈光。裂隙擾亂導航後，他攜帶縮小版燈塔核心加入遠征隊，以火光指引撤離路徑。',
    traits: ['靈燈導引', '航道預測', '夜行守望'],
    quote: '「只要燈還亮著，迷途者就不會被黑暗吞噬。」'
  },
  'meteor-dancer': {
    faction: '燎炬王廷',
    role: '流星舞者',
    tagline: '將墜星軌跡化作戰舞的舞刀者。',
    personality: '輕快浪漫，對危機有著奇妙的樂觀。',
    backstory:
      '蓓妮在王廷節慶中表演流星舞，能以身軀模擬流星軌跡。當天空裂開，她把舞步調整為戰場節奏，使隊友在火光中同步移動。',
    traits: ['隕光舞步', '節奏連鎖', '流星落點'],
    quote: '「把恐懼當作節拍，腳步就能踩在希望上。」'
  },
  'tide-matriarch': {
    faction: '潮生議會',
    role: '潮宙議長',
    tagline: '掌控海霧議事廳的慈威領袖。',
    personality: '睿智寬厚，善於以柔制剛。',
    backstory:
      '薇拉在議會中調和各港口利益，擅長以潮汐預言判斷未來。她看見虛空將吞沒港灣，遂親率潮生禁衛協助遠征隊穩定補給線。',
    traits: ['潮汐議法', '海霧庇佑', '港灣盟約'],
    quote: '「浪會退去，但我們的決心永不枯竭。」'
  },
  'frost-oracle': {
    faction: '潮生議會',
    role: '霜潮神諭',
    tagline: '以冰晶推演潮線的冷冽預言家。',
    personality: '沉著理性，說話總帶著霜氣般的距離。',
    backstory:
      '塞茜雅能從冰晶中的波形推演未來，曾預警議長遇襲。她將推算出的裂隙節奏交給遠征隊，提供最精準的攻勢窗口。',
    traits: ['霜晶推演', '潮汐測序', '冷悟洞察'],
    quote: '「答案寫在霜花裡，我只是替它開口。」'
  },
  'azure-medic': {
    faction: '潮生議會',
    role: '湛流療士',
    tagline: '將潮水化為護脈的海療專家。',
    personality: '溫婉體貼，對痛苦的感知異常敏銳。',
    backstory:
      '米瑞在漂浮診所服務，能以海霧針線縫合傷勢。她目睹裂隙毒潮侵染漁民，毅然帶著藥箱登上遠征隊的補給艦。',
    traits: ['潮霧療織', '深海藥典', '平衡呼吸'],
    quote: '「別怕，讓海浪先替你呼吸。」'
  },
  'abyss-scout': {
    faction: '潮生議會',
    role: '深渦斥候',
    tagline: '熟悉黑潮水道的潛行觀測員。',
    personality: '寡言敏捷，習慣以手勢溝通。',
    backstory:
      '奈歐負責監測深渦壓力，發現虛空氣泡潛入海床。他的偵測報告挽救了整座浮港，如今他化身遠征隊的水域先導。',
    traits: ['壓流感知', '潛行引導', '暗水坐標'],
    quote: '「在最黑的水裡，我仍看得見前方的光。」'
  },
  'iceblade-assassin': {
    faction: '潮生議會',
    role: '冰刃潛影',
    tagline: '以結冰水幕消失在視線之外的影殺。',
    personality: '冷靜精準，討厭多餘的情緒。',
    backstory:
      '弋洛曾是議會的陰影守衛，專門清除海盜首領。裂隙吞噬他的師父後，他決意追隨遠征隊，把每一次出手都獻給復仇。',
    traits: ['水幕遁形', '冰刃手術', '靜脈突擊'],
    quote: '「沒有波浪的海面，才是殺機最深的時刻。」'
  },
  'tidal-minstrel': {
    faction: '潮生議會',
    role: '潮語琴師',
    tagline: '用潮聲調律心跳的旅歌者。',
    personality: '柔和細膩，喜歡用故事換取情報。',
    backstory:
      '洛珊以水琴記錄港灣傳說，她發現虛空波形與古老的溺歌相似。她把旋律交給遠征隊，讓隊伍能提前察覺波動異常。',
    traits: ['海歌諧振', '波形記憶', '流動故事'],
    quote: '「每一段水聲都是預言，只要有人願意聽。」'
  },
  'star-navigator': {
    faction: '潮生議會',
    role: '星潮領航員',
    tagline: '同時掌握星圖與潮圖的航線統籌。',
    personality: '冷靜務實，任何決策都需完整數據。',
    backstory:
      '凱爾帶領潮生艦隊巡航，他將星瀑殘光與潮流結合出新圖層。遠征隊依靠他的導向穿越浮空裂縫，避免陷入虛空旋渦。',
    traits: ['星潮對照', '航線校準', '靈測紀錄'],
    quote: '「地平線會改變，但我們的坐標始終正確。」'
  },
  'glacier-magus': {
    faction: '潮生議會',
    role: '冰瀑術士',
    tagline: '能在瞬間凍結潮流的冰霜典範。',
    personality: '寧靜自持，對學術研究有近乎苛刻的要求。',
    backstory:
      '芙蘭執掌冰瀑塔，研究如何以寒流封鎖裂隙。她的結論是透過連鎖凍結延緩虛空增殖，於是攜帶實驗成果加入遠征隊。',
    traits: ['霜瀑封鎖', '符陣冷凝', '寒潮轉向'],
    quote: '「溫度會說實話，我只需替它安排下一步。」'
  },
  'abyss-warden': {
    faction: '潮生議會',
    role: '淵監典獄',
    tagline: '守護深海監牢的冷面軍官。',
    personality: '嚴苛守紀，對背叛毫無容忍。',
    backstory:
      '羅亞監督潮牢囚犯，曾阻止虛空教團滲透。他把監牢守衛術式移植到遠征隊陣線，確保後方不再被偷襲。',
    traits: ['潮鎖陣列', '禁制條約', '海壁守備'],
    quote: '「自由必須有人守著牢門，這是我的責任。」'
  },
  'stormcaller': {
    faction: '潮生議會',
    role: '驟雨咒師',
    tagline: '呼喚風暴清洗戰場的雲海法師。',
    personality: '熱情活潑，對暴風的摯愛近乎狂熱。',
    backstory:
      '伊婕能引導雲海雷暴，曾以一場風雨平息海盜叛亂。她為遠征隊調製風暴戰術，利用雷雨拆解虛空孢囊。',
    traits: ['雷霆召喚', '雲海遷徙', '暴風分割'],
    quote: '「讓雨勢大聲些，虛空就聽不見我們的恐懼。」'
  },
  'verdant-sage': {
    faction: '蒼藤歌盟',
    role: '蒼藤長老',
    tagline: '解讀森林記憶的古藤智者。',
    personality: '慈祥耐心，說話宛如風穿過樹梢。',
    backstory:
      '墨萊守護雲層古林，他能透過藤蔓汲取過往的聲音。虛空割斷樹根後，他將古林的意志托付給遠征隊，維繫自然的反擊。',
    traits: ['藤脈記憶', '森林共鳴', '樹語庇護'],
    quote: '「樹木記得一切，我只是代替它們開口。」'
  },
  'vine-rogue': {
    faction: '蒼藤歌盟',
    role: '藤影盜賊',
    tagline: '在枝葉間穿梭的林間俠盜。',
    personality: '機靈淘氣，喜歡用惡作劇測試同伴反應。',
    backstory:
      '琪娜曾偷取聖庭的祭壇琥珀，只為讓被驅逐的村落重獲陽光。她帶著偷來的光種加入遠征隊，負責切斷虛空藤觸。',
    traits: ['枝影潛行', '光種偷換', '林間破壞'],
    quote: '「別怕，我只偷那些該被偷走的東西。」'
  },
  'grove-champion': {
    faction: '蒼藤歌盟',
    role: '樹衛勇士',
    tagline: '以樹甲纏鬥巨獸的林地武者。',
    personality: '憨厚誠實，討厭繞遠路。',
    backstory:
      '卡登保護雲林祭壇，曾徒手擊退入侵的機械獵手。當虛空吞噬樹冠，他披上古藤鎧甲護送族人撤離，並加入遠征隊護衛前線。',
    traits: ['古藤鎧甲', '林地攔截', '祭壇誓言'],
    quote: '「我的拳頭就是根系，會牢牢抓住我們的土地。」'
  },
  'emerald-warden': {
    faction: '蒼藤歌盟',
    role: '碧翠護林',
    tagline: '傾聽森林律動的巡林隊長。',
    personality: '冷靜公正，對破壞自然者毫不留情。',
    backstory:
      '伊涅鎮守翠谷，她能以葉片震動辨識敵影。她親眼看到裂隙灼燒樹梢後，毅然帶隊支援遠征隊的前進營地。',
    traits: ['葉脈偵測', '巡林哨戒', '碧谷守令'],
    quote: '「請別踐踏草地，因為那是我的耳朵。」'
  },
  'sprout-traveler': {
    faction: '蒼藤歌盟',
    role: '萌芽旅人',
    tagline: '將種子撒向每個被遺忘角落的旅行者。',
    personality: '外向開朗，喜歡與所有人交換植物。',
    backstory:
      '托比帶著種子漫遊各地，用植物連結散落的族人。裂隙蔓延時，他把珍藏的種庫交給遠征隊，希冀戰後世界仍能綠意盎然。',
    traits: ['種庫守護', '旅途採集', '綠蔓補給'],
    quote: '「哪裡有泥土，哪裡就會重新發芽。」'
  },
  'sky-ranger': {
    faction: '蒼藤歌盟',
    role: '蒼穹遊俠',
    tagline: '馭風巡弋雲林的箭術獵人。',
    personality: '豪邁爽朗，與風鳥為伴。',
    backstory:
      '歐菲與風鳥共生，擅長在氣流間狙擊。她曾在空戰中射落虛空螢幕，遠征隊仰賴她的箭雨清理裂縫邊緣。',
    traits: ['疾風箭雨', '風鳥契約', '高空巡航'],
    quote: '「箭矢飛過的地方，天空就回復澄明。」'
  },
  'oracle-of-vines': {
    faction: '蒼藤歌盟',
    role: '藤蔓占卜師',
    tagline: '透過藤蔓節奏預測未來的神秘使者。',
    personality: '溫柔神秘，總帶著半分調皮。',
    backstory:
      '芙蒂雅能從藤蔓纏繞中讀出命運，她預見到虛空將吞噬森林心臟。為改寫預言，她選擇站在遠征隊一側，用蔓生術挽救土地。',
    traits: ['蔓延占卜', '根網治癒', '命運重編'],
    quote: '「命運是藤蔓，織得越緊，越需要溫柔地解開。」'
  },
  'forest-guardian': {
    faction: '蒼藤歌盟',
    role: '林海守衛',
    tagline: '掌握林海陣法的防禦統帥。',
    personality: '沉穩守序，把責任看得比生命重要。',
    backstory:
      '卡登在林海長大，熟悉樹根織成的迷宮。他曾率部隊擊退機械鋸群，如今在遠征隊面前再次築起根網防線。',
    traits: ['林海陣圖', '根網防盾', '迷霧巡邏'],
    quote: '「守住樹根，就守住我們的故事。」'
  },
  'wild-drummer': {
    faction: '蒼藤歌盟',
    role: '原林鼓者',
    tagline: '以鼓點喚醒森林靈魂的節奏師。',
    personality: '外放熱情，喜歡讓隊友跟著節奏呼吸。',
    backstory:
      '里卡的鼓面由千年樹皮織成，能讓林靈共鳴。他在祭典上擊鼓阻止暴風折枝，如今把節奏帶到遠征隊，讓隊伍保持連鎖節拍。',
    traits: ['節奏鼓舞', '林靈同調', '自然律動'],
    quote: '「跟著節拍走，森林會教你如何戰鬥。」'
  },
  'shadow-huntress': {
    faction: '蒼藤歌盟',
    role: '森影潛獵者',
    tagline: '以藤影伏擊敵人的森林刺客。',
    personality: '敏銳冷靜，習慣讓對手先出招。',
    backstory:
      '嘉莉守護禁林，專門清除闖入的虛空孢子。她把藤影毒術交給遠征隊，確保裂縫邊緣的敵人難以立足。',
    traits: ['藤影毒擊', '影步伏擊', '禁林守則'],
    quote: '「你聽見的沙沙聲，已經是晚了。」'
  },
  'dawn-empress': {
    faction: '晝耀聖庭',
    role: '晨曦女王',
    tagline: '用晨光安撫民心的聖庭象徵。',
    personality: '慈悲堅定，擅長在危機中凝聚士氣。',
    backstory:
      '艾琳在光穹城即位時曾以聖光抹去瘟疫。她願意將王權借給遠征隊，只求讓聖庭子民免於虛空審判。',
    traits: ['晨曦恩典', '聖光施赦', '王庭號令'],
    quote: '「黎明終究會抵達，只要有人牽著它前行。」'
  },
  'judicator-vyss': {
    faction: '晝耀聖庭',
    role: '聖焰裁判',
    tagline: '以火焰審核罪行的光庭裁者。',
    personality: '嚴厲公正，不容任何含糊。',
    backstory:
      '薇絲在聖庭審判廳長大，曾經揭露教士貪污。虛空出現後，她把裁判聖焰轉向真正的罪魁禍首。',
    traits: ['聖焰審核', '護盾粉碎', '判決之印'],
    quote: '「正義或許會遲到，但永遠不會失火。」'
  },
  'radiant-priest': {
    faction: '晝耀聖庭',
    role: '光耀祭司',
    tagline: '用祈禱療癒戰線的聖職者。',
    personality: '溫柔謙遜，連敵人受傷也會心生不忍。',
    backstory:
      '賽洛在聖堂醫療所服務，懂得以光脈重塑血肉。她堅信遠征隊是守護世界的燈塔，願意賭上信仰陪同到底。',
    traits: ['光脈療癒', '祝福之雨', '聖堂誓約'],
    quote: '「願我的光為你縫合命運的缺口。」'
  },
  'lumina-blade': {
    faction: '晝耀聖庭',
    role: '聖輝劍士',
    tagline: '以光束切裂戰場的劍舞者。',
    personality: '高傲自信，但對弱者格外體貼。',
    backstory:
      '伊莉亞受訓於聖庭劍廳，她的劍可折射百道光束。面對虛空侵蝕，她將高塔守衛的榮耀分享給遠征隊。',
    traits: ['光束斬擊', '劍舞折射', '高塔騎士'],
    quote: '「折射的每一道光，都在替誰守候。」'
  },
  'celestial-tactician': {
    faction: '晝耀聖庭',
    role: '星衡軍師',
    tagline: '能將星辰軌跡化為戰術的智者。',
    personality: '冷靜周密，任何變數都在計畫之內。',
    backstory:
      '維爾解析星盤，預知聖庭城牆將在何處裂開。為了修補這個未來，她主動加入遠征隊，設計光輝陣型壓制敵軍。',
    traits: ['星盤謀略', '光陣指揮', '危機演算'],
    quote: '「我不改變未來，只讓正確的未來實現。」'
  },
  'halo-savant': {
    faction: '晝耀聖庭',
    role: '環耀賢者',
    tagline: '研究聖暈光圈的光能學者。',
    personality: '天馬行空，常在戰場上做筆記。',
    backstory:
      '蕾雅研究聖暈與情緒的關聯，她的實驗能提振士氣。虛空帶來恐懼後，她將理論轉化為守護符文，陪同遠征隊矯正恐慌。',
    traits: ['聖暈調律', '士氣增幅', '光譜研究'],
    quote: '「光會記錄情緒，所以別吝嗇你的笑容。」'
  },
  'aegis-dion': {
    faction: '晝耀聖庭',
    role: '聖盾執行官',
    tagline: '擋下千軍萬馬的聖盾守衛。',
    personality: '嚴謹可靠，把自己當成城牆一部分。',
    backstory:
      '狄昂守護聖庭南門二十年，從未讓敵人跨過一步。裂隙出現後，他把聖盾調整成可攜式防線，引導避難民眾。',
    traits: ['聖盾壁壘', '防線置換', '堅毅守志'],
    quote: '「我的盾牌會記住每一次守護。」'
  },
  'domain-neira': {
    faction: '晝耀聖庭',
    role: '光域監者',
    tagline: '以光之領域隔絕黑暗的看守官。',
    personality: '冷峻嚴肅，重視規矩勝過一切。',
    backstory:
      '妮菈統管聖庭邊境，對跨越界線者毫不寬貸。虛空撕裂邊界後，她主動將光域術借給遠征隊，重建新的安全線。',
    traits: ['光域封鎖', '界線誓令', '巡境號角'],
    quote: '「只要界線還存在，我們就有退路。」'
  },
  'pulse-healer': {
    faction: '晝耀聖庭',
    role: '脈光療手',
    tagline: '以心脈節奏穩定傷勢的治療師。',
    personality: '柔和細緻，總能找出最需要安慰的人。',
    backstory:
      '瑟菲拉研究心脈與光能的互動，能把光束導入脈搏。她加入遠征隊後成為傷兵最信賴的醫者。',
    traits: ['心脈調和', '聖光注入', '靜脈節拍'],
    quote: '「聽，我能讓你的心重新與光同步。」'
  },
  'silver-envoy': {
    faction: '晝耀聖庭',
    role: '銀耀使節',
    tagline: '穿梭各勢力的外交奇才。',
    personality: '圓滑而真誠，擅長拆解誤會。',
    backstory:
      '希格在各大勢力間奔波，促成遠征隊正式成立。她繼續留在隊伍裡，以談判術換取更多援軍。',
    traits: ['盟約締結', '談判專家', '銀翼傳訊'],
    quote: '「對話是光，能讓最難的路也亮起來。」'
  },
  'noctis-witch': {
    faction: '幽影契會',
    role: '夜幕巫女',
    tagline: '操縱暗影契文的神秘術士。',
    personality: '冷艷神祕，喜歡以謎語回答問題。',
    backstory:
      '莉絲照看幽影書庫，熟稔禁忌符鏈。她從古籍中發現虛空審判者的真名，決定親自踏上戰場驗證傳說。',
    traits: ['暗影秘文', '夜幕儀式', '禁書守望'],
    quote: '「黑夜會說話，但只對聽得懂的人開口。」'
  },
  'void-hunter': {
    faction: '幽影契會',
    role: '虛影獵手',
    tagline: '狩獵裂隙怪譎的暗影追跡者。',
    personality: '冷酷專注，對自己的身影都保持警戒。',
    backstory:
      '赫斯曾被虛空觸手侵蝕，卻靠契會儀式重獲新生。他能追蹤虛影留下的殘光，為遠征隊截斷逃竄的魔王。',
    traits: ['虛影追蹤', '暗鏈捕獵', '殘光標記'],
    quote: '「你以為牠逃了，其實我一直跟在牠影子裡。」'
  },
  'shadow-walker': {
    faction: '幽影契會',
    role: '深影行者',
    tagline: '穿梭陰影縫隙的斥候。',
    personality: '寡言神祕，笑容總在最意外的時候出現。',
    backstory:
      '露琪能讓自身融入影縫，她曾多次潛入虛空據點奪回情報。遠征隊仰賴她的影步在戰線後方自由穿梭。',
    traits: ['影縫遁形', '暗毒纏身', '幽徑導航'],
    quote: '「一步踏進陰影，就等於提早看見結局。」'
  },
  'gloom-keeper': {
    faction: '幽影契會',
    role: '暗耀守祕者',
    tagline: '保管禁忌儀式的暗影司庫。',
    personality: '沉著圓滑，擅長談條件。',
    backstory:
      '伊傲看守幽影契約，防止力量落入歪途。裂隙開啟後，他攜帶封印器具支援遠征隊，拖慢敵方攻勢。',
    traits: ['契約封印', '暗耀律令', '遲緩囚籠'],
    quote: '「秘密不是用來藏，而是用來守。」'
  },
  'river-shaman': {
    faction: '幽影契會',
    role: '冥河巫醫',
    tagline: '能與亡魂交談的暗河醫者。',
    personality: '溫吞和善，像在與另一個世界同行。',
    backstory:
      '古魯守護冥河渡口，為亡魂縫合記憶。虛空吞噬渡口後，他跟著遠征隊行走，確保英靈不會迷失。',
    traits: ['冥河召喚', '靈魂縫合', '陰影醫術'],
    quote: '「別怕，冥河的水只會帶你去想去的地方。」'
  },
  'fallen-strategist': {
    faction: '幽影契會',
    role: '墮落軍師',
    tagline: '曾為敵軍獻策的黑暗謀士。',
    personality: '嘴角總帶諷刺，自知罪孽深重。',
    backstory:
      '法隆過去替侵略者計畫戰術，導致多座城池陷落。為贖罪他向契會自首，如今用陰影戰術輔佐遠征隊對抗虛空。',
    traits: ['暗影戰策', '冷冽覺察', '罪行補償'],
    quote: '「我欠世界太多，至少得把棋局下到底。」'
  },
  'abyssal-seer': {
    faction: '幽影契會',
    role: '幽冥占星家',
    tagline: '解讀暗星流向的預言者。',
    personality: '神情恍惚，常在夢話中透露預警。',
    backstory:
      '曼紗能從夜空看見另一個可能的未來。為避免預言成真，她帶著星盤協助遠征隊重新洗牌命運。',
    traits: ['暗星卜算', '命運改寫', '星盤幻視'],
    quote: '「星星不會說謊，只是我們聽懂的方式不同。」'
  },
  'shadow-wraith': {
    faction: '幽影契會',
    role: '影蝕刺靈',
    tagline: '以影鏈束縛敵人的幽靈化刺客。',
    personality: '陰鬱多疑，對友情半信半疑。',
    backstory:
      '克洛在影化儀式失敗後半魂遊離，他學會利用痛楚困住敵人。遠征隊收留他，他則承諾以影鏈守護隊友。',
    traits: ['影鏈束縛', '暗脈破甲', '半魂盟誓'],
    quote: '「別怕我的影子，它只是比我先到。」'
  },
  'dusk-swordmaster': {
    faction: '幽影契會',
    role: '暮色劍聖',
    tagline: '掌控暮光快步的雙劍宗師。',
    personality: '冷冽雅致，對時間有異常執著。',
    backstory:
      '薩迪爾曾在暮色決鬥場無敗，他的劍術能在黑暗中劃出光。裂隙扭曲時間後，他把影步技巧交給遠征隊。',
    traits: ['暮色連閃', '瞬步劍影', '時間把握'],
    quote: '「快一步，才能在黑夜降臨前收劍。」'
  },
  'obsidian-bard': {
    faction: '幽影契會',
    role: '黑曜歌者',
    tagline: '吟唱暗色挽歌的夜行詩人。',
    personality: '溫柔憂鬱，喜歡在戰後安魂。',
    backstory:
      '萊爾用黑曜石製作樂器，歌聲能為殞落者導引去路。他跟隨遠征隊，只為確保戰死者的名字不會被遺忘。',
    traits: ['暗調挽歌', '靈魂安撫', '黑曜琴弦'],
    quote: '「讓我唱一首歌，把你的恐懼藏進夜裡。」'
  }
};

export const STORY_CAMPAIGN = [
  {
    id: 'chapter-rift',
    order: 1,
    chapter: '序章',
    title: '星瀑裂痕',
    summary: '裂縫守望者固守星瀑坍塌的前線，若不擊潰它，整座浮空城都將被拖入虛空。',
    recommendedAttack: 15000,
    difficulty: 1,
    badges: ['護盾轉換', '倒數 3'],
    enemy: {
      id: 'rift-warden',
      artId: 'rift-warden',
      displayName: '裂縫守望者・格拉斯',
      title: '裂縫守望者',
      name: '格拉斯',
      maxHp: 36000,
      attackMessage: '{enemyDisplay}釋放裂隙震盪，造成{damage}傷害！',
      victoryLog: '{enemyDisplay}倒下，裂痕的嗚鳴暫時沉寂。',
      victoryOverlay: '裂縫守望者崩解，星瀑的奔流重新回到軌道。',
      defeatOverlay: '{enemyDisplay}封鎖了靈能回路，調整隊伍後再展開突圍。',
      openingNarration: '星瀑回路在{realm}怒吼，守護者遠征隊面對第一個虛空造物。',
      persona: '格拉斯原是星瀑維護者，被虛空腐化後仍機械地執行巡檢任務。',
      story: '它記得過去的巡檢路線，卻無法停止對任何靠近者的攻擊。擊敗它能讓裂縫暫時合攏。',
      quote: '「流程失序——清除所有變數。」',
      phases: [
        {
          threshold: 1,
          shieldElement: 'water',
          shieldReduction: 0.2,
          attack: 2900,
          countdownMax: 3,
          announcement: '{enemyDisplay}召喚晶潮護盾，倒數啟動！'
        },
        {
          threshold: 0.5,
          shieldElement: 'light',
          shieldReduction: 0.3,
          attack: 3400,
          countdownMax: 2,
          announcement: '{enemyDisplay}暴走，護盾轉為聖光脈衝！'
        }
      ]
    },
    objectives: [
      '裂隙震盪每三回合一次，請維持護盾或延緩倒數。',
      '護盾元素會在水與光之間轉換，帶上多屬性輸出更為安全。',
      '使用追打或持續傷害可在護盾轉換間創造破口。'
    ]
  },
  {
    id: 'chapter-tempest',
    order: 2,
    chapter: '第二章',
    title: '驟雨浮堡',
    summary: '風后掌握雲海浮堡的核心，引導雷暴摧毀沿途的村落。',
    recommendedAttack: 29000,
    difficulty: 2,
    badges: ['雷暴加劇', '行動延緩'],
    enemy: {
      id: 'tempest-empress',
      artId: 'tempest-empress',
      displayName: '雷冠風后・奧芙拉',
      title: '雷冠風后',
      name: '奧芙拉',
      maxHp: 44000,
      attackMessage: '{enemyDisplay}召來暴風雷鳴，造成{damage}傷害！',
      victoryLog: '{enemyDisplay}的雷冠碎裂，雲海航線再度穩定。',
      victoryOverlay: '驟雨浮堡墜落，大地重獲寧靜的雨聲。',
      defeatOverlay: '風后吹散了你的陣形，嘗試延長移動時間再戰。',
      openingNarration: '驟雨浮堡在天空巡弋，雷冠風后拒絕任何談判。',
      persona: '奧芙拉原是潮生議會的風暴導師，為救回被虛空奪走的弟子而扭曲成狂躁女皇。',
      story: '她相信只要讓所有城市淹沒，就能洗去虛空留下的污點。擊倒她能喚醒沉睡的理智。',
      quote: '「讓雷聲淹沒你們的懺悔！」',
      phases: [
        {
          threshold: 1,
          shieldElement: 'water',
          shieldReduction: 0.25,
          attack: 3600,
          countdownMax: 3,
          announcement: '{enemyDisplay}召喚雨幕，雷雲蓄勢待發！'
        },
        {
          threshold: 0.7,
          shieldElement: 'wood',
          shieldReduction: 0.35,
          attack: 4200,
          countdownMax: 2,
          announcement: '風后將雷鳴編成旋舞，倒數加快！'
        },
        {
          threshold: 0.35,
          shieldElement: 'light',
          shieldReduction: 0.25,
          attack: 4600,
          countdownMax: 2,
          announcement: '暴風核心暴走，雷霆席捲整片棋盤！'
        }
      ]
    },
    objectives: [
      '善用延長移動或減速技能，避免被連續雷擊擊倒。',
      '第二階段護盾換成木屬，帶上火屬輸出效果極佳。',
      '風后會頻繁延緩我方技能，提前儲備關鍵主動技。'
    ]
  },
  {
    id: 'chapter-astral',
    order: 3,
    chapter: '第三章',
    title: '星鑄殘塔',
    summary: '星鑄巨偶守在崩毀的光塔核心，試圖重新引導虛空能量。',
    recommendedAttack: 20000,
    difficulty: 3,
    badges: ['護盾厚重', '反擊光束'],
    enemy: {
      id: 'stellar-colossus',
      artId: 'stellar-colossus',
      displayName: '星鑄巨偶・歐克塔',
      title: '星鑄巨偶',
      name: '歐克塔',
      maxHp: 52000,
      attackMessage: '{enemyDisplay}釋放星核光束，造成{damage}傷害！',
      victoryLog: '{enemyDisplay}的核心熄滅，光塔殘骸終於沉寂。',
      victoryOverlay: '巨偶跪倒在瓦礫間，星光重新回到聖庭調和。',
      defeatOverlay: '星核光束穿透了防線，嘗試使用破甲技能抵銷護盾。',
      openingNarration: '聖庭星塔僅存的守護機兵被虛空奪走指令，任何靠近者都遭到排除。',
      persona: '歐克塔原是守塔儀式巨偶，只認得職責與命令。',
      story: '虛空在它體內植入新的星核，讓它無差別掃射。奪回核心才能重啟光塔防線。',
      quote: '「指令：排除未知因子。」',
      phases: [
        {
          threshold: 1,
          shieldElement: 'light',
          shieldReduction: 0.35,
          attack: 3900,
          countdownMax: 3,
          announcement: '{enemyDisplay}展開星輝護甲，光束蓄能中。'
        },
        {
          threshold: 0.6,
          shieldElement: 'fire',
          shieldReduction: 0.4,
          attack: 4400,
          countdownMax: 2,
          announcement: '巨偶核心過載，熔火裂縫四散！'
        },
        {
          threshold: 0.3,
          shieldElement: null,
          shieldReduction: 0.25,
          attack: 5000,
          countdownMax: 2,
          announcement: '星核裸露，巨偶以全功率掃射戰場！'
        }
      ]
    },
    objectives: [
      '使用破甲或真實傷害突破巨偶厚重護盾。',
      '第二階段會反彈火屬傷害，請注意屬性順序。',
      '在星核裸露前預留高爆發技能以免被掃射壓制。'
    ]
  },
  {
    id: 'chapter-abyss',
    order: 4,
    chapter: '第四章',
    title: '淵歌王座',
    summary: '淵歌女王沉眠於冥潮深處，以歌聲腐化所有靠近者。',
    recommendedAttack: 24000,
    difficulty: 4,
    badges: ['毒潮侵蝕', '倒數縮短'],
    enemy: {
      id: 'abyssal-matriarch',
      artId: 'abyssal-matriarch',
      displayName: '淵歌女王・瑟菈薇',
      title: '淵歌女王',
      name: '瑟菈薇',
      maxHp: 60000,
      attackMessage: '{enemyDisplay}以淵歌纏繞靈魂，造成{damage}傷害！',
      victoryLog: '{enemyDisplay}的歌聲沉寂，冥潮再度聽見海霧低語。',
      victoryOverlay: '女王沉入深海，遠征隊在淵底重燃希望。',
      defeatOverlay: '淵歌讓你的靈魂迷失，帶上淨化技能再挑戰。',
      openingNarration: '冥潮之底傳來哀歌，瑟菈薇企圖以歌聲喚醒整片深淵。',
      persona: '瑟菈薇曾統治潮生暗渠，為了守護遭虛空奪走的子民而與深淵簽訂契約。',
      story: '她相信只有徹底沉眠才能逃離虛空，於是要把所有生命拉進夢境。打破她的歌聲才能封鎖淵底裂隙。',
      quote: '「沉入，我會替你們守望永夜。」',
      phases: [
        {
          threshold: 1,
          shieldElement: 'dark',
          shieldReduction: 0.25,
          attack: 4200,
          countdownMax: 3,
          announcement: '{enemyDisplay}低唱淵歌，毒潮開始蔓延。'
        },
        {
          threshold: 0.65,
          shieldElement: 'water',
          shieldReduction: 0.35,
          attack: 4700,
          countdownMax: 2,
          announcement: '歌聲共鳴，倒數縮短，毒潮更加濃烈！'
        },
        {
          threshold: 0.3,
          shieldElement: 'dark',
          shieldReduction: 0.3,
          attack: 5400,
          countdownMax: 1,
          announcement: '淵歌化為尖嘯，瑟菈薇決意把你拖入深淵！'
        }
      ]
    },
    objectives: [
      '攜帶淨化或持續回復以抵抗歌聲帶來的毒潮。',
      '第二階段倒數縮短，適時延緩或控制能保住生命線。',
      '善用暗屬與水屬隊員的協力，在護盾轉換時完成爆發。'
    ]
  },
  {
    id: 'chapter-final',
    order: 5,
    chapter: '終章',
    title: '審判之環',
    summary: '虛空審判者坐鎮裂隙核心，企圖以審判脈網重寫所有元素法則。',
    recommendedAttack: 36000,
    difficulty: 6,
    badges: ['護盾輪替', '倒數 2→1'],
    enemy: {
      id: 'void-arbiter',
      artId: 'void-arbiter',
      displayName: '虛空審判者',
      title: '審判者',
      name: '審判者',
      maxHp: 72000,
      attackMessage: '{enemyDisplay}釋放黑暗制裁，造成{damage}傷害！',
      victoryLog: '{enemyDisplay}護盾瓦解，審判之環終於崩塌。',
      victoryOverlay: '你擊敗了虛空審判者，失落的聖城重新獲得光明。',
      defeatOverlay: '審判者記錄了你的靈紋，重整陣容後再次挑戰。',
      openingNarration: '審判之環開啟，虛空審判者以冷峻目光審視所有抵抗者。',
      persona: '它是虛空的執行裝置，試圖用絕對秩序取代有機生命的自由。',
      story: '只要它尚存，裂隙便不會關閉。擊敗審判者是收束世界崩壞的唯一希望。',
      quote: '「判決：凡魂皆須歸於寂。」',
      phases: [
        {
          threshold: 1,
          shieldElement: 'fire',
          shieldReduction: 0.35,
          attack: 4500,
          countdownMax: 2,
          announcement: '{enemyDisplay}展開熾焰護盾，審判開始！'
        },
        {
          threshold: 0.6,
          shieldElement: 'dark',
          shieldReduction: 0.45,
          attack: 5200,
          countdownMax: 2,
          announcement: '{enemyDisplay}轉化為暗影相位，攻勢與護盾同時增強！'
        },
        {
          threshold: 0.3,
          shieldElement: 'light',
          shieldReduction: 0.2,
          attack: 5800,
          countdownMax: 1,
          announcement: '審判者狂怒暴走，倒數加快，光壁鎧甲覆體！'
        }
      ]
    },
    objectives: [
      '第三階段倒數僅剩一回合，請善用延緩或控制技能。',
      '利用護盾輪替的空窗施放大招，並維持高連鎖以觸發共鳴。',
      '記錄審判者的攻擊節奏，讓治療與護盾在關鍵回合到位。'
    ]
  }
];
