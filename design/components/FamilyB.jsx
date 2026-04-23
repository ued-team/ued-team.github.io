// ═══════════════════════════════════════════════════════════════════
// Family B — One Entry → All-in-One Bottom Sheet
// 每個變體都有「不同入口」+「不同 sheet 內部結構」
// ═══════════════════════════════════════════════════════════════════

// ═════════════ Shared building blocks for sheet content ═══════════
const MeetingCardCompact = ({ mp, i, total }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      <div style={{
        width: 22, height: 22, borderRadius: 11, background: 'var(--bg-brand)',
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700,
      }}>{i + 1}</div>
      <strong style={{ fontSize: 14 }}>{mp.meetTime}</strong>
      <span style={{ fontSize: 11, color: 'var(--fg2)' }}>集合 · {mp.startTime} 出發</span>
    </div>
    <MeetingPointFull mp={mp} idx={i} total={1} />
  </div>
);

const ContactBlockRich = ({ order }) => {
  const c = order.contacts.primary;
  return (
    <div>
      <div style={{ padding: 14, background: 'var(--bg-brand-soft)', borderRadius: 12, marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: 'var(--kk-color-cyan-10)', fontWeight: 700 }}>司機</div>
        <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{c.name}</div>
        <div style={{ fontSize: 12, color: 'var(--fg2)', marginTop: 2 }}>可用語言：{c.langs.join(' / ')}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <a href={`tel:${c.phone}`} style={{
            flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 8,
            background: 'var(--bg-brand)', color: '#fff', textDecoration: 'none',
            fontSize: 13, fontWeight: 600,
          }}>{c.phone}</a>
          <a href={`https://wa.me/${c.whatsapp.replace(/\D/g, '')}`} style={{
            flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 8,
            background: '#fff', color: 'var(--kk-color-cyan-9)',
            border: '1px solid var(--kk-color-cyan-6)',
            textDecoration: 'none', fontSize: 13, fontWeight: 600,
          }}>WhatsApp</a>
        </div>
      </div>
      <div style={{ padding: 12, border: '1px solid var(--border1)', borderRadius: 10, marginBottom: 8,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{order.contacts.merchant.name}</div>
          <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 2 }}>商家客服</div>
        </div>
        <KKButton kind="secondary" size="sm">聯絡</KKButton>
      </div>
      <div style={{ padding: 12, border: '1px solid var(--border1)', borderRadius: 10,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{order.contacts.kkday.name}</div>
          <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 2 }}>{order.contacts.kkday.hours}</div>
        </div>
        <KKButton kind="ghost" size="sm">聯絡</KKButton>
      </div>
    </div>
  );
};

const ReminderBlockRich = ({ order }) => (
  <div style={{ padding: 14, background: '#FFF8E1', border: '1px solid #F3E1A6', borderRadius: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
      <KKIcon name="info_fill" size={16} color="#E78F37" />
      <strong style={{ fontSize: 13, color: '#8A5A1F' }}>供應商提醒</strong>
    </div>
    <div style={{ fontSize: 13, lineHeight: '21px', color: '#5A4A2A', whiteSpace: 'pre-wrap' }}>
      {order.reminderRaw}
    </div>
  </div>
);

// ═════════════════════ SHEET VARIANT 1 · Tabs ═════════════════════
// Top segmented tabs (原版)
const SheetTabbed = ({ order }) => {
  const [tab, setTab] = React.useState('meeting');
  const pts = order.meetingPoints;
  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, position: 'sticky', top: 0,
        background: '#fff', paddingBottom: 8, zIndex: 2,
      }}>
        {[
          { k: 'meeting', label: `集合 · ${pts.length}` },
          { k: 'contact', label: '聯絡方式' },
          { k: 'reminder', label: '行前提醒' },
        ].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{
            flex: 1, padding: '9px 10px', borderRadius: 8,
            background: tab === t.k ? 'var(--bg-brand)' : 'var(--bg3, #F2F2F2)',
            color: tab === t.k ? '#fff' : 'var(--fg2)',
            border: 0, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit',
          }}>{t.label}</button>
        ))}
      </div>
      {tab === 'meeting' && pts.map((mp, i) => (
        <div key={mp.id} style={{ paddingBottom: 18, marginBottom: 18,
          borderBottom: i < pts.length - 1 ? '1px dashed var(--border1)' : 'none' }}>
          <MeetingCardCompact mp={mp} i={i} total={pts.length} />
        </div>
      ))}
      {tab === 'contact' && <ContactBlockRich order={order} />}
      {tab === 'reminder' && <ReminderBlockRich order={order} />}
    </div>
  );
};

// ═════════════════════ SHEET VARIANT 2 · 全覽長頁 ═════════════════
// 三段直接上下排列，sticky section header 可點快速跳轉
const SheetLongScroll = ({ order }) => {
  const pts = order.meetingPoints;
  const meetingRef = React.useRef(null), contactRef = React.useRef(null), reminderRef = React.useRef(null);
  const jump = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <div>
      {/* anchors */}
      <div style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 3,
        display: 'flex', gap: 16, padding: '4px 0 10px', borderBottom: '1px solid var(--border1)',
      }}>
        <button onClick={() => jump(meetingRef)} style={anchorStyle}>📍 集合地點 {pts.length}</button>
        <button onClick={() => jump(contactRef)} style={anchorStyle}>☎ 聯絡</button>
        <button onClick={() => jump(reminderRef)} style={anchorStyle}>⚠ 提醒</button>
      </div>
      <div ref={meetingRef} style={{ paddingTop: 16 }}>
        <h3 style={sheetH3}>📍 集合地點</h3>
        {pts.map((mp, i) => (
          <div key={mp.id} style={{ paddingBottom: 16, marginBottom: 16,
            borderBottom: i < pts.length - 1 ? '1px dashed var(--border1)' : 'none' }}>
            <MeetingCardCompact mp={mp} i={i} total={pts.length} />
          </div>
        ))}
      </div>
      <div ref={contactRef} style={{ paddingTop: 20 }}>
        <h3 style={sheetH3}>☎ 聯絡方式</h3>
        <ContactBlockRich order={order} />
      </div>
      <div ref={reminderRef} style={{ paddingTop: 20, paddingBottom: 20 }}>
        <h3 style={sheetH3}>⚠ 行前提醒</h3>
        <ReminderBlockRich order={order} />
      </div>
    </div>
  );
};
const anchorStyle = { background: 'transparent', border: 0, padding: '6px 0', fontSize: 12, fontWeight: 600, color: 'var(--kk-color-cyan-9)', cursor: 'pointer', fontFamily: 'inherit' };
const sheetH3 = { margin: '0 0 12px', fontSize: 15, fontWeight: 700 };

// ═════════════════════ SHEET VARIANT 3 · 手風琴 ═══════════════════
// 三個可展開/收合區塊，預設只展開「集合地點」
const SheetAccordion = ({ order }) => {
  const pts = order.meetingPoints;
  const [open, setOpen] = React.useState('meeting');
  const Row = ({ k, icon, title, badge, children, tone }) => (
    <div style={{ marginBottom: 10, border: '1px solid var(--border1)', borderRadius: 12, overflow: 'hidden',
      background: tone === 'soft' ? 'var(--bg-brand-soft)' : '#fff' }}>
      <button onClick={() => setOpen(open === k ? '' : k)} style={{
        width: '100%', padding: 14, background: 'transparent', border: 0, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'inherit', textAlign: 'left',
      }}>
        <KKIcon name={icon} size={18} color="var(--kk-color-cyan-10)" />
        <strong style={{ fontSize: 14, flex: 1 }}>{title}</strong>
        {badge && <KKChip kind="neutral">{badge}</KKChip>}
        <KKIcon name="arrowDown_line" size={16}
          style={{ transform: open === k ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
      </button>
      {open === k && <div style={{ padding: '0 14px 14px' }}>{children}</div>}
    </div>
  );
  return (
    <div>
      <Row k="meeting" icon="location_line" title="集合地點" badge={`${pts.length} 站`}>
        {pts.map((mp, i) => (
          <div key={mp.id} style={{ paddingTop: i > 0 ? 14 : 0, marginTop: i > 0 ? 14 : 0,
            borderTop: i > 0 ? '1px dashed var(--border1)' : 'none' }}>
            <MeetingCardCompact mp={mp} i={i} total={pts.length} />
          </div>
        ))}
      </Row>
      <Row k="contact" icon="headset_line" title="聯絡方式">
        <ContactBlockRich order={order} />
      </Row>
      <Row k="reminder" icon="info_fill" title="行前提醒">
        <ReminderBlockRich order={order} />
      </Row>
    </div>
  );
};

// ═════════════════════ SHEET VARIANT 4 · Drill-down ═══════════════
// 1 級：主選單（三張大卡），2 級：進入具體內容、可返回
const SheetDrilldown = ({ order }) => {
  const [level, setLevel] = React.useState('root'); // root | meeting | contact | reminder
  const pts = order.meetingPoints;
  const mp0 = pts[0];
  if (level === 'root') {
    const Tile = ({ k, icon, title, desc, accent }) => (
      <button onClick={() => setLevel(k)} style={{
        width: '100%', padding: 16, background: '#fff', border: 0, borderRadius: 14,
        marginBottom: 10, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
        display: 'flex', alignItems: 'center', gap: 14,
        boxShadow: '0 1px 3px rgba(0,0,0,.05)', border: '1px solid var(--border1)',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, background: accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <KKIcon name={icon} size={24} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: 12, color: 'var(--fg2)', marginTop: 2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{desc}</div>
        </div>
        <KKIcon name="arrowRight_line" size={16} color="var(--fg2)" />
      </button>
    );
    return (
      <div>
        <Tile k="meeting" icon="location_line" accent="#37AFAE"
          title={`集合地點 · ${pts.length} 站`} desc={`首站 ${mp0.meetTime} · ${mp0.name.split(/[（\s※]/)[0]}`} />
        <Tile k="contact" icon="headset_line" accent="#3A7BD5"
          title="聯絡方式" desc={`司機 ${order.contacts.primary.name} · 商家 · KKday`} />
        <Tile k="reminder" icon="info_fill" accent="#E78F37"
          title="行前提醒" desc="供應商注意事項與緊急聯絡" />
      </div>
    );
  }
  return (
    <div>
      <button onClick={() => setLevel('root')} style={{
        background: 'transparent', border: 0, padding: 0, marginBottom: 12,
        display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
        color: 'var(--kk-color-cyan-9)', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
      }}>
        <KKIcon name="arrowLeft_line" size={14} color="var(--kk-color-cyan-9)" />
        返回
      </button>
      {level === 'meeting' && pts.map((mp, i) => (
        <div key={mp.id} style={{ paddingBottom: 16, marginBottom: 16,
          borderBottom: i < pts.length - 1 ? '1px dashed var(--border1)' : 'none' }}>
          <MeetingCardCompact mp={mp} i={i} total={pts.length} />
        </div>
      ))}
      {level === 'contact' && <ContactBlockRich order={order} />}
      {level === 'reminder' && <ReminderBlockRich order={order} />}
    </div>
  );
};

// ═════════════════════ SHEET VARIANT 5 · Timeline ═════════════════
// 把三者組成「明天的時間軸」：T-12h 行前提醒 → T-0 集合地點 → 緊急時 聯絡
const SheetTimeline = ({ order }) => {
  const pts = order.meetingPoints;
  const { h, m } = useCountdown(order.departure.startIso);
  const TimelineItem = ({ dot, time, title, children, last }) => (
    <div style={{ display: 'flex', gap: 12, position: 'relative', paddingBottom: last ? 0 : 24 }}>
      <div style={{ position: 'relative', width: 28, flexShrink: 0 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 14, background: dot,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, color: '#fff', fontWeight: 700, position: 'relative', zIndex: 2,
        }}>{typeof title === 'string' && title.length ? dot === '#E78F37' ? '!' : dot === '#37AFAE' ? '📍' : '☎' : '·'}</div>
        {!last && (
          <div style={{ position: 'absolute', left: 13, top: 28, bottom: -24, width: 2,
            background: 'var(--border1)', zIndex: 1,
          }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: 'var(--fg2)', marginBottom: 2 }}>{time}</div>
        <strong style={{ fontSize: 14 }}>{title}</strong>
        <div style={{ marginTop: 8 }}>{children}</div>
      </div>
    </div>
  );
  return (
    <div>
      <div style={{ padding: 12, background: 'var(--bg-brand-soft)', borderRadius: 10, marginBottom: 16,
        fontSize: 12, color: 'var(--kk-color-cyan-10)', textAlign: 'center', fontWeight: 600,
      }}>
        ⏱ 距集合 {h} 小時 {m} 分
      </div>
      <TimelineItem dot="#E78F37" time="出發前 — 現在看" title="行前提醒">
        <div style={{ padding: 12, background: '#FFF8E1', border: '1px solid #F3E1A6', borderRadius: 10,
          fontSize: 13, lineHeight: '20px', color: '#5A4A2A', whiteSpace: 'pre-wrap',
        }}>{order.reminderRaw}</div>
      </TimelineItem>
      <TimelineItem dot="#37AFAE" time={`明早 ${pts[0].meetTime} — 集合`} title={`集合地點 · ${pts.length} 站`}>
        {pts.map((mp, i) => (
          <div key={mp.id} style={{ marginBottom: i < pts.length - 1 ? 14 : 0 }}>
            <MeetingCardCompact mp={mp} i={i} total={pts.length} />
          </div>
        ))}
      </TimelineItem>
      <TimelineItem dot="#3A7BD5" time="有問題時" title="聯絡方式" last>
        <ContactBlockRich order={order} />
      </TimelineItem>
    </div>
  );
};

// ═════════════════════════ Hook ═══════════════════════════════════
const useSheet = (order, SheetBody, title = '出發前須知') => {
  const [open, setOpen] = React.useState(false);
  const SheetEl = (
    <BottomSheet open={open} onClose={() => setOpen(false)} title={title} height="88%">
      <SheetBody order={order} />
    </BottomSheet>
  );
  return { open: () => setOpen(true), SheetEl };
};

// Stripped page (no meeting / contact / reminder inline)
const StrippedPage = ({ order, entry }) => (
  <Page>
    <TopBar />
    <StatusStrip order={order} />
    <div style={{ height: 12 }} />
    <ProductBlock order={order} />
    {entry}
    <VoucherBlock order={order} />
    <PriceBlock order={order} />
  </Page>
);

// ════════════════════════ 5 Variants ══════════════════════════════
// B1 · List Row entry + Tabbed sheet
const ScreenB1 = ({ order }) => {
  const sheet = useSheet(order, SheetTabbed, '出發前須知');
  const mp = order.meetingPoints[0];
  const Entry = (
    <SectionCard padded={false}>
      <button onClick={sheet.open} style={{
        width: '100%', padding: 14, background: 'transparent', border: 0,
        display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
        textAlign: 'left', fontFamily: 'inherit',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, background: 'var(--bg-brand-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <KKIcon name="flash_line" size={20} color="var(--kk-color-cyan-10)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>出發前須知</div>
          <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 2 }}>
            集合地點 · 聯絡方式 · 行前提醒
          </div>
        </div>
        <KKIcon name="arrowRight_line" size={16} color="var(--fg2)" />
      </button>
    </SectionCard>
  );
  return <div style={{ position: 'relative', height: '100%' }}><StrippedPage order={order} entry={Entry} />{sheet.SheetEl}</div>;
};

// B2 · Big CTA + Long-scroll sheet
const ScreenB2 = ({ order }) => {
  const sheet = useSheet(order, SheetLongScroll, '出發前須知');
  const { h, m } = useCountdown(order.departure.startIso);
  const Entry = (
    <SectionCard>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <KKIcon name="clock_line" size={18} color="var(--kk-color-cyan-10)" />
        <strong style={{ fontSize: 14 }}>明天就出發 · {h}h {m}m 後集合</strong>
      </div>
      <div style={{ fontSize: 12, color: 'var(--fg2)', lineHeight: '18px' }}>
        集合地點、司機聯絡方式、行前提醒都在這裡
      </div>
      <KKButton kind="primary" size="md" block onClick={sheet.open} style={{ marginTop: 12 }}>
        查看出發前須知
      </KKButton>
    </SectionCard>
  );
  return <div style={{ position: 'relative', height: '100%' }}><StrippedPage order={order} entry={Entry} />{sheet.SheetEl}</div>;
};

// B3 · Preview Card + Accordion sheet
const ScreenB3 = ({ order }) => {
  const sheet = useSheet(order, SheetAccordion, '出發前須知');
  const mp = order.meetingPoints[0];
  const pts = order.meetingPoints;
  const Entry = (
    <SectionCard padded={false}>
      <div style={{ padding: '14px 16px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <KKIcon name="flash_line" size={18} color="var(--kk-color-cyan-10)" />
          <strong style={{ fontSize: 14 }}>出發前須知</strong>
        </div>
      </div>
      <div style={{ padding: '0 16px 12px', display: 'flex', gap: 10 }}>
        <div style={{ width: 76, height: 76, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
          <MapThumb height={76} pin="" interactive={false} />
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11 }}>
          <div style={{ color: 'var(--fg2)' }}>📍 集合 <strong style={{ color: 'var(--fg1)' }}>{pts.length} 站 · 首站 {mp.meetTime}</strong></div>
          <div style={{ color: 'var(--fg2)' }}>☎ 司機 <strong style={{ color: 'var(--fg1)' }}>{order.contacts.primary.name}</strong></div>
          <div style={{ color: 'var(--fg2)' }}>⚠ 行前提醒 <strong style={{ color: 'var(--fg1)' }}>1 則</strong></div>
        </div>
      </div>
      <button onClick={sheet.open} style={{
        width: '100%', padding: '12px 16px', background: 'var(--bg-brand-soft)', border: 0,
        borderTop: '1px solid var(--border1)', cursor: 'pointer', fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        color: 'var(--kk-color-cyan-10)', fontWeight: 700, fontSize: 13,
      }}>展開查看 <KKIcon name="arrowRight_line" size={14} color="var(--kk-color-cyan-10)" /></button>
    </SectionCard>
  );
  return <div style={{ position: 'relative', height: '100%' }}><StrippedPage order={order} entry={Entry} />{sheet.SheetEl}</div>;
};

// B4 · 3-icon tiles + Drilldown sheet
const ScreenB4 = ({ order }) => {
  const sheet = useSheet(order, SheetDrilldown, '出發前須知');
  const mp = order.meetingPoints[0];
  const { h, m } = useCountdown(order.departure.startIso);
  const IconTile = ({ icon, label, sub }) => (
    <div onClick={sheet.open} style={{
      flex: 1, padding: '12px 8px', background: '#fff', borderRadius: 10,
      border: '1px solid var(--border1)', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center',
    }}>
      <KKIcon name={icon} size={22} color="var(--kk-color-cyan-10)" />
      <div style={{ fontSize: 11, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 10, color: 'var(--fg2)' }}>{sub}</div>
    </div>
  );
  const Entry = (
    <div style={{
      margin: '0 12px 12px', padding: 14,
      background: 'linear-gradient(135deg, #E8F3F3 0%, #FFFFFF 60%)',
      borderRadius: 12, border: '1px solid var(--border-primary-light)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <KKIcon name="clock_line" size={16} color="var(--kk-color-cyan-10)" />
        <strong style={{ fontSize: 13, color: 'var(--kk-color-cyan-10)' }}>明早 {mp.meetTime} 集合 · {h}h {m}m</strong>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <IconTile icon="location_line" label="集合地點" sub={`${order.meetingPoints.length} 站`} />
        <IconTile icon="headset_line" label="聯絡方式" sub="司機" />
        <IconTile icon="info_fill" label="行前提醒" sub="1 則" />
      </div>
    </div>
  );
  return <div style={{ position: 'relative', height: '100%' }}><StrippedPage order={order} entry={Entry} />{sheet.SheetEl}</div>;
};

// B5 · Map banner + Timeline sheet
const ScreenB5 = ({ order }) => {
  const sheet = useSheet(order, SheetTimeline, '明天的時間軸');
  const mp = order.meetingPoints[0];
  const pts = order.meetingPoints;
  const Entry = (
    <div onClick={sheet.open} style={{
      margin: '0 12px 12px', position: 'relative', borderRadius: 12, overflow: 'hidden',
      cursor: 'pointer', border: '1px solid var(--border1)',
    }}>
      <MapThumb height={130} pin={mp.name.split(/[（\s※]/)[0]} interactive={false} />
      <div style={{ position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,.62) 100%)' }} />
      <div style={{ position: 'absolute', left: 12, right: 12, bottom: 10,
        display: 'flex', alignItems: 'center', gap: 8, color: '#fff',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>明天的時間軸</div>
          <div style={{ fontSize: 11, opacity: .9 }}>提醒 → 集合 {pts.length} 站 → 聯絡</div>
        </div>
        <span style={{ background: '#fff', color: 'var(--fg1)', borderRadius: 999,
          padding: '5px 10px', fontSize: 11, fontWeight: 700 }}>展開 ›</span>
      </div>
    </div>
  );
  return <div style={{ position: 'relative', height: '100%' }}><StrippedPage order={order} entry={Entry} />{sheet.SheetEl}</div>;
};

Object.assign(window, { ScreenB1, ScreenB2, ScreenB3, ScreenB4, ScreenB5 });
