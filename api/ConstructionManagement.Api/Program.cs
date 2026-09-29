using ConstructionManagement.Api.Common.Localization;
using ConstructionManagement.Api.Common.Middleware;
using ConstructionManagement.Api.Common.Tenancy;
using ConstructionManagement.Api.Infrastructure.Data;
using ConstructionManagement.Api.Infrastructure.Utils;
using Dapper;
using Microsoft.EntityFrameworkCore;

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
builder.Services.AddScoped<TenantSessionContextInterceptor>();
builder.Services.AddTransient<TenantContextMiddleware>();

builder.Services.AddDbContext<ApplicationDbContext>((sp, options) =>
    options.UseSqlServer(connectionString)
        .AddInterceptors(sp.GetRequiredService<TenantSessionContextInterceptor>()));

builder.Services.AddMediator(options =>
{
    options.ServiceLifetime = ServiceLifetime.Scoped;
});

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
