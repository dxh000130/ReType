using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ReType.Dtos
{
    public class Article_Process
    {
        [Required]
        public int ArticleID { get; set; }
        [Required]
        public string Article { get; set; }
        [Required]
        public string Input { get; set; }
        public string? AlreadyCorrect { get; set; }
        public int Enter { get; set; }
    }
}
