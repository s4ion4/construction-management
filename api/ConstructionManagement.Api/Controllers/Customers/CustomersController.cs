using ConstructionManagement.Api.Common.Extensions;
using ConstructionManagement.Api.Controllers.Customers.Dtos;
using ConstructionManagement.Api.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ConstructionManagement.Api.Controllers.Customers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly CustomerRepository _customerRepository;

        public CustomersController(CustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            Guid tenantId = User.GetTenantId();
            IReadOnlyList<CustomerDto> dtos = await _customerRepository.GetDtosAsync(tenantId);
            return Ok(dtos);
        }
    }
}