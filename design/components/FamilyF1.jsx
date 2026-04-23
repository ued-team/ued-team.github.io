// ═══════════════════════════════════════════════════════════════════
// Family F (part 1) — 任務連續性：hub 任務感延伸到子頁
//   F1 Return-with-check   子頁底部大 CTA「看完了」→ 回 hub 打勾動畫
//   F2 Scroll-to-done      滾到底自動完成、徽章飛回 hub
//   F3 Sub-checklist       子頁內部再有小 checklist
//   F4 Swipeable Next      子頁底部「下一項 →」直接連下一個子頁
//   F5 XP / Level          每完成得 XP、hub 等級進度條
// ═══════════════════════════════════════════════════════════════════

// ─── 共用 helpers ───────────────────────────────────────────────
const SubFrame = ({ title, onBack, children, footer }) => (
  <div style={{
    position: 'absolute', inset: 0, background: 'var(--bg2, #F5F5F5)',
    zIndex: 50, display: 'flex', flexDirection: 'column',
    animation: 'slideInRight .25s ease-out',
  }}>
    <div style={{
      padding: '12px 16px', background: '#fff',
      borderBottom: '1px solid var(--border1)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <button onClick={onBack} style={{
        background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
        display: 'flex', alignItems: 'center',
        color: 'var(--fg1)', fontFamily: 'inherit',
      }}>
        <KKIcon name="arrowLeft_line" size={18} color="var(--fg1)" />
      </button>
      <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, flex: 1 }}>{title}</h2>
    </div>
    <div style={{ flex: 1, overflowY: 'auto', padding: 12, paddingBottom: footer ? 90 : 12 }}>
      {children}
    </div>
    {footer && (
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 12, background: '#fff',
        borderTop: '1px solid var(--border1)',
      }}>{footer}</div>
    )}
  </div>
);

const BodyFor = ({ k, order }) => {
  if (k === 'meet') return <MeetingListBody order={order} />;
  if (k === 'call') return <ContactBody order={order} />;
  if (k === 'tip') return <ReminderBody order={order} />;
  return null;
};

const taskMeta = (order) => [
  { k: 'meet', icon: 'location_line', title: `集合地點 · ${order.meetingPoints.length} 站`,
    short: '集合地點',
    summary: `首站 ${order.meetingPoints[0].meetTime} · ${order.meetingPoints[0].name.split(/[（\s※]/)[0]}` },
  { k: 'call', icon: 'headset_line', title: '聯絡方式', short: '聯絡方式',
    summary: `司機 ${order.contacts.primary.name.split('（')[0]} · WhatsApp` },
  { k: 'tip', icon: 'info_fill', title: '行前提醒', short: '行前提醒',
    summary: '供應商緊急聯絡、車型行李限制' },
];

// ═════════════════════ F1 · Return-with-check ══════════════════════
// 子頁底部大 CTA「我看完了」→ 關頁 + 主頁對應 row 打勾 + 閃一下
const ScreenF1 = ({ order }) => {
  const [page, setPage] = React.useState(null);
  const [done, setDone] = React.useState(new Set());
  const [flash, setFlash] = React.useState('');
  const items = taskMeta(order);
  const complete = (k) => {
    setDone(d => new Set([...d, k]));
    setPage(null);
    setFlash(k);
    setTimeout(() => setFlash(''), 800);
  };
  const n = done.size, total = 3, allDone = n === total;

  return (
    <Page style={{ position: 'relative' }}>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <KKIcon name="flash_line" size={18} color="var(--kk-color-cyan-10)" />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>出發前待確認</h3>
          <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700,
            color: allDone ? '#048C66' : 'var(--kk-color-cyan-10)' }}>
            {allDone ? '✓ 完成' : `${n} / ${total}`}
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'var(--bg3)',
          overflow: 'hidden', marginBottom: 8,
        }}>
          <div style={{ height: '100%', width: `${(n/total)*100}%`,
            background: allDone ? '#048C66' : 'var(--bg-brand)',
            transition: 'width .4s ease',
          }} />
        </div>
        {items.map((t, i) => {
          const isDone = done.has(t.k);
          const isFlash = flash === t.k;
          return (
            <button key={t.k} onClick={() => setPage(t.k)} style={{
              width: '100%', padding: '12px 0', background: 'transparent', border: 0,
              borderTop: i > 0 ? '1px solid var(--border1)' : 'none',
              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
              fontFamily: 'inherit', textAlign: 'left',
              transform: isFlash ? 'scale(1.02)' : 'scale(1)',
              transition: 'transform .3s',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 12,
                background: isDone ? '#048C66' : 'transparent',
                border: isDone ? 'none' : '1.5px solid var(--border2, #D5D5D5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                boxShadow: isFlash ? '0 0 0 6px rgba(4,140,102,.2)' : 'none',
                transition: 'all .3s',
              }}>
                {isDone && <KKIcon name="check_line" size={14} color="#fff" />}
              </div>
              <KKIcon name={t.icon} size={16}
                color={isDone ? 'var(--fg3, #999)' : 'var(--fg1)'} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600,
                  color: isDone ? 'var(--fg2)' : 'var(--fg1)',
                  textDecoration: isDone ? 'line-through' : 'none',
                }}>{t.title}</div>
                <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{isDone ? '✓ 已看過' : t.summary}</div>
              </div>
              <KKIcon name="arrowRight_line" size={14} color="var(--fg2)" />
            </button>
          );
        })}
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
      {page && (
        <SubFrame title={items.find(x => x.k === page).title} onBack={() => setPage(null)}
          footer={
            <button onClick={() => complete(page)} style={{
              width: '100%', padding: '12px', borderRadius: 10,
              background: 'var(--bg-brand)', color: '#fff', border: 0,
              fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <KKIcon name="check_line" size={16} color="#fff" />
              我看完了 · 回主頁
            </button>
          }
        >
          <SectionCard><BodyFor k={page} order={order} /></SectionCard>
        </SubFrame>
      )}
    </Page>
  );
};

// ═════════════════════ F2 · Scroll-to-done ═══════════════════════
// 子頁滾到底 → 自動觸發完成、徽章浮現「✓ 已看完」飛出去
const ScreenF2 = ({ order }) => {
  const [page, setPage] = React.useState(null);
  const [done, setDone] = React.useState(new Set());
  const [reachedBottom, setReachedBottom] = React.useState(false);
  const [badgeFly, setBadgeFly] = React.useState(null);
  const items = taskMeta(order);

  React.useEffect(() => { setReachedBottom(false); }, [page]);

  const onScroll = (e) => {
    if (reachedBottom) return;
    const el = e.target;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 40) {
      setReachedBottom(true);
      if (page && !done.has(page)) {
        setTimeout(() => {
          setDone(d => new Set([...d, page]));
          setBadgeFly(page);
          setTimeout(() => { setBadgeFly(null); setPage(null); }, 900);
        }, 300);
      }
    }
  };

  const n = done.size, total = 3, allDone = n === total;

  return (
    <Page style={{ position: 'relative' }}>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <KKIcon name="flash_line" size={18} color="var(--kk-color-cyan-10)" />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>滑到底就完成</h3>
          <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700,
            color: allDone ? '#048C66' : 'var(--kk-color-cyan-10)' }}>{n} / {total}</span>
        </div>
        {items.map((t, i) => {
          const isDone = done.has(t.k);
          return (
            <button key={t.k} onClick={() => setPage(t.k)} style={{
              width: '100%', padding: '12px 0', background: 'transparent', border: 0,
              borderTop: i > 0 ? '1px solid var(--border1)' : 'none',
              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
              fontFamily: 'inherit', textAlign: 'left',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 12,
                background: isDone ? '#048C66' : 'transparent',
                border: isDone ? 'none' : '1.5px solid var(--border2, #D5D5D5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {isDone && <KKIcon name="check_line" size={14} color="#fff" />}
              </div>
              <KKIcon name={t.icon} size={16} color="var(--fg1)" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{t.title}</div>
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
      {page && (
        <div style={{
          position: 'absolute', inset: 0, background: 'var(--bg2, #F5F5F5)',
          zIndex: 50, display: 'flex', flexDirection: 'column',
          animation: 'slideInRight .25s ease-out',
        }}>
          <div style={{ padding: '12px 16px', background: '#fff',
            borderBottom: '1px solid var(--border1)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <button onClick={() => setPage(null)} style={{
              background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
            }}>
              <KKIcon name="arrowLeft_line" size={18} color="var(--fg1)" />
            </button>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, flex: 1 }}>
              {items.find(x => x.k === page).title}
            </h2>
            <span style={{ fontSize: 10, color: 'var(--fg2)',
              padding: '3px 8px', borderRadius: 10, background: 'var(--bg3)',
            }}>
              {reachedBottom ? '✓ 已到底' : '滑到底自動完成'}
            </span>
          </div>
          <div onScroll={onScroll} style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
            <SectionCard>
              <BodyFor k={page} order={order} />
              <div style={{ marginTop: 20, padding: 20, textAlign: 'center',
                border: '2px dashed var(--border1)', borderRadius: 10,
                color: 'var(--fg2)', fontSize: 12,
              }}>
                {reachedBottom ? '✓ 看完了 · 正在打勾…' : '↓ 請滑到這裡'}
              </div>
            </SectionCard>
          </div>
          {badgeFly === page && (
            <div style={{
              position: 'absolute', right: 20, top: 60,
              background: '#048C66', color: '#fff',
              padding: '10px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 6,
              animation: 'flyBack .9s forwards ease-in',
              boxShadow: '0 4px 12px rgba(4,140,102,.4)',
            }}>
              <KKIcon name="checkCircle_fill" size={14} color="#fff" />
              完成 +1
            </div>
          )}
        </div>
      )}
    </Page>
  );
};

// ═════════════════════ F3 · Sub-checklist ════════════════════════
// 子頁內部也有小 checklist（幾個子任務）、全打勾才算完成
const ScreenF3 = ({ order }) => {
  const [page, setPage] = React.useState(null);
  const [done, setDone] = React.useState(new Set());
  const [subDone, setSubDone] = React.useState({ meet: new Set(), call: new Set(), tip: new Set() });
  const items = taskMeta(order);

  const subTasks = {
    meet: [
      { id: 'addr', label: '看過集合地點與地址' },
      { id: 'time', label: '記下集合時間' },
      { id: 'map', label: '試開 Google Maps 導航' },
    ],
    call: [
      { id: 'drv', label: '存司機 WhatsApp' },
      { id: 'emg', label: '記下緊急聯絡' },
    ],
    tip: [
      { id: 'read', label: '讀完注意事項' },
      { id: 'lug', label: '確認行李數量' },
    ],
  };

  const tickSub = (k, id) => {
    setSubDone(s => {
      const next = new Set(s[k]);
      next.has(id) ? next.delete(id) : next.add(id);
      const updated = { ...s, [k]: next };
      if (next.size === subTasks[k].length) {
        setDone(d => new Set([...d, k]));
      } else {
        setDone(d => { const n = new Set(d); n.delete(k); return n; });
      }
      return updated;
    });
  };

  const n = done.size, total = 3, allDone = n === total;

  return (
    <Page style={{ position: 'relative' }}>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <KKIcon name="flash_line" size={18} color="var(--kk-color-cyan-10)" />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>出發前 · 每項都有子任務</h3>
          <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700,
            color: allDone ? '#048C66' : 'var(--kk-color-cyan-10)' }}>{n} / {total}</span>
        </div>
        {items.map((t, i) => {
          const isDone = done.has(t.k);
          const subN = subDone[t.k].size, subTotal = subTasks[t.k].length;
          return (
            <button key={t.k} onClick={() => setPage(t.k)} style={{
              width: '100%', padding: '12px 0', background: 'transparent', border: 0,
              borderTop: i > 0 ? '1px solid var(--border1)' : 'none',
              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
              fontFamily: 'inherit', textAlign: 'left',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 12,
                background: isDone ? '#048C66' : 'transparent',
                border: isDone ? 'none' : '1.5px solid var(--border2, #D5D5D5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {isDone && <KKIcon name="check_line" size={14} color="#fff" />}
              </div>
              <KKIcon name={t.icon} size={16} color={isDone ? 'var(--fg3, #999)' : 'var(--fg1)'} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{t.title}</div>
                <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 2 }}>
                  子任務 {subN}/{subTotal}
                </div>
              </div>
              <KKIcon name="arrowRight_line" size={14} color="var(--fg2)" />
            </button>
          );
        })}
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
      {page && (
        <SubFrame title={items.find(x => x.k === page).title} onBack={() => setPage(null)}>
          <SectionCard>
            <div style={{ marginBottom: 12, padding: 12, borderRadius: 8,
              background: 'var(--bg-brand-soft)',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--kk-color-cyan-10)',
                marginBottom: 8,
              }}>
                本頁任務 ({subDone[page].size}/{subTasks[page].length})
              </div>
              {subTasks[page].map(st => {
                const isSub = subDone[page].has(st.id);
                return (
                  <label key={st.id} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 0', cursor: 'pointer',
                  }}>
                    <div onClick={() => tickSub(page, st.id)} style={{
                      width: 18, height: 18, borderRadius: 4,
                      background: isSub ? '#048C66' : '#fff',
                      border: isSub ? 'none' : '1.5px solid var(--border2, #D5D5D5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {isSub && <KKIcon name="check_line" size={10} color="#fff" />}
                    </div>
                    <span style={{ fontSize: 12,
                      textDecoration: isSub ? 'line-through' : 'none',
                      color: isSub ? 'var(--fg2)' : 'var(--fg1)',
                    }}>{st.label}</span>
                  </label>
                );
              })}
            </div>
            <BodyFor k={page} order={order} />
          </SectionCard>
        </SubFrame>
      )}
    </Page>
  );
};

// ═════════════════════ F4 · Swipeable Next ══════════════════════
// 子頁底部「下一項 →」直接連到下一個子頁（串流完成）
const ScreenF4 = ({ order }) => {
  const [page, setPage] = React.useState(null); // 0/1/2 or null
  const [done, setDone] = React.useState(new Set());
  const items = taskMeta(order);
  const completeAndNext = () => {
    const k = items[page].k;
    setDone(d => new Set([...d, k]));
    if (page < items.length - 1) setPage(page + 1);
    else setPage(null);
  };
  const n = done.size, total = 3, allDone = n === total;

  return (
    <Page style={{ position: 'relative' }}>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <KKIcon name="flash_line" size={18} color="var(--kk-color-cyan-10)" />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>出發前三站</h3>
          <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700,
            color: allDone ? '#048C66' : 'var(--kk-color-cyan-10)' }}>{n} / {total}</span>
        </div>
        <button onClick={() => setPage(0)} style={{
          width: '100%', padding: '14px', borderRadius: 10,
          background: allDone ? '#F0F9F5' : 'var(--bg-brand)',
          color: allDone ? '#048C66' : '#fff', border: 0,
          fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          marginBottom: 12,
        }}>
          <KKIcon name="playCircle_line" size={16}
            color={allDone ? '#048C66' : '#fff'} />
          {allDone ? '✓ 已看完全部 · 再瀏覽一次' : '開始瀏覽三項'}
        </button>
        {items.map((t, i) => {
          const isDone = done.has(t.k);
          return (
            <div key={t.k} style={{
              padding: '10px 0', borderTop: i > 0 ? '1px solid var(--border1)' : 'none',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 10,
                background: isDone ? '#048C66' : 'transparent',
                border: isDone ? 'none' : '1.5px solid var(--border2, #D5D5D5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {isDone && <KKIcon name="check_line" size={12} color="#fff" />}
              </div>
              <KKIcon name={t.icon} size={14} color={isDone ? 'var(--fg3, #999)' : 'var(--fg1)'} />
              <div style={{ flex: 1, fontSize: 12, fontWeight: 600,
                color: isDone ? 'var(--fg2)' : 'var(--fg1)',
                textDecoration: isDone ? 'line-through' : 'none',
              }}>{t.title}</div>
              <button onClick={() => setPage(i)} style={{
                fontSize: 11, fontWeight: 600, color: 'var(--kk-color-cyan-10)',
                background: 'transparent', border: 0, cursor: 'pointer',
                fontFamily: 'inherit',
              }}>單獨看 ›</button>
            </div>
          );
        })}
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
      {page !== null && (
        <SubFrame
          title={`${page + 1}/${items.length} · ${items[page].title}`}
          onBack={() => setPage(null)}
          footer={
            <div style={{ display: 'flex', gap: 8 }}>
              <button disabled={page === 0}
                onClick={() => setPage(Math.max(0, page - 1))} style={{
                padding: '12px 16px', borderRadius: 10,
                background: '#fff', border: '1px solid var(--border1)',
                color: page === 0 ? 'var(--fg3, #999)' : 'var(--fg1)',
                fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                cursor: page === 0 ? 'default' : 'pointer',
                opacity: page === 0 ? 0.5 : 1,
              }}>‹ 上一項</button>
              <button onClick={completeAndNext} style={{
                flex: 1, padding: '12px', borderRadius: 10,
                background: 'var(--bg-brand)', color: '#fff', border: 0,
                fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <KKIcon name="check_line" size={14} color="#fff" />
                {page < items.length - 1 ? '看過了 · 下一項 →' : '看過了 · 完成'}
              </button>
            </div>
          }
        >
          <div style={{ padding: '0 0 12px' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {items.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 4, borderRadius: 2,
                  background: done.has(items[i].k) ? '#048C66' :
                    i === page ? 'var(--bg-brand)' : 'var(--border2, #D5D5D5)',
                  transition: 'all .3s',
                }} />
              ))}
            </div>
          </div>
          <SectionCard><BodyFor k={items[page].k} order={order} /></SectionCard>
        </SubFrame>
      )}
    </Page>
  );
};

// ═════════════════════ F5 · XP / Level ═══════════════════════════
// 每看完一項得 30 XP、hub 顯示 XP 條 + 等級 Lv.0→Lv.1，滿級祝賀
const ScreenF5 = ({ order }) => {
  const [page, setPage] = React.useState(null);
  const [done, setDone] = React.useState(new Set());
  const [flashXP, setFlashXP] = React.useState(false);
  const items = taskMeta(order);
  const xpPer = 30, total = items.length * xpPer;
  const xp = done.size * xpPer;
  const level = Math.floor(xp / total);
  const complete = (k) => {
    if (!done.has(k)) {
      setDone(d => new Set([...d, k]));
      setFlashXP(true);
      setTimeout(() => setFlashXP(false), 1200);
    }
    setPage(null);
  };

  return (
    <Page style={{ position: 'relative' }}>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard padded={false} style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '14px 16px',
          background: 'linear-gradient(135deg, #6A4AB0 0%, #8C5BCC 100%)',
          color: '#fff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 18,
              background: 'rgba(255,255,255,.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 800,
            }}>
              Lv.{level}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>
                {xp === total ? '🎉 行前準備達人' : '行前準備 · 經驗累積中'}
              </div>
              <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>
                已獲得 {xp} / {total} XP
              </div>
            </div>
            {flashXP && (
              <div style={{
                padding: '4px 10px', borderRadius: 12,
                background: '#FFD84F', color: '#6A4AB0',
                fontSize: 11, fontWeight: 800,
                animation: 'pop .5s',
              }}>+{xpPer} XP</div>
            )}
          </div>
          <div style={{ height: 8, borderRadius: 4,
            background: 'rgba(255,255,255,.25)', overflow: 'hidden',
          }}>
            <div style={{ height: '100%', width: `${(xp/total)*100}%`,
              background: 'linear-gradient(90deg, #FFD84F, #FFA530)',
              transition: 'width .6s ease',
            }} />
          </div>
        </div>
        <div style={{ padding: 12 }}>
          {items.map((t, i) => {
            const isDone = done.has(t.k);
            return (
              <button key={t.k} onClick={() => setPage(t.k)} style={{
                width: '100%', padding: '12px 0', background: 'transparent', border: 0,
                borderTop: i > 0 ? '1px solid var(--border1)' : 'none',
                display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                fontFamily: 'inherit', textAlign: 'left',
              }}>
                <KKIcon name={t.icon} size={18}
                  color={isDone ? 'var(--fg3, #999)' : 'var(--fg1)'} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600,
                    color: isDone ? 'var(--fg2)' : 'var(--fg1)',
                    textDecoration: isDone ? 'line-through' : 'none',
                  }}>{t.title}</div>
                  <div style={{ fontSize: 11, color: isDone ? '#048C66' : '#6A4AB0',
                    marginTop: 2, fontWeight: 600,
                  }}>
                    {isDone ? `✓ +${xpPer} XP` : `+${xpPer} XP`}
                  </div>
                </div>
                <KKIcon name="arrowRight_line" size={14} color="var(--fg2)" />
              </button>
            );
          })}
        </div>
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
      {page && (
        <SubFrame title={items.find(x => x.k === page).title} onBack={() => setPage(null)}
          footer={
            <button onClick={() => complete(page)} style={{
              width: '100%', padding: '12px', borderRadius: 10,
              background: 'linear-gradient(135deg, #6A4AB0 0%, #8C5BCC 100%)',
              color: '#fff', border: 0,
              fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              獲得 +{xpPer} XP · 回主頁
            </button>
          }
        >
          <SectionCard><BodyFor k={page} order={order} /></SectionCard>
        </SubFrame>
      )}
    </Page>
  );
};

Object.assign(window, { ScreenF1, ScreenF2, ScreenF3, ScreenF4, ScreenF5 });
