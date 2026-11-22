import { Building2, Users, Inbox, Heart, Activity } from "lucide-react";
function metricIcon(title) {
  if (/user|registr/i.test(title)) return Users;
  if (/request|rental/i.test(title)) return Inbox;
  if (/propert/i.test(title)) return Building2;
  return /wishlist/i.test(title) ? Heart : Activity;
}
export default function MetricOverview({ title, metrics }) {
  return <section className="bn-overview"><h1>{title}</h1><dl className="bn-metrics">
    {metrics.map(({ title: label, value }) => { const Icon = metricIcon(label); return <div key={label}>
      <dt><Icon size={18}/>{label}</dt><dd>{Number(value ?? 0).toLocaleString()}</dd>
    </div>; })}
  </dl></section>;
}
