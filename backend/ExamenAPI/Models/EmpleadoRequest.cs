using System.ComponentModel.DataAnnotations;

namespace ExamenAPI.Models
{
    /// <summary>
    /// DTO para las solicitudes de Alta y Cambio de empleado.
    /// </summary>
    public class EmpleadoRequest
    {
        [Required(ErrorMessage = "El nombre del empleado es obligatorio.")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "El nombre debe tener entre 1 y 100 caracteres.")]
        public string Nombre { get; set; } = string.Empty;
    }
}
