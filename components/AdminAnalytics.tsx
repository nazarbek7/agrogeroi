import React from "react";
import prisma from "@/utils/db";
import { FaArrowDown, FaArrowUp, FaTriangleExclamation } from "react-icons/fa6";
import { plural } from "@/lib/utils";

/**
 * Chart ink. Every chart here plots ONE series (magnitude), so there is a single
 * series colour rather than a categorical palette — a value-ramp across nominal
 * bars would double-encode length as hue.
 *
 * SERIES is a lightened step of the brand green: brand #345509 itself sits at
 * OKLCH L 0.409, outside the 0.43–0.77 band a mark colour needs. #4a7a0d passes
 * the lightness band, chroma floor and 3:1 contrast against the white card.
 */
const SERIES = "#4a7a0d";
const TRACK = "#eaf1dd";
const GRID = "#e1e0d9";
const AXIS_INK = "#898781";

const STATUS_LABELS: Record<string, string> = {
  pending: "В ожидании",
  processing: "Обрабатывается",
  confirmed: "Подтверждён",
  shipped: "Отправлен",
  delivered: "Доставлен",
  canceled: "Отменён",
};

const som = (value: number) => `${value.toLocaleString("ru-RU")} сом`;

const dayKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

/** Round an axis maximum up to a readable number (1 200 → 1 500, 6 550 → 7 000). */
const niceMax = (value: number) => {
  if (value <= 0) return 100;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / (magnitude / 2)) * (magnitude / 2);
};

const loadAnalytics = async () => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const from14 = new Date(startOfToday);
  from14.setDate(from14.getDate() - 13);
  const from7 = new Date(startOfToday);
  from7.setDate(from7.getDate() - 6);
  const prev7 = new Date(startOfToday);
  prev7.setDate(prev7.getDate() - 13);

  const [orders, recentOrders, orderItems, outOfStock] = await Promise.all([
    prisma.customer_order.findMany({ select: { total: true, status: true } }),
    prisma.customer_order.findMany({
      where: { dateTime: { gte: prev7 } },
      select: { total: true, dateTime: true },
    }),
    // small table for a nursery catalogue; only two light fields are selected
    prisma.customer_order_product.findMany({
      select: { productId: true, quantity: true },
    }),
    prisma.product.count({ where: { isActive: true, inStock: { lte: 0 } } }),
  ]);

  const revenue = orders.reduce((sum, order) => sum + (order.total ?? 0), 0);
  const orderCount = orders.length;

  const byStatus = Object.keys(STATUS_LABELS).map((status) => ({
    status,
    label: STATUS_LABELS[status],
    count: orders.filter((order) => order.status === status).length,
  }));
  const unknownStatusCount = orders.filter(
    (order) => !STATUS_LABELS[order.status]
  ).length;

  // 14 day buckets, zero-filled — a missing day must render as 0, not be skipped
  const days: { key: string; date: Date; revenue: number }[] = [];
  for (let offset = 13; offset >= 0; offset--) {
    const date = new Date(startOfToday);
    date.setDate(date.getDate() - offset);
    days.push({ key: dayKey(date), date, revenue: 0 });
  }
  const dayIndex = new Map(days.map((day, index) => [day.key, index]));

  let revenue7 = 0;
  let revenuePrev7 = 0;
  for (const order of recentOrders) {
    if (!order.dateTime) continue;
    const when = new Date(order.dateTime);
    const index = dayIndex.get(dayKey(when));
    if (index !== undefined) days[index].revenue += order.total ?? 0;
    if (when >= from7) revenue7 += order.total ?? 0;
    else if (when >= prev7) revenuePrev7 += order.total ?? 0;
  }

  const units = new Map<string, number>();
  for (const item of orderItems) {
    units.set(item.productId, (units.get(item.productId) ?? 0) + item.quantity);
  }
  const topIds = [...units.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([productId]) => productId);
  const topProductRows = topIds.length
    ? await prisma.product.findMany({
        where: { id: { in: topIds } },
        select: { id: true, title: true, price: true },
      })
    : [];
  const topProducts = topIds
    .map((id) => {
      const product = topProductRows.find((row) => row.id === id);
      return product
        ? { id, title: product.title, units: units.get(id) ?? 0 }
        : null;
    })
    .filter(Boolean) as { id: string; title: string; units: number }[];

  return {
    revenue,
    orderCount,
    avgOrder: orderCount > 0 ? Math.round(revenue / orderCount) : 0,
    revenue7,
    revenuePrev7,
    outOfStock,
    byStatus,
    unknownStatusCount,
    days,
    topProducts,
  };
};

/** Bar with a 4px rounded data-end and a square baseline end. */
const columnPath = (x: number, y: number, width: number, height: number) => {
  const r = Math.min(4, height);
  return `M ${x} ${y + height} L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} L ${
    x + width - r
  } ${y} Q ${x + width} ${y} ${x + width} ${y + r} L ${x + width} ${y + height} Z`;
};

const StatTile = ({
  label,
  value,
  hint,
  delta,
  alert,
}: {
  label: string;
  value: string;
  hint?: string;
  delta?: { value: number; caption: string } | null;
  alert?: boolean;
}) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="mt-1.5 text-2xl font-semibold text-gray-900">{value}</p>
    {delta && (
      <p
        className={`mt-1.5 flex items-center gap-1.5 text-sm font-medium ${
          delta.value >= 0 ? "text-[#006300]" : "text-[#d03b3b]"
        }`}
      >
        {delta.value >= 0 ? (
          <FaArrowUp className="text-[10px]" />
        ) : (
          <FaArrowDown className="text-[10px]" />
        )}
        {delta.value >= 0 ? "+" : "−"}
        {Math.abs(delta.value)}%
        <span className="font-normal text-gray-400">{delta.caption}</span>
      </p>
    )}
    {hint && !delta && (
      <p
        className={`mt-1.5 flex items-center gap-1.5 text-sm ${
          alert ? "font-medium text-[#d03b3b]" : "text-gray-400"
        }`}
      >
        {alert && <FaTriangleExclamation className="text-[11px]" />}
        {hint}
      </p>
    )}
  </div>
);

/** Label + bar + value row. Track is a lighter step of the same ramp. */
const BarRow = ({
  label,
  value,
  max,
  suffix,
}: {
  label: string;
  value: number;
  max: number;
  suffix?: string;
}) => (
  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5">
    <p className="truncate text-sm text-gray-700" title={label}>
      {label}
    </p>
    <p className="text-sm font-semibold tabular-nums text-gray-900">
      {value.toLocaleString("ru-RU")}
      {suffix ? <span className="font-normal text-gray-400"> {suffix}</span> : null}
    </p>
    <div
      className="col-span-2 h-2.5 w-full overflow-hidden rounded-full"
      style={{ backgroundColor: TRACK }}
    >
      {value > 0 && (
        <div
          className="h-full rounded-r-[4px]"
          style={{
            width: `${Math.max((value / max) * 100, 1.5)}%`,
            backgroundColor: SERIES,
          }}
        />
      )}
    </div>
  </div>
);

const Card = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <h3 className="text-base font-semibold text-gray-900">{title}</h3>
    {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
    <div className="mt-5">{children}</div>
  </div>
);

const AdminAnalytics = async () => {
  let data: Awaited<ReturnType<typeof loadAnalytics>>;
  try {
    data = await loadAnalytics();
  } catch (error) {
    console.error("Analytics failed", error);
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-500 shadow-sm">
        Не удалось загрузить аналитику.
      </div>
    );
  }

  const deltaPercent =
    data.revenuePrev7 > 0
      ? Math.round(((data.revenue7 - data.revenuePrev7) / data.revenuePrev7) * 100)
      : null;

  // Column chart geometry — the viewBox includes the x-axis band so labels are
  // never cut off by the container.
  // wide aspect ratio on purpose: the SVG scales with the card width, so a
  // near-square viewBox would balloon to ~460px tall on a wide admin screen
  const W = 1200;
  const H = 250;
  const PAD = { top: 30, right: 12, bottom: 34, left: 64 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const band = plotW / data.days.length;
  // 20 viewBox units, not 24: the SVG is scaled up on a wide card, and the spec
  // caps the rendered bar at 24px
  const barW = Math.min(20, band - 10);
  const peak = Math.max(...data.days.map((day) => day.revenue));
  const axisMax = niceMax(peak);
  const peakIndex = data.days.findIndex((day) => day.revenue === peak && peak > 0);

  const statusMax = Math.max(...data.byStatus.map((row) => row.count), 1);
  const unitsMax = Math.max(...data.topProducts.map((row) => row.units), 1);

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-lg font-bold text-gray-900">Аналитика</h2>

      {/* Hero figure — the one number the dashboard leads with */}
      <div className="mb-4 grid grid-cols-4 gap-4 max-xl:grid-cols-2 max-sm:grid-cols-1">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Выручка всего</p>
          <p className="mt-1 text-5xl font-semibold leading-none text-gray-900 max-sm:text-4xl">
            {data.revenue.toLocaleString("ru-RU")}
          </p>
          <p className="mt-2 text-sm text-gray-400">
            сом · {data.orderCount}{" "}
            {plural(data.orderCount, ["заказ", "заказа", "заказов"])}
          </p>
        </div>
        <StatTile
          label="За последние 7 дней"
          value={som(data.revenue7)}
          delta={
            deltaPercent !== null
              ? { value: deltaPercent, caption: "к прошлой неделе" }
              : null
          }
          hint={deltaPercent === null ? "Нет данных за прошлую неделю" : undefined}
        />
        <StatTile label="Средний чек" value={som(data.avgOrder)} hint="За всё время" />
        <StatTile
          label="Нет в наличии"
          value={String(data.outOfStock)}
          hint={
            data.outOfStock > 0
              ? "Товары не видны покупателям"
              : "Все товары в наличии"
          }
          alert={data.outOfStock > 0}
        />
      </div>

      {/* Daily revenue — single series, one colour for every column */}
      <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">Выручка по дням</h3>
        <p className="mt-0.5 text-sm text-gray-500">
          Последние 14 дней · всего {som(data.days.reduce((s, d) => s + d.revenue, 0))}
        </p>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mt-5 w-full"
          role="img"
          aria-label="Выручка по дням за последние 14 дней"
        >
          {/* hairline solid gridlines, one step off the surface */}
          {[0, 0.5, 1].map((ratio) => {
            const y = PAD.top + plotH - plotH * ratio;
            return (
              <g key={ratio}>
                <line
                  x1={PAD.left}
                  y1={y}
                  x2={W - PAD.right}
                  y2={y}
                  stroke={GRID}
                  strokeWidth="1"
                />
                <text
                  x={PAD.left - 12}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill={AXIS_INK}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {Math.round(axisMax * ratio).toLocaleString("ru-RU")}
                </text>
              </g>
            );
          })}

          {data.days.map((day, index) => {
            const height = axisMax > 0 ? (day.revenue / axisMax) * plotH : 0;
            const x = PAD.left + index * band + (band - barW) / 2;
            const y = PAD.top + plotH - height;
            return (
              <g key={day.key} className="[&:hover>path]:opacity-80">
                <title>{`${day.date.toLocaleDateString("ru-RU")} — ${som(day.revenue)}`}</title>
                {/* invisible hit area so hover works on zero days too */}
                <rect
                  x={PAD.left + index * band}
                  y={PAD.top}
                  width={band}
                  height={plotH}
                  fill="transparent"
                />
                {height > 0 && (
                  <path d={columnPath(x, y, barW, height)} fill={SERIES} />
                )}
                {/* label only the peak — a value on every column goes unread */}
                {index === peakIndex && (
                  <text
                    x={x + barW / 2}
                    y={y - 10}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="600"
                    fill="#52514e"
                  >
                    {day.revenue.toLocaleString("ru-RU")}
                  </text>
                )}
                <text
                  x={PAD.left + index * band + band / 2}
                  y={H - 12}
                  textAnchor="middle"
                  fontSize="12"
                  fill={AXIS_INK}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {day.date.getDate()}
                </text>
              </g>
            );
          })}
        </svg>

        {/* table twin — values are never gated behind hover */}
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium text-brand hover:underline">
            Показать таблицей
          </summary>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="py-2 font-medium">Дата</th>
                <th className="py-2 text-right font-medium">Выручка</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {data.days.map((day) => (
                <tr key={day.key} className="border-b border-gray-50">
                  <td className="py-1.5 text-gray-600">
                    {day.date.toLocaleDateString("ru-RU")}
                  </td>
                  <td className="py-1.5 text-right text-gray-900">
                    {som(day.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </div>

      <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
        <Card
          title="Заказы по статусам"
          subtitle={`Всего ${data.orderCount}${
            data.unknownStatusCount > 0
              ? ` · ${data.unknownStatusCount} с другим статусом`
              : ""
          }`}
        >
          <div className="flex flex-col gap-4">
            {data.byStatus.map((row) => (
              <BarRow
                key={row.status}
                label={row.label}
                value={row.count}
                max={statusMax}
              />
            ))}
          </div>
        </Card>

        <Card title="Топ товаров" subtitle="По количеству проданных штук">
          {data.topProducts.length > 0 ? (
            <div className="flex flex-col gap-4">
              {data.topProducts.map((row) => (
                <BarRow
                  key={row.id}
                  label={row.title}
                  value={row.units}
                  max={unitsMax}
                  suffix="шт."
                />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-gray-400">
              Продаж пока не было.
            </p>
          )}
        </Card>
      </div>
    </section>
  );
};

export default AdminAnalytics;
