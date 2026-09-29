using ConstructionManagement.Api.Common.Utils;
using ConstructionManagement.Api.Domain.Customers;
using ConstructionManagement.Api.Domain.Departments;
using ConstructionManagement.Api.Domain.Employees;
using ConstructionManagement.Api.Domain.Projects;
using ConstructionManagement.Api.Infrastructure.Data;
using CSharpFunctionalExtensions;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace ConstructionManagement.Api.Application.Projects.Commands
{
    public sealed class UpdateProjectCommand : ICommand<UnitResult<Error>>
    {
        public Guid TenantId { get; }
        public string CurrentProjectCode { get; }
        public string? ProjectCode { get; }
        public string? Name { get; }
        public Guid? CustomerId { get; }
        public string? CustomerContactPerson { get; }
        public DateOnly? OrderDate { get; }
        public OrderType? OrderType { get; }
        public string? EstimateNumberMainNumber { get; }
        public string? EstimateNumberBranchNumber { get; }
        public Guid? DepartmentId { get; }
        public Guid? SalesStaffId { get; }
        public Guid? ConstructionStaffId { get; }

        public UpdateProjectCommand(
            Guid tenantId,
            string currentProjectCode,
            string? projectCode,
            string? name,
            Guid? customerId,
            string? customerContactPerson,
            DateOnly? orderDate,
            OrderType? orderType,
            string? estimateNumberMainNumber,
            string? estimateNumberBranchNumber,
            Guid? departmentId,
            Guid? salesStaffId,
            Guid? constructionStaffId)
        {
            TenantId = tenantId;
            CurrentProjectCode = currentProjectCode;
            ProjectCode = projectCode;
            Name = name;
            CustomerId = customerId;
            CustomerContactPerson = customerContactPerson;
            OrderDate = orderDate;
            OrderType = orderType;
            EstimateNumberMainNumber = estimateNumberMainNumber;
            EstimateNumberBranchNumber = estimateNumberBranchNumber;
            DepartmentId = departmentId;
            SalesStaffId = salesStaffId;
            ConstructionStaffId = constructionStaffId;
        }

        internal sealed class UpdateProjectCommandHandler : ICommandHandler<UpdateProjectCommand, UnitResult<Error>>
        {
            private readonly ApplicationDbContext _context;

            public UpdateProjectCommandHandler(ApplicationDbContext context)
            {
                _context = context;
            }

            public async ValueTask<UnitResult<Error>> Handle(
                UpdateProjectCommand command,
                CancellationToken cancellationToken)
            {
                var currentCodeResult = Domain.Projects.ProjectCode.Create(command.CurrentProjectCode);
                if (currentCodeResult.IsFailure)
                    return UnitResult.Failure(Errors.General.Validation(currentCodeResult.Error));

                Project? project = await _context.Projects
                    .FirstOrDefaultAsync(p => p.TenantId == command.TenantId && p.ProjectCode == currentCodeResult.Value, cancellationToken);
                if (project is null)
                    return UnitResult.Failure(Errors.General.NotFound());

                if (!project.CanEdit())
                    return UnitResult.Failure(Errors.General.UnprocessableEntity("承認済みの工事は編集できません。"));

                ProjectCode newProjectCode = Domain.Projects.ProjectCode.Create(command.ProjectCode).Value;
                OrderDate orderDate = Domain.Projects.OrderDate.Create(command.OrderDate).Value;
                EstimateNumber? estimateNumber = command.EstimateNumberMainNumber is null
                    ? null
                    : EstimateNumber.Create(command.EstimateNumberMainNumber, command.EstimateNumberBranchNumber).Value;

                if (newProjectCode != project.ProjectCode)
                {
                    bool projectCodeExists = await _context.Projects
                        .AnyAsync(p => p.TenantId == command.TenantId && p.ProjectCode == newProjectCode, cancellationToken);
                    if (projectCodeExists)
                        return UnitResult.Failure(Errors.General.Conflict("指定された工事コードは既に使用されています。"));

                    bool projectCodeArchivedExists = await _context.ProjectArchives
                        .AnyAsync(p => p.TenantId == command.TenantId && p.ProjectCode == newProjectCode, cancellationToken);
                    if (projectCodeArchivedExists)
                        return UnitResult.Failure(Errors.General.Conflict("指定された工事コードはアーカイブ済みのため使用できません。"));
                }

                if (command.CustomerId != project.CustomerId)
                {
                    Customer? customer = await _context.Customers
                        .FirstOrDefaultAsync(c => c.TenantId == command.TenantId && c.Id == command.CustomerId!.Value, cancellationToken);
                    if (customer is null || customer.Status != CustomerStatus.Active)
                        return UnitResult.Failure(Errors.General.UnprocessableEntity("指定された得意先は無効です。"));
                }

                if (command.DepartmentId != project.DepartmentId && command.DepartmentId is not null)
                {
                    Department? department = await _context.Departments
                        .FirstOrDefaultAsync(d => d.TenantId == command.TenantId && d.Id == command.DepartmentId.Value, cancellationToken);
                    if (department is null || department.Status != DepartmentStatus.Active)
                        return UnitResult.Failure(Errors.General.UnprocessableEntity("指定された部門は無効です。"));
                }

                if (command.SalesStaffId != project.SalesStaffId && command.SalesStaffId is not null)
                {
                    Employee? salesStaff = await _context.Employees
                        .FirstOrDefaultAsync(e => e.TenantId == command.TenantId && e.Id == command.SalesStaffId.Value, cancellationToken);
                    if (salesStaff is null || salesStaff.Status != EmployeeStatus.Active)
                        return UnitResult.Failure(Errors.General.UnprocessableEntity("指定された社員は無効です。"));
                }

                if (command.ConstructionStaffId != project.ConstructionStaffId && command.ConstructionStaffId is not null)
                {
                    Employee? constructionStaff = await _context.Employees
                        .FirstOrDefaultAsync(e => e.TenantId == command.TenantId && e.Id == command.ConstructionStaffId.Value, cancellationToken);
                    if (constructionStaff is null || constructionStaff.Status != EmployeeStatus.Active)
                        return UnitResult.Failure(Errors.General.UnprocessableEntity("指定された社員は無効です。"));
                }

                project.Update(
                    newProjectCode,
                    command.Name!,
                    command.CustomerId!.Value,
                    command.CustomerContactPerson,
                    orderDate,
                    command.OrderType!.Value,
                    estimateNumber,
                    command.DepartmentId,
                    command.SalesStaffId,
                    command.ConstructionStaffId);

                await _context.SaveChangesAsync(cancellationToken);

                return UnitResult.Success<Error>();
            }
        }
    }
}