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

namespace ReType.Controllers
{
    [Route("api")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IWebAPIRepo _repository;

        public UserController(IWebAPIRepo repository)
        {
            _repository = repository;
        }
        // GET /api/GetVersion
        [HttpGet("GetVersion")]
        public string GetVersion() //API version
        {
            return "V1";
        }
        // POST /api/Register
        [HttpPost("Register")]
        public ActionResult Register(Register user) //Register function
        {
            User user1 = _repository.Getuser(user.UserName); //Username alread exist or not
            if (user1 == null)
            {
                User c = new User { UserName = user.UserName, Password = user.Password, Email = user.Email, Score = 0 }; //From user input get data and store in database
                _repository.Register(c);
                return Ok("User successfully registered.");
            }
            else { return Ok("Username not available"); }

        }
        // GET /api/Login
        [Authorize]
        [Authorize(Policy = "UserOnly")] //Vaild user login
        [HttpGet("Login")]
        public string Login() //if Vaild success, give back to front-end. Otherwise return error
        {
            return "Yes";
        }
        [HttpGet("Registrationverificationcode/{email}")]
        public string Registrationverificationcode(string email)
        {
            Verificationcode c1 = _repository.findemail(email);
            if (c1 != null)
            {
                _repository.Deleteverificationcode(c1);
            }
            Random random = new Random();
            int single;
            string code = string.Empty;
            for (int p = 0; p < 6; p++)
            {
                single = Convert.ToInt32(random.NextDouble() * 10);
                code += single;
            }
            string content = "Registration verification code：" + code;
            _repository.Send(email, "【Retype】Registration verification code", content);//收件人邮箱，邮箱标题，邮箱内容
            Verificationcode c = new Verificationcode { Email = email, code = code, Date = DateTime.Now };
            _repository.Storeverificationcode(c);
            return "yes";
        }
        [HttpGet("Resetpasswordcode/{email}")]
        public string Resetpasswordcode(string email)
        {
            Verificationcode c1 = _repository.findemail(email);
            if (c1 != null)
            {
                _repository.Deleteverificationcode(c1);
            }
            User user1 = _repository.Getuserbyemail(email);
            if (user1 == null)
            {
                return "The user is not found in the database";
            }
            Random random = new Random();
            int single;
            string code = string.Empty;
            for (int p = 0; p < 6; p++)
            {
                single = Convert.ToInt32(random.NextDouble() * 10);
                code += single;
            }
            string content = "Reset password verification code：" + code;
            _repository.Send(email, "【Retype】Reset password verification code", content);//收件人邮箱，邮箱标题，邮箱内容
            Verificationcode c = new Verificationcode { Email = email, code = code, Date = DateTime.Now };
            _repository.Storeverificationcode(c);
            return "yes";
        }
        [HttpPost("verifycode")]
        public string verifycode(Verifycode code)
        {
            Verificationcode c = _repository.Getverificationcode(code.Email, code.Code);
            if (c == null)
            {
                return "verification code Wrong";
            } else if (c.Date.AddMinutes(30) <= DateTime.Now)
            {
                _repository.Deleteverificationcode(c);
                return "verification code timeout";
            }
            else {
                _repository.Deleteverificationcode(c);
                return "Correct";
                    }
        }
        [Authorize]
        [Authorize(Policy = "UserOnly")] //Vaild user login
        [HttpPost("UpdateUserDetail")]
        public string UpdateUserDetail(UpdateUser user)
        {
            User c = _repository.Getuser(user.UserName);
            c.Name = user.Name;
            c.Dataofbirth = user.Dataofbirth;
            c.Gerder = user.Gerder;
            _repository.UpdateUserDetail(c);
            return "success";
        }
    }
}

