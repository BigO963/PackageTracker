using System.ComponentModel.DataAnnotations;

namespace PackageTracker.Server.Models
{
    public class PackageSender
    {
        [Key]
        public Guid SenderId { get; set; }

        public string SenderAddress { get; set; }

        public string SenderName { get; set; }

        public string SenderPhone { get; set; }
    }
}
