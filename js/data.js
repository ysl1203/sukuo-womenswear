/* ==========================================================================
   素廓 Sukuo — Catalog, Lookbook Hotspots & Silhouette Data Store
   12 Curated SKUs · 3 Lookbook Outfits · 3 Silhouette Archives
   ========================================================================== */

export const CATEGORIES = [
  '全部',
  '外套与大衣',
  '上装与针织',
  '裙装与连衣裙',
  '裤装',
  '包袋配饰'
];

export const MOODS = [
  '全部风格',
  '青春松弛',
  '都市通勤',
  '轻熟优雅',
  '约会微光'
];

export const HERO_SLIDES = [
  {
    id: 'slide-commute',
    title: '建筑感通勤廓形',
    scene: '都市通勤',
    seasonTag: '2026 秋冬廓形季',
    headline: '剪裁保有分寸，风格跨越年龄',
    headlineHtml: '剪裁保有分寸，<br />风格跨越年龄',
    lead: '素廓以克制的建筑感剪裁与天然精纺面料，为不同生活阶段的女性构筑可长期叠穿的当代衣橱。从校园与工作室到晚间聚会，只需调整层次，不必更换自我。',
    image: 'assets/images/hero_campaign.jpg',
    imageAlt: '素廓 Sukuo 石灰长风衣与勃艮第折褶包全身画报',
    captionTitle: '解构防风廓形长风衣与垂感阔腿裤',
    captionMeta: '都市通勤焦点造型，配勃艮第折褶法棍包',
    targetLookId: 'look-commute'
  },
  {
    id: 'slide-evening',
    title: '柔光晚间剪裁',
    scene: '轻熟优雅',
    seasonTag: '2026 秋冬羊绒档案',
    headline: '柔和质地包裹利落骨相',
    headlineHtml: '柔和质地，<br />包裹利落骨相',
    lead: '双面精梳羊绒与日本醋酸斜裁缎面的质感对话，在冬日微光里保持轻盈垂坠，无需刻意修饰便自有气场。',
    image: 'assets/images/prod_doubleface_coat.jpg',
    imageAlt: '素廓 Sukuo 象牙白双面羊绒廓形大衣棚拍静物图',
    captionTitle: '双面羊绒廓形浴袍大衣',
    captionMeta: '手工双面呢工艺，叠搭勃艮第斜裁长裙',
    targetLookId: 'look-evening'
  },
  {
    id: 'slide-tailor',
    title: '精准双褶垂感裤型',
    scene: '青春松弛 / 通勤',
    seasonTag: '2026 秋冬下装制版',
    headline: '一条裤管拉出修长视觉比例',
    headlineHtml: '一条裤管，<br />拉出修长比例',
    lead: '高腰双褶预留舒适胯部余量，精纺羊毛混纺自带垂顺抗皱筋骨，适配短针织的松弛校园感，也撑得起长外套的都会气场。',
    image: 'assets/images/prod_wide_trousers.jpg',
    imageAlt: '素廓 Sukuo 高腰双褶炭灰阔腿西裤棚拍图',
    captionTitle: '高腰双褶垂感阔腿裤',
    captionMeta: '高腰修饰腿型，适配多元上衣叠穿',
    targetLookId: 'look-commute'
  }
];

export const PRODUCTS = [
  {
    id: 'trench-coat',
    patternKey: 'trench-coat',
    name: '解构防风廓形长风衣',
    category: '外套与大衣',
    moods: ['都市通勤', '轻熟优雅'],
    silhouetteType: 'h-line',
    price: 980,
    isNew: true,
    featuredRank: 1,
    photo: null,
    fabricSummary: '精纺抗皱羊毛混纺，建筑挺括垂坠',
    description: '采用微落肩解构防风片与可拆卸系带设计，敞开穿着呈现利落 H 型建筑感，系带后自然抬高腰线，轻松横跨日常通勤与周末出街。',
    careNotes: '建议专业干洗；蒸汽低温顺毛熨烫，悬挂于宽肩衣架保持肩部挺括。',
    colors: [
      { name: '冷石灰褐', hex: '#A5A096' },
      { name: '炭墨深灰', hex: '#383B42' },
      { name: '松石浅雾', hex: '#B9C0C7' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    measurements: {
      XS: { '衣长': '112 cm', '肩宽': '43 cm', '胸围': '106 cm' },
      S: { '衣长': '115 cm', '肩宽': '44.5 cm', '胸围': '110 cm' },
      M: { '衣长': '118 cm', '肩宽': '46 cm', '胸围': '114 cm' },
      L: { '衣长': '121 cm', '肩宽': '47.5 cm', '胸围': '118 cm' }
    },
    inLooks: ['look-commute']
  },
  {
    id: 'doubleface-coat',
    patternKey: 'doubleface-coat',
    name: '双面羊绒廓形大衣',
    category: '外套与大衣',
    moods: ['轻熟优雅', '约会微光'],
    silhouetteType: 'h-line',
    price: 1480,
    isNew: true,
    featuredRank: 2,
    photo: 'assets/images/prod_doubleface_coat.jpg',
    fabricSummary: '90% 澳洲美利奴羊毛 10% 山羊绒，手工双面呢',
    description: '无里衬手工对缝双面羊绒工艺，触感轻盈温润却保有清晰大翻领骨相。落肩宽松袖笼可从容叠穿厚针织与西装。',
    careNotes: '仅限专业干洗；穿着后用软毛衣刷顺纹拂尘，静置通风一晚恢复纤维弹性。',
    colors: [
      { name: '粉笔象牙白', hex: '#EAE6DC' },
      { name: '石膏冷灰', hex: '#C7C9CE' },
      { name: '曜石炭黑', hex: '#26282E' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    measurements: {
      XS: { '衣长': '114 cm', '肩宽': '44 cm', '胸围': '110 cm' },
      S: { '衣长': '117 cm', '肩宽': '45.5 cm', '胸围': '114 cm' },
      M: { '衣长': '120 cm', '肩宽': '47 cm', '胸围': '118 cm' },
      L: { '衣长': '123 cm', '肩宽': '48.5 cm', '胸围': '122 cm' }
    },
    inLooks: ['look-evening']
  },
  {
    id: 'wool-blazer',
    patternKey: 'wool-blazer',
    name: '建筑落肩冷灰西装',
    category: '外套与大衣',
    moods: ['都市通勤', '青春松弛'],
    silhouetteType: 'h-line',
    price: 890,
    isNew: false,
    featuredRank: 3,
    photo: null,
    fabricSummary: '100% 精梳冷羊毛，轻垫肩利落廓形',
    description: '弱化传统职场西装的拘谨感，以适度宽松的落肩线条与单粒天然牛角扣构筑松弛权力感；内搭白衬衫或细针织皆利落有型。',
    careNotes: '建议干洗；避免长时间折叠压痕，使用低温挂烫机恢复翻领立体感。',
    colors: [
      { name: '矿物冷灰', hex: '#8F949E' },
      { name: '深炭灰', hex: '#3D414A' },
      { name: '燕麦浅褐', hex: '#CBC4B8' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    measurements: {
      XS: { '衣长': '71 cm', '肩宽': '43 cm', '胸围': '102 cm' },
      S: { '衣长': '73 cm', '肩宽': '44.5 cm', '胸围': '106 cm' },
      M: { '衣长': '75 cm', '肩宽': '46 cm', '胸围': '110 cm' },
      L: { '衣长': '77 cm', '肩宽': '47.5 cm', '胸围': '114 cm' }
    },
    inLooks: []
  },
  {
    id: 'satin-dress',
    patternKey: 'satin-dress',
    name: '勃艮第醋酸斜裁长裙',
    category: '裙装与连衣裙',
    moods: ['约会微光', '轻熟优雅'],
    silhouetteType: 'bias-a',
    price: 680,
    isNew: true,
    featuredRank: 4,
    photo: null,
    fabricSummary: '78% 日本三醋酸 22% 桑蚕丝，45° 斜丝垂坠',
    description: '采用 45° 斜丝裁剪自然贴合身形却不紧绷，行走间呈现水波般哑光丝泽。勃艮第酒红在冷灰外套映衬下克制而极具辨识度。',
    careNotes: '冷水轻柔手洗或干洗，阴凉处平铺晾干，切勿拧绞或高温直射熨烫。',
    colors: [
      { name: '勃艮第红', hex: '#6D1D2C' },
      { name: '月光银灰', hex: '#C6CAD2' },
      { name: '静夜炭黑', hex: '#23262C' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    measurements: {
      XS: { '裙长': '116 cm', '胸围': '84 cm', '腰围': '72 cm' },
      S: { '裙长': '118 cm', '胸围': '88 cm', '腰围': '76 cm' },
      M: { '裙长': '120 cm', '胸围': '92 cm', '腰围': '80 cm' },
      L: { '裙长': '122 cm', '胸围': '96 cm', '腰围': '84 cm' }
    },
    inLooks: ['look-evening']
  },
  {
    id: 'wide-trousers',
    patternKey: 'wide-trousers',
    name: '高腰双褶垂感阔腿裤',
    category: '裤装',
    moods: ['都市通勤', '轻熟优雅', '青春松弛'],
    silhouetteType: 'h-line',
    price: 490,
    isNew: false,
    featuredRank: 5,
    photo: 'assets/images/prod_wide_trousers.jpg',
    fabricSummary: '68% 精纺羊毛 32% 天丝，垂坠免烫裤线',
    description: '前幅双褶剪裁温和包容腹部与胯部线条，笔直中缝烫线视觉拉长腿部比例，是 15–40 岁不同风格女性衣橱里出场率最高的核心下装。',
    careNotes: '建议干洗或装洗衣袋冷水轻柔机洗；沿裤缝平挂晾干可长久保持笔直裤线。',
    colors: [
      { name: '炭墨灰', hex: '#3B3F46' },
      { name: '冷雾灰', hex: '#8A8F99' },
      { name: '深曜黑', hex: '#202227' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    measurements: {
      XS: { '裤长': '101 cm', '腰围': '64 cm', '臀围': '94 cm' },
      S: { '裤长': '103 cm', '腰围': '68 cm', '臀围': '98 cm' },
      M: { '裤长': '105 cm', '腰围': '72 cm', '臀围': '102 cm' },
      L: { '裤长': '107 cm', '腰围': '76 cm', '臀围': '106 cm' }
    },
    inLooks: ['look-commute']
  },
  {
    id: 'merino-cardigan',
    patternKey: 'merino-cardigan',
    name: '精纺美利奴短开衫',
    category: '上装与针织',
    moods: ['青春松弛', '都市通勤'],
    silhouetteType: 'cropped-waist',
    price: 520,
    isNew: true,
    featuredRank: 6,
    photo: null,
    fabricSummary: '100% 澳洲 16 针超细美利奴羊毛，亲肤细腻',
    description: '微短衣长精准落在高腰分割线附近，单穿显利落比例，敞开叠穿府绸白衬衫即刻呈现学院松弛感；贴身穿着同样细腻柔软。',
    careNotes: '30℃以下羊毛专用洗液手洗，平铺网兜阴干，避免衣架垂挂导致肩部变形。',
    colors: [
      { name: '深炭灰', hex: '#474B54' },
      { name: '勃艮第红', hex: '#6D1D2C' },
      { name: '浅燕麦', hex: '#DDD7CC' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    measurements: {
      XS: { '衣长': '51 cm', '肩宽': '37 cm', '胸围': '92 cm' },
      S: { '衣长': '53 cm', '肩宽': '38.5 cm', '胸围': '96 cm' },
      M: { '衣长': '55 cm', '肩宽': '40 cm', '胸围': '100 cm' },
      L: { '衣长': '57 cm', '肩宽': '41.5 cm', '胸围': '104 cm' }
    },
    inLooks: ['look-campus']
  },
  {
    id: 'poplin-shirt',
    patternKey: 'poplin-shirt',
    name: '高支府绸微廓衬衫',
    category: '上装与针织',
    moods: ['青春松弛', '都市通勤'],
    silhouetteType: 'h-line',
    price: 369,
    isNew: false,
    featuredRank: 7,
    photo: null,
    fabricSummary: '100% 120支长绒棉高密府绸，爽滑骨感',
    description: '隐藏式暗门襟与立体宽袖克夫令基础白衬衫拥有建筑美感，弧形下摆单穿潇洒、露出于短针织下摆则层次分明。',
    careNotes: '常温轻柔机洗，半干状态中温熨烫即可恢复高支府绸清脆手感。',
    colors: [
      { name: '画廊纯白', hex: '#F4F5F7' },
      { name: '冰雾浅蓝', hex: '#D4DEE8' },
      { name: '细石条纹灰', hex: '#C4C8D0' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    measurements: {
      XS: { '衣长': '68 cm', '肩宽': '44 cm', '胸围': '106 cm' },
      S: { '衣长': '70 cm', '肩宽': '45.5 cm', '胸围': '110 cm' },
      M: { '衣长': '72 cm', '肩宽': '47 cm', '胸围': '114 cm' },
      L: { '衣长': '74 cm', '肩宽': '48.5 cm', '胸围': '118 cm' }
    },
    inLooks: ['look-campus']
  },
  {
    id: 'pleated-skirt',
    patternKey: 'pleated-skirt',
    name: '精梳羊毛百褶中长裙',
    category: '裙装与连衣裙',
    moods: ['青春松弛', '轻熟优雅'],
    silhouetteType: 'bias-a',
    price: 560,
    isNew: true,
    featuredRank: 8,
    photo: null,
    fabricSummary: '100% 精梳定型羊毛呢，高温立体刀褶',
    description: '高腰平整腰头收束腹线，向下发散出利落均匀的立体刀褶，步履间轻盈摆动却丝毫不显稚气，兼顾青春学院与轻熟优雅。',
    careNotes: '建议专业干洗以保持高温定型刀褶锋利度；使用裙夹垂直悬挂收纳。',
    colors: [
      { name: '板岩深灰', hex: '#555A64' },
      { name: '炭黑', hex: '#2A2D34' },
      { name: '冷驼石色', hex: '#ACA598' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    measurements: {
      XS: { '裙长': '77 cm', '腰围': '63 cm', '下摆宽': '164 cm' },
      S: { '裙长': '79 cm', '腰围': '67 cm', '下摆宽': '168 cm' },
      M: { '裙长': '81 cm', '腰围': '71 cm', '下摆宽': '172 cm' },
      L: { '裙长': '83 cm', '腰围': '75 cm', '下摆宽': '176 cm' }
    },
    inLooks: ['look-campus']
  },
  {
    id: 'rib-turtleneck',
    patternKey: 'rib-turtleneck',
    name: '极细坑条半高领针织',
    category: '上装与针织',
    moods: ['都市通勤', '轻熟优雅', '青春松弛'],
    silhouetteType: 'cropped-waist',
    price: 299,
    isNew: false,
    featuredRank: 9,
    photo: null,
    fabricSummary: '70% 精纺羊毛 30% 桑蚕丝，微弹贴肤',
    description: '恰到好处的半高领高度自然修饰颈部线条而不紧勒，细密竖向坑条在视觉上更显纤细，是大衣、风衣与西装的理想内搭基底。',
    careNotes: '冷水轻柔手洗，毛巾吸干水分后平铺晾干，切忌烘干。',
    colors: [
      { name: '燕麦象牙', hex: '#E6E1D8' },
      { name: '深炭黑', hex: '#282B31' },
      { name: '石雾灰', hex: '#9FA4AE' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    measurements: {
      XS: { '衣长': '57 cm', '肩宽': '34 cm', '胸围': '78 cm' },
      S: { '衣长': '59 cm', '肩宽': '35.5 cm', '胸围': '82 cm' },
      M: { '衣长': '61 cm', '肩宽': '37 cm', '胸围': '86 cm' },
      L: { '衣长': '63 cm', '肩宽': '38.5 cm', '胸围': '90 cm' }
    },
    inLooks: ['look-commute']
  },
  {
    id: 'selvedge-denim',
    patternKey: 'selvedge-denim',
    name: '微阔原色赤耳丹宁裤',
    category: '裤装',
    moods: ['青春松弛', '都市通勤'],
    silhouetteType: 'h-line',
    price: 429,
    isNew: false,
    featuredRank: 10,
    photo: null,
    fabricSummary: '100% 12.5oz 日本赤耳全棉丹宁，细腻原色',
    description: '摒弃繁复做旧磨白，以深邃原色靛蓝与直筒微阔剪裁塑造干净都会丹宁感；卷起裤脚即可露出精致红边赤耳细节。',
    careNotes: '深色原牛初次建议单独反面冷水轻洗，减少频繁洗涤以养出自然立体色落。',
    colors: [
      { name: '原色深靛蓝', hex: '#283347' },
      { name: '水洗石炭黑', hex: '#34373D' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    measurements: {
      XS: { '裤长': '100 cm', '腰围': '64 cm', '臀围': '92 cm' },
      S: { '裤长': '102 cm', '腰围': '68 cm', '臀围': '96 cm' },
      M: { '裤长': '104 cm', '腰围': '72 cm', '臀围': '100 cm' },
      L: { '裤长': '106 cm', '腰围': '76 cm', '臀围': '104 cm' }
    },
    inLooks: []
  },
  {
    id: 'sculptural-bag',
    patternKey: 'sculptural-bag',
    name: '雕塑折褶腋下法棍包',
    category: '包袋配饰',
    moods: ['约会微光', '都市通勤', '轻熟优雅'],
    silhouetteType: 'cropped-waist',
    price: 620,
    isNew: true,
    featuredRank: 11,
    photo: null,
    fabricSummary: '意大利光面小牛皮，立体折褶侧面结构',
    description: '纤长建筑感折褶包身配以利落弧形单肩带，勃艮第酒红为黑白灰秋冬造型注入克制的视觉焦点；内含拉链暗袋，轻松容纳手机与随身小物。',
    careNotes: '避免雨水浸泡与尖锐刮擦，日常以柔软干布轻拭，收纳时填充纸团防压。',
    colors: [
      { name: '勃艮第酒红', hex: '#6D1D2C' },
      { name: '曜石纯黑', hex: '#202227' },
      { name: '石膏冷白', hex: '#E4E5E9' }
    ],
    sizes: ['均码'],
    measurements: {
      '均码': { '包高': '14 cm', '包宽': '29 cm', '肩带垂直高': '24 cm' }
    },
    inLooks: ['look-commute', 'look-evening']
  },
  {
    id: 'leather-tote',
    patternKey: 'leather-tote',
    name: '雾面粒面牛皮托特包',
    category: '包袋配饰',
    moods: ['都市通勤', '青春松弛'],
    silhouetteType: 'h-line',
    price: 780,
    isNew: false,
    featuredRank: 12,
    photo: null,
    fabricSummary: '头层雾面荔枝纹小牛皮，14 寸电脑友好',
    description: '竖版建筑托特轮廓利落收窄而不显笨重，轻松收纳 14 寸笔记本电脑、画册与随行水杯；细韧肩带贴合大衣肩线不易滑落。',
    careNotes: '远离潮湿与高温直射，定期使用中性皮具护理乳轻薄涂抹保持皮面柔润。',
    colors: [
      { name: '雾面曜黑', hex: '#22242A' },
      { name: '冷灰岩棕', hex: '#7D7974' }
    ],
    sizes: ['均码'],
    measurements: {
      '均码': { '包高': '35 cm', '包宽': '30 cm', '肩带垂直高': '27 cm' }
    },
    inLooks: ['look-campus']
  }
];

export const LOOKBOOKS = [
  {
    id: 'look-commute',
    title: '建筑感通勤廓形',
    tabLabel: '建筑感通勤廓形',
    mood: '都市通勤',
    stylingNote: '以冷石灰长风衣和炭灰双褶阔腿裤确立纵向修长线条，内里叠穿柔和半高领，手提勃艮第红法棍包作为全身唯一色彩锚点，从会议室到美术馆都从容得体。',
    mode: 'photo',
    image: 'assets/images/hero_campaign.jpg',
    imageAlt: '素廓建筑感通勤廓形整套穿搭画报',
    bundleDiscount: 120,
    hotspots: [
      {
        productId: 'trench-coat',
        role: '外搭核心',
        note: '冷石灰褐系带轮廓，利落修饰身形',
        x: 52,
        y: 47
      },
      {
        productId: 'rib-turtleneck',
        role: '贴肤内搭',
        note: '半高领衔接大衣领口，保暖不显臃肿',
        x: 50,
        y: 34
      },
      {
        productId: 'wide-trousers',
        role: '下装比例',
        note: '高腰垂感阔腿裤管延伸下身线条',
        x: 55,
        y: 82
      },
      {
        productId: 'sculptural-bag',
        role: '点睛配饰',
        note: '勃艮第酒红打破黑白灰沉闷感',
        x: 39,
        y: 70
      }
    ]
  },
  {
    id: 'look-evening',
    title: '柔光晚间剪裁',
    tabLabel: '柔光晚间剪裁',
    mood: '轻熟优雅 / 约会微光',
    stylingNote: '将温润松弛的粉笔白双面羊绒大衣披覆于勃艮第红斜裁醋酸长裙之外，哑光羊毛与水光缎面形成迷人材质反差，轻松应对晚餐、音乐会与城市微醺时刻。',
    mode: 'board',
    bundleDiscount: 120,
    hotspots: [
      {
        productId: 'doubleface-coat',
        role: '柔和外披',
        note: '粉笔象牙白双面羊绒，柔化冷调氛围',
        x: 31,
        y: 46
      },
      {
        productId: 'satin-dress',
        role: '主调内裙',
        note: '45° 斜丝醋酸缎面，流动感与显瘦兼具',
        x: 76,
        y: 41
      },
      {
        productId: 'sculptural-bag',
        role: '同色呼应',
        note: '勃艮第折褶包与长裙构成高级顺色层次',
        x: 72,
        y: 82
      }
    ]
  },
  {
    id: 'look-campus',
    title: '松弛学院叠穿',
    tabLabel: '松弛学院叠穿',
    mood: '青春松弛',
    stylingNote: '短款美利奴开衫内搭高支白衬衫，露出干净领口与下摆层次；下身配合立体刀褶羊毛中长裙与能装下电脑的竖版皮质托特，兼顾年轻朝气与高级买手质感。',
    mode: 'board',
    bundleDiscount: 120,
    hotspots: [
      {
        productId: 'merino-cardigan',
        role: '短廓外搭',
        note: '微短衣长自然提高视觉腰线',
        x: 31,
        y: 30
      },
      {
        productId: 'poplin-shirt',
        role: '层次内衬',
        note: '高支长绒棉清脆领型，提亮面部气色',
        x: 70,
        y: 28
      },
      {
        productId: 'pleated-skirt',
        role: '灵动下装',
        note: '高温定型刀褶 A 摆，包容梨形身材',
        x: 33,
        y: 73
      },
      {
        productId: 'leather-tote',
        role: '通勤随行',
        note: '雾面粒面牛皮可容 14 寸电脑与书本',
        x: 72,
        y: 71
      }
    ]
  }
];

export const SILHOUETTES = [
  {
    id: 'h-line',
    name: '建筑 H 型廓形',
    summary: '以微落肩与笔直纵线构建克制、有骨相的轮廓，不刻意收勒腰腹，让衣物与身体之间保留流动的空气余量。',
    fitNote: '对苹果形、H 形及高挑/娇小身材均十分友好；小个子敞开穿着并配合高腰内搭同样利落不压身高。',
    metrics: [
      { label: '轮廓挺括度', value: 88, text: '高挺括' },
      { label: '垂坠流畅感', value: 82, text: '自然垂顺' },
      { label: '叠穿包容度', value: 94, text: '极佳' },
      { label: '跨季适穿性', value: 86, text: '秋 / 冬 / 早春' }
    ]
  },
  {
    id: 'bias-a',
    name: '斜裁流体 A 摆',
    summary: '通过 45° 斜丝裁剪或高腰放射刀褶，让面料顺应重力自然散开，赋予女性行走时静谧优雅的动态韵律。',
    fitNote: '特别修饰腰臀差与梨形身材，轻盈包裹胯部线条而不显紧绷，适合日常约会与艺术展演场合。',
    metrics: [
      { label: '垂坠流畅感', value: 96, text: '水波垂坠' },
      { label: '身形修饰力', value: 92, text: '强包容' },
      { label: '亲肤透气度', value: 90, text: '细腻轻盈' },
      { label: '光泽质感', value: 84, text: '柔和丝泽' }
    ]
  },
  {
    id: 'cropped-waist',
    name: '微收腰短廓形',
    summary: '精准将衣长定格在腰胯上方黄金分割点，上短下长自带轻盈青春感，与阔腿裤或中长百褶裙组成零失误比例。',
    fitNote: '适合 155–175 cm 不同身高女性快速重塑三七分比例，既显年轻灵动又不失极简克制。',
    metrics: [
      { label: '显高比例值', value: 95, text: '黄金分割' },
      { label: '亲肤柔软度', value: 92, text: '贴肤无刺感' },
      { label: '叠穿层次感', value: 90, text: '轻松叠穿' },
      { label: '轻便活动度', value: 94, text: '全天自在' }
    ]
  }
];
