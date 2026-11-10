using ConstructionManagement.Domain.Customers;
using ConstructionManagement.Domain.Departments;
using ConstructionManagement.Domain.Employees;
using ConstructionManagement.Domain.Projects;
using ConstructionManagement.Infrastructure.Data.Interceptors;
using Microsoft.EntityFrameworkCore;

namespace ConstructionManagement.Infrastructure.Data
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