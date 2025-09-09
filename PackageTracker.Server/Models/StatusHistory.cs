using System.ComponentModel.DataAnnotations;

namespace PackageTracker.Server.Models
{
    public class StatusHistory
    {
        [Key]
        public Guid Id { get; set; }

        public string PrevStatus { get; set; }

        public string NewStatus { get; set; }

        public string DateModified { get; set; }
    }
}
