using ExamenAPI.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace ExamenAPI.Data
{
    /// <summary>
    /// Servicio de acceso a datos que ejecuta todos los Stored Procedures
    /// del sistema de gestión de empleados.
    /// </summary>
    public class DatabaseService : IDatabaseService
    {
        private readonly string _connectionString;

        public DatabaseService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' no encontrada.");
        }

        /// <summary>
        /// Alta de empleado - Ejecuta sp_AltaEmpleado
        /// </summary>
        public async Task<Empleado?> AltaEmpleadoAsync(string nombre)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_AltaEmpleado", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@Nombre", nombre);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return MapEmpleado(reader);
            }

            return null;
        }

        /// <summary>
        /// Baja lógica de empleado - Ejecuta sp_BajaEmpleado
        /// </summary>
        public async Task<Empleado?> BajaEmpleadoAsync(int idEmpleado)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_BajaEmpleado", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@IdEmpleado", idEmpleado);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return MapEmpleado(reader);
            }

            return null;
        }

        /// <summary>
        /// Cambio/Actualización de empleado - Ejecuta sp_CambioEmpleado
        /// </summary>
        public async Task<Empleado?> CambioEmpleadoAsync(int idEmpleado, string nombre)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_CambioEmpleado", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@IdEmpleado", idEmpleado);
            command.Parameters.AddWithValue("@Nombre", nombre);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return MapEmpleado(reader);
            }

            return null;
        }

        /// <summary>
        /// Obtener lista de empleados - Ejecuta sp_ObtenerEmpleados
        /// </summary>
        public async Task<List<Empleado>> ObtenerEmpleadosAsync(bool soloActivos = false)
        {
            var empleados = new List<Empleado>();

            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_ObtenerEmpleados", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@SoloActivos", soloActivos);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                empleados.Add(MapEmpleado(reader));
            }

            return empleados;
        }

        /// <summary>
        /// Obtener empleado por Id - Ejecuta sp_ObtenerEmpleadoPorId
        /// </summary>
        public async Task<Empleado?> ObtenerEmpleadoPorIdAsync(int idEmpleado)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_ObtenerEmpleadoPorId", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@IdEmpleado", idEmpleado);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return MapEmpleado(reader);
            }

            return null;
        }

        /// <summary>
        /// Obtener bitácora de movimientos - Ejecuta sp_ObtenerMovimientos
        /// </summary>
        public async Task<List<Movimiento>> ObtenerMovimientosAsync(int? idEmpleado = null, string? tipoMovimiento = null)
        {
            var movimientos = new List<Movimiento>();

            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_ObtenerMovimientos", connection);
            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.AddWithValue("@IdEmpleado", (object?)idEmpleado ?? DBNull.Value);
            command.Parameters.AddWithValue("@TipoMovimiento", (object?)tipoMovimiento ?? DBNull.Value);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                movimientos.Add(new Movimiento
                {
                    IdMovimiento = reader.GetInt32(reader.GetOrdinal("IdMovimiento")),
                    IdEmpleado = reader.GetInt32(reader.GetOrdinal("IdEmpleado")),
                    NombreEmpleado = reader.GetString(reader.GetOrdinal("NombreEmpleado")),
                    TipoMovimiento = reader.GetString(reader.GetOrdinal("TipoMovimiento")),
                    FechaMovimiento = reader.GetDateTime(reader.GetOrdinal("FechaMovimiento"))
                });
            }

            return movimientos;
        }

        /// <summary>
        /// Mapea un SqlDataReader a un objeto Empleado.
        /// </summary>
        private static Empleado MapEmpleado(SqlDataReader reader)
        {
            return new Empleado
            {
                IdEmpleado = reader.GetInt32(reader.GetOrdinal("IdEmpleado")),
                Nombre = reader.GetString(reader.GetOrdinal("Nombre")),
                Activo = reader.GetBoolean(reader.GetOrdinal("Activo")),
                FechaAlta = reader.GetDateTime(reader.GetOrdinal("FechaAlta")),
                FechaModificacion = reader.IsDBNull(reader.GetOrdinal("FechaModificacion"))
                    ? null
                    : reader.GetDateTime(reader.GetOrdinal("FechaModificacion"))
            };
        }
    }
}
