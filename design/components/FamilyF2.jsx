// ═══════════════════════════════════════════════════════════════════
// Family F (part 2) — 任務連續性 F6~F10
//   F6  Streak Trail         三個任務用長條步道連起來，角色點在推進
//   F7  Quiz Gate            子頁末尾小確認題，答對才蓋章
//   F8  Collectible Cards    看完解鎖一張明信片卡、hub 卡冊 1/3
//   F9  Map Quest            hub 主角色在地圖上移動、完成一項走一站
//   F10 Sticker Reward       完成全部跳滿版慶祝 + 可分享貼圖
// 依賴 FamilyF1 的 SubFrame, BodyFor, taskMeta
// ═══════════════════════════════════════════════════════════════════

// ═════════════════════ F6 · Streak Trail ═════════════════════════
const ScreenF6 = ({ order }) => {
  const [page, setPage] = React.useState(null);
  const [done, setDone] = React.useState(new Set());
  const items = taskMeta(order);
  const complete = (k) => { setDone(d => new Set([...d, k])); setPage(null); };
  const n = done.size, total = 3;

  return (
    <Page style={{ position: 'relative' }}>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <KKIcon name="flash_line" size={18} color="var(--kk-color-cyan-10)" />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>出發前旅程</h3>
          <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700,
            color: n === total ? '#048C66' : 'var(--kk-color-cyan-10)' }}>{n} / {total}</span>
        </div>
        {/* 步道 */}
        <div style={{ position: 'relative', height: 90, marginBottom: 12 }}>
          {/* 連線 */}
          <div style={{ position: 'absolute', left: 30, right: 30, top: 22, height: 4,
            borderRadius: 2, background: 'var(--border2, #E0E0E0)',
          }} />
          <div style={{ position: 'absolute', left: 30, top: 22, height: 4,
            borderRadius: 2,
            width: `calc(${(n / total) * 100}% - ${n === 0 ? 0 : n === total ? 60 : 30}px)`,
            background: 'linear-gradient(90deg, var(--bg-brand), #048C66)',
            transition: 'width .5s ease',
          }} />
          {/* 站點 */}
          {items.map((t, i) => {
            const isDone = done.has(t.k);
            const left = `calc(${(i / (items.length - 1)) * 100}% - 22px)`;
            return (
              <div key={t.k} style={{
                position: 'absolute', left, top: 0, width: 50,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}>
                <button onClick={() => setPage(t.k)} style={{
                  width: 44, height: 44, borderRadius: 22,
                  background: isDone ? '#048C66' : '#fff',
                  border: isDone ? 'none' : '3px solid var(--border2, #E0E0E0)',
                  cursor: 'pointer', padding: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isDone ? '0 2px 8px rgba(4,140,102,.3)' : 'none',
                }}>
                  <KKIcon name={isDone ? 'check_line' : t.icon} size={18}
                    color={isDone ? '#fff' : 'var(--fg1)'} />
                </button>
                <div style={{ fontSize: 10, color: 'var(--fg2)', textAlign: 'center' }}>
                  {t.short}
                </div>
              </div>
            );
          })}
          {/* 小角色 */}
          {n > 0 && n < total && (
            <div style={{
              position: 'absolute', fontSize: 20,
              top: -8, left: `calc(${((n - 0.3) / (items.length - 1)) * 100}% - 10px)`,
              transition: 'left .5s ease',
            }}>🧳</div>
          )}
        </div>
        <div style={{ fontSize: 11, color: 'var(--fg2)', textAlign: 'center',
          padding: 8, background: 'var(--bg3)', borderRadius: 8,
        }}>
          {n === 0 ? '點任一站開始行前準備' :
           n === total ? '🎉 準備完成，明天出發順利！' :
           `往下一站前進 · 還剩 ${total - n} 站`}
        </div>
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
            }}>抵達這一站 · 回主頁</button>
          }>
          <SectionCard><BodyFor k={page} order={order} /></SectionCard>
        </SubFrame>
      )}
    </Page>
  );
};

// ═════════════════════ F7 · Quiz Gate ════════════════════════════
const ScreenF7 = ({ order }) => {
  const [page, setPage] = React.useState(null);
  const [done, setDone] = React.useState(new Set());
  const [answered, setAnswered] = React.useState(null);
  const items = taskMeta(order);

  const quizzes = {
    meet: {
      q: `明早集合時間是幾點？`,
      options: ['07:30', order.meetingPoints[0].meetTime, '08:00'],
      correct: 1,
    },
    call: {
      q: `有狀況時最主要的聯絡方式？`,
      options: ['Email 供應商', 'WhatsApp 司機', 'App 站內信'],
      correct: 1,
    },
    tip: {
      q: `車型乘載不下時，司機可能會？`,
      options: ['幫忙改行程', '有權拒絕乘載', '主動退款'],
      correct: 1,
    },
  };

  const openPage = (k) => { setPage(k); setAnswered(null); };
  const answer = (idx) => {
    setAnswered(idx);
    if (idx === quizzes[page].correct) {
      setTimeout(() => { setDone(d => new Set([...d, page])); setPage(null); }, 900);
    }
  };
  const n = done.size, total = 3;

  return (
    <Page style={{ position: 'relative' }}>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <KKIcon name="flash_line" size={18} color="var(--kk-color-cyan-10)" />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>看完答題才算完成</h3>
          <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700,
            color: n === total ? '#048C66' : 'var(--kk-color-cyan-10)' }}>{n} / {total}</span>
        </div>
        {items.map((t, i) => {
          const isDone = done.has(t.k);
          return (
            <button key={t.k} onClick={() => openPage(t.k)} style={{
              width: '100%', padding: '12px 0', background: 'transparent', border: 0,
              borderTop: i > 0 ? '1px solid var(--border1)' : 'none',
              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
              fontFamily: 'inherit', textAlign: 'left',
            }}>
              <div style={{ width: 24, height: 24, borderRadius: 12,
                background: isDone ? '#048C66' : 'transparent',
                border: isDone ? 'none' : '1.5px solid var(--border2, #D5D5D5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {isDone ? <KKIcon name="check_line" size={14} color="#fff" />
                  : <span style={{ fontSize: 10, color: 'var(--fg2)' }}>?</span>}
              </div>
              <KKIcon name={t.icon} size={16} color="var(--fg1)" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{t.title}</div>
                <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 2 }}>
                  {isDone ? '✓ 已答對' : '看完後有小測驗'}
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
          <SectionCard><BodyFor k={page} order={order} /></SectionCard>
          <SectionCard>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--kk-color-cyan-10)',
              marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <KKIcon name="info_fill" size={12} color="var(--kk-color-cyan-10)" />
              小測驗 · 答對才打勾
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
              {quizzes[page].q}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {quizzes[page].options.map((opt, idx) => {
                const isPicked = answered === idx;
                const isCorrect = idx === quizzes[page].correct;
                const show = answered !== null;
                return (
                  <button key={idx} disabled={show} onClick={() => answer(idx)} style={{
                    padding: '12px 14px', borderRadius: 10, textAlign: 'left',
                    background: show && isCorrect ? '#E8F7EF' :
                                show && isPicked ? '#FCE8E8' : '#fff',
                    border: '1.5px solid',
                    borderColor: show && isCorrect ? '#048C66' :
                                 show && isPicked ? '#D64545' : 'var(--border1)',
                    color: 'var(--fg1)', fontSize: 13, fontWeight: 500,
                    cursor: show ? 'default' : 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{ flex: 1 }}>{opt}</span>
                    {show && isCorrect && <KKIcon name="checkCircle_fill" size={16} color="#048C66" />}
                    {show && isPicked && !isCorrect && (
                      <span style={{ fontSize: 11, color: '#D64545' }}>再看一下 ↑</span>
                    )}
                  </button>
                );
              })}
            </div>
          </SectionCard>
        </SubFrame>
      )}
    </Page>
  );
};

// ═════════════════════ F8 · Collectible Cards ═══════════════════
const ScreenF8 = ({ order }) => {
  const [page, setPage] = React.useState(null);
  const [done, setDone] = React.useState(new Set());
  const items = taskMeta(order);
  const complete = (k) => { setDone(d => new Set([...d, k])); setPage(null); };
  const n = done.size;

  const cardStyles = {
    meet: { bg: 'linear-gradient(135deg, #37AFAE 0%, #2B8A9A 100%)', emoji: '📍' },
    call: { bg: 'linear-gradient(135deg, #3A7BD5 0%, #5E9ED6 100%)', emoji: '☎️' },
    tip: { bg: 'linear-gradient(135deg, #E78F37 0%, #F4A85A 100%)', emoji: '💡' },
  };

  return (
    <Page style={{ position: 'relative' }}>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <KKIcon name="flash_line" size={18} color="var(--kk-color-cyan-10)" />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>收集行前卡 {n}/3</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
          marginBottom: 10,
        }}>
          {items.map(t => {
            const isDone = done.has(t.k);
            const s = cardStyles[t.k];
            return (
              <button key={t.k} onClick={() => setPage(t.k)} style={{
                aspectRatio: '3/4', borderRadius: 10, padding: 10,
                background: isDone ? s.bg : '#F5F5F5',
                border: isDone ? 'none' : '2px dashed var(--border2, #C8C8C8)',
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', flexDirection: 'column',
                alignItems: 'flex-start', justifyContent: 'space-between',
                color: isDone ? '#fff' : 'var(--fg2)', textAlign: 'left',
                position: 'relative', overflow: 'hidden',
              }}>
                {isDone ? (
                  <>
                    <div style={{ fontSize: 26 }}>{s.emoji}</div>
                    <div>
                      <div style={{ fontSize: 10, opacity: .85 }}>已收集</div>
                      <div style={{ fontSize: 12, fontWeight: 800, marginTop: 2 }}>{t.short}</div>
                    </div>
                    <div style={{ position: 'absolute', top: 6, right: 6,
                      width: 16, height: 16, borderRadius: 8, background: 'rgba(255,255,255,.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <KKIcon name="check_line" size={10} color="#fff" />
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 22, opacity: .4 }}>{s.emoji}</div>
                    <div>
                      <div style={{ fontSize: 10 }}>未收集</div>
                      <div style={{ fontSize: 11, fontWeight: 700, marginTop: 2 }}>{t.short}</div>
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: 'var(--fg2)', padding: '6px 0',
          textAlign: 'center',
        }}>
          {n === 3 ? '🎉 收集完成 · 你是行前達人' : '點卡片查看、看完自動收集'}
        </div>
      </SectionCard>
      <VoucherBlock order={order} />
      <PriceBlock order={order} />
      {page && (
        <SubFrame title={items.find(x => x.k === page).title} onBack={() => setPage(null)}
          footer={
            <button onClick={() => complete(page)} style={{
              width: '100%', padding: '12px', borderRadius: 10,
              background: cardStyles[page].bg, color: '#fff', border: 0,
              fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              {cardStyles[page].emoji} 收藏這張卡
            </button>
          }>
          <SectionCard><BodyFor k={page} order={order} /></SectionCard>
        </SubFrame>
      )}
    </Page>
  );
};

// ═════════════════════ F9 · Map Quest ════════════════════════════
// hub 上一條地圖小徑、角色每完成一項走一站
const ScreenF9 = ({ order }) => {
  const [page, setPage] = React.useState(null);
  const [done, setDone] = React.useState(new Set());
  const items = taskMeta(order);
  const complete = (k) => { setDone(d => new Set([...d, k])); setPage(null); };
  const n = done.size, total = items.length;
  const stops = [
    { k: 'meet', x: 18, y: 70 },
    { k: 'call', x: 50, y: 30 },
    { k: 'tip', x: 82, y: 60 },
  ];
  const pos = n === 0 ? { x: 5, y: 85 } : stops[Math.min(n - 1, total - 1)];

  return (
    <Page style={{ position: 'relative' }}>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard padded={false} style={{ overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <KKIcon name="flash_line" size={18} color="var(--kk-color-cyan-10)" />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>出發前小旅程</h3>
          <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700,
            color: n === total ? '#048C66' : 'var(--kk-color-cyan-10)' }}>{n} / {total}</span>
        </div>
        <div style={{
          position: 'relative', height: 180,
          background: 'linear-gradient(180deg, #E8F5E9 0%, #F5EED3 100%)',
          overflow: 'hidden',
        }}>
          {/* 虛線路徑 */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
          }}>
            <path d="M 5 85 Q 20 50 50 30 T 95 60"
              stroke="#A0B0A0" strokeWidth="0.6" fill="none"
              strokeDasharray="2 1.5" />
          </svg>
          {/* 站點 */}
          {stops.map((s, i) => {
            const t = items.find(x => x.k === s.k);
            const isDone = done.has(s.k);
            return (
              <button key={s.k} onClick={() => setPage(s.k)} style={{
                position: 'absolute',
                left: `${s.x}%`, top: `${s.y}%`,
                transform: 'translate(-50%, -50%)',
                width: 44, height: 44, borderRadius: 22,
                background: isDone ? '#048C66' : '#fff',
                border: isDone ? 'none' : '2.5px solid var(--kk-color-cyan-10)',
                cursor: 'pointer', padding: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,.15)',
                fontFamily: 'inherit',
              }}>
                <KKIcon name={isDone ? 'check_line' : t.icon} size={18}
                  color={isDone ? '#fff' : 'var(--kk-color-cyan-10)'} />
              </button>
            );
          })}
          {/* 角色 */}
          <div style={{
            position: 'absolute',
            left: `${pos.x}%`, top: `${pos.y}%`,
            transform: 'translate(-50%, -110%)',
            fontSize: 22,
            transition: 'left .6s ease, top .6s ease',
          }}>🚶</div>
          {/* 終點 */}
          <div style={{
            position: 'absolute', right: 8, top: 52,
            fontSize: 24, opacity: n === total ? 1 : .4,
          }}>🏁</div>
        </div>
        <div style={{ padding: 12, display: 'flex', gap: 6, justifyContent: 'center' }}>
          {items.map(t => {
            const isDone = done.has(t.k);
            return (
              <div key={t.k} style={{
                padding: '4px 10px', borderRadius: 12,
                background: isDone ? '#E8F7EF' : 'var(--bg3)',
                fontSize: 10, fontWeight: 600,
                color: isDone ? '#048C66' : 'var(--fg2)',
              }}>{isDone ? '✓ ' : ''}{t.short}</div>
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
              background: 'var(--bg-brand)', color: '#fff', border: 0,
              fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}>🚶 繼續旅程 · 回主頁</button>
          }>
          <SectionCard><BodyFor k={page} order={order} /></SectionCard>
        </SubFrame>
      )}
    </Page>
  );
};

// ═════════════════════ F10 · Sticker Reward ══════════════════════
const ScreenF10 = ({ order }) => {
  const [page, setPage] = React.useState(null);
  const [done, setDone] = React.useState(new Set());
  const [celebrate, setCelebrate] = React.useState(false);
  const items = taskMeta(order);
  const complete = (k) => {
    setDone(d => {
      const n = new Set([...d, k]);
      if (n.size === items.length) setCelebrate(true);
      return n;
    });
    setPage(null);
  };
  const n = done.size, total = 3;

  return (
    <Page style={{ position: 'relative' }}>
      <TopBar />
      <StatusStrip order={order} />
      <div style={{ height: 12 }} />
      <ProductBlock order={order} />
      <SectionCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <KKIcon name="flash_line" size={18} color="var(--kk-color-cyan-10)" />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>看完解鎖限定貼圖</h3>
          <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700,
            color: n === total ? '#048C66' : 'var(--kk-color-cyan-10)' }}>{n} / {total}</span>
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
                <div style={{ fontSize: 13, fontWeight: 600,
                  textDecoration: isDone ? 'line-through' : 'none',
                  color: isDone ? 'var(--fg2)' : 'var(--fg1)',
                }}>{t.title}</div>
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
        <SubFrame title={items.find(x => x.k === page).title} onBack={() => setPage(null)}
          footer={
            <button onClick={() => complete(page)} style={{
              width: '100%', padding: '12px', borderRadius: 10,
              background: 'var(--bg-brand)', color: '#fff', border: 0,
              fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}>看完了 · 回主頁</button>
          }>
          <SectionCard><BodyFor k={page} order={order} /></SectionCard>
        </SubFrame>
      )}
      {celebrate && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)',
          zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20, animation: 'fadeIn .3s',
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: 24,
            textAlign: 'center', maxWidth: 320, width: '100%',
            animation: 'pop .5s',
          }}>
            <div style={{
              width: 180, height: 180, margin: '0 auto 16px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, #FFE5B4 0%, #FFD0A0 50%, #FFAA7D 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 6,
              boxShadow: '0 8px 24px rgba(255,170,125,.4)',
            }}>
              <div style={{ fontSize: 56 }}>🎒</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#6B3410' }}>
                我準備好了
              </div>
              <div style={{ fontSize: 10, color: '#8B5A2B' }}>
                {order.departure.shortDate} · 東京
              </div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
              🎉 準備完成！
            </div>
            <div style={{ fontSize: 12, color: 'var(--fg2)', marginBottom: 16,
              lineHeight: '18px',
            }}>
              你已確認集合、聯絡、提醒三項<br/>
              獲得限定旅程貼圖一枚
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setCelebrate(false)} style={{
                flex: 1, padding: '10px', borderRadius: 8,
                background: 'transparent', color: 'var(--fg1)',
                border: '1px solid var(--border1)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}>知道了</button>
              <button onClick={() => setCelebrate(false)} style={{
                flex: 1, padding: '10px', borderRadius: 8,
                background: 'var(--bg-brand)', color: '#fff', border: 0,
                fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>分享貼圖</button>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
};

Object.assign(window, { ScreenF6, ScreenF7, ScreenF8, ScreenF9, ScreenF10 });
