using ConstructionManagement.Api.Domain.Customers;
using ConstructionManagement.Api.Domain.Departments;
using ConstructionManagement.Api.Domain.Employees;
using ConstructionManagement.Api.Domain.Projects;
using Microsoft.EntityFrameworkCore;

namespace ConstructionManagement.Api.Infrastructure.Data
{
    public sealed class ApplicationDbContext : DbContext
    {
        private static readonly AuditInterceptor _auditInterceptor = new();

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Project> Projects => Set<Project>();
        public DbSet<ProjectArchive> ProjectArchives => Set<ProjectArchive>();
        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<Department> Departments => Set<Department>();
        public DbSet<Employee> Employees => Set<Employee>();

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.AddInterceptors(_auditInterceptor);

        protected override void OnModelCreating(ModelBuilder modelBuilder)
            => modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}