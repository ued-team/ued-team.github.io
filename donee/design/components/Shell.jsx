// Shared shell — top bar + product + voucher + reminder + contact + price
// Each concept composes these with its own 集合地點 presentation.

const Page = ({ children, paddingBottom = 24 }) => (
  <div style={{
    height: '100%', overflowY: 'auto', background: 'var(--bg2, #f5f5f5)',
    paddingBottom,
  }}>{children}</div>
);

const TopBar = ({ title = '訂單詳情' }) => (
  <div style={{
    position: 'sticky', top: 0, zIndex: 20,
    background: '#fff',
    padding: '10px 12px',
    borderBottom: '1px solid var(--border1)',
    display: 'flex', alignItems: 'center', gap: 8,
  }}>
    <KKIcon name="arrowLeft_line" size={22} />
    <div style={{ flex: 1, fontSize: 16, fontWeight: 700, textAlign: 'center', marginRight: 22 }}>{title}</div>
  </div>
);

// Status / countdown banner — compact
const StatusStrip = ({ order }) => {
  const { h, m } = useCountdown(order.departure.startIso);
  return (
    <div style={{
      margin: '12px 12px 0',
      padding: '10px 14px',
      background: '#fff',
      border: '1px solid var(--border-primary-light)',
      borderRadius: 12,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 16,
        background: 'var(--bg-brand)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <KKIcon name="checkCircle_fill" size={18} color="#fff" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>訂單已確認 · 明天出發</div>
        <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 1 }}>
          {order.departure.date} · 距集合 <strong style={{ color: 'var(--kk-color-cyan-9)' }}>{h}h {m}m</strong>
        </div>
      </div>
    </div>
  );
};

// Product summary
const ProductBlock = ({ order }) => (
  <SectionCard padded={false} style={{ overflow: 'hidden' }}>
    <div style={{ display: 'flex', gap: 12, padding: 12 }}>
      <img src={order.product.image} alt="" style={{
        width: 76, height: 76, borderRadius: 8, objectFit: 'cover', flexShrink: 0,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <KKChip kind="brand" style={{ marginBottom: 4 }}>{order.product.tag}</KKChip>
        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: '18px',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{order.product.title}</div>
        <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 4 }}>
          {order.product.duration} · {order.product.pax}
        </div>
      </div>
    </div>
    <div style={{ borderTop: '1px solid var(--border1)', padding: '8px 12px',
      display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--fg2)',
    }}>
      <span>訂單編號 {order.id}</span>
      <span style={{ color: 'var(--kk-color-cyan-9)' }}>複製</span>
    </div>
  </SectionCard>
);

// Reminder — full raw text
const ReminderFull = ({ order }) => (
  <SectionCard>
    <SectionHeader title="行前提醒" icon="info_fill" />
    <div style={{ fontSize: 13, lineHeight: '20px', color: 'var(--fg1)', whiteSpace: 'pre-wrap' }}>
      {order.reminderRaw}
    </div>
  </SectionCard>
);

// Voucher
const VoucherBlock = ({ order }) => (
  <SectionCard>
    <SectionHeader title="使用憑證" icon="coupon_line" />
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>數位憑證 · 1 張</div>
        <div style={{ fontSize: 11, color: 'var(--fg2)' }}>當日出示給司機即可</div>
      </div>
      <KKButton kind="secondary" size="sm">查看憑證</KKButton>
    </div>
  </SectionCard>
);

// Contact block — matches your real spec
const ContactBlock = ({ order }) => {
  const c = order.contacts.primary;
  return (
    <SectionCard>
      <SectionHeader title="聯絡資訊" icon="headset_line" />
      {c.kind === 'driver' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 2 }}>
                司機 · 可用語言：{c.langs.join(' / ')}
              </div>
            </div>
            <KKButton kind="secondary" size="sm" icon="headset_line">撥號</KKButton>
          </div>
          <div style={{ borderTop: '1px dashed var(--border1)', margin: '10px 0' }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <KKButton kind="ghost" size="sm" style={{ flex: 1 }}>聯絡商家</KKButton>
            <KKButton kind="ghost" size="sm" style={{ flex: 1 }}>KKday 客服</KKButton>
          </div>
        </div>
      )}
    </SectionCard>
  );
};

// Price
const PriceBlock = ({ order }) => (
  <SectionCard>
    <SectionHeader title="付款資訊" />
    <KeyValueRow k="方案小計" v={`${order.price.currency} ${order.price.total.toLocaleString()}`} />
    <KeyValueRow k="付款方式" v="信用卡 **** 4829" />
    <div style={{ borderTop: '1px solid var(--border1)', marginTop: 8, paddingTop: 10,
      display: 'flex', justifyContent: 'space-between',
    }}>
      <span style={{ fontWeight: 700 }}>總金額</span>
      <span style={{ fontWeight: 700, color: 'var(--kk-color-red-9)', fontSize: 16 }}>
        {order.price.currency} {order.price.total.toLocaleString()}
      </span>
    </div>
  </SectionCard>
);

// ─── Bottom Sheet primitive ───────────────────────────────────────
const BottomSheet = ({ open, onClose, title, children, height = '70%' }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,.4)',
        animation: 'fadeIn .2s',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height, maxHeight: '88%',
        background: '#fff',
        borderRadius: '20px 20px 0 0',
        display: 'flex', flexDirection: 'column',
        animation: 'slideUp .25s cubic-bezier(.3,.9,.3,1)',
        boxShadow: '0 -8px 24px rgba(0,0,0,.2)',
      }}>
        <div style={{ padding: '10px 0 6px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border2, #D5D5D5)' }} />
        </div>
        {title && (
          <div style={{ padding: '6px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border1)' }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>
            <button onClick={onClose} style={{ background: 'transparent', border: 0, padding: 4, cursor: 'pointer' }}>
              <KKIcon name="cross_line" size={20} />
            </button>
          </div>
        )}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// ─── Shared meeting-point content (for sheets & full cards) ──────
const MeetingPointFull = ({ mp, idx, total }) => (
  <div>
    {total > 1 && (
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--kk-color-cyan-9)', marginBottom: 6 }}>
        集合點 {idx + 1} / {total}
      </div>
    )}
    <div style={{ fontSize: 15, fontWeight: 700, lineHeight: '22px' }}>{mp.name}</div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginTop: 6 }}>
      <div style={{ fontSize: 12, color: 'var(--fg2)', lineHeight: '18px', flex: 1 }}>{mp.address}</div>
      <a href={mp.nav} style={{ fontSize: 12, color: 'var(--kk-color-cyan-9)', textDecoration: 'underline', whiteSpace: 'nowrap', flexShrink: 0 }}>導航 ›</a>
    </div>
    <div style={{ marginTop: 10 }}>
      <MapThumb height={140} pin={mp.name.split(' ')[0]} />
    </div>
    {mp.photos && mp.photos.length > 0 && (
      <div style={{ display: 'flex', gap: 6, marginTop: 8, overflowX: 'auto' }}>
        {mp.photos.map((p, i) => (
          <img key={i} src={p} style={{ width: 84, height: 84, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
        ))}
      </div>
    )}
    <div style={{ marginTop: 12, display: 'flex', gap: 16 }}>
      <div>
        <div style={{ fontSize: 11, color: 'var(--fg2)' }}>集合時間</div>
        <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{mp.meetTime}</div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'var(--fg2)' }}>出發時間</div>
        <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{mp.startTime}</div>
      </div>
    </div>
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>如何抵達</div>
      <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, lineHeight: '18px', color: 'var(--fg1)' }}>
        {mp.howToArrive.map((step, i) => <li key={i}>{step}</li>)}
      </ul>
    </div>
  </div>
);

Object.assign(window, {
  Page, TopBar, StatusStrip, ProductBlock, ReminderFull,
  VoucherBlock, ContactBlock, PriceBlock, BottomSheet, MeetingPointFull,
});
