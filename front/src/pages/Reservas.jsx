const reservasDummy = [
  { id: 1, huesped: 'Carlos Ruiz', habitacion: '101', entrada: '2024-06-01', salida: '2024-06-05', status: 'Confirmada' },
  { id: 2, huesped: 'Ana López', habitacion: 'Suite 205', entrada: '2024-06-03', salida: '2024-06-07', status: 'Confirmada' },
  { id: 3, huesped: 'Pedro Martín', habitacion: '308', entrada: '2024-06-05', salida: '2024-06-08', status: 'Pendiente' },
  { id: 4, huesped: 'María García', habitacion: '112', entrada: '2024-06-10', salida: '2024-06-12', status: 'Cancelada' },
  { id: 5, huesped: 'Luis Fernández', habitacion: '220', entrada: '2024-06-15', salida: '2024-06-20', status: 'Confirmada' },
];

const statusColors = {
  Confirmada: 'bg-green-100 text-green-700',
  Pendiente: 'bg-yellow-100 text-yellow-700',
  Cancelada: 'bg-red-100 text-red-700',
};

function Reservas() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reservas</h2>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['ID', 'Huésped', 'Habitación', 'Entrada', 'Salida', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reservasDummy.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">#{r.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{r.huesped}</td>
                  <td className="px-4 py-3 text-gray-600">{r.habitacion}</td>
                  <td className="px-4 py-3 text-gray-600">{r.entrada}</td>
                  <td className="px-4 py-3 text-gray-600">{r.salida}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reservas;
