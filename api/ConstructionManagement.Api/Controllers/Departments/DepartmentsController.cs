using ConstructionManagement.Api.Common.Extensions;
using ConstructionManagement.Api.Controllers.Departments.Dtos;
using ConstructionManagement.Api.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ConstructionManagement.Api.Controllers.Departments
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        private readonly DepartmentRepository _departmentRepository;

        public DepartmentsController(DepartmentRepository departmentRepository)
        {
            _departmentRepository = departmentRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            Guid tenantId = User.GetTenantId();
            IReadOnlyList<DepartmentDto> dtos = await _departmentRepository.GetDtosAsync(tenantId);
            return Ok(dtos);
        }
    }
}