using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ReType.Dtos
{
    public class Article_Choose_output
    {
        [Required]
        public int ID { get; set; }
        [Required]
        public string Article { get; set; }
        [Required]
        public int ErrorRemain { get; set; }
    }
}
