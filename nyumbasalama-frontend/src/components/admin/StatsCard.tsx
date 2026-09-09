'use client';

interface StatsCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: string;
}

export default function StatsCard({ icon: Icon, label, value, color = 'text-orange-500' }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500 mt-0.5">{label}</p>
        </div>
      </div>
    </div>
  );
}
