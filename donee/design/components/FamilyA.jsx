// ═══════════════════════════════════════════════════════════════════
// Family A — 一個合併 section，內含「集合地點 + 聯絡方式 + 行前提醒」
// 不使用 bottom sheet，所有資訊 inline 可見或展開。
// 5 個變體用不同的「內部組織邏輯」:
//   A1 Timeline   | 以時間軸縱貫三者
//   A2 Segmented  | 單卡內上方分頁切三視圖
//   A3 Accordion  | 三段可展開收合、預設開集合
//   A4 Priority   | 集合大區塊 + 聯絡/提醒縮成底部 footer rows
//   A5 IconTabs   | 頂部 3 icon 切換、下方 body
// ═══════════════════════════════════════════════════════════════════

// ─── Shared compact building blocks ───────────────────────────────

// Compact meeting-point row (time + name + nav)
const MPRow = ({ mp, i, total }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
    <div style={{
      width: 28, height: 28, borderRadius: 14, background: 'var(--bg-brand)',
      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12, fontWeight: 700, flexShrink: 0,
    }}>{i + 1}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <strong style={{ fontSize: 14 }}>{mp.meetTime}</strong>
        <span style={{ fontSize: 11, color: 'var(--fg2)' }}>集合 · {mp.startTime} 出發</span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{mp.name}</div>
      <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 2,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{mp.address}</div>
      <a href={mp.nav} style={{ fontSize: 11, color: 'var(--kk-color-cyan-9)',
        fontWeight: 600, marginTop: 4, display: 'inline-block' }}>導航 ›</a>
    </div>
  </div>
);

// Compact contact block
const ContactInline = ({ order }) => {
  const c = order.contacts.primary;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 18, background: 'var(--bg-brand-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          fontSize: 13, fontWeight: 700, color: 'var(--kk-color-cyan-10)',
        }}>{c.name.charAt(0)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
          <div style={{ fontSize: 11, color: 'var(--fg2)' }}>司機 · {c.langs.join(' / ')}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <a href={`tel:${c.phone}`} style={{
          flex: 1, padding: '8px 0', textAlign: 'center', borderRadius: 8,
          background: 'var(--bg-brand)', color: '#fff', textDecoration: 'none',
          fontSize: 12, fontWeight: 600,
        }}>電話</a>
        <a href={`https://wa.me/${c.whatsapp.replace(/\D/g, '')}`} style={{
          flex: 1, padding: '8px 0', textAlign: 'center', borderRadius: 8,
          background: '#fff', border: '1px solid var(--kk-color-cyan-6)',
          color: 'var(--kk-color-cyan-9)', textDecoration: 'none',
          fontSize: 12, fontWeight: 600,
        }}>WhatsApp</a>
        <button style={{
          flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid var(--border1)',
          background: '#fff', color: 'var(--fg1)', fontSize: 12, fontWeight: 600,
          fontFamily: 'inherit', cursor: 'pointer',
        }}>KKday</button>
      </div>
    </div>
  );
};

// Compact reminder (clamped + expand)
const ReminderInline = ({ order }) => {
  const [expand, setExpand] = React.useState(false);
  return (
    <div style={{ padding: 12, background: '#FFF8E1', border: '1px solid #F3E1A6', borderRadius: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <KKIcon name="info_fill" size={14} color="#E78F37" />
        <strong style={{ fontSize: 12, color: '#8A5A1F' }}>供應商提醒</strong>
      </div>
      <div style={{
        fontSize: 12, lineHeight: '18px', color: '#5A4A2A', whiteSpace: 'pre-wrap',
        display: expand ? 'block' : '-webkit-box',
        WebkitLineClamp: expand ? 'unset' : 3,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>{order.reminderRaw}</div>
      <button onClick={() => setExpand(e => !e)} style={{
        background: 'transparent', border: 0, padding: 0, marginTop: 6,
        fontSize: 11, fontWeight: 600, color: '#8A5A1F',
        cursor: 'pointer', fontFamily: 'inherit',
      }}>{expand ? '收合 ▲' : '展開全文 ▼'}</button>
    </div>
  );
};

// ═════════════════════ A1 · Timeline ═════════════════════════════
// 垂直時間軸：提醒（T-前）→ 集合 1 → 集合 2 → 聯絡（有狀況時）
const ScreenA1 = ({ order }) => {
  const pts = order.meetingPoints;
  const { h, m } = useCountdown(order.departure.startIso);

  const Node = ({ color, icon, badge }) => (
    <div style={{ position: 'relative', width: 28, flexShrink: 0 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 14, background: color,
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700, zIndex: 2, position: 'relative',
      }}>{badge || (icon && <KKIcon name={icon} size={14} color="#fff" />)}</div>
    </div>
  );
  const Line = () => (
    <div style={{ position: 'absolute', left: 27, top: 28, bottom: -16, width: 2,
      background: 'var(--border1)', zIndex: 1 }} />
  );

  return (
    <Page>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />

      <SectionCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <KKIcon name="flash_line" size={18} color="var(--kk-color-cyan-10)" />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>出發前須知</h3>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--fg2)' }}>
            {h}h {m}m 後集合
          </span>
        </div>

        {/* T-前：行前提醒 */}
        <div style={{ display: 'flex', gap: 12, position: 'relative', paddingBottom: 18 }}>
          <Node color="#E78F37" icon="info_fill" />
          <Line />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--fg2)', marginBottom: 2 }}>出發前</div>
            <strong style={{ fontSize: 13 }}>行前提醒</strong>
            <div style={{ marginTop: 6 }}>
              <ReminderInline order={order} />
            </div>
          </div>
        </div>

        {/* 集合點 */}
        {pts.map((mp, i) => (
          <div key={mp.id} style={{ display: 'flex', gap: 12, position: 'relative', paddingBottom: 18 }}>
            <Node color="var(--bg-brand)" badge={i + 1} />
            <Line />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: 'var(--fg2)', marginBottom: 2 }}>
                明早 {mp.meetTime} 集合 · {mp.startTime} 出發
              </div>
              <strong style={{ fontSize: 13 }}>{mp.name}</strong>
              <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 3, lineHeight: '16px' }}>
                {mp.address}
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                <a href={mp.nav} style={{
                  padding: '6px 10px', borderRadius: 6, background: 'var(--bg-brand-soft)',
                  color: 'var(--kk-color-cyan-10)', fontSize: 11, fontWeight: 600,
                  textDecoration: 'none',
                }}>導航 ›</a>
                <span style={{
                  padding: '6px 10px', borderRadius: 6, background: 'var(--bg3)',
                  color: 'var(--fg2)', fontSize: 11,
                }}>{mp.howToArrive[0]?.slice(0, 14)}…</span>
              </div>
            </div>
          </div>
        ))}

        {/* 最後：聯絡 */}
        <div style={{ display: 'flex', gap: 12, position: 'relative' }}>
          <Node color="#3A7BD5" icon="headset_line" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--fg2)', marginBottom: 2 }}>有狀況時</div>
            <strong style={{ fontSize: 13 }}>聯絡方式</strong>
            <div style={{ marginTop: 8 }}>
              <ContactInline order={order} />
            </div>
          </div>
        </div>
      </SectionCard>

      <VoucherBlock order={order} />
      <PriceBlock order={order} />
    </Page>
  );
};

// ═════════════════════ A2 · Segmented Tabs ═══════════════════════
// 一張卡、上方 3 個 tab 切換；body 換內容
const ScreenA2 = ({ order }) => {
  const [tab, setTab] = React.useState('meet');
  const pts = order.meetingPoints;
  const tabs = [
    { k: 'meet', label: '集合', badge: pts.length },
    { k: 'call', label: '聯絡' },
    { k: 'tip',  label: '提醒' },
  ];
  return (
    <Page>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard padded={false}>
        <div style={{ padding: '14px 16px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <KKIcon name="flash_line" size={18} color="var(--kk-color-cyan-10)" />
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>出發前須知</h3>
          </div>
        </div>
        <div style={{ padding: '0 16px', display: 'flex', gap: 6, borderBottom: '1px solid var(--border1)' }}>
          {tabs.map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{
              padding: '10px 6px', background: 'transparent', border: 0,
              borderBottom: `2px solid ${tab === t.k ? 'var(--bg-brand)' : 'transparent'}`,
              color: tab === t.k ? 'var(--kk-color-cyan-10)' : 'var(--fg2)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4,
              marginBottom: -1,
            }}>
              {t.label}
              {t.badge && (
                <span style={{
                  background: tab === t.k ? 'var(--bg-brand)' : 'var(--bg3)',
                  color: tab === t.k ? '#fff' : 'var(--fg2)',
                  borderRadius: 999, padding: '0 6px', fontSize: 10, fontWeight: 700,
                }}>{t.badge}</span>
              )}
            </button>
          ))}
        </div>
        <div style={{ padding: 16 }}>
          {tab === 'meet' && pts.map((mp, i) => (
            <div key={mp.id} style={{ paddingBottom: i < pts.length - 1 ? 12 : 0,
              marginBottom: i < pts.length - 1 ? 12 : 0,
              borderBottom: i < pts.length - 1 ? '1px dashed var(--border1)' : 'none' }}>
              <MPRow mp={mp} i={i} total={pts.length} />
            </div>
          ))}
          {tab === 'call' && <ContactInline order={order} />}
          {tab === 'tip' && <ReminderInline order={order} />}
        </div>
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
    </Page>
  );
};

// ═════════════════════ A3 · Accordion ════════════════════════════
// 一張卡、三個 row 可展開/收合，預設只開「集合」
const ScreenA3 = ({ order }) => {
  const [open, setOpen] = React.useState('meet');
  const pts = order.meetingPoints;
  const mp0 = pts[0];

  const Row = ({ k, icon, color, title, summary, children, last }) => {
    const isOpen = open === k;
    return (
      <div style={{ borderBottom: last ? 'none' : '1px solid var(--border1)' }}>
        <button onClick={() => setOpen(isOpen ? '' : k)} style={{
          width: '100%', padding: '14px 0', background: 'transparent', border: 0,
          display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
          fontFamily: 'inherit', textAlign: 'left',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <KKIcon name={icon} size={16} color="#fff" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{title}</div>
            {!isOpen && (
              <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 2,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{summary}</div>
            )}
          </div>
          <KKIcon name="arrowDown_line" size={16} color="var(--fg2)" style={{
            transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s',
          }} />
        </button>
        {isOpen && <div style={{ paddingBottom: 16 }}>{children}</div>}
      </div>
    );
  };

  return (
    <Page>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <KKIcon name="flash_line" size={18} color="var(--kk-color-cyan-10)" />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>出發前須知</h3>
        </div>
        <Row k="meet" icon="location_line" color="var(--bg-brand)"
          title={`集合地點 · ${pts.length} 站`}
          summary={`首站 ${mp0.meetTime} · ${mp0.name.split(/[（\s※]/)[0]}`}>
          {pts.map((mp, i) => (
            <div key={mp.id} style={{ paddingTop: i > 0 ? 12 : 0, marginTop: i > 0 ? 12 : 0,
              borderTop: i > 0 ? '1px dashed var(--border1)' : 'none' }}>
              <MPRow mp={mp} i={i} total={pts.length} />
            </div>
          ))}
        </Row>
        <Row k="call" icon="headset_line" color="#3A7BD5"
          title="聯絡方式"
          summary={`司機 ${order.contacts.primary.name.split('（')[0]} · WhatsApp`}>
          <ContactInline order={order} />
        </Row>
        <Row k="tip" icon="info_fill" color="#E78F37"
          title="行前提醒"
          summary="供應商緊急聯絡、車型行李限制"
          last>
          <ReminderInline order={order} />
        </Row>
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
    </Page>
  );
};

// ═════════════════════ A4 · Priority Stack ═══════════════════════
// 集合資訊大區塊顯眼、聯絡/提醒縮成底部 footer quiet rows（可點展開）
const ScreenA4 = ({ order }) => {
  const pts = order.meetingPoints;
  const mp0 = pts[0];
  const { h, m } = useCountdown(order.departure.startIso);
  const [openTip, setOpenTip] = React.useState(false);
  const [openCall, setOpenCall] = React.useState(false);

  return (
    <Page>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard padded={false} style={{ overflow: 'hidden' }}>
        {/* Hero: 集合 */}
        <div style={{ padding: 16, background: 'linear-gradient(180deg, var(--bg-brand-soft) 0%, #fff 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <KKIcon name="location_line" size={16} color="var(--kk-color-cyan-10)" />
            <strong style={{ fontSize: 13, color: 'var(--kk-color-cyan-10)' }}>集合地點</strong>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--fg2)' }}>
              {h}h {m}m 後
            </span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, lineHeight: '28px' }}>
            {mp0.meetTime}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{mp0.name}</div>
          <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 2, lineHeight: '16px' }}>
            {mp0.address}
          </div>
          <div style={{ marginTop: 12 }}>
            <MapThumb height={120} pin={mp0.name.split(/[（\s※]/)[0]} />
          </div>
          {pts.length > 1 && (
            <div style={{ marginTop: 10, padding: '8px 10px', background: '#fff',
              borderRadius: 8, border: '1px dashed var(--kk-color-cyan-6)',
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 11,
            }}>
              <KKIcon name="info_fill" size={12} color="var(--kk-color-cyan-9)" />
              <span>另有第 2 集合點：{pts[1].meetTime} · {pts[1].name.split(/[（\s※]/)[0]}</span>
            </div>
          )}
        </div>

        {/* Footer quiet rows */}
        <div style={{ borderTop: '1px solid var(--border1)' }}>
          <button onClick={() => setOpenCall(v => !v)} style={{
            width: '100%', padding: '12px 16px', background: 'transparent', border: 0,
            borderBottom: '1px solid var(--border1)',
            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <KKIcon name="headset_line" size={16} color="var(--fg2)" />
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>聯絡方式</div>
              <div style={{ fontSize: 11, color: 'var(--fg2)' }}>司機 {order.contacts.primary.name.split('（')[0]}</div>
            </div>
            <KKIcon name="arrowDown_line" size={14} color="var(--fg2)"
              style={{ transform: openCall ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
          </button>
          {openCall && <div style={{ padding: 16, borderBottom: '1px solid var(--border1)' }}>
            <ContactInline order={order} />
          </div>}
          <button onClick={() => setOpenTip(v => !v)} style={{
            width: '100%', padding: '12px 16px', background: 'transparent', border: 0,
            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <KKIcon name="info_fill" size={16} color="var(--fg2)" />
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>行前提醒</div>
              <div style={{ fontSize: 11, color: 'var(--fg2)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>供應商緊急聯絡與注意事項</div>
            </div>
            <KKIcon name="arrowDown_line" size={14} color="var(--fg2)"
              style={{ transform: openTip ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
          </button>
          {openTip && <div style={{ padding: 16, borderTop: '1px solid var(--border1)' }}>
            <ReminderInline order={order} />
          </div>}
        </div>
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
    </Page>
  );
};

// ═════════════════════ A5 · Icon Tabs ════════════════════════════
// 頂部 3 顆大 icon 方塊，點切下方 body；每顆下方有數字/小字副標
const ScreenA5 = ({ order }) => {
  const [tab, setTab] = React.useState('meet');
  const pts = order.meetingPoints;

  const Tile = ({ k, icon, color, label, sub }) => {
    const active = tab === k;
    return (
      <button onClick={() => setTab(k)} style={{
        flex: 1, padding: '12px 6px', background: active ? color : 'var(--bg3)',
        border: 0, borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        transition: 'background .15s',
      }}>
        <KKIcon name={icon} size={22} color={active ? '#fff' : 'var(--fg2)'} />
        <div style={{ fontSize: 12, fontWeight: 700,
          color: active ? '#fff' : 'var(--fg1)' }}>{label}</div>
        <div style={{ fontSize: 10,
          color: active ? 'rgba(255,255,255,.85)' : 'var(--fg2)' }}>{sub}</div>
      </button>
    );
  };

  return (
    <Page>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <KKIcon name="flash_line" size={18} color="var(--kk-color-cyan-10)" />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>出發前須知</h3>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <Tile k="meet" icon="location_line" color="var(--bg-brand)"
            label="集合地點" sub={`${pts.length} 站`} />
          <Tile k="call" icon="headset_line" color="#3A7BD5"
            label="聯絡方式" sub="司機/客服" />
          <Tile k="tip" icon="info_fill" color="#E78F37"
            label="行前提醒" sub="1 則" />
        </div>
        <div>
          {tab === 'meet' && pts.map((mp, i) => (
            <div key={mp.id} style={{ paddingBottom: i < pts.length - 1 ? 12 : 0,
              marginBottom: i < pts.length - 1 ? 12 : 0,
              borderBottom: i < pts.length - 1 ? '1px dashed var(--border1)' : 'none' }}>
              <MPRow mp={mp} i={i} total={pts.length} />
            </div>
          ))}
          {tab === 'call' && <ContactInline order={order} />}
          {tab === 'tip' && <ReminderInline order={order} />}
        </div>
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
    </Page>
  );
};

Object.assign(window, { ScreenA1, ScreenA2, ScreenA3, ScreenA4, ScreenA5 });
