// Mock order — 東京接送 / 市區遊，2 個集合點
// Based on real KKday 訂單明細頁 data structure.
window.ORDER = {
  id: 'KKD-2026-04-22-8294710',
  product: {
    title: '東京市區包車一日遊：新宿 → 銀座 → 淺草（含接送）',
    supplier: 'Tokyo Hire Car Co.',
    tag: 'Tour · 日遊',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    duration: '約 8 小時',
    pax: '2 成人',
  },
  departure: {
    date: '2026/04/22（三）',
    shortDate: '04/22 三',
    meetTime: '07:45',
    startIso: '2026-04-22T07:45:00+09:00',
  },
  meetingPoints: [
    {
      id: 'shinjuku',
      name: '新宿西口 i-Land Tower 前（LOVE 雕塑前）',
      address: 'LOVE (robert Indiana) 新宿西口 i-Land Tower 前',
      meetTime: '07:45',
      startTime: '08:00',
      nav: 'https://maps.google.com/?q=i-Land+Tower+Shinjuku',
      map: 'https://maps.googleapis.com/maps/api/staticmap?center=35.6931,139.6901&zoom=15&size=640x280&scale=2&markers=color:red%7C35.6931,139.6901',
      photos: [
        'https://images.unsplash.com/photo-1554797589-7241bb691973?w=240&q=80',
      ],
      howToArrive: [
        '東京 Metro 丸之內線「西新宿站」C7 出口 約 10 分鐘',
        '都營大江戶線「都廳前站」A1（新宿三井大樓方向 B2）出口 徒步約 5 分鐘',
        '都營大江戶線「新宿西口站」D4 出口 徒步約 12 分鐘',
      ],
    },
    {
      id: 'ginza',
      name: 'GinzaNovo ※地鐵銀座站 C2 / C3 出口步行 1 分鐘',
      address: '5 Chome-2-1 Ginza, Chuo City, Tokyo 104-0061',
      meetTime: '07:50',
      startTime: '08:00',
      nav: 'https://maps.google.com/?q=GinzaNovo',
      map: 'https://maps.googleapis.com/maps/api/staticmap?center=35.6710,139.7654&zoom=15&size=640x280&scale=2&markers=color:red%7C35.6710,139.7654',
      photos: [
        'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=240&q=80',
        'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=240&q=80',
        'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=240&q=80',
      ],
      howToArrive: [
        '地鐵銀座站 C2 / C3 出口步行 1 分鐘',
        'GinzaNovo（原銀座東急 Plaza）一樓集合，請認 KKday 看板',
      ],
    },
  ],
  reminderRaw: '貴賓有緊急問題請加上聯絡資訊: what\'s app : +886 968-383-871 / 或直接 KKday 平台留言, 會有客服人員為您服務。請注意五座車款跟九座車款, 行李乘載數量 (規範請參照產品頁面說明) 乘載不下司機有權利拒絕乘載。',
  contacts: {
    primary: {
      kind: 'driver', // 'driver' | 'merchant' | 'kkday'
      name: '山田 駿（Yamada Shun）',
      langs: ['中文', '日文', '英文'],
      phone: '+81 80-1234-5678',
      whatsapp: '+886 968-383-871',
    },
    merchant: {
      name: 'Tokyo Hire Car Co.',
      phone: '+81 3-1234-5678',
    },
    kkday: {
      name: 'KKday 線上客服',
      hours: '24 hr',
    },
  },
  voucher: { code: 'KKD-VC-2026-04-22', ready: true },
  price: { total: 8960, currency: 'TWD' },
};
