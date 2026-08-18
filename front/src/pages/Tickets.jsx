const ticketsDummy = [
  { id: 1, titulo: 'AC no funciona', habitacion: '101', prioridad: 'Alta', asignado: 'Mantenimiento', status: 'Abierto' },
  { id: 2, titulo: 'Limpieza extra solicitada', habitacion: '202', prioridad: 'Media', asignado: 'Limpieza', status: 'En progreso' },
  { id: 3, titulo: 'Toallas adicionales', habitacion: '308', prioridad: 'Baja', asignado: 'Housekeeping', status: 'Cerrado' },
  { id: 4, titulo: 'TV sin señal', habitacion: 'Suite 205', prioridad: 'Media', asignado: 'Técnico', status: 'Abierto' },
  { id: 5, titulo: 'Room service - desayuno', habitacion: '112', prioridad: 'Baja', asignado: 'Cocina', status: 'En progreso' },
];

const prioridadColors = {
  Alta: 'bg-red-100 text-red-700',
  Media: 'bg-yellow-100 text-yellow-700',
  Baja: 'bg-blue-100 text-blue-700',
};

const statusColors = {
  Abierto: 'bg-green-100 text-green-700',
  'En progreso': 'bg-purple-100 text-purple-700',
  Cerrado: 'bg-gray-100 text-gray-700',
};

function Tickets() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tickets</h2>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['ID', 'Título', 'Habitación', 'Prioridad', 'Asignado', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ticketsDummy.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">#{t.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{t.titulo}</td>
                  <td className="px-4 py-3 text-gray-600">{t.habitacion}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${prioridadColors[t.prioridad]}`}>
                      {t.prioridad}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{t.asignado}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[t.status]}`}>
                      {t.status}
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

export default Tickets;
