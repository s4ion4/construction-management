using ConstructionManagement.Api.Domain.Projects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace ConstructionManagement.Api.Infrastructure.Data
{
    internal sealed class AuditInterceptor : SaveChangesInterceptor
    {
        private static readonly Type[] _excludedTypes = [typeof(ProjectArchive)];

        public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
            DbContextEventData eventData,
            InterceptionResult<int> result,
            CancellationToken cancellationToken = default)
        {
            if (eventData.Context is null)
                return base.SavingChangesAsync(eventData, result, cancellationToken);

            var utcNow = DateTime.UtcNow;

            foreach (var entry in eventData.Context.ChangeTracker.Entries())
            {
                if (_excludedTypes.Contains(entry.Entity.GetType()))
                    continue;

                if (entry.State == EntityState.Added)
                {
                    if (entry.Metadata.FindProperty("CreatedAt") is not null)
                        entry.Property("CreatedAt").CurrentValue = utcNow;

                    if (entry.Metadata.FindProperty("UpdatedAt") is not null)
                        entry.Property("UpdatedAt").CurrentValue = utcNow;
                }
                else if (entry.State == EntityState.Modified)
                {
                    if (entry.Metadata.FindProperty("UpdatedAt") is not null)
                        entry.Property("UpdatedAt").CurrentValue = utcNow;
                }
            }

            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }
    }
}