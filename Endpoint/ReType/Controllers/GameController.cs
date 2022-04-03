using ReType.Model;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Xml.Linq;
using System.Drawing.Imaging;
using System.Drawing;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using ReType.data;
using ReType.Dtos;
using Google.Apis.Oauth2.v2;
using Google.Apis.Auth;
using System.Text.RegularExpressions;

namespace ReType.Controllers
{
    [Route("api")]
    [ApiController]
    public class GameController : Controller
    {
        private readonly IWebAPIRepo _repository;

        public GameController(IWebAPIRepo repository)
        {
            _repository = repository;
        }
        [Authorize]
        [Authorize(Policy = "UserOnly")]
        [HttpPost("ArticleChoose")]
        public ActionResult<Article_Choose_output> ArticleChoose(Article_Choose choose) //API
        {
            Article c = _repository.ChooseArticle(choose.Difficulty, choose.Type);
            if (c != null)
            {
                Article_Choose_output output = new Article_Choose_output { ID = c.Id, Article = c.WholeArticle};
                return Ok(output);
            }
            else
            {
                return NotFound();
            }
        }
        [HttpPost("ArticleProcess")]
        public ActionResult<string> ArticleProcess(Article_Process Article)
        {
            string pattern1 = @"[A-Za-z]*(?i:";
            string pattern3 = ")+[A-Za-z]*";
            string pattern = pattern1 + Article.Input + pattern3;
            string replacement = "<span style=\"color: red;\">$&</span>";
            Regex rgx = new Regex(pattern);
            string result = rgx.Replace(Article.Article, replacement);
            //foreach (Match match in Regex.Matches(Article.Article.ToUpper(), pattern))
            //{
            //    //Console.WriteLine(match.Value);
            //    int index1 = match.Index;
            //    Console.WriteLine(Article.Article.Substring(index1, match.Value.Length));
            //}

            return Ok(result);
        }
    }
}

