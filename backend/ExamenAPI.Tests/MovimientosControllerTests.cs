using ExamenAPI.Controllers;
using ExamenAPI.Data;
using ExamenAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace ExamenAPI.Tests.Controllers
{
    public class MovimientosControllerTests
    {
        private readonly Mock<IDatabaseService> _mockDb;
        private readonly MovimientosController _controller;

        public MovimientosControllerTests()
        {
            _mockDb = new Mock<IDatabaseService>();
            _controller = new MovimientosController(_mockDb.Object);
        }

        [Fact]
        public async Task GetMovimientos_ReturnsOkResult_WithListOfMovimientos()
        {
            // Arrange
            var mockMovimientos = new List<Movimiento>
            {
                new Movimiento { IdMovimiento = 1, IdEmpleado = 1, TipoMovimiento = "Alta", FechaMovimiento = DateTime.Now }
            };
            _mockDb.Setup(db => db.ObtenerMovimientosAsync(null, null)).ReturnsAsync(mockMovimientos);

            // Act
            var result = await _controller.GetMovimientos(null, null);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<ApiResponse<List<Movimiento>>>(okResult.Value);
            Assert.Single(response.Data);
        }
    }
}
