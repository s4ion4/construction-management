using ConstructionManagement.Api.Application.Customers.Dtos;
using ConstructionManagement.Api.Application.Customers.Queries;
using ConstructionManagement.Api.Common.Extensions;
using ConstructionManagement.Api.Common.Utils;
using Mediator;
using Microsoft.AspNetCore.Mvc;

namespace ConstructionManagement.Api.Controllers
{
    [Route("api/[controller]")]
    public class CustomersController : BaseController
    {
        private readonly IMediator _mediator;

        public CustomersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            Guid tenantId = User.GetTenantId();
            IReadOnlyList<CustomerDto> dtos = await _mediator.Send(new GetAllCustomersQuery(tenantId));
            return Ok(dtos);
        }
    }
}