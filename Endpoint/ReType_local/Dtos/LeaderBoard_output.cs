using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ReType.Dtos
{
    public class LeaderBoard_output
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public int Score { get; set; }
        [Required]
        public int Index { get; set; }
    }
}
