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
            Console.WriteLine(Article.Input + "n");
            string[] wronglist = _repository.WrongWordList(Article.ArticleID);
            string[] correctlist = _repository.CorrectWordList(Article.ArticleID);
            string pattern = pattern1 + Article.Input + pattern3;
            string replacement = "<span style=\"color: LightGray;\">$&</span>";
            Regex rgx = new Regex(pattern);
            //string result = rgx.Replace(Article.Article, replacement);
            int articlediff = _repository.articlediff(Article.ArticleID);
            string already = Article.AlreadyCorrect;
            string articlecopy = Article.Article;
            int wrong = 1;
            for (int i = 0; i < wronglist.Length; i++)
            {
                if (wronglist[i].ToUpper() == Article.Input.ToUpper() && Article.Enter == 1) //Input correct wrong word
                {
                    int error_remain = wronglist.Count();
                    if (already != "")
                    {
                        error_remain = wronglist.Count() - already.Split(',').Count() / 2;
                        
                    }
                    wrong = 0;
                    string result = rgx.Replace(Article.Article, replacement);
                    Article_Process_out final = new Article_Process_out { ArticleID = Article.ArticleID, Article = articlecopy, Correct = "tryagain, No plus or minus score", ArticleDisp = result, ErrorRemain = error_remain, AlreadyCorrect = already, Score = _repository.GetUserScore(username), hint = "", ScoreChange = 0 };
                    return Ok(final);
                }
                if (Regex.Matches(already.ToUpper(), Article.Input.ToUpper()).Count >= 1 && Article.Enter == 1) //Already Input, No plus or minus score
                {
                    int error_remain = wronglist.Count();
                    if (already != "")
                    {
                        error_remain = wronglist.Count() - already.Split(',').Count() / 2;
                    }
                    wrong = 0;
                    string result = rgx.Replace(Article.Article, replacement);
                    Article_Process_out final = new Article_Process_out { ArticleID = Article.ArticleID, Article = articlecopy, Correct = "Already Input, No plus or minus score", ArticleDisp = result, ErrorRemain = error_remain, AlreadyCorrect = already, Score = _repository.GetUserScore(username), hint = "", ScoreChange = 0 };
                    return Ok(final);
                }
                else if (correctlist[i].ToUpper() == Article.Input.ToUpper() && Article.Enter == 1) //add score
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
                    wrong = 0;
                    Article_Process_out final = new Article_Process_out { ArticleID = Article.ArticleID, Article = articleout, Correct = "yes,add score", ArticleDisp = result, ErrorRemain = error_remain, AlreadyCorrect = already, Score = _repository.AddUserScore(username, articlediff), hint = "", ScoreChange = articlediff };
                    return Ok(final);
                }
                
            }
            int error_remain1 = wronglist.Count();
            if (already != "")
            {
                error_remain1 = wronglist.Count() - already.Split(',').Count() / 2;
            }

            //string result1 = rgx.Replace(Article.Article, replacement);
            string temp12 = @"(?<=[\s,.])" + Article.Input + @"(?=[\s,.])";
            for (int i = 1; i < Article.Input.Length; i++)
            {
                temp12 += @"|(?<=[\s,.])" + Article.Input.Substring(0, i) + "[a-zA-Z]{0,1}" + Article.Input.Substring(i + 1) + @"(?=[\s,.])";
            }
            Console.WriteLine(temp12);
            Regex rgx6 = new Regex("(?i:" + temp12 + ")+");
            
            Regex rgx2 = new Regex("(?i:" + Article.Input + ")+");
            string result2 = rgx2.Replace(Article.Article, "<span style=\"color: blue;\">$&</span>");
            string result6 = rgx6.Replace(result2, "<span style=\"color: #e25555;\">$&</span>");
            Regex rgx3 = new Regex("[A-Za-z]*<span style=\"color: blue;\">(?i:" + Article.Input + ")+</span>[A-Za-z]*");
            string result3 = rgx3.Replace(result6, "<span style=\"background-color: DarkGray;\">$&</span>");
            Article_Process_out final1 = new Article_Process_out { ArticleID = Article.ArticleID, Article = articlecopy, Correct = "No, No plus or minus score", ArticleDisp = result3, ErrorRemain = error_remain1, AlreadyCorrect = already, Score = _repository.GetUserScore(username), hint = "", ScoreChange = 0 };

            if (articlecopy == result3 && Article.Enter== 1 && Article.hint == 0)
            {
                return Ok(new Article_Process_out { ArticleID = Article.ArticleID, Article = articlecopy, Correct = "No, minus score", ArticleDisp = result3, ErrorRemain = error_remain1, AlreadyCorrect = already, Score = _repository.MinusUserScore(username, articlediff), hint = "", ScoreChange = -1 * articlediff });
            }
            if (wrong == 1 && Article.Enter == 1 && Article.hint == 0)
            {
                return Ok(new Article_Process_out { ArticleID = Article.ArticleID, Article = articlecopy, Correct = "No, minus score", ArticleDisp = result3, ErrorRemain = error_remain1, AlreadyCorrect = already, Score = _repository.MinusUserScore(username, articlediff), hint = "", ScoreChange = -1 * articlediff });
            }
            if (Article.hint == 1)
            {
                for (int i = 0; i < correctlist.Count(); i++)
                {
                    if (Regex.Matches(already.ToUpper(), correctlist[i].ToUpper()).Count == 0)
                    {
                        Regex rgx4 = new Regex("(?i:" + wronglist[i] + ")+");
                        string result4 = rgx4.Replace(Article.Article, "<span style=\"color: blue;\">$&</span>");
                        return Ok(new Article_Process_out { ArticleID = Article.ArticleID, Article = articlecopy, Correct = "Hint", ArticleDisp = result4, ErrorRemain = error_remain1, AlreadyCorrect = already, Score = _repository.MinusUserScore(username, 1), hint = wronglist[i], ScoreChange = -1 });
                    }
                }
            }
            //if (articlecopy == result3 && Article.hint == 0)
            //{
            //    string temp12 = Article.Input + "[a-zA-Z]*";
            //    for (int i = 0; i < Article.Input.Length; i++)
            //    {
            //        temp12 += "|" + Article.Input.Substring(0, i) + "[a-zA-Z]*" + Article.Input.Substring(i + 1);
            //    }
            //    Console.WriteLine(temp12);
            //    Regex rgx6 = new Regex("(?i:" + temp12 + ")+");
            //    string result6 = rgx6.Replace(Article.Article, "<span style=\"color: #e25555;\">$&</span>");
            //    return Ok(new Article_Process_out { ArticleID = Article.ArticleID, Article = articlecopy, Correct = "No, No plus or minus score", ArticleDisp = result6, ErrorRemain = error_remain1, AlreadyCorrect = already, Score = _repository.GetUserScore(username), hint = "", ScoreChange = 0 });
            //}
            return Ok(final1);
        }

    }
}

