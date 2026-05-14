import { Mail, Users, FileText, TrendingUp } from 'lucide-react';

const stats = [
  {
    title: 'Total Invitations',
    value: '2,345',
    change: '+12.5%',
    icon: Mail,
    color: 'bg-blue-500',
  },
  {
    title: 'Active Users',
    value: '1,289',
    change: '+8.2%',
    icon: Users,
    color: 'bg-green-500',
  },
  {
    title: 'Templates',
    value: '24',
    change: '+2',
    icon: FileText,
    color: 'bg-purple-500',
  },
  {
    title: 'Conversion Rate',
    value: '68.5%',
    change: '+3.1%',
    icon: TrendingUp,
    color: 'bg-orange-500',
  },
];

export default function AnalyticsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 text-sm font-medium">
                {stat.title}
              </h3>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-bold text-gray-900">
                {stat.value}
              </p>
              <span className="text-green-600 text-sm font-medium">
                {stat.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
