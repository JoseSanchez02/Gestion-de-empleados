using ExamenAPI.Data;
using ExamenAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace ExamenAPI.Controllers
{
    /// <summary>
    /// Controlador REST para la gestión de empleados.
    /// Todas las operaciones se realizan mediante Stored Procedures.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class EmpleadosController : ControllerBase
    {
        private readonly IDatabaseService _db;

        public EmpleadosController(IDatabaseService db)
        {
            _db = db;
        }

        /// <summary>
        /// Obtiene la lista de empleados.
        /// GET /api/empleados?soloActivos=true
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<Empleado>>>> GetEmpleados([FromQuery] bool soloActivos = false)
        {
            try
            {
                var empleados = await _db.ObtenerEmpleadosAsync(soloActivos);
                return Ok(ApiResponse<List<Empleado>>.Ok(empleados, $"Se encontraron {empleados.Count} empleados."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<Empleado>>.Error($"Error al obtener empleados: {ex.Message}"));
            }
        }

        /// <summary>
        /// Obtiene un empleado por su Id.
        /// GET /api/empleados/5
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<Empleado>>> GetEmpleado(int id)
        {
            try
            {
                var empleado = await _db.ObtenerEmpleadoPorIdAsync(id);
                if (empleado == null)
                {
                    return NotFound(ApiResponse<Empleado>.Error($"No se encontró el empleado con Id {id}."));
                }
                return Ok(ApiResponse<Empleado>.Ok(empleado));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<Empleado>.Error($"Error al obtener empleado: {ex.Message}"));
            }
        }

        /// <summary>
        /// Alta de un nuevo empleado.
        /// POST /api/empleados
        /// Body: { "nombre": "Juan Pérez" }
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ApiResponse<Empleado>>> CreateEmpleado([FromBody] EmpleadoRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = string.Join("; ", ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage));
                return BadRequest(ApiResponse<Empleado>.Error(errors));
            }

            try
            {
                var empleado = await _db.AltaEmpleadoAsync(request.Nombre);
                if (empleado == null)
                {
                    return StatusCode(500, ApiResponse<Empleado>.Error("No se pudo crear el empleado."));
                }
                return CreatedAtAction(
                    nameof(GetEmpleado),
                    new { id = empleado.IdEmpleado },
                    ApiResponse<Empleado>.Ok(empleado, "Empleado creado exitosamente.")
                );
            }
            catch (Microsoft.Data.SqlClient.SqlException ex)
            {
                return BadRequest(ApiResponse<Empleado>.Error(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<Empleado>.Error($"Error al crear empleado: {ex.Message}"));
            }
        }

        /// <summary>
        /// Actualización (Cambio) de un empleado existente.
        /// PUT /api/empleados/5
        /// Body: { "nombre": "Juan Pérez Actualizado" }
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<Empleado>>> UpdateEmpleado(int id, [FromBody] EmpleadoRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = string.Join("; ", ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage));
                return BadRequest(ApiResponse<Empleado>.Error(errors));
            }

            try
            {
                var empleado = await _db.CambioEmpleadoAsync(id, request.Nombre);
                if (empleado == null)
                {
                    return NotFound(ApiResponse<Empleado>.Error($"No se encontró el empleado con Id {id}."));
                }
                return Ok(ApiResponse<Empleado>.Ok(empleado, "Empleado actualizado exitosamente."));
            }
            catch (Microsoft.Data.SqlClient.SqlException ex)
            {
                return BadRequest(ApiResponse<Empleado>.Error(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<Empleado>.Error($"Error al actualizar empleado: {ex.Message}"));
            }
        }

        /// <summary>
        /// Baja lógica de un empleado (cambia estatus a inactivo).
        /// DELETE /api/empleados/5
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<Empleado>>> DeleteEmpleado(int id)
        {
            try
            {
                var empleado = await _db.BajaEmpleadoAsync(id);
                if (empleado == null)
                {
                    return NotFound(ApiResponse<Empleado>.Error($"No se encontró el empleado con Id {id}."));
                }
                return Ok(ApiResponse<Empleado>.Ok(empleado, "Empleado dado de baja exitosamente."));
            }
            catch (Microsoft.Data.SqlClient.SqlException ex)
            {
                return BadRequest(ApiResponse<Empleado>.Error(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<Empleado>.Error($"Error al dar de baja empleado: {ex.Message}"));
            }
        }
    }
}
