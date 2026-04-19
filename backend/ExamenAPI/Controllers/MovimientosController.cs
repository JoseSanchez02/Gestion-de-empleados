using ExamenAPI.Data;
using ExamenAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace ExamenAPI.Controllers
{
    /// <summary>
    /// Controlador REST para la consulta de la bitácora de movimientos.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class MovimientosController : ControllerBase
    {
        private readonly IDatabaseService _db;

        public MovimientosController(IDatabaseService db)
        {
            _db = db;
        }

        /// <summary>
        /// Obtiene la bitácora de movimientos con filtros opcionales.
        /// GET /api/movimientos?idEmpleado=5&tipoMovimiento=Alta
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<Movimiento>>>> GetMovimientos(
            [FromQuery] int? idEmpleado = null,
            [FromQuery] string? tipoMovimiento = null)
        {
            try
            {
                var movimientos = await _db.ObtenerMovimientosAsync(idEmpleado, tipoMovimiento);
                return Ok(ApiResponse<List<Movimiento>>.Ok(movimientos, $"Se encontraron {movimientos.Count} movimientos."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<Movimiento>>.Error($"Error al obtener movimientos: {ex.Message}"));
            }
        }
    }
}
