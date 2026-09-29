using ConstructionManagement.Api.Domain.Projects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ConstructionManagement.Api.Infrastructure.Data.Configurations
{
    internal sealed class ProjectConfiguration : IEntityTypeConfiguration<Project>
    {
        public void Configure(EntityTypeBuilder<Project> builder)
        {
            builder.ToTable("Project");

            builder.HasKey(p => p.Id);

            builder.HasIndex(p => new { p.TenantId, p.ProjectCode })
                .IsUnique()
                .HasDatabaseName("AK_Project_TenantId_ProjectCode");

            builder.Property(p => p.ProjectCode)
                .HasConversion(
                    v => v.Value,
                    v => ProjectCode.Create(v).Value)
                .HasColumnName("ProjectCode")
                .IsRequired();

            builder.Property(p => p.Name)
                .IsRequired();

            builder.Property(p => p.OrderDate)
                .HasConversion(
                    v => v.Value,
                    v => OrderDate.Create(v).Value)
                .HasColumnName("OrderDate")
                .HasColumnType("date")
                .IsRequired();

            builder.Property(p => p.OrderType)
                .HasConversion<byte>()
                .IsRequired();

            builder.OwnsOne(p => p.EstimateNumber, en =>
            {
                en.Property(x => x.MainNumber)
                    .HasColumnName("EstimateMainNumber");

                en.Property(x => x.BranchNumber)
                    .HasColumnName("EstimateBranchNumber");
            });

            builder.Property(p => p.Status)
                .HasConversion<byte>()
                .IsRequired();
        }
    }
}