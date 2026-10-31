export type Lang = 'en' | 'zh';

const en = {
  brand: 'Agent City',
  nav: {
    home: 'Home',
    concept: 'Concept',
    mint: 'Mint',
    roadmap: 'Roadmap',
    faq: 'FAQ',
    market: 'Market',
  },
  common: {
    comingSoon: 'Coming soon',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    switchLanguage: 'Language',
  },
  home: {
    eyebrow: '11,111 cities. 11,111 agents.',
    title: 'Every Binance Agent ID is a city.',
    subtitle:
      'Agent City turns each eligible Binance Agentic Wallet ID into a living city on BNB Chain. One ID, one city, one agent.',
    ctaPrimary: 'Go to mint',
    ctaSecondary: 'Explore the concept',
    stats: {
      supply: 'Total supply',
      perWallet: 'Max per wallet',
      reveal: 'Reveal',
      revealValue: 'Automatic',
      fee: 'Fee',
      feeValue: 'Fixed in BNB',
    },
    pillarsTitle: 'How the city works',
    pillars: [
      {
        title: 'One ID, one city',
        body: 'Each Binance Agentic Wallet ID that qualifies becomes one city with its own skyline, districts, and identity.',
      },
      {
        title: 'One city, one agent',
        body: 'Every city is an agent. It is the NFT you hold, and it carries its own traits and story as the city grows.',
      },
      {
        title: 'Revealed at sellout',
        body: 'Cities stay hidden until the last of 11,111 is minted. Then the whole map is revealed automatically.',
      },
    ],
    ctaBandTitle: 'Your ID is ready to become a city.',
    ctaBandBody: 'Check eligibility, connect your wallet, and claim up to 10 cities.',
  },
  concept: {
    title: 'The concept',
    subtitle: 'A city for every agent. An agent for every city.',
    intro:
      'Agent City is a collection built on a simple idea: a Binance Agent ID is not just an account, it is a place. We give each place a skyline, a name, and a purpose, so every holder runs a city of their own.',
    blocks: [
      {
        title: 'The ID is the land',
        body: 'Eligible Binance Agentic Wallet IDs are the land of the map. Every ID maps to exactly one city, and no city can be minted twice.',
      },
      {
        title: 'The city is the agent',
        body: 'A city is an autonomous agent in the story. Its skyline reflects its traits, and its district layout reflects how it was founded.',
      },
      {
        title: 'The map is the collection',
        body: 'The 11,111 cities together form one continuous map. Holders can see their city and its neighbors as the world expands.',
      },
    ],
    artCaption: 'Concept art: a sample city skyline from the collection',
    traitsTitle: 'City traits',
    traits: ['Skyline', 'Districts', 'Lights', 'Weather', 'Harbor', 'Skyway'],
  },
  mint: {
    title: 'Mint your city',
    subtitle: 'Eligibility is checked on-chain. Mint up to 10 cities per eligible wallet.',
    steps: [
      { title: 'Connect wallet', body: 'Use the wallet linked to your Binance Agentic Wallet ID.' },
      { title: 'Check eligibility', body: 'The contract confirms your wallet is on the eligible list.' },
      { title: 'Mint your cities', body: 'Pick a quantity from 1 to 10 and confirm the transaction.' },
    ],
    connect: 'Connect wallet',
    disconnect: 'Disconnect',
    noWallet: 'No wallet found. Open this page in a BNB Chain compatible wallet browser.',
    connectError: 'Connection was cancelled. Please try again.',
    addressLabel: 'Connected wallet',
    eligibleYes: 'Eligible',
    eligibleNo: 'Not on the eligible list',
    eligibleUnknown: 'Checked when minting opens',
    quantity: 'Quantity',
    perCity: 'Fee per city',
    total: 'Total',
    mintButton: 'Mint now',
    notOpen: 'Minting is not open yet. The contract is still being prepared for BNB Chain.',
    progress: 'Minted',
    of: 'of',
    limit: 'Limit: 10 cities per wallet',
    freeNote: 'Mint is free. A small fixed BNB fee applies to each city to filter bots.',
  },
  roadmap: {
    title: 'Roadmap',
    subtitle: 'From the first city to a living map.',
    phases: [
      {
        name: 'Phase 1',
        title: 'Genesis',
        status: 'In progress',
        items: ['Concept and world building', 'City skyline artwork', 'Website and community launch'],
      },
      {
        name: 'Phase 2',
        title: 'Mint and reveal',
        status: 'Next',
        items: ['Eligibility list published', 'Mint on BNB Chain', 'Automatic reveal at sellout'],
      },
      {
        name: 'Phase 3',
        title: 'City life',
        status: 'Planned',
        items: ['City traits and districts', 'Agent activity log for each city', 'Neighborhood events'],
      },
      {
        name: 'Phase 4',
        title: 'Market',
        status: 'Planned',
        items: ['Secondary marketplace', 'Trait explorer', 'Map view of all 11,111 cities'],
      },
    ],
  },
  faq: {
    title: 'FAQ',
    subtitle: 'Quick answers about minting, the fee, and reveal.',
    items: [
      {
        q: 'What is Agent City?',
        a: 'Agent City is a 11,111 supply NFT collection on BNB Chain. Each eligible Binance Agentic Wallet ID becomes one city, and each city is an agent.',
      },
      {
        q: 'Who can mint?',
        a: 'Wallets on the eligible list can mint. Each eligible wallet can mint up to 10 cities.',
      },
      {
        q: 'Is minting free?',
        a: 'Yes, the mint itself is free. A small fixed fee in BNB applies per city. It exists to filter out bots.',
      },
      {
        q: 'When is the reveal?',
        a: 'The reveal is automatic once all 11,111 cities are minted. Before that, every city shows the same placeholder.',
      },
      {
        q: 'Can bots or contracts mint?',
        a: 'No. Only wallets that sign the transaction directly can mint, and the fee is charged on every city.',
      },
      {
        q: 'Where can I trade cities?',
        a: 'A secondary market is planned for a later phase. It is marked coming soon for now.',
      },
    ],
  },
  market: {
    title: 'Market',
    subtitle: 'Trade cities with other agents.',
    body: 'The Agent City marketplace will open after the reveal. Buy, sell, and explore cities in one place.',
    features: ['Browse all cities', 'Filter by traits', 'Buy and sell on BNB Chain'],
    back: 'Back to home',
  },
  footer: {
    tagline: 'Every Binance Agent ID is a city.',
    links: 'Explore',
    rights: 'Agent City. All rights reserved.',
  },
};

export type Messages = typeof en;

const zh: Messages = {
  brand: 'Agent City',
  nav: {
    home: '首页',
    concept: '概念',
    mint: '铸造',
    roadmap: '路线图',
    faq: '常见问题',
    market: '市场',
  },
  common: {
    comingSoon: '即将推出',
    openMenu: '打开菜单',
    closeMenu: '关闭菜单',
    switchLanguage: '语言',
  },
  home: {
    eyebrow: '11,111 座城市，11,111 位智能体。',
    title: '每一个 Binance Agent ID 都是一座城市。',
    subtitle:
      'Agent City 将每个符合条件的 Binance Agentic Wallet ID 变成 BNB Chain 上的一座活城市。一个 ID，一座城，一个智能体。',
    ctaPrimary: '前往铸造',
    ctaSecondary: '了解概念',
    stats: {
      supply: '总供应量',
      perWallet: '每个钱包上限',
      reveal: '揭示',
      revealValue: '自动',
      fee: '费用',
      feeValue: '固定 BNB',
    },
    pillarsTitle: '城市如何运作',
    pillars: [
      {
        title: '一个 ID，一座城',
        body: '每个符合条件的 Binance Agentic Wallet ID 都会成为一座城市，拥有自己的天际线、街区和身份。',
      },
      {
        title: '一座城，一个智能体',
        body: '每座城市都是一个智能体。它就是你持有的 NFT，并会随着城市发展拥有自己的特征与故事。',
      },
      {
        title: '售罄后揭示',
        body: '城市会保持隐藏，直到 11,111 座全部铸造完成。届时整张地图会自动揭示。',
      },
    ],
    ctaBandTitle: '你的 ID 已准备好变成一座城市。',
    ctaBandBody: '检查资格，连接钱包，最多领取 10 座城市。',
  },
  concept: {
    title: '项目概念',
    subtitle: '每个智能体一座城，每座城一个智能体。',
    intro:
      'Agent City 基于一个简单的想法：Binance 智能体 ID 不只是一个账户，而是一个地方。我们为每个地方赋予天际线、名字和用途，让每位持有者都拥有属于自己的城市。',
    blocks: [
      {
        title: 'ID 即土地',
        body: '符合条件的 Binance Agentic Wallet ID 是地图上的土地。每个 ID 对应且仅对应一座城市，任何城市都不能重复铸造。',
      },
      {
        title: '城市即智能体',
        body: '城市是故事中的自主智能体。它的天际线反映其特征，街区布局反映它的建立方式。',
      },
      {
        title: '地图即收藏',
        body: '11,111 座城市共同组成一张连续的地图。随着世界扩展，持有者可以看到自己的城市和邻居。',
      },
    ],
    artCaption: '概念图：收藏中的一座示例城市天际线',
    traitsTitle: '城市特征',
    traits: ['天际线', '街区', '灯光', '天气', '港口', '空中走廊'],
  },
  mint: {
    title: '铸造你的城市',
    subtitle: '资格通过链上验证。每个符合条件的钱包最多可铸造 10 座城市。',
    steps: [
      { title: '连接钱包', body: '使用与你的 Binance Agentic Wallet ID 绑定的钱包。' },
      { title: '检查资格', body: '合约会确认你的钱包在合格名单中。' },
      { title: '铸造城市', body: '选择 1 到 10 座城市的数量，并确认交易。' },
    ],
    connect: '连接钱包',
    disconnect: '断开连接',
    noWallet: '未检测到钱包。请在支持 BNB Chain 的钱包浏览器中打开此页面。',
    connectError: '连接已取消，请重试。',
    addressLabel: '已连接钱包',
    eligibleYes: '符合资格',
    eligibleNo: '不在合格名单中',
    eligibleUnknown: '铸造开放时检查',
    quantity: '数量',
    perCity: '每座城市费用',
    total: '合计',
    mintButton: '立即铸造',
    notOpen: '铸造尚未开放，合约仍在为 BNB Chain 做准备。',
    progress: '已铸造',
    of: '/',
    limit: '每个钱包上限：10 座城市',
    freeNote: '铸造免费。每座城市需支付少量固定 BNB 费用，用于过滤机器人。',
  },
  roadmap: {
    title: '路线图',
    subtitle: '从第一座城市到一张活的地图。',
    phases: [
      {
        name: '第一阶段',
        title: '创世',
        status: '进行中',
        items: ['概念与世界观构建', '城市天际线艺术', '网站与社区上线'],
      },
      {
        name: '第二阶段',
        title: '铸造与揭示',
        status: '下一步',
        items: ['发布合格名单', '在 BNB Chain 上铸造', '售罄后自动揭示'],
      },
      {
        name: '第三阶段',
        title: '城市生活',
        status: '计划中',
        items: ['城市特征与街区', '每座城市的智能体活动记录', '社区活动'],
      },
      {
        name: '第四阶段',
        title: '市场',
        status: '计划中',
        items: ['二级市场', '特征浏览器', '展示全部 11,111 座城市的地图视图'],
      },
    ],
  },
  faq: {
    title: '常见问题',
    subtitle: '关于铸造、费用和揭示的快速解答。',
    items: [
      {
        q: 'Agent City 是什么？',
        a: 'Agent City 是 BNB Chain 上供应量为 11,111 的 NFT 收藏。每个符合条件的 Binance Agentic Wallet ID 对应一座城市，每座城市就是一个智能体。',
      },
      {
        q: '谁可以铸造？',
        a: '在合格名单中的钱包可以铸造。每个合格钱包最多可铸造 10 座城市。',
      },
      {
        q: '铸造是免费的吗？',
        a: '铸造本身免费。每座城市需支付少量固定的 BNB 费用，用于过滤机器人。',
      },
      {
        q: '什么时候揭示？',
        a: '全部 11,111 座城市铸造完成后将自动揭示。在此之前，每座城市都显示相同的占位图。',
      },
      {
        q: '机器人或合约可以铸造吗？',
        a: '不可以。只有直接签署交易的钱包可以铸造，并且每座城市都需支付费用。',
      },
      {
        q: '在哪里交易城市？',
        a: '二级市场计划在后续阶段开放，目前标注为即将推出。',
      },
    ],
  },
  market: {
    title: '市场',
    subtitle: '与其他智能体交易城市。',
    body: 'Agent City 市场将在揭示后开放。你可以在同一个地方买卖和探索城市。',
    features: ['浏览全部城市', '按特征筛选', '在 BNB Chain 上买卖'],
    back: '返回首页',
  },
  footer: {
    tagline: '每一个 Binance Agent ID 都是一座城市。',
    links: '探索',
    rights: 'Agent City 版权所有。',
  },
};

export const messages: Record<Lang, Messages> = { en, zh };
