// Shared order-detail sections for the base (non-specialized) order detail page.
// Used both in base mockup and underneath the specialized T0-1 modules.

const SectionCard = ({ children, style, padded = true }) => (
  <section style={{
    background: '#fff',
    borderRadius: 12,
    border: '1px solid var(--border1)',
    margin: '0 12px 12px',
    padding: padded ? 16 : 0,
    ...style,
  }}>{children}</section>
);

const SectionHeader = ({ title, action, icon }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {icon && <KKIcon name={icon} size={18} color="var(--fg1)" />}
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--fg1)' }}>{title}</h3>
    </div>
    {action}
  </div>
);

const KeyValueRow = ({ k, v, vColor }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', fontSize: 13, lineHeight: '20px' }}>
    <span style={{ color: 'var(--fg2)' }}>{k}</span>
    <span style={{ color: vColor || 'var(--fg1)', fontWeight: 500, textAlign: 'right', flex: 1 }}>{v}</span>
  </div>
);

// Order status banner — confirmed + countdown ribbon
const StatusBanner = ({ order }) => {
  const { h, m } = useCountdown(order.departure.startIso);
  return (
    <div style={{
      margin: '12px 12px 0',
      padding: '14px 16px',
      background: 'linear-gradient(135deg, #F0FAFB 0%, #FFFFFF 100%)',
      border: '1px solid var(--border-primary-light)',
      borderRadius: 12,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 20,
        background: 'var(--bg-brand)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <KKIcon name="checkCircle_fill" size={22} color="#fff" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--kk-color-cyan-10)' }}>
          訂單已確認 · 明天出發
        </div>
        <div style={{ fontSize: 12, color: 'var(--fg2)', marginTop: 2 }}>
          距集合時間還有 <strong style={{ color: 'var(--kk-color-cyan-9)' }}>{h} 小時 {m} 分</strong>
        </div>
      </div>
    </div>
  );
};

// Product summary row
const ProductSummary = ({ order }) => (
  <SectionCard padded={false} style={{ overflow: 'hidden' }}>
    <div style={{ display: 'flex', gap: 12, padding: 12 }}>
      <img src={order.product.image} alt="" style={{
        width: 88, height: 88, borderRadius: 8, objectFit: 'cover', flexShrink: 0,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
          <KKChip kind="brand">{order.product.tag}</KKChip>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg1)', lineHeight: '18px',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{order.product.title}</div>
        <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 4 }}>
          {order.product.duration} · {order.product.pax}
        </div>
      </div>
    </div>
    <div style={{ borderTop: '1px solid var(--border1)', padding: '10px 12px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontSize: 12, color: 'var(--fg2)',
    }}>
      <span>訂單編號 {order.id}</span>
      <span style={{ color: 'var(--kk-color-cyan-9)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 2 }}>
        複製 <KKIcon name="edit_line" size={12} />
      </span>
    </div>
  </SectionCard>
);

// Base Meeting Info card — classic order detail layout
const BaseMeetingInfo = ({ order }) => (
  <SectionCard>
    <SectionHeader title="集合資訊" icon="location_line" />
    <div>
      <KeyValueRow k="集合日期" v={order.departure.date} />
      <KeyValueRow k="集合時間" v={order.departure.meetTime} />
      <KeyValueRow k="集合地點" v={order.departure.meetLocation} />
      <KeyValueRow k="返回時間" v={order.departure.returnTime} />
    </div>
  </SectionCard>
);

// Base Highlights
const HighlightsCard = ({ order }) => (
  <SectionCard>
    <SectionHeader title="行程重點" icon="flash_line" />
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {order.highlights.map((h, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, lineHeight: '20px' }}>
          <span style={{ color: 'var(--bg-brand)', fontWeight: 700, marginTop: 1 }}>·</span>
          <span>{h}</span>
        </li>
      ))}
    </ul>
  </SectionCard>
);

// Participant / contact / voucher rows
const VoucherRow = () => (
  <SectionCard>
    <SectionHeader title="使用憑證" icon="coupon_line" />
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
      <div>
        <div style={{ fontSize: 13, color: 'var(--fg1)', fontWeight: 500 }}>數位憑證 · 2 張</div>
        <div style={{ fontSize: 11, color: 'var(--fg2)' }}>當日出示給導遊即可</div>
      </div>
      <KKButton kind="secondary" size="sm">查看憑證</KKButton>
    </div>
  </SectionCard>
);

const ContactRow = ({ order }) => (
  <SectionCard>
    <SectionHeader title="聯絡方式" icon="headset_line" />
    <KeyValueRow k="供應商" v={order.product.supplier} />
    <KeyValueRow k="導遊" v={order.guide.name} />
    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
      <KKButton kind="ghost" size="sm" icon="headset_line" style={{ flex: 1 }}>聯絡客服</KKButton>
      <KKButton kind="ghost" size="sm" style={{ flex: 1 }}>聯絡供應商</KKButton>
    </div>
  </SectionCard>
);

const PriceRow = ({ order }) => (
  <SectionCard>
    <SectionHeader title="付款資訊" />
    <KeyValueRow k="方案小計" v={`${order.price.currency} ${order.price.total.toLocaleString()}`} />
    <KeyValueRow k="付款方式" v="信用卡 **** 4829" />
    <div style={{ borderTop: '1px solid var(--border1)', marginTop: 8, paddingTop: 8,
      display: 'flex', justifyContent: 'space-between',
    }}>
      <span style={{ fontWeight: 700 }}>總金額</span>
      <span style={{ fontWeight: 700, color: 'var(--kk-color-red-9)', fontSize: 16 }}>
        {order.price.currency} {order.price.total.toLocaleString()}
      </span>
    </div>
  </SectionCard>
);

Object.assign(window, {
  SectionCard, SectionHeader, KeyValueRow, StatusBanner,
  ProductSummary, BaseMeetingInfo, HighlightsCard,
  VoucherRow, ContactRow, PriceRow,
});
