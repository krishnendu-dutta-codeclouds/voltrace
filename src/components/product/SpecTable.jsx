/**
 * SpecTable — product technical specifications (Tailwind CSS v4).
 */
function humanize(k) {
  return k
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

export default function SpecTable({ specs }) {
  const rows = Object.entries(specs ?? {});
  if (rows.length === 0) return null;

  return (
    <dl className="divide-y divide-border">
      {rows.map(([key, value]) => (
        <div key={key} className="flex items-center justify-between py-3">
          <dt className="text-[13px] font-semibold text-ink-muted capitalize">{humanize(key)}</dt>
          <dd className="text-[14px] font-bold text-ink text-right">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
