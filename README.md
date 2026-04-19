# Sistema de Gestión de Empleados

Este es un sistema interno desarrollado para la gestión administrativa de empleados, incluyendo control de altas, bajas, cambios, bitácora de movimientos y depuración automática de registros inactivos mediante procesos programados.

## 🚀 Tecnologías

El proyecto utiliza un stack moderno y profesional:

- **Backend:** .NET 10 Web API (C#) con arquitectura basada estrictamente en **Stored Procedures**.
- **Frontend:** React + Vite con diseño responsivo, **Vanilla CSS** y manejo de estado moderno.
- **Base de Datos:** SQL Server Standard Edition (Obligatorio para la ejecución de SQL Server Agent Jobs).
- **Reporting:** Bitácora automatizada de movimientos con filtros avanzados en el frontend.

## 🛠️ Requisitos e Instalación

### 1. Base de Datos
1. Asegúrate de tener **SQL Server Standard Edition** (o superior) instalado y con el servicio **SQL Server Agent** activo.
2. Ejecuta los scripts ubicados en la carpeta `/database` en el siguiente orden (Todos son obligatorios):
   - `01_CreateDatabase.sql`
   - `02_CreateTables.sql`
   - `03_StoredProcedures.sql`
   - `04_Job_DepuracionEmpleados.sql` (Configuración del Job de mantenimiento).

### 2. Backend (.NET 10 API)
1. Navega a `backend/ExamenAPI`.
2. Restaura y ejecuta la aplicación:
   ```bash
   dotnet run
   ```
   *La API iniciará en `http://localhost:5050`.*

### 3. Frontend (React)
1. Navega a `frontend/examen-app`.
2. Instala las dependencias y corre el servidor de desarrollo:
   ```bash
   npm install
   ```
   ```bash
   npm run dev
   ```
   *La web app estará disponible en `http://localhost:5173`.*

## ✅ Pruebas Unitarias

El proyecto incluye una suite de pruebas unitarias desarrolladas con **xUnit** y **Moq** para validar la lógica de los controladores del backend.

Para ejecutar las pruebas:
1. Navega a `backend/`.
2. Ejecuta el comando:
   ```bash
   dotnet test
   ```

## ✨ Características Destacadas

- **Interfaz Profesional:** Diseño limpio, moderno y responsivo optimizado para la gestión administrativa.
- **Alerta de Depuración:** Sistema inteligente que identifica empleados con más de 75 días sin movimientos, alertando sobre su próxima eliminación por el proceso de mantenimiento automático (3 meses).
- **Bitácora Detallada:** Reporte completo de cada acción realizada (Alta, Baja, Cambio) con filtros avanzados por fecha y tipo de movimiento.
- **Estadísticas en Tiempo Real:** Dashboard dinámico con métricas de empleados activos e inactivos.
- **Mantenimiento Automático:** Implementación de SQL Server Agent Jobs para la limpieza profunda de registros obsoletos de forma desatendida.

---
*Sistema de Gestión Administrativa Integral.*
