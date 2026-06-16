using ConstructionManagement.Api.Common.Localization;
using ConstructionManagement.Api.Common.Middleware;
using ConstructionManagement.Api.Common.Tenancy;
using ConstructionManagement.Api.Domain.Customers;
using ConstructionManagement.Api.Domain.Departments;
using ConstructionManagement.Api.Domain.Employees;
using ConstructionManagement.Api.Domain.Projects;
using ConstructionManagement.Api.Infrastructure.Repositories;
using ConstructionManagement.Api.Infrastructure.Utils;
using Dapper;

SqlMapper.AddTypeHandler(new DateOnlyTypeHandler());
SqlMapper.AddTypeHandler(new DateTimeUtcTypeHandler());

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers(options =>
{
    options.ModelMetadataDetailsProviders.Add(new JapaneseValidationMetadataProvider());
});
builder.Services.AddOpenApi();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("接続文字列が設定されていません。");
builder.Services.AddSingleton(new ConnectionString(connectionString));

builder.Services.AddScoped<TenantContext>();
builder.Services.AddScoped<ITenantContext>(sp => sp.GetRequiredService<TenantContext>());
builder.Services.AddScoped<ITenantSetter>(sp => sp.GetRequiredService<TenantContext>());
builder.Services.AddScoped<TenantSqlConnectionFactory>();
builder.Services.AddTransient<TenantContextMiddleware>();

builder.Services.AddScoped<ProjectRepository>();
builder.Services.AddScoped<ProjectArchiveRepository>();
builder.Services.AddScoped<DepartmentRepository>();
builder.Services.AddScoped<EmployeeRepository>();
builder.Services.AddScoped<CustomerRepository>();

builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

var app = builder.Build();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseMiddleware<TenantContextMiddleware>();

app.MapControllers();

app.Run();
