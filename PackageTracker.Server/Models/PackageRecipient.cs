using System.ComponentModel.DataAnnotations;

namespace PackageTracker.Server.Models
{
    public class PackageRecipient
    {
        [Key]
        public Guid RecipientId { get; set; }

        public string RecipientAddress { get; set; }

        public string RecipientName { get; set; }

        public string RecipientPhone { get; set; }
    }
}
