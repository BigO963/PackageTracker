using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PackageTracker.Server.Models.DTOS;

namespace PackageTracker.Server.Controllers
{
    [ApiController]
    public class PackageController : ControllerBase
    {


        private readonly PackageDbContext _context;
        private readonly ILogger<PackageController> _logger;

        public PackageController(PackageDbContext context, ILogger<PackageController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("packages")]
        public async Task<IActionResult> GetPackages()
        {
            var packages = await _context.Packages
                .ToListAsync();

            //Jei nėra siuntų
            if (packages == null)
            {
                return NotFound();
            }

            //Gražinamas OK atsakymas su siuntų duomenimis
            return Ok(packages);
        }

        [HttpPut("packages/{id}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] StatusUpdateDto dto)
        {
            var pkg = await _context.Packages.FindAsync(id);

            _logger.LogInformation($"Package: {pkg}");

            if (pkg == null) return NotFound();

            var allowedTransitions = pkg.Status switch
            {
                "Created" => new[] { "Sent", "Canceled" },
                "Sent" => new[] { "Accepted", "Returned", "Canceled" },
                "Returned" => new[] { "Sent", "Canceled" },
                "Accepted" => Array.Empty<string>(),
                "Canceled" => Array.Empty<string>(),
                _ => Array.Empty<string>()
            };

            if (!allowedTransitions.Contains(dto.NewStatus))
                return BadRequest("Invalid status transition");

            pkg.Status = dto.NewStatus;
            await _context.SaveChangesAsync();

            return Ok(pkg);
        }
    }
}
