using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ReType.Dtos
{
    public class UserDetail
    {
        [Required]
        public string Username { get; set; }

        public string ?Name { get; set; }

        public string ?Dataofbirth { get; set; }

        public string ?Gerder { get; set; }

        public string ?Google { get; set; }
    }
}
