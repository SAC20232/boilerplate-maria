import { useEffect, useState } from 'react';
import ContratoModal from '../components/ContratoModal.jsx';
import { contratosApi } from '../utils/api.js';
import { formatDate } from '../utils/helpers.js';

const statusColors = {
  'Pendiente de firma': 'bg-yellow-100 text-yellow-700',
  Firmado: 'bg-green-100 text-green-700',
  Cancelado: 'bg-red-100 text-red-700',
};

function Contratos() {
  const [contratos, setContratos] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filtros, setFiltros] = useState({ nombre: '', status: '' });

  async function fetchContratos(page = 1) {
    setLoading(true);
    try {
      const { data } = await contratosApi.getAll(page, filtros);
      setContratos(data.data || []);
      setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      console.error('Error fetching contratos:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContratos(pagination.page);
  }, [pagination.page]);

  async function handleAction(action, id) {
    try {
      if (action === 'cancelar') await contratosApi.cancelar(id);
      if (action === 'firmar') await contratosApi.firmar(id);
      if (action === 'reenviar') await contratosApi.reenviar(id);
      if (action === 'editar') {
        // TODO: implement edit modal
        alert(`Editar contrato #${id} - funcionalidad pendiente`);
        return;
      }
      fetchContratos(pagination.page);
    } catch (err) {
      console.error(`Error on action ${action}:`, err);
    }
  }

  function handleNewContrato(newContrato) {
    setContratos((prev) => [newContrato, ...prev]);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Contratos</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Nuevo Contrato
        </button>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Buscar por nombre</label>
          <input
            type="text"
            placeholder="Ej. Juan..."
            value={filtros.nombre}
            onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filtros.status}
            onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="Pendiente de firma">Pendiente de firma</option>
            <option value="Firmado">Firmado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
        <button
          onClick={() => fetchContratos(1)} // Al buscar, siempre regresamos a la página 1
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 border border-gray-300"
        >
          Buscar
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className='overflow-x-auto'>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Nombre', 'Apellidos', 'Teléfono', 'Email', 'Fecha Reserva', 'Contrato', 'Status', 'Acciones'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">Cargando...</td>
                </tr>
              ) : contratos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">No hay contratos</td>
                </tr>
              ) : (
                contratos.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{c.nombre}</td>
                    <td className="px-4 py-3 text-gray-600">{c.apellidos}</td>
                    <td className="px-4 py-3 text-gray-600">{c.telefono}</td>
                    <td className="px-4 py-3 text-gray-600">{c.email}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(c.fecha_reserva)}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{c.contrato || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[c.status] || 'bg-gray-100 text-gray-700'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleAction('editar', c.id)} className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100">Editar</button>
                        <button onClick={() => handleAction('reenviar', c.id)} className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded hover:bg-gray-100">Reenviar</button>
                        <button onClick={() => handleAction('cancelar', c.id)} className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100">Cancelar</button>
                        <button onClick={() => handleAction('firmar', c.id)} className="px-2 py-1 text-xs bg-green-50 text-green-600 rounded hover:bg-green-100">Firmar</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-sm text-gray-500">
              Página {pagination.page} de {pagination.totalPages} ({pagination.total} registros)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page <= 1}
                className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <ContratoModal
          onClose={() => setShowModal(false)}
          onSuccess={handleNewContrato}
        />
      )}
    </div>
  );
}

export default Contratos;
