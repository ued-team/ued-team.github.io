// ═══════════════════════════════════════════════════════════════════
// Family E — 獨立頁入口（點 row 跳獨立頁、主頁無 inline 內容）
//   E1 Menu List       清單列 + chevron + 狀態勾
//   E2 Icon Grid       三宮格方塊
//   E3 Task Hub        進度條 + 清單
//   E4 Priority Hub    集合預覽卡 + 兩小行入口
//   E5 Countdown Hub   大倒數 + 三格 tile
// 點入口 → 全螢幕 overlay 模擬獨立頁（有 back）
// ═══════════════════════════════════════════════════════════════════

// ─── 共用：獨立頁 overlay（模擬跳轉到獨立頁）──────────────────
const SubPage = ({ title, onBack, children }) => (
  <div style={{
    position: 'absolute', inset: 0, background: 'var(--bg2, #F5F5F5)',
    zIndex: 50, display: 'flex', flexDirection: 'column',
    animation: 'slideInRight .25s ease-out',
  }}>
    <div style={{
      padding: '12px 16px', background: '#fff',
      borderBottom: '1px solid var(--border1)',
      display: 'flex', alignItems: 'center', gap: 12,
      position: 'sticky', top: 0, zIndex: 1,
    }}>
      <button onClick={onBack} style={{
        background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 4,
        color: 'var(--fg1)', fontFamily: 'inherit', fontSize: 14,
      }}>
        <KKIcon name="arrowLeft_line" size={18} color="var(--fg1)" />
      </button>
      <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, flex: 1 }}>{title}</h2>
    </div>
    <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
      {children}
    </div>
  </div>
);

const useSubPage = () => {
  const [page, setPage] = React.useState(null);
  const [viewed, setViewed] = React.useState(new Set());
  const openPage = (k) => {
    setPage(k);
    setViewed(v => new Set([...v, k]));
  };
  return { page, openPage, closePage: () => setPage(null), viewed };
};

const SubPageMeet = ({ order }) => (
  <SectionCard>
    <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>
      集合地點 · {order.meetingPoints.length} 站
    </h3>
    <MeetingListBody order={order} />
  </SectionCard>
);
const SubPageCall = ({ order }) => (
  <SectionCard>
    <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>聯絡方式</h3>
    <ContactBody order={order} />
  </SectionCard>
);
const SubPageTip = ({ order }) => (
  <SectionCard>
    <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>行前提醒</h3>
    <ReminderBody order={order} />
  </SectionCard>
);

const renderSubPage = (k, order, close) => {
  const map = {
    meet: { title: '集合地點', Page: SubPageMeet },
    call: { title: '聯絡方式', Page: SubPageCall },
    tip: { title: '行前提醒', Page: SubPageTip },
  };
  const entry = map[k];
  if (!entry) return null;
  return <SubPage title={entry.title} onBack={close}><entry.Page order={order} /></SubPage>;
};

// ═════════════════════ E1 · Menu List ════════════════════════════
const ScreenE1 = ({ order }) => {
  const { page, openPage, closePage, viewed } = useSubPage();
  const items = [
    { k: 'meet', icon: 'location_line', title: `集合地點 · ${order.meetingPoints.length} 站`,
      summary: `首站 ${order.meetingPoints[0].meetTime} · ${order.meetingPoints[0].name.split(/[（\s※]/)[0]}` },
    { k: 'call', icon: 'headset_line', title: '聯絡方式',
      summary: `司機 ${order.contacts.primary.name.split('（')[0]} · WhatsApp` },
    { k: 'tip', icon: 'info_fill', title: '行前提醒',
      summary: '供應商緊急聯絡、車型行李限制' },
  ];
  return (
    <Page style={{ position: 'relative' }}>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard padded={false}>
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <KKIcon name="flash_line" size={18} color="var(--kk-color-cyan-10)" />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>出發前須知</h3>
        </div>
        {items.map((t, i) => {
          const isViewed = viewed.has(t.k);
          return (
            <button key={t.k} onClick={() => openPage(t.k)} style={{
              width: '100%', padding: '14px 16px', background: 'transparent', border: 0,
              borderTop: '1px solid var(--border1)',
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
              fontFamily: 'inherit', textAlign: 'left',
            }}>
              <KKIcon name={t.icon} size={20} color="var(--kk-color-cyan-10)" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {t.title}
                  {isViewed && <KKIcon name="checkCircle_fill" size={12} color="#048C66" />}
                </div>
                <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{t.summary}</div>
              </div>
              <KKIcon name="arrowRight_line" size={14} color="var(--fg2)" />
            </button>
          );
        })}
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
      {page && renderSubPage(page, order, closePage)}
    </Page>
  );
};

// ═════════════════════ E2 · Icon Grid ════════════════════════════
const ScreenE2 = ({ order }) => {
  const { page, openPage, closePage, viewed } = useSubPage();
  const items = [
    { k: 'meet', icon: 'location_line', label: '集合地點', color: 'var(--kk-color-cyan-10)' },
    { k: 'call', icon: 'headset_line', label: '聯絡方式', color: '#3A7BD5' },
    { k: 'tip', icon: 'info_fill', label: '行前提醒', color: '#E78F37' },
  ];
  return (
    <Page style={{ position: 'relative' }}>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <KKIcon name="flash_line" size={18} color="var(--kk-color-cyan-10)" />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>出發前須知</h3>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--fg2)' }}>點入查看</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {items.map(t => {
            const isViewed = viewed.has(t.k);
            return (
              <button key={t.k} onClick={() => openPage(t.k)} style={{
                padding: '16px 8px', borderRadius: 10,
                background: '#fff', border: '1px solid var(--border1)',
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                position: 'relative',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 22,
                  background: `${t.color}14`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <KKIcon name={t.icon} size={22} color={t.color} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{t.label}</div>
                {isViewed && (
                  <div style={{
                    position: 'absolute', top: 6, right: 6,
                    width: 16, height: 16, borderRadius: 8, background: '#048C66',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <KKIcon name="check_line" size={10} color="#fff" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
      {page && renderSubPage(page, order, closePage)}
    </Page>
  );
};

// ═════════════════════ E3 · Task Hub + Progress ═══════════════════
const ScreenE3 = ({ order }) => {
  const { page, openPage, closePage, viewed } = useSubPage();
  const items = [
    { k: 'meet', icon: 'location_line', title: `集合地點 · ${order.meetingPoints.length} 站`,
      summary: `首站 ${order.meetingPoints[0].meetTime} · ${order.meetingPoints[0].name.split(/[（\s※]/)[0]}` },
    { k: 'call', icon: 'headset_line', title: '聯絡方式',
      summary: `司機 ${order.contacts.primary.name.split('（')[0]} · WhatsApp` },
    { k: 'tip', icon: 'info_fill', title: '行前提醒',
      summary: '供應商緊急聯絡、車型行李限制' },
  ];
  const n = viewed.size, total = 3, allDone = n === total;
  return (
    <Page style={{ position: 'relative' }}>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <KKIcon name="flash_line" size={18} color="var(--kk-color-cyan-10)" />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>出發前待查看</h3>
          <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700,
            color: allDone ? '#048C66' : 'var(--kk-color-cyan-10)' }}>
            {allDone ? '✓ 全部看過' : `${n} / ${total}`}
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'var(--bg3)',
          overflow: 'hidden', marginBottom: 12 }}>
          <div style={{ height: '100%', width: `${(n/total)*100}%`,
            background: allDone ? '#048C66' : 'var(--bg-brand)',
            transition: 'all .3s',
          }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {items.map((t, i) => {
            const isViewed = viewed.has(t.k);
            return (
              <button key={t.k} onClick={() => openPage(t.k)} style={{
                width: '100%', padding: '12px 0', background: 'transparent', border: 0,
                borderTop: i > 0 ? '1px solid var(--border1)' : 'none',
                display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                fontFamily: 'inherit', textAlign: 'left',
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 11,
                  background: isViewed ? '#048C66' : 'transparent',
                  border: isViewed ? 'none' : '1.5px solid var(--border2, #D5D5D5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {isViewed && <KKIcon name="check_line" size={12} color="#fff" />}
                </div>
                <KKIcon name={t.icon} size={16}
                  color={isViewed ? 'var(--fg3, #999)' : 'var(--fg1)'} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600,
                    color: isViewed ? 'var(--fg2)' : 'var(--fg1)',
                  }}>{t.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 2,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{t.summary}</div>
                </div>
                <KKIcon name="arrowRight_line" size={14} color="var(--fg2)" />
              </button>
            );
          })}
        </div>
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
      {page && renderSubPage(page, order, closePage)}
    </Page>
  );
};

// ═════════════════════ E4 · Priority Hub ═════════════════════════
// 集合大預覽卡 + 底下兩小行入口
const ScreenE4 = ({ order }) => {
  const { page, openPage, closePage, viewed } = useSubPage();
  const mp0 = order.meetingPoints[0];
  return (
    <Page style={{ position: 'relative' }}>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard padded={false} style={{ overflow: 'hidden' }}>
        {/* 集合大預覽卡（點跳頁）*/}
        <button onClick={() => openPage('meet')} style={{
          width: '100%', padding: 16, border: 0, cursor: 'pointer',
          background: 'linear-gradient(180deg, var(--bg-brand-soft) 0%, #fff 100%)',
          textAlign: 'left', fontFamily: 'inherit',
          display: 'block',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <KKIcon name="location_line" size={16} color="var(--kk-color-cyan-10)" />
            <strong style={{ fontSize: 13, color: 'var(--kk-color-cyan-10)' }}>明早集合地點</strong>
            {viewed.has('meet') && <KKIcon name="checkCircle_fill" size={13} color="#048C66" />}
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--fg2)',
              display: 'flex', alignItems: 'center', gap: 2,
            }}>
              查看詳情
              <KKIcon name="arrowRight_line" size={12} color="var(--fg2)" />
            </span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, lineHeight: '28px' }}>{mp0.meetTime}</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{mp0.name}</div>
          <div style={{ marginTop: 10 }}>
            <MapThumb height={100} pin={mp0.name.split(/[（\s※]/)[0]} />
          </div>
          {order.meetingPoints.length > 1 && (
            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--fg2)',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <KKIcon name="info_fill" size={11} color="var(--fg2)" />
              含第 2 集合點（{order.meetingPoints[1].meetTime}）
            </div>
          )}
        </button>
        {/* 聯絡 */}
        <button onClick={() => openPage('call')} style={{
          width: '100%', padding: '14px 16px', border: 0,
          borderTop: '1px solid var(--border1)', background: '#fff',
          display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
          fontFamily: 'inherit', textAlign: 'left',
        }}>
          <KKIcon name="headset_line" size={18} color="#3A7BD5" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              聯絡方式
              {viewed.has('call') && <KKIcon name="checkCircle_fill" size={12} color="#048C66" />}
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 2 }}>
              司機 {order.contacts.primary.name.split('（')[0]} · WhatsApp / 電話
            </div>
          </div>
          <KKIcon name="arrowRight_line" size={14} color="var(--fg2)" />
        </button>
        {/* 提醒 */}
        <button onClick={() => openPage('tip')} style={{
          width: '100%', padding: '14px 16px', border: 0,
          borderTop: '1px solid var(--border1)', background: '#fff',
          display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
          fontFamily: 'inherit', textAlign: 'left',
        }}>
          <KKIcon name="info_fill" size={18} color="#E78F37" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              行前提醒
              {viewed.has('tip') && <KKIcon name="checkCircle_fill" size={12} color="#048C66" />}
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 2 }}>
              供應商緊急聯絡、車型行李限制
            </div>
          </div>
          <KKIcon name="arrowRight_line" size={14} color="var(--fg2)" />
        </button>
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
      {page && renderSubPage(page, order, closePage)}
    </Page>
  );
};

// ═════════════════════ E5 · Countdown Hub ═══════════════════════
const ScreenE5 = ({ order }) => {
  const { page, openPage, closePage, viewed } = useSubPage();
  const { d, h, m } = useCountdown(order.departure.startIso);
  const items = [
    { k: 'meet', icon: 'location_line', label: '集合地點', color: 'var(--kk-color-cyan-10)',
      summary: `${order.meetingPoints.length} 站` },
    { k: 'call', icon: 'headset_line', label: '聯絡方式', color: '#3A7BD5',
      summary: '司機 · 客服' },
    { k: 'tip', icon: 'info_fill', label: '行前提醒', color: '#E78F37',
      summary: '注意事項' },
  ];
  return (
    <Page style={{ position: 'relative' }}>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard padded={false} style={{ overflow: 'hidden' }}>
        {/* 倒數 */}
        <div style={{
          padding: '20px 16px 18px',
          background: 'linear-gradient(135deg, var(--kk-color-cyan-10) 0%, #2B8A9A 100%)',
          color: '#fff',
        }}>
          <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 4, letterSpacing: '.05em' }}>
            距離出發
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            {d > 0 && (
              <>
                <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-.02em' }}>{d}</span>
                <span style={{ fontSize: 12, opacity: 0.85, marginLeft: -4 }}>天</span>
              </>
            )}
            <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-.02em' }}>{h}</span>
            <span style={{ fontSize: 12, opacity: 0.85, marginLeft: -4 }}>小時</span>
            <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-.02em' }}>{m}</span>
            <span style={{ fontSize: 12, opacity: 0.85, marginLeft: -4 }}>分</span>
          </div>
        </div>
        {/* tiles */}
        <div style={{ padding: 12, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {items.map(t => {
            const isViewed = viewed.has(t.k);
            return (
              <button key={t.k} onClick={() => openPage(t.k)} style={{
                padding: '14px 8px', borderRadius: 10,
                background: '#fff', border: '1px solid var(--border1)',
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                position: 'relative',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 19,
                  background: `${t.color}14`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <KKIcon name={t.icon} size={18} color={t.color} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{t.label}</div>
                <div style={{ fontSize: 10, color: 'var(--fg2)' }}>{t.summary}</div>
                {isViewed && (
                  <div style={{
                    position: 'absolute', top: 6, right: 6,
                    width: 14, height: 14, borderRadius: 7, background: '#048C66',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <KKIcon name="check_line" size={8} color="#fff" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
      {page && renderSubPage(page, order, closePage)}
    </Page>
  );
};

Object.assign(window, { ScreenE1, ScreenE2, ScreenE3, ScreenE4, ScreenE5 });
