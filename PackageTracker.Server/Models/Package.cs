using System.ComponentModel.DataAnnotations;

namespace PackageTracker.Server.Models
{
    public class Package
    {
        [Key]
        public Guid PackageId { get; set; }

        public string TrackingNumber { get; set; }

        public PackageSender Sender { get; set; }

        public PackageRecipient Recipient { get; set; }

        public string Status { get; set; }

        public DateTime CreatedAt { get; set; }

        public Package()
        {
            TrackingNumber = GenerateTrackingNumber();
        }

        public List<StatusHistory>? History { get; set; }

        //Pagalbinė funkcija naujam sekimo numeriui sukurti, kuris bus sudarytas iš didžiųjų raidžių ir skaičių ir bus 14 simbolių ilgio.
        public static string GenerateTrackingNumber()
        {
            return Guid.NewGuid().ToString("N").Substring(0, 14).ToUpper();
        }
    }
}
