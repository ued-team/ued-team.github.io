// Base reference screen — full un-compressed order detail with multiple meeting points

const ScreenBase = ({ order }) => (
  <Page>
    <TopBar />
    <StatusStrip order={order} />
    <div style={{ height: 12 }} />
    <ProductBlock order={order} />
    {/* Classic meeting section — each point in full detail */}
    {order.meetingPoints.map((mp, i) => (
      <SectionCard key={mp.id}>
        {i === 0 && <SectionHeader title="集合地點" icon="location_line" />}
        <MeetingPointFull mp={mp} idx={i} total={order.meetingPoints.length} />
      </SectionCard>
    ))}
    <ReminderFull order={order} />
    <VoucherBlock order={order} />
    <ContactBlock order={order} />
    <PriceBlock order={order} />
  </Page>
);

Object.assign(window, { ScreenBase });
