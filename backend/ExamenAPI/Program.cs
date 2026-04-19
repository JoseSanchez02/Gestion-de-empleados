using ExamenAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// =============================================
// Configuración de Servicios
// =============================================

// Registrar el servicio de acceso a datos (Stored Procedures)
builder.Services.AddScoped<IDatabaseService, DatabaseService>();

// Agregar controladores con validación de modelos
builder.Services.AddControllers();

// Configurar OpenAPI/Swagger para documentación
builder.Services.AddOpenApi();

// Configurar CORS para permitir el frontend de React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000",
                "http://127.0.0.1:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// =============================================
// Configuración del Pipeline HTTP
// =============================================

// Habilitar Swagger en desarrollo
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    // Redirigir la raíz a la documentación de la API
    app.MapGet("/", () => Results.Redirect("/openapi/v1.json"));
}

// Habilitar CORS
app.UseCors("AllowFrontend");

// Mapear controladores
app.MapControllers();

app.Run();
