using ExamenAPI.Models;

namespace ExamenAPI.Data
{
    public interface IDatabaseService
    {
        Task<Empleado?> AltaEmpleadoAsync(string nombre);
        Task<Empleado?> BajaEmpleadoAsync(int idEmpleado);
        Task<Empleado?> CambioEmpleadoAsync(int idEmpleado, string nombre);
        Task<List<Empleado>> ObtenerEmpleadosAsync(bool soloActivos = false);
        Task<Empleado?> ObtenerEmpleadoPorIdAsync(int idEmpleado);
        Task<List<Movimiento>> ObtenerMovimientosAsync(int? idEmpleado = null, string? tipoMovimiento = null);
    }
}
