using ConstructionManagement.Api.Domain.Customers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ConstructionManagement.Api.Infrastructure.Data.Configurations
{
    internal sealed class CustomerConfiguration : IEntityTypeConfiguration<Customer>
    {
        public void Configure(EntityTypeBuilder<Customer> builder)
        {
            builder.ToTable("Customer");

            builder.HasKey(c => c.Id);

            builder.HasIndex(c => new { c.TenantId, c.CustomerCode })
                .IsUnique()
                .HasDatabaseName("AK_Customer_TenantId_CustomerCode");

            builder.Property(c => c.CustomerCode)
                .HasConversion(
                    v => v.Value,
                    v => CustomerCode.Create(v).Value)
                .HasColumnName("CustomerCode")
                .IsRequired();

            builder.Property(c => c.Name)
                .IsRequired();

            builder.Property(c => c.Status)
                .HasConversion<byte>()
                .IsRequired();
        }
    }
}