using ConstructionManagement.Api.Domain.Departments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ConstructionManagement.Api.Infrastructure.Data.Configurations
{
    internal sealed class DepartmentConfiguration : IEntityTypeConfiguration<Department>
    {
        public void Configure(EntityTypeBuilder<Department> builder)
        {
            builder.ToTable("Department");

            builder.HasKey(d => d.Id);

            builder.HasIndex(d => new { d.TenantId, d.DepartmentCode })
                .IsUnique()
                .HasDatabaseName("AK_Department_TenantId_DepartmentCode");

            builder.Property(d => d.DepartmentCode)
                .HasConversion(
                    v => v.Value,
                    v => DepartmentCode.Create(v).Value)
                .HasColumnName("DepartmentCode")
                .IsRequired();

            builder.Property(d => d.Name)
                .IsRequired();

            builder.Property(d => d.Status)
                .HasConversion<byte>()
                .IsRequired();
        }
    }
}