namespace ExamenAPI.Models
{
    /// <summary>
    /// Modelo que representa un movimiento (bitácora) en el sistema.
    /// </summary>
    public class Movimiento
    {
        public int IdMovimiento { get; set; }
        public int IdEmpleado { get; set; }
        public string NombreEmpleado { get; set; } = string.Empty;
        public string TipoMovimiento { get; set; } = string.Empty;
        public DateTime FechaMovimiento { get; set; }
    }
}
