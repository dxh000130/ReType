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
                Article_Choose_output output = new Article_Choose_output { ID = c.Id, Article = c.WholeArticle, ErrorRemain = _repository.WrongWordList(c.Id).Count()};
                return Ok(output);
            }
            else
            {
                return NotFound();
            }
        }
        [Authorize]
        [Authorize(Policy = "UserOnly")] //Vaild user login
        [HttpPost("ArticleProcess")]
        public ActionResult<Article_Process_out> ArticleProcess(Article_Process Article)
        {
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim claim = ci.FindFirst("UserName");
            string username = claim.Value;
            string pattern1 = @"[A-Za-z]*(?i:";
            string pattern3 = ")+[A-Za-z]*";
            string inputreplace = "";
            Match mc2 = Regex.Match(Article.Input, "[A-Za-z]+");
            if (mc2.Value != "")
            {
                inputreplace = mc2.Value;
            }
            else
            {
                inputreplace = "sfgvbadfvbhaidfgvbadfvagarfgsdfgvfdvdfvfvdfsbvb";
            }

            Regex inputrgx = new Regex(".+");
            Article.Input = inputrgx.Replace(Article.Input, inputreplace);

            string[] wronglist = _repository.WrongWordList(Article.ArticleID);
            string[] correctlist = _repository.CorrectWordList(Article.ArticleID);
            string pattern = pattern1 + Article.Input + pattern3;
            string replacement = "<span style=\"color: LightGray;\">$&</span>";
            Regex rgx = new Regex(pattern);
            //string result = rgx.Replace(Article.Article, replacement);
            
            string already = Article.AlreadyCorrect;
            string articlecopy = Article.Article;
            for (int i = 0; i < wronglist.Length; i++)
            {
                if (wronglist[i].ToUpper() == Article.Input.ToUpper() && Article.Enter == 1)
                {
                    int error_remain = wronglist.Count();
                    if (already != "")
                    {
                        error_remain = wronglist.Count() - already.Split(',').Count() / 2;
                    }

                    string result = rgx.Replace(Article.Article, replacement);
                    Article_Process_out final = new Article_Process_out { ArticleID = Article.ArticleID, Article = articlecopy, Correct = "tryagain, No plus or minus score", ArticleDisp = result, ErrorRemain = error_remain, AlreadyCorrect = already, Score = _repository.GetUserScore(username) };
                    return Ok(final);
                }
                    if (Regex.Matches(already, "(?i:" + Article.Input+ "),").Count >= 1 && Article.Enter == 1)
                {
                    int error_remain = wronglist.Count();
                    if (already != "")
                    {
                        error_remain = wronglist.Count() - already.Split(',').Count() / 2;
                    }

                    string result = rgx.Replace(Article.Article, replacement);
                    Article_Process_out final = new Article_Process_out { ArticleID = Article.ArticleID, Article = articlecopy, Correct = "Already Input, No plus or minus score", ArticleDisp = result, ErrorRemain = error_remain, AlreadyCorrect = already, Score = _repository.GetUserScore(username) };
                    return Ok(final);
                }
                else if (correctlist[i].ToUpper() == Article.Input.ToUpper() && Article.Enter == 1)
                {
                    Regex rgx12 = new Regex(wronglist[i]);
                    string correctreplacement = "<span style=\"color: green;\">" + correctlist[i] + "</span>";
                    string result = rgx12.Replace(Article.Article, correctreplacement);
                    string correctreplacementnocolor = correctlist[i];
                    string articleout = rgx12.Replace(articlecopy, correctreplacementnocolor);
                    if (already == "")
                    {
                        already += wronglist[i] + "," + correctlist[i];
                    }
                    else
                    {
                        already += "," + wronglist[i] + "," + correctlist[i];
                    }
                    int error_remain = wronglist.Count() - already.Split(',').Count() / 2;
                    Article_Process_out final = new Article_Process_out { ArticleID = Article.ArticleID, Article = articleout, Correct = "yes,add 1 score", ArticleDisp = result, ErrorRemain = error_remain, AlreadyCorrect = already, Score = _repository.AddUserScore(username) };
                    return Ok(final);
                }
                
            }
            int error_remain1 = wronglist.Count();
            if (already != "")
            {
                error_remain1 = wronglist.Count() - already.Split(',').Count() / 2;
            }

            //string result1 = rgx.Replace(Article.Article, replacement);
            Regex rgx2 = new Regex("(?i:" + Article.Input + ")+");
            string result2 = rgx2.Replace(Article.Article, "<span style=\"color: blue;\">$&</span>");
            Regex rgx3 = new Regex("[A-Za-z]*<span style=\"color: blue;\">(?i:" + Article.Input + ")+</span>[A-Za-z]*");
            string result3 = rgx3.Replace(result2, "<span style=\"background-color: DarkGray;\">$&</span>");
            Article_Process_out final1 = new Article_Process_out { ArticleID = Article.ArticleID, Article = articlecopy, Correct = "No, No plus or minus score", ArticleDisp = result3, ErrorRemain = error_remain1, AlreadyCorrect = already, Score = _repository.GetUserScore(username) };
            if (articlecopy == result3 && Article.Enter==1)
            {
                return Ok(new Article_Process_out { ArticleID = Article.ArticleID, Article = articlecopy, Correct = "No, minus score", ArticleDisp = result3, ErrorRemain = error_remain1, AlreadyCorrect = already, Score = _repository.MinusUserScore(username) });
            }
            return Ok(final1);
        }
    }
}

