using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ReType.Dtos
{
    public class Article_Process_out
    {
        [Required]
        public int ArticleID { get; set; }
        [Required]
        public string Article { get; set; }
        [Required]
        public string Correct { get; set; }
        [Required]
        public string ArticleDisp { get; set; }
        [Required]
        public int ErrorRemain { get; set; }
        public string? AlreadyCorrect { get; set; }
        public int? Score { get; set; }
    }
}
