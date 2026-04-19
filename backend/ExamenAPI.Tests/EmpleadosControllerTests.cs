using ExamenAPI.Controllers;
using ExamenAPI.Data;
using ExamenAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace ExamenAPI.Tests.Controllers
{
    public class EmpleadosControllerTests
    {
        private readonly Mock<IDatabaseService> _mockDb;
        private readonly EmpleadosController _controller;

        public EmpleadosControllerTests()
        {
            _mockDb = new Mock<IDatabaseService>();
            _controller = new EmpleadosController(_mockDb.Object);
        }

        [Fact]
        public async Task GetEmpleados_ReturnsOkResult_WithListOfEmpleados()
        {
            // Arrange
            var mockEmpleados = new List<Empleado>
            {
                new Empleado { IdEmpleado = 1, Nombre = "Juan Perez", Activo = true },
                new Empleado { IdEmpleado = 2, Nombre = "Maria Lopez", Activo = true }
            };
            _mockDb.Setup(db => db.ObtenerEmpleadosAsync(false)).ReturnsAsync(mockEmpleados);

            // Act
            var result = await _controller.GetEmpleados(false);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<ApiResponse<List<Empleado>>>(okResult.Value);
            Assert.True(response.Success);
            Assert.Equal(2, response.Data.Count);
        }

        [Fact]
        public async Task GetEmpleado_ReturnsNotFound_WhenEmployeeDoesNotExist()
        {
            // Arrange
            _mockDb.Setup(db => db.ObtenerEmpleadoPorIdAsync(99)).ReturnsAsync((Empleado)null);

            // Act
            var result = await _controller.GetEmpleado(99);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task CreateEmpleado_ReturnsCreated_WhenValid()
        {
            // Arrange
            var request = new EmpleadoRequest { Nombre = "Nuevo Empleado" };
            var createdEmpleado = new Empleado { IdEmpleado = 10, Nombre = "Nuevo Empleado", Activo = true };
            _mockDb.Setup(db => db.AltaEmpleadoAsync(request.Nombre)).ReturnsAsync(createdEmpleado);

            // Act
            var result = await _controller.CreateEmpleado(request);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var response = Assert.IsType<ApiResponse<Empleado>>(createdResult.Value);
            Assert.Equal("Nuevo Empleado", response.Data.Nombre);
        }
    }
}
