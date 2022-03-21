using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReType.Model
{// Store all information about the user
    public class User
    {
        [Key]
        public string UserName { get; set; } //Username
        [Required]
        public string Password { get; set; } //Password
        [Required]
        public int Score { get; set; } //User score
        public string Email { get; set; } //User Email
        public string? Name { get; set; } //User Name
        public string? Dataofbirth { get; set; } //User Dataofbirth
        public string? Gerder { get; set; }// User Gender
    }
}
