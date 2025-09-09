using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PackageTracker.Server.Models;
using PackageTracker.Server.Models.DTOS;

namespace PackageTracker.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PackagesController : ControllerBase
    {

        private readonly PackageDbContext _context;
        private readonly ILogger<PackagesController> _logger;
        
        public PackagesController(PackageDbContext context, ILogger<PackagesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
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

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] StatusUpdateDto dto)
        {
            var pkg = await _context.Packages.FindAsync(id);

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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPackageDetails(Guid id)
        {
            var package = await _context.Packages
                .FindAsync(id);

            if (package == null) return NotFound();

            return Ok(package);
        }

        [HttpPost("addStatusHistory/{id}")]
        public async Task<IActionResult> AddStatusHistory(Guid id,[FromBody] StatusHistory statusHistory) 
        {
            if (statusHistory == null) return BadRequest();

            var package = await _context.Packages
                .Include(p => p.History)
                .FirstOrDefaultAsync(p => p.PackageId == id);

            if (package == null) return NotFound();

            package.History ??= new List<StatusHistory>();
            package.History.Add(statusHistory);

            await _context.SaveChangesAsync();
            return Created();

        }

        [HttpGet("statusHistory/{id}")]
        public async Task<IActionResult> GetStatusHistory(Guid id)
        {
            var statusHistory = await _context.Packages
                .AsNoTracking()
                .Where(p => p.PackageId == id)
                .SelectMany(p => p.History)
                .OrderBy(p => p.DateModified)
                .ToListAsync();

            if (statusHistory == null) return NotFound();

            return Ok(statusHistory);
        }
        
    }
}
