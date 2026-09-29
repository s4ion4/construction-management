using ConstructionManagement.Api.Domain.Departments;
using ConstructionManagement.Api.Domain.Employees;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ConstructionManagement.Api.Infrastructure.Data.Configurations
{
    internal sealed class EmployeeConfiguration : IEntityTypeConfiguration<Employee>
    {
        public void Configure(EntityTypeBuilder<Employee> builder)
        {
            builder.ToTable("Employee");

            builder.HasKey(e => e.Id);

            builder.HasIndex(e => new { e.TenantId, e.EmployeeCode })
                .IsUnique()
                .HasDatabaseName("AK_Employee_TenantId_EmployeeCode");

            builder.Property(e => e.EmployeeCode)
                .HasConversion(
                    v => v.Value,
                    v => EmployeeCode.Create(v).Value)
                .HasColumnName("EmployeeCode")
                .IsRequired();

            builder.Property(e => e.Name)
                .IsRequired();

            builder.Property(e => e.DepartmentCode)
                .HasConversion(
                    v => v.Value,
                    v => DepartmentCode.Create(v).Value)
                .HasColumnName("DepartmentCode")
                .IsRequired();

            builder.Property(e => e.Status)
                .HasConversion<byte>()
                .IsRequired();
        }
    }
}