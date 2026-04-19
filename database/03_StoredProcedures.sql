USE EXAMEN;
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_AltaEmpleado]') AND type in (N'P'))
    DROP PROCEDURE [dbo].[sp_AltaEmpleado];
GO

CREATE PROCEDURE [dbo].[sp_AltaEmpleado]
    @Nombre NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @Nombre IS NULL OR LTRIM(RTRIM(@Nombre)) = ''
    BEGIN
        RAISERROR('El nombre del empleado es obligatorio.', 16, 1);
        RETURN;
    END

    DECLARE @IdEmpleado INT;
    DECLARE @FechaActual DATETIME = GETDATE();

    BEGIN TRY
        BEGIN TRANSACTION;

        INSERT INTO [dbo].[Empleados] ([Nombre], [Activo], [FechaAlta])
        VALUES (LTRIM(RTRIM(@Nombre)), 1, @FechaActual);

        SET @IdEmpleado = SCOPE_IDENTITY();

        INSERT INTO [dbo].[Movimientos] ([IdEmpleado], [TipoMovimiento], [FechaMovimiento])
        VALUES (@IdEmpleado, 'Alta', @FechaActual);

        COMMIT TRANSACTION;

        SELECT 
            [IdEmpleado],
            [Nombre],
            [Activo],
            [FechaAlta],
            [FechaModificacion]
        FROM [dbo].[Empleados]
        WHERE [IdEmpleado] = @IdEmpleado;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_BajaEmpleado]') AND type in (N'P'))
    DROP PROCEDURE [dbo].[sp_BajaEmpleado];
GO

CREATE PROCEDURE [dbo].[sp_BajaEmpleado]
    @IdEmpleado INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Empleados] WHERE [IdEmpleado] = @IdEmpleado)
    BEGIN
        RAISERROR('El empleado con Id %d no existe.', 16, 1, @IdEmpleado);
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM [dbo].[Empleados] WHERE [IdEmpleado] = @IdEmpleado AND [Activo] = 0)
    BEGIN
        RAISERROR('El empleado con Id %d ya se encuentra dado de baja.', 16, 1, @IdEmpleado);
        RETURN;
    END

    DECLARE @FechaActual DATETIME = GETDATE();

    BEGIN TRY
        BEGIN TRANSACTION;

        UPDATE [dbo].[Empleados]
        SET [Activo] = 0,
            [FechaModificacion] = @FechaActual
        WHERE [IdEmpleado] = @IdEmpleado;

        INSERT INTO [dbo].[Movimientos] ([IdEmpleado], [TipoMovimiento], [FechaMovimiento])
        VALUES (@IdEmpleado, 'Baja', @FechaActual);

        COMMIT TRANSACTION;

        SELECT 
            [IdEmpleado],
            [Nombre],
            [Activo],
            [FechaAlta],
            [FechaModificacion]
        FROM [dbo].[Empleados]
        WHERE [IdEmpleado] = @IdEmpleado;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_CambioEmpleado]') AND type in (N'P'))
    DROP PROCEDURE [dbo].[sp_CambioEmpleado];
GO

CREATE PROCEDURE [dbo].[sp_CambioEmpleado]
    @IdEmpleado INT,
    @Nombre NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Nombre IS NULL OR LTRIM(RTRIM(@Nombre)) = ''
    BEGIN
        RAISERROR('El nombre del empleado es obligatorio.', 16, 1);
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Empleados] WHERE [IdEmpleado] = @IdEmpleado)
    BEGIN
        RAISERROR('El empleado con Id %d no existe.', 16, 1, @IdEmpleado);
        RETURN;
    END

    DECLARE @FechaActual DATETIME = GETDATE();

    BEGIN TRY
        BEGIN TRANSACTION;

        UPDATE [dbo].[Empleados]
        SET [Nombre] = LTRIM(RTRIM(@Nombre)),
            [FechaModificacion] = @FechaActual
        WHERE [IdEmpleado] = @IdEmpleado;

        INSERT INTO [dbo].[Movimientos] ([IdEmpleado], [TipoMovimiento], [FechaMovimiento])
        VALUES (@IdEmpleado, 'Cambio', @FechaActual);

        COMMIT TRANSACTION;

        SELECT 
            [IdEmpleado],
            [Nombre],
            [Activo],
            [FechaAlta],
            [FechaModificacion]
        FROM [dbo].[Empleados]
        WHERE [IdEmpleado] = @IdEmpleado;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_ObtenerEmpleados]') AND type in (N'P'))
    DROP PROCEDURE [dbo].[sp_ObtenerEmpleados];
GO

CREATE PROCEDURE [dbo].[sp_ObtenerEmpleados]
    @SoloActivos BIT = 0
AS
BEGIN
    SET NOCOUNT ON;

    IF @SoloActivos = 1
    BEGIN
        SELECT 
            [IdEmpleado],
            [Nombre],
            [Activo],
            [FechaAlta],
            [FechaModificacion]
        FROM [dbo].[Empleados]
        WHERE [Activo] = 1
        ORDER BY [IdEmpleado] ASC;
    END
    ELSE
    BEGIN
        SELECT 
            [IdEmpleado],
            [Nombre],
            [Activo],
            [FechaAlta],
            [FechaModificacion]
        FROM [dbo].[Empleados]
        ORDER BY [IdEmpleado] ASC;
    END
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_ObtenerEmpleadoPorId]') AND type in (N'P'))
    DROP PROCEDURE [dbo].[sp_ObtenerEmpleadoPorId];
GO

CREATE PROCEDURE [dbo].[sp_ObtenerEmpleadoPorId]
    @IdEmpleado INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        [IdEmpleado],
        [Nombre],
        [Activo],
        [FechaAlta],
        [FechaModificacion]
    FROM [dbo].[Empleados]
    WHERE [IdEmpleado] = @IdEmpleado;
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_ObtenerMovimientos]') AND type in (N'P'))
    DROP PROCEDURE [dbo].[sp_ObtenerMovimientos];
GO

CREATE PROCEDURE [dbo].[sp_ObtenerMovimientos]
    @IdEmpleado INT = NULL,
    @TipoMovimiento VARCHAR(10) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        m.[IdMovimiento],
        m.[IdEmpleado],
        e.[Nombre] AS NombreEmpleado,
        m.[TipoMovimiento],
        m.[FechaMovimiento]
    FROM [dbo].[Movimientos] m
    INNER JOIN [dbo].[Empleados] e ON m.[IdEmpleado] = e.[IdEmpleado]
    WHERE (@IdEmpleado IS NULL OR m.[IdEmpleado] = @IdEmpleado)
      AND (@TipoMovimiento IS NULL OR m.[TipoMovimiento] = @TipoMovimiento)
    ORDER BY m.[FechaMovimiento] DESC;
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_DepuracionEmpleados]') AND type in (N'P'))
    DROP PROCEDURE [dbo].[sp_DepuracionEmpleados];
GO

CREATE PROCEDURE [dbo].[sp_DepuracionEmpleados]
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @FechaLimite DATETIME = DATEADD(MONTH, -3, GETDATE());

    BEGIN TRY
        BEGIN TRANSACTION;

        DELETE FROM [dbo].[Movimientos]
        WHERE [IdEmpleado] IN (
            SELECT e.[IdEmpleado]
            FROM [dbo].[Empleados] e
            INNER JOIN (
                SELECT [IdEmpleado], MAX([FechaMovimiento]) AS UltimoMovimiento
                FROM [dbo].[Movimientos]
                GROUP BY [IdEmpleado]
            ) ult ON e.[IdEmpleado] = ult.[IdEmpleado]
            WHERE ult.UltimoMovimiento < @FechaLimite
        );

        DELETE FROM [dbo].[Empleados]
        WHERE [IdEmpleado] IN (
            SELECT [IdEmpleado]
            FROM [dbo].[Empleados]
            WHERE [IdEmpleado] NOT IN (
                SELECT DISTINCT [IdEmpleado] FROM [dbo].[Movimientos]
            )
        );

        COMMIT TRANSACTION;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END
GO
