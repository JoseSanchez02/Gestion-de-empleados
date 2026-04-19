USE EXAMEN;
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Empleados]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Empleados] (
        [IdEmpleado]        INT             IDENTITY(1,1)   NOT NULL,
        [Nombre]            NVARCHAR(100)                   NOT NULL,
        [Activo]            BIT                             NOT NULL    DEFAULT 1,
        [FechaAlta]         DATETIME                        NOT NULL    DEFAULT GETDATE(),
        [FechaModificacion] DATETIME                        NULL,
        CONSTRAINT [PK_Empleados] PRIMARY KEY CLUSTERED ([IdEmpleado] ASC)
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Movimientos]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Movimientos] (
        [IdMovimiento]      INT             IDENTITY(1,1)   NOT NULL,
        [IdEmpleado]        INT                             NOT NULL,
        [TipoMovimiento]    VARCHAR(10)                     NOT NULL,
        [FechaMovimiento]   DATETIME                        NOT NULL    DEFAULT GETDATE(),
        CONSTRAINT [PK_Movimientos] PRIMARY KEY CLUSTERED ([IdMovimiento] ASC),
        CONSTRAINT [FK_Movimientos_Empleados] FOREIGN KEY ([IdEmpleado])
            REFERENCES [dbo].[Empleados] ([IdEmpleado]),
        CONSTRAINT [CK_Movimientos_Tipo] CHECK ([TipoMovimiento] IN ('Alta', 'Baja', 'Cambio'))
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Movimientos_IdEmpleado')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Movimientos_IdEmpleado]
        ON [dbo].[Movimientos] ([IdEmpleado] ASC);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Movimientos_FechaMovimiento')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Movimientos_FechaMovimiento]
        ON [dbo].[Movimientos] ([FechaMovimiento] ASC);
END
GO
