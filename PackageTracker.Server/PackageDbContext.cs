using Microsoft.EntityFrameworkCore;
using PackageTracker.Server.Models;

namespace PackageTracker.Server
{
    public class PackageDbContext : DbContext
    {
        public PackageDbContext(DbContextOptions<PackageDbContext> options)
            : base(options)

        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Package>().OwnsOne(p => p.Sender);
            modelBuilder.Entity<Package>().OwnsOne(p => p.Recipient);
            modelBuilder.Entity<Package>().OwnsMany<StatusHistory>(p => p.History);
        }

        public DbSet<Package> Packages { get; set; }

        public DbSet<PackageSender> PackageSenders { get; set; }

        public DbSet<PackageRecipient> PackageRecipients { get; set; }

        public DbSet<StatusHistory> StatusHistory { get; set; }
    }
}
