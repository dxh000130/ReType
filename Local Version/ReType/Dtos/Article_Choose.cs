using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ReType.Dtos
{
    public class Article_Choose
    {
        [Required]
        public string Difficulty { get; set; }
        [Required]
        public string Type { get; set; }
    }
}
