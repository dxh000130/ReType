using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReType.Model
{// Store all information about the user
    public class Verificationcode
    {
        [Key]
        public string Email { get; set; } //Username
        [Required]
        public string code { get; set; } //Password
        [Required]
        public DateTime Date { get; set; } //User score
    }
}
