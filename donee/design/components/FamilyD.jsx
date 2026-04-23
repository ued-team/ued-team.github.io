// ═══════════════════════════════════════════════════════════════════
// Family D — 任務完成感（更多隱喻）
//   D1 Swipe-to-complete   滑動/按鈕標記完成、卡片淡出沉底
//   D2 Unlock Gate         必看才解鎖下一項、灰+鎖頭
//   D3 Briefing Cards      卡堆、像 Tinder 一張一張滑掉
//   D4 Countdown Dashboard 大倒數 + 三格 checklist tile
//   D5 Progress Ring       圓環進度（0/3 → 3/3 圓弧）+ 三 task row
// ═══════════════════════════════════════════════════════════════════

// ═════════════════════ D1 · Swipe-to-complete ═══════════════════
// 三張 task 卡片，右側按鈕「標記為已看」→ 卡片淡出縮小 → 沉到底部「已完成」區
const ScreenD1 = ({ order }) => {
  const [done, setDone] = React.useState([]); // 完成順序
  const [open, setOpen] = React.useState('meet');
  const tasks = [
    { k: 'meet', icon: 'location_line', title: `確認集合地點 · ${order.meetingPoints.length} 站`,
      summary: `首站 ${order.meetingPoints[0].meetTime} · ${order.meetingPoints[0].name.split(/[（\s※]/)[0]}`,
      Body: MeetingListBody },
    { k: 'call', icon: 'headset_line', title: '存好聯絡方式',
      summary: `司機 ${order.contacts.primary.name.split('（')[0]} · WhatsApp`,
      Body: ContactBody },
    { k: 'tip', icon: 'info_fill', title: '讀完行前提醒',
      summary: '供應商緊急聯絡、車型行李限制',
      Body: ReminderBody },
  ];
  const pending = tasks.filter(t => !done.includes(t.k));
  const completed = done.map(k => tasks.find(t => t.k === k));
  const complete = (k) => {
    setDone(d => [...d, k]);
    const next = pending.find(t => t.k !== k);
    setOpen(next ? next.k : '');
  };
  const allDone = pending.length === 0;

  const Card = ({ t, isDone }) => {
    const isOpen = open === t.k && !isDone;
    return (
      <div style={{
        background: '#fff',
        border: isOpen ? '1.5px solid var(--kk-color-cyan-9)' : '1px solid var(--border1)',
        borderRadius: 10,
        boxShadow: isOpen ? '0 4px 12px rgba(55,175,174,.15)' : 'none',
        overflow: 'hidden',
        opacity: isDone ? 0.55 : 1,
        transform: isDone ? 'scale(0.97)' : 'scale(1)',
        transition: 'all .3s',
      }}>
        <button onClick={() => !isDone && setOpen(isOpen ? '' : t.k)} style={{
          width: '100%', padding: '12px 14px', background: 'transparent', border: 0,
          display: 'flex', alignItems: 'center', gap: 10, cursor: isDone ? 'default' : 'pointer',
          fontFamily: 'inherit', textAlign: 'left',
        }}>
          <KKIcon name={isDone ? 'checkCircle_fill' : t.icon} size={18}
            color={isDone ? '#048C66' : 'var(--kk-color-cyan-10)'} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700,
              textDecoration: isDone ? 'line-through' : 'none',
              textDecorationColor: 'var(--fg3, #999)',
              color: isDone ? 'var(--fg2)' : 'var(--fg1)',
            }}>{t.title}</div>
            {!isOpen && (
              <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 2,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{isDone ? '✓ 已看過' : t.summary}</div>
            )}
          </div>
        </button>
        {isOpen && (
          <div style={{ padding: 14, borderTop: '1px solid var(--border1)' }}>
            <t.Body order={order} />
            <button onClick={() => complete(t.k)} style={{
              marginTop: 14, width: '100%', padding: '10px',
              background: 'var(--bg-brand)', color: '#fff', border: 0, borderRadius: 8,
              fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <KKIcon name="check_line" size={14} color="#fff" />
              標記為已看
            </button>
          </div>
        )}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <KKIcon name="flash_line" size={18} color="var(--kk-color-cyan-10)" />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>出發前待辦</h3>
          <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700,
            color: allDone ? '#048C66' : 'var(--kk-color-cyan-10)' }}>
            {allDone ? '✓ 全部完成' : `還有 ${pending.length} 項`}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pending.map(t => <Card key={t.k} t={t} isDone={false} />)}
        </div>
        {completed.length > 0 && (
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px dashed var(--border1)' }}>
            <div style={{ fontSize: 11, color: 'var(--fg2)', marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <KKIcon name="checkCircle_fill" size={12} color="#048C66" />
              已完成 {completed.length} 項
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {completed.map(t => <Card key={t.k} t={t} isDone={true} />)}
            </div>
          </div>
        )}
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
    </Page>
  );
};

// ═════════════════════ D2 · Unlock Gate ═══════════════════════════
// 按順序解鎖：集合 → 聯絡 → 提醒。未解鎖灰+鎖頭、已解鎖正常
const ScreenD2 = ({ order }) => {
  const order_ = ['meet', 'call', 'tip'];
  const [unlocked, setUnlocked] = React.useState(1); // 已解鎖到第 N 個（1-indexed）
  const [done, setDone] = React.useState(new Set());
  const [open, setOpen] = React.useState('meet');
  const items = [
    { k: 'meet', icon: 'location_line', title: '確認集合地點', Body: MeetingListBody },
    { k: 'call', icon: 'headset_line',  title: '存好聯絡方式', Body: ContactBody },
    { k: 'tip',  icon: 'info_fill',     title: '讀完行前提醒', Body: ReminderBody },
  ];

  const markDone = (k) => {
    setDone(d => new Set([...d, k]));
    const idx = order_.indexOf(k);
    if (idx + 1 > unlocked - 1) setUnlocked(Math.min(3, idx + 2));
    // open next
    const nextK = order_[idx + 1];
    if (nextK) setOpen(nextK);
  };

  const Step = ({ t, idx }) => {
    const isUnlocked = idx < unlocked;
    const isDone = done.has(t.k);
    const isOpen = open === t.k && isUnlocked;
    return (
      <div style={{
        border: '1px solid',
        borderColor: isOpen ? 'var(--kk-color-cyan-9)' : 'var(--border1)',
        borderRadius: 10, overflow: 'hidden',
        background: isUnlocked ? '#fff' : 'var(--bg3)',
      }}>
        <button onClick={() => isUnlocked && setOpen(isOpen ? '' : t.k)} style={{
          width: '100%', padding: '12px 14px', background: 'transparent', border: 0,
          display: 'flex', alignItems: 'center', gap: 10,
          cursor: isUnlocked ? 'pointer' : 'not-allowed',
          fontFamily: 'inherit', textAlign: 'left',
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: 13,
            background: isDone ? '#048C66' : isUnlocked ? 'var(--bg-brand)' : 'var(--border2, #D5D5D5)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>
            {isDone ? <KKIcon name="check_line" size={13} color="#fff" />
              : isUnlocked ? idx + 1
              : <KKIcon name="lock_fill" size={12} color="#fff" />}
          </div>
          <KKIcon name={t.icon} size={16}
            color={isUnlocked ? 'var(--fg1)' : 'var(--fg3, #999)'} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700,
              color: isUnlocked ? (isDone ? 'var(--fg2)' : 'var(--fg1)') : 'var(--fg3, #999)',
              textDecoration: isDone ? 'line-through' : 'none',
            }}>{t.title}</div>
            {!isUnlocked && (
              <div style={{ fontSize: 11, color: 'var(--fg3, #999)', marginTop: 2 }}>
                完成上一項後解鎖
              </div>
            )}
          </div>
          {isUnlocked && (
            <KKIcon name="arrowDown_line" size={14} color="var(--fg2)"
              style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
          )}
        </button>
        {isOpen && (
          <div style={{ padding: 14, borderTop: '1px solid var(--border1)' }}>
            <t.Body order={order} />
            {!isDone && (
              <button onClick={() => markDone(t.k)} style={{
                marginTop: 14, width: '100%', padding: '10px',
                background: 'var(--bg-brand)', color: '#fff', border: 0, borderRadius: 8,
                fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                我已看完 · 繼續下一項
              </button>
            )}
          </div>
        )}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <KKIcon name="flash_line" size={18} color="var(--kk-color-cyan-10)" />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>出發前三步</h3>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--fg2)' }}>
            依序完成 {done.size}/3
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((t, idx) => <Step key={t.k} t={t} idx={idx} />)}
        </div>
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
    </Page>
  );
};

// ═════════════════════ D3 · Briefing Cards（卡堆 Tinder）═══════════
// 三張疊在一起的卡片，「看過了 →」下一張。看完三張出現「準備就緒」
const ScreenD3 = ({ order }) => {
  const cards = [
    { k: 'meet', icon: 'location_line', color: 'var(--kk-color-cyan-10)',
      title: '① 集合地點',
      intro: `明早 ${order.meetingPoints[0].meetTime} · ${order.meetingPoints.length} 個集合點`,
      Body: MeetingListBody },
    { k: 'call', icon: 'headset_line', color: '#3A7BD5',
      title: '② 聯絡方式',
      intro: `司機 ${order.contacts.primary.name.split('（')[0]} · WhatsApp`,
      Body: ContactBody },
    { k: 'tip', icon: 'info_fill', color: '#E78F37',
      title: '③ 行前提醒',
      intro: '供應商緊急聯絡、車型行李限制',
      Body: ReminderBody },
  ];
  const [idx, setIdx] = React.useState(0);
  const allDone = idx >= cards.length;
  const cur = cards[idx];

  return (
    <Page>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard padded={false} style={{ overflow: 'visible', background: 'transparent',
        border: 'none', boxShadow: 'none' }}>
        <div style={{ padding: '0 4px 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <KKIcon name="flash_line" size={18} color="var(--kk-color-cyan-10)" />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>出發前三張卡</h3>
          <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: 'var(--kk-color-cyan-10)' }}>
            {allDone ? '✓ 看完了' : `${idx + 1} / ${cards.length}`}
          </span>
        </div>
        {allDone ? (
          <div style={{
            marginTop: 10, padding: 24,
            background: 'linear-gradient(135deg, #DCFAEB 0%, #FFFFFF 100%)',
            border: '1px solid #A0E0B8', borderRadius: 12, textAlign: 'center',
          }}>
            <div style={{ fontSize: 36, marginBottom: 6 }}>🎉</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#048C66', marginBottom: 4 }}>
              準備就緒
            </div>
            <div style={{ fontSize: 12, color: 'var(--fg2)', lineHeight: '18px' }}>
              已看完集合地點、聯絡方式、行前提醒<br/>明天出發順利！
            </div>
            <button onClick={() => setIdx(0)} style={{
              marginTop: 14, padding: '8px 14px',
              background: 'transparent', color: '#048C66',
              border: '1px solid #A0E0B8', borderRadius: 8,
              fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              再看一次
            </button>
          </div>
        ) : (
          <div style={{ position: 'relative', marginTop: 10, height: 440 }}>
            {/* 後面兩張影子卡 */}
            {cards.slice(idx + 1, idx + 3).map((c, i) => (
              <div key={c.k} style={{
                position: 'absolute', inset: 0,
                top: (i + 1) * 6, left: (i + 1) * 4, right: -(i + 1) * 4,
                background: '#fff', borderRadius: 12,
                border: '1px solid var(--border1)',
                opacity: 0.6 - i * 0.2, zIndex: 1,
              }} />
            ))}
            {/* 前面卡 */}
            <div style={{
              position: 'absolute', inset: 0, background: '#fff', borderRadius: 12,
              border: `1.5px solid ${cur.color}`,
              boxShadow: '0 8px 20px rgba(0,0,0,.08)', zIndex: 2,
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 16px', background: `${cur.color}14`,
                display: 'flex', alignItems: 'center', gap: 10,
                borderBottom: '1px solid var(--border1)',
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 16, background: cur.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <KKIcon name={cur.icon} size={16} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{cur.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 2 }}>{cur.intro}</div>
                </div>
              </div>
              <div style={{ flex: 1, padding: 14, overflowY: 'auto' }}>
                <cur.Body order={order} />
              </div>
              <div style={{ padding: 12, borderTop: '1px solid var(--border1)', display: 'flex', gap: 8 }}>
                {idx > 0 && (
                  <button onClick={() => setIdx(idx - 1)} style={{
                    padding: '10px 14px', background: 'transparent',
                    border: '1px solid var(--border1)', borderRadius: 8,
                    color: 'var(--fg1)', fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}>← 上一張</button>
                )}
                <button onClick={() => setIdx(idx + 1)} style={{
                  flex: 1, padding: '10px',
                  background: cur.color, color: '#fff',
                  border: 0, borderRadius: 8,
                  fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  {idx < cards.length - 1 ? '看過了 · 下一張 →' : '看完了 ✓'}
                </button>
              </div>
            </div>
          </div>
        )}
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
    </Page>
  );
};

// ═════════════════════ D4 · Countdown Dashboard ══════════════════
// 上方大倒數 + 下方 3 個 checklist tile（grid 2x2 - ish）
const ScreenD4 = ({ order }) => {
  const { d, h, m } = useCountdown(order.departure.startIso);
  const [done, setDone] = React.useState({ meet: false, call: false, tip: false });
  const [open, setOpen] = React.useState('');
  const click = (k) => {
    setOpen(prev => prev === k ? '' : k);
    if (!done[k]) setDone(d => ({ ...d, [k]: true }));
  };
  const n = Object.values(done).filter(Boolean).length;

  const Tile = ({ k, icon, title, color, summary, Body }) => {
    const isOpen = open === k;
    const isDone = done[k];
    return (
      <div>
        <button onClick={() => click(k)} style={{
          width: '100%', padding: 12, borderRadius: 10,
          background: isDone ? '#F0F9F5' : '#fff',
          border: isOpen ? `1.5px solid ${color}` : '1px solid var(--border1)',
          cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
          display: 'flex', flexDirection: 'column', gap: 8,
          position: 'relative',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: isDone ? '#048C66' : `${color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <KKIcon name={isDone ? 'check_line' : icon} size={16}
                color={isDone ? '#fff' : color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700,
                color: isDone ? 'var(--fg2)' : 'var(--fg1)',
                textDecoration: isDone ? 'line-through' : 'none',
              }}>{title}</div>
              <div style={{ fontSize: 10, color: 'var(--fg2)', marginTop: 1,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140,
              }}>{summary}</div>
            </div>
          </div>
        </button>
        {isOpen && (
          <div style={{ marginTop: 8, padding: 14, background: '#fff',
            border: '1px solid var(--border1)', borderRadius: 10,
          }}>
            <Body order={order} />
          </div>
        )}
      </div>
    );
  };

  return (
    <Page>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard padded={false} style={{ overflow: 'hidden' }}>
        {/* 倒數 dashboard */}
        <div style={{
          padding: '20px 16px 16px',
          background: 'linear-gradient(135deg, var(--kk-color-cyan-10) 0%, #2B8A9A 100%)',
          color: '#fff',
        }}>
          <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 4, letterSpacing: '.05em' }}>
            距離出發
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, opacity: 0.9 }}>
            <KKIcon name="location_line" size={12} color="#fff" />
            <span>{order.meetingPoints[0].name.split(/[（\s※]/)[0]}</span>
            <span style={{ margin: '0 4px', opacity: 0.5 }}>·</span>
            <span>{order.departure.meetTime} 集合</span>
          </div>
        </div>
        {/* 進度條 */}
        <div style={{ padding: '10px 14px', background: '#fff',
          display: 'flex', alignItems: 'center', gap: 8,
          borderBottom: '1px solid var(--border1)',
        }}>
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--bg3)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(n/3)*100}%`,
              background: n === 3 ? '#048C66' : 'var(--bg-brand)',
              transition: 'all .3s',
            }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700,
            color: n === 3 ? '#048C66' : 'var(--kk-color-cyan-10)',
          }}>
            {n === 3 ? '✓ 完成' : `${n}/3 已確認`}
          </span>
        </div>
        {/* Tiles */}
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Tile k="meet" icon="location_line" color="var(--kk-color-cyan-10)"
            title={`集合地點 · ${order.meetingPoints.length} 站`}
            summary={`首站 ${order.meetingPoints[0].name.split(/[（\s※]/)[0]}`}
            Body={MeetingListBody} />
          <Tile k="call" icon="headset_line" color="#3A7BD5"
            title="聯絡方式"
            summary={`司機 ${order.contacts.primary.name.split('（')[0]} · WhatsApp`}
            Body={ContactBody} />
          <Tile k="tip" icon="info_fill" color="#E78F37"
            title="行前提醒"
            summary="供應商緊急聯絡、車型限制"
            Body={ReminderBody} />
        </div>
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
    </Page>
  );
};

// ═════════════════════ D5 · Progress Ring ═══════════════════════
// 左上大圓環 0/3 → 3/3、右邊三個 task row
const ScreenD5 = ({ order }) => {
  const t = useTasks(['meet', 'call', 'tip']);
  const [open, setOpen] = React.useState('meet');
  const click = (k) => {
    setOpen(prev => prev === k ? '' : k);
    if (!t.done[k]) t.complete(k);
  };

  const size = 72, stroke = 7, r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = t.n / t.total;

  const Row = ({ k, icon, title, summary, Body, color, last }) => {
    const isOpen = open === k;
    const isDone = t.done[k];
    return (
      <div style={{ borderBottom: last ? 'none' : '1px solid var(--border1)' }}>
        <button onClick={() => click(k)} style={{
          width: '100%', padding: '12px 0', background: 'transparent', border: 0,
          display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
          fontFamily: 'inherit', textAlign: 'left',
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: 4,
            background: isDone ? '#048C66' : color,
            flexShrink: 0,
          }} />
          <KKIcon name={icon} size={15} color={isDone ? 'var(--fg3, #999)' : 'var(--fg1)'} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600,
              color: isDone ? 'var(--fg2)' : 'var(--fg1)',
              textDecoration: isDone ? 'line-through' : 'none',
              textDecorationColor: 'var(--fg3, #999)',
            }}>{title}</div>
            {!isOpen && (
              <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 1,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{summary}</div>
            )}
          </div>
          {isDone ? (
            <KKIcon name="checkCircle_fill" size={16} color="#048C66" />
          ) : (
            <KKIcon name="arrowDown_line" size={14} color="var(--fg2)"
              style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
          )}
        </button>
        {isOpen && <div style={{ paddingBottom: 14 }}><Body order={order} /></div>}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={size/2} cy={size/2} r={r} fill="none"
                stroke="var(--bg3)" strokeWidth={stroke} />
              <circle cx={size/2} cy={size/2} r={r} fill="none"
                stroke={t.allDone ? '#048C66' : 'var(--bg-brand)'}
                strokeWidth={stroke} strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - pct)}
                style={{ transition: 'stroke-dashoffset .5s ease, stroke .3s' }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column',
            }}>
              <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1,
                color: t.allDone ? '#048C66' : 'var(--fg1)',
              }}>{t.n}/{t.total}</div>
              <div style={{ fontSize: 9, color: 'var(--fg2)', marginTop: 2 }}>已確認</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--fg2)', marginBottom: 2 }}>
              {t.allDone ? '已準備好明天出發' : '出發前待確認'}
            </div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
              {t.allDone ? '✓ 準備就緒' : '還差幾項就完成'}
            </h3>
            <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 4, lineHeight: '16px' }}>
              {t.allDone ? '集合、聯絡、提醒都看過了' : '點下方任一項展開並標記完成'}
            </div>
          </div>
        </div>
        <div>
          <Row k="meet" icon="location_line" color="var(--kk-color-cyan-10)"
            title={`集合地點 · ${order.meetingPoints.length} 站`}
            summary={`首站 ${order.meetingPoints[0].meetTime} · ${order.meetingPoints[0].name.split(/[（\s※]/)[0]}`}
            Body={MeetingListBody} />
          <Row k="call" icon="headset_line" color="#3A7BD5"
            title="聯絡方式"
            summary={`司機 ${order.contacts.primary.name.split('（')[0]} · WhatsApp`}
            Body={ContactBody} />
          <Row k="tip" icon="info_fill" color="#E78F37"
            title="行前提醒"
            summary="供應商緊急聯絡、車型行李限制"
            Body={ReminderBody} last />
        </div>
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
    </Page>
  );
};

Object.assign(window, { ScreenD1, ScreenD2, ScreenD3, ScreenD4, ScreenD5 });
