// ═══════════════════════════════════════════════════════════════════
// Family C — 任務完成感 (Task Completion)
// 延伸 A3/A4/A5 + B4/B5，加入「一項一項解」的打卡/進度感。
//   C1 Checklist         一張卡三個任務，左 checkbox + 頂部進度條
//   C2 Wizard            一次一個 step、強制漸進、底部進度點
//   C3 Stamp Card        三個圓形章，未讀空圓、已讀填色 ✓
//   C4 T-minus Timeline  縱向時間軸 + 每點 checkbox
//   C5 Priority + Tasks  延伸 A4，hero 之下三個 task row
// ═══════════════════════════════════════════════════════════════════

// ─── 共用 hook：task done 狀態（用 useState，重讀時 reset）────────────
const useTasks = (keys) => {
  const [done, setDone] = React.useState(() => Object.fromEntries(keys.map(k => [k, false])));
  const complete = (k) => setDone(d => ({ ...d, [k]: true }));
  const n = Object.values(done).filter(Boolean).length;
  const total = keys.length;
  return { done, complete, n, total, allDone: n === total };
};

// ─── 共用 task 內容（集合 / 聯絡 / 提醒 bodies）─────────────────────
const MeetingListBody = ({ order }) => (
  <div>
    {order.meetingPoints.map((mp, i) => (
      <div key={mp.id} style={{
        paddingTop: i > 0 ? 12 : 0, marginTop: i > 0 ? 12 : 0,
        borderTop: i > 0 ? '1px dashed var(--border1)' : 'none',
      }}>
        <MPRow mp={mp} i={i} total={order.meetingPoints.length} />
      </div>
    ))}
  </div>
);
const ContactBody = ({ order }) => <ContactInline order={order} />;
const ReminderBody = ({ order }) => <ReminderInline order={order} />;

// ═════════════════════ C1 · Checklist ═══════════════════════════
// 一張卡、頂部進度條、三個 task row 可展開（展開即視為已閱讀）
const ScreenC1 = ({ order }) => {
  const t = useTasks(['meet', 'call', 'tip']);
  const [open, setOpen] = React.useState('meet');
  const toggle = (k) => {
    setOpen(prev => prev === k ? '' : k);
    if (!t.done[k]) t.complete(k);
  };

  const TaskRow = ({ k, icon, title, summary, Body, last }) => {
    const isOpen = open === k;
    const isDone = t.done[k];
    return (
      <div style={{ borderBottom: last ? 'none' : '1px solid var(--border1)' }}>
        <button onClick={() => toggle(k)} style={{
          width: '100%', padding: '14px 0', background: 'transparent', border: 0,
          display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
          fontFamily: 'inherit', textAlign: 'left',
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: 12,
            background: isDone ? 'var(--bg-brand)' : '#fff',
            border: isDone ? 'none' : '1.5px solid var(--border2, #D5D5D5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {isDone && <KKIcon name="check_line" size={14} color="#fff" />}
          </div>
          <KKIcon name={icon} size={16} color={isDone ? 'var(--fg3, #999)' : 'var(--fg1)'} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700,
              color: isDone ? 'var(--fg2)' : 'var(--fg1)',
              textDecoration: isDone ? 'line-through' : 'none',
              textDecorationColor: 'var(--fg3, #999)',
            }}>{title}</div>
            {!isOpen && (
              <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 2,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{summary}</div>
            )}
          </div>
          <KKIcon name="arrowDown_line" size={14} color="var(--fg2)"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
        </button>
        {isOpen && <div style={{ paddingBottom: 16 }}><Body order={order} /></div>}
      </div>
    );
  };

  const pct = (t.n / t.total) * 100;
  const pts = order.meetingPoints;

  return (
    <Page>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <KKIcon name="flash_line" size={18} color="var(--kk-color-cyan-10)" />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>出發前待確認</h3>
          <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700,
            color: t.allDone ? '#048C66' : 'var(--kk-color-cyan-10)' }}>
            {t.allDone ? '✓ 已完成' : `${t.n} / ${t.total}`}
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'var(--bg3)',
          overflow: 'hidden', marginBottom: 6 }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: t.allDone ? '#048C66' : 'var(--bg-brand)',
            transition: 'width .3s ease, background .3s',
          }} />
        </div>
        <TaskRow k="meet" icon="location_line"
          title={`確認集合地點 · ${pts.length} 站`}
          summary={`首站 ${pts[0].meetTime} · ${pts[0].name.split(/[（\s※]/)[0]}`}
          Body={MeetingListBody} />
        <TaskRow k="call" icon="headset_line"
          title="存好聯絡方式"
          summary={`司機 ${order.contacts.primary.name.split('（')[0]} · WhatsApp / 電話`}
          Body={ContactBody} />
        <TaskRow k="tip" icon="info_fill"
          title="讀完行前提醒"
          summary="供應商緊急聯絡、車型行李限制"
          Body={ReminderBody} last />
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
    </Page>
  );
};

// ═════════════════════ C2 · Wizard ═══════════════════════════════
// 強制漸進：一次只看一個 step、底部 1/2/3 進度點、下一步推進、可回上一步
const ScreenC2 = ({ order }) => {
  const steps = [
    { k: 'meet', icon: 'location_line', title: '步驟 1 · 確認集合地點', Body: MeetingListBody,
      tagline: '明早幾點去哪裡？' },
    { k: 'call', icon: 'headset_line', title: '步驟 2 · 存好聯絡方式', Body: ContactBody,
      tagline: '有狀況怎麼聯絡？' },
    { k: 'tip',  icon: 'info_fill',    title: '步驟 3 · 讀完行前提醒', Body: ReminderBody,
      tagline: '供應商要你注意什麼？' },
  ];
  const [i, setI] = React.useState(0);
  const [done, setDone] = React.useState(new Set());
  const cur = steps[i];
  const markAndNext = () => {
    setDone(d => new Set([...d, cur.k]));
    if (i < steps.length - 1) setI(i + 1);
  };
  const allDone = done.size === steps.length;

  return (
    <Page>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard padded={false} style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', background: 'var(--bg-brand-soft)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <KKIcon name={cur.icon} size={18} color="var(--kk-color-cyan-10)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--kk-color-cyan-10)' }}>{cur.title}</div>
            <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 2 }}>{cur.tagline}</div>
          </div>
          {done.has(cur.k) && (
            <div style={{ width: 22, height: 22, borderRadius: 11, background: '#048C66',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <KKIcon name="check_line" size={13} color="#fff" />
            </div>
          )}
        </div>
        <div style={{ padding: 16 }}>
          <cur.Body order={order} />
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border1)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <button disabled={i === 0} onClick={() => setI(Math.max(0, i - 1))} style={{
            padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border1)',
            background: '#fff', color: i === 0 ? 'var(--fg3, #999)' : 'var(--fg1)',
            fontSize: 12, fontWeight: 600, cursor: i === 0 ? 'default' : 'pointer',
            fontFamily: 'inherit', opacity: i === 0 ? 0.5 : 1,
          }}>上一步</button>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 6 }}>
            {steps.map((s, idx) => (
              <div key={s.k} style={{
                width: idx === i ? 20 : 6, height: 6, borderRadius: 3,
                background: done.has(s.k) ? '#048C66' :
                  idx === i ? 'var(--bg-brand)' : 'var(--border2, #D5D5D5)',
                transition: 'all .2s',
              }} />
            ))}
          </div>
          <button onClick={markAndNext} style={{
            padding: '8px 14px', borderRadius: 8, border: 0,
            background: allDone ? '#048C66' : 'var(--bg-brand)', color: '#fff',
            fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>{i < steps.length - 1 ? '下一步 ›' : allDone ? '✓ 已看完' : '完成'}</button>
        </div>
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
    </Page>
  );
};

// ═════════════════════ C3 · Stamp Card ═══════════════════════════
// 三個圓形章（未讀虛線空圓、已讀填色 + ✓），點一個展開該項
// 全蓋完 → 上方出現「準備完成」綠色 banner
const ScreenC3 = ({ order }) => {
  const t = useTasks(['meet', 'call', 'tip']);
  const [open, setOpen] = React.useState(null);
  const click = (k) => {
    setOpen(prev => prev === k ? null : k);
    if (!t.done[k]) t.complete(k);
  };

  const Stamp = ({ k, icon, label }) => {
    const isDone = t.done[k];
    const isOpen = open === k;
    return (
      <button onClick={() => click(k)} style={{
        flex: 1, background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        fontFamily: 'inherit',
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: 30, position: 'relative',
          background: isDone ? 'var(--bg-brand)' : '#fff',
          border: isDone ? 'none' : '2px dashed var(--border2, #C8C8C8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: isOpen ? 'scale(1.05)' : 'none',
          boxShadow: isOpen ? '0 4px 10px rgba(55,175,174,.3)' : 'none',
          transition: 'all .2s',
        }}>
          <KKIcon name={icon} size={26} color={isDone ? '#fff' : 'var(--fg2)'} />
          {isDone && (
            <div style={{
              position: 'absolute', right: -2, bottom: -2,
              width: 20, height: 20, borderRadius: 10, background: '#048C66',
              border: '2px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <KKIcon name="check_line" size={10} color="#fff" />
            </div>
          )}
        </div>
        <div style={{ fontSize: 11, fontWeight: 600,
          color: isDone ? 'var(--fg1)' : 'var(--fg2)' }}>{label}</div>
      </button>
    );
  };

  return (
    <Page>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      {t.allDone && (
        <div style={{
          margin: '0 12px 12px', padding: '10px 14px',
          background: 'linear-gradient(135deg, #DCFAEB 0%, #FFFFFF 100%)',
          border: '1px solid #A0E0B8', borderRadius: 10,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <KKIcon name="checkCircle_fill" size={18} color="#048C66" />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#048C66' }}>
            已完成所有出發前確認 · 明天出發順利！
          </span>
        </div>
      )}
      <SectionCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <KKIcon name="flash_line" size={18} color="var(--kk-color-cyan-10)" />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>出發前確認</h3>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--fg2)' }}>
            點一點就完成 {t.n}/{t.total}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-around', padding: '6px 0 14px' }}>
          <Stamp k="meet" icon="location_line" label="集合地點" />
          <Stamp k="call" icon="headset_line" label="聯絡方式" />
          <Stamp k="tip"  icon="info_fill"    label="行前提醒" />
        </div>
        {open && (
          <div style={{
            padding: 14, background: 'var(--bg-brand-soft)', borderRadius: 10,
            border: '1px solid var(--border-primary-light)',
            animation: 'slideUp .2s',
          }}>
            {open === 'meet' && <MeetingListBody order={order} />}
            {open === 'call' && <ContactBody order={order} />}
            {open === 'tip' && <ReminderBody order={order} />}
          </div>
        )}
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
    </Page>
  );
};

// ═════════════════════ C4 · T-minus Timeline ══════════════════════
// 縱向時間軸：T-18h 讀提醒 → T-0 集合 → 有事時 聯絡
// 每一點有 checkbox，點 node 或文字展開內容（展開自動打勾）
const ScreenC4 = ({ order }) => {
  const t = useTasks(['tip', 'meet', 'call']);
  const [open, setOpen] = React.useState('tip');
  const { h, m } = useCountdown(order.departure.startIso);
  const click = (k) => {
    setOpen(prev => prev === k ? '' : k);
    if (!t.done[k]) t.complete(k);
  };

  const TimeNode = ({ k, color, time, title, subtitle, icon, Body, last }) => {
    const isOpen = open === k;
    const isDone = t.done[k];
    return (
      <div style={{ display: 'flex', gap: 12, position: 'relative',
        paddingBottom: last ? 0 : 18 }}>
        <div style={{ position: 'relative', width: 32, flexShrink: 0 }}>
          <button onClick={() => click(k)} style={{
            width: 32, height: 32, borderRadius: 16,
            background: isDone ? '#048C66' : color,
            border: 0, cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', zIndex: 2, color: '#fff',
          }}>
            {isDone ? <KKIcon name="check_line" size={16} color="#fff" />
                    : <KKIcon name={icon} size={14} color="#fff" />}
          </button>
          {!last && (
            <div style={{ position: 'absolute', left: 15, top: 32, bottom: -18, width: 2,
              background: isDone ? '#048C66' : 'var(--border1)', zIndex: 1,
              transition: 'background .3s',
            }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <button onClick={() => click(k)} style={{
            background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
            fontFamily: 'inherit', textAlign: 'left', width: '100%',
          }}>
            <div style={{ fontSize: 11, color: 'var(--fg2)', marginBottom: 2 }}>{time}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <strong style={{ fontSize: 13,
                color: isDone ? 'var(--fg2)' : 'var(--fg1)',
                textDecoration: isDone ? 'line-through' : 'none',
                textDecorationColor: 'var(--fg3, #999)',
              }}>{title}</strong>
              <KKIcon name="arrowDown_line" size={12} color="var(--fg2)"
                style={{ transform: isOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform .2s' }} />
            </div>
            {!isOpen && subtitle && (
              <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 2,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{subtitle}</div>
            )}
          </button>
          {isOpen && <div style={{ marginTop: 10 }}><Body order={order} /></div>}
        </div>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <KKIcon name="flash_line" size={18} color="var(--kk-color-cyan-10)" />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>出發前時程</h3>
          <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700,
            color: t.allDone ? '#048C66' : 'var(--kk-color-cyan-10)' }}>
            {t.allDone ? '✓ 完成' : `${t.n} / ${t.total}`}
          </span>
        </div>
        <TimeNode k="tip" color="#E78F37" icon="info_fill"
          time={`T-${h}h · 今天先讀`}
          title="行前提醒"
          subtitle="供應商緊急聯絡、車型行李限制"
          Body={ReminderBody} />
        <TimeNode k="meet" color="var(--bg-brand)" icon="location_line"
          time={`T-0 · 明早 ${order.meetingPoints[0].meetTime} 集合`}
          title={`集合地點 · ${order.meetingPoints.length} 站`}
          subtitle={`首站 ${order.meetingPoints[0].name.split(/[（\s※]/)[0]}`}
          Body={MeetingListBody} />
        <TimeNode k="call" color="#3A7BD5" icon="headset_line"
          time="有狀況時 · 隨時可用"
          title="聯絡方式"
          subtitle={`司機 ${order.contacts.primary.name.split('（')[0]} · WhatsApp`}
          Body={ContactBody} last />
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
    </Page>
  );
};

// ═════════════════════ C5 · Priority + Task Footer ══════════════
// 延伸 A4：集合 hero 大、底部三個帶 checkbox 的 task row
// 集合 hero 顯示就算看過 → 自動打勾
const ScreenC5 = ({ order }) => {
  const pts = order.meetingPoints;
  const mp0 = pts[0];
  const { h, m } = useCountdown(order.departure.startIso);
  // 集合預設看過，因為 hero 就顯示了
  const [done, setDone] = React.useState({ meet: true, call: false, tip: false });
  const [open, setOpen] = React.useState('');
  const click = (k) => {
    setOpen(prev => prev === k ? '' : k);
    if (!done[k]) setDone(d => ({ ...d, [k]: true }));
  };
  const n = Object.values(done).filter(Boolean).length;
  const allDone = n === 3;

  const TaskFooter = ({ k, icon, title, summary, Body, last }) => {
    const isOpen = open === k;
    const isDone = done[k];
    return (
      <React.Fragment>
        <button onClick={() => click(k)} style={{
          width: '100%', padding: '12px 16px', background: 'transparent', border: 0,
          borderBottom: last && !isOpen ? 'none' : '1px solid var(--border1)',
          display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
          fontFamily: 'inherit', textAlign: 'left',
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: 11,
            background: isDone ? '#048C66' : '#fff',
            border: isDone ? 'none' : '1.5px solid var(--border2, #D5D5D5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {isDone && <KKIcon name="check_line" size={13} color="#fff" />}
          </div>
          <KKIcon name={icon} size={16} color={isDone ? 'var(--fg3, #999)' : 'var(--fg1)'} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600,
              color: isDone ? 'var(--fg2)' : 'var(--fg1)',
              textDecoration: isDone ? 'line-through' : 'none',
              textDecorationColor: 'var(--fg3, #999)',
            }}>{title}</div>
            <div style={{ fontSize: 11, color: 'var(--fg2)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{summary}</div>
          </div>
          <KKIcon name="arrowDown_line" size={14} color="var(--fg2)"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
        </button>
        {isOpen && (
          <div style={{ padding: 16,
            borderBottom: last ? 'none' : '1px solid var(--border1)',
            background: 'var(--bg-brand-soft)',
          }}><Body order={order} /></div>
        )}
      </React.Fragment>
    );
  };

  return (
    <Page>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard padded={false} style={{ overflow: 'hidden' }}>
        {/* Hero 集合 */}
        <div style={{ padding: 16, background: 'linear-gradient(180deg, var(--bg-brand-soft) 0%, #fff 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <KKIcon name="location_line" size={16} color="var(--kk-color-cyan-10)" />
            <strong style={{ fontSize: 13, color: 'var(--kk-color-cyan-10)' }}>明早集合地點</strong>
            <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700,
              color: allDone ? '#048C66' : 'var(--kk-color-cyan-10)' }}>
              {allDone ? '✓ 完成' : `${n} / 3`}
            </span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, lineHeight: '28px' }}>{mp0.meetTime}</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{mp0.name}</div>
          <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 2, lineHeight: '16px' }}>
            {mp0.address}
          </div>
          <div style={{ marginTop: 12 }}>
            <MapThumb height={110} pin={mp0.name.split(/[（\s※]/)[0]} />
          </div>
          {pts.length > 1 && (
            <div style={{ marginTop: 10, padding: '8px 10px', background: '#fff',
              borderRadius: 8, border: '1px dashed var(--kk-color-cyan-6)',
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 11,
            }}>
              <KKIcon name="info_fill" size={12} color="var(--kk-color-cyan-9)" />
              <span>第 2 集合點：{pts[1].meetTime} · {pts[1].name.split(/[（\s※]/)[0]}</span>
            </div>
          )}
        </div>
        {/* 進度條 */}
        <div style={{ height: 4, background: 'var(--bg3)' }}>
          <div style={{ height: '100%', width: `${(n / 3) * 100}%`,
            background: allDone ? '#048C66' : 'var(--bg-brand)',
            transition: 'all .3s',
          }} />
        </div>
        {/* Task footer */}
        <TaskFooter k="meet" icon="location_line"
          title={`集合地點已確認 · ${pts.length} 站`}
          summary="上方地圖、地址、導航皆已顯示"
          Body={MeetingListBody} />
        <TaskFooter k="call" icon="headset_line"
          title="存好聯絡方式"
          summary={`司機 ${order.contacts.primary.name.split('（')[0]} · WhatsApp`}
          Body={ContactBody} />
        <TaskFooter k="tip" icon="info_fill"
          title="讀完行前提醒"
          summary="供應商緊急聯絡與注意事項"
          Body={ReminderBody} last />
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
    </Page>
  );
};

Object.assign(window, { ScreenC1, ScreenC2, ScreenC3, ScreenC4, ScreenC5 });
