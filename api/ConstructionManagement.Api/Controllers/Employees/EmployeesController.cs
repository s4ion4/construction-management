using ConstructionManagement.Api.Common.Extensions;
using ConstructionManagement.Api.Controllers.Employees.Dtos;
using ConstructionManagement.Api.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ConstructionManagement.Api.Controllers.Employees
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly EmployeeRepository _employeeRepository;

        public EmployeesController(EmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            Guid tenantId = User.GetTenantId();
            IReadOnlyList<EmployeeDto> dtos = await _employeeRepository.GetDtosAsync(tenantId);
            return Ok(dtos);
        }
    }
}