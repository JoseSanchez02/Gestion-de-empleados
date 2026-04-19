USE [msdb];
GO

IF EXISTS (SELECT job_id FROM msdb.dbo.sysjobs WHERE name = N'DepuracionEmpleados')
BEGIN
    EXEC msdb.dbo.sp_delete_job @job_name = N'DepuracionEmpleados', @delete_unused_schedule = 1;
END
GO

DECLARE @JobId BINARY(16);

EXEC msdb.dbo.sp_add_job @job_name=N'DepuracionEmpleados', 
    @enabled=1, 
    @description=N'Ejecuta sp_DepuracionEmpleados diariamente a las 5 AM.', 
    @job_id = @JobId OUTPUT;

EXEC msdb.dbo.sp_add_jobstep @job_id=@JobId, @step_name=N'Ejecutar SP Depuracion', 
    @step_id=1, 
    @cmdexec_success_code=0, 
    @on_success_action=1, 
    @os_run_priority=0, @subsystem=N'TSQL', 
    @command=N'EXEC [EXAMEN].[dbo].[sp_DepuracionEmpleados]', 
    @database_name=N'EXAMEN';

DECLARE @ScheduleId INT;
EXEC msdb.dbo.sp_add_jobschedule @job_id=@JobId, @name=N'HorarioDiario5AM', 
    @enabled=1, 
    @freq_type=4, 
    @freq_interval=1, 
    @active_start_time=050000,
    @schedule_id = @ScheduleId OUTPUT;

EXEC msdb.dbo.sp_add_jobserver @job_id = @JobId, @server_name = N'(local)';
GO
