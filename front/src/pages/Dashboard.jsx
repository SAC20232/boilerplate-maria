const stats = [
  { label: 'Reservas Totales', value: '1,284', change: '+12%', color: 'blue' },
  { label: 'Contratos Activos', value: '347', change: '+5%', color: 'green' },
  { label: 'Tickets Abiertos', value: '89', change: '-3%', color: 'yellow' },
  { label: 'Ingresos del Mes', value: '€48,320', change: '+18%', color: 'purple' },
];

function StatCard({ label, value, change, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <span
        className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${colors[color]}`}
      >
        {change} vs mes anterior
      </span>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Reservas Recientes</h3>
          <div className="space-y-3">
            {[
              'Habitación 101 - Carlos Ruiz',
              'Suite 205 - Ana López',
              'Habitación 308 - Pedro Martín',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <span className="text-sm text-gray-600">{item}</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                  Confirmada
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Tickets Pendientes</h3>
          <div className="space-y-3">
            {[
              'Solicitud mantenimiento AC',
              'Limpieza extra habitación 202',
              'Pedido room service',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <span className="text-sm text-gray-600">{item}</span>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                  Pendiente
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
