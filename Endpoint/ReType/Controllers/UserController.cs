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
        [HttpGet("Registrationverificationcode/{email}")] //Send a verification code to verify the validity of the mailbox
        public string Registrationverificationcode(string email)
        {
            User user1 = _repository.Getuserbyemail(email);
            if (user1 != null)
            {
                return "This email has been registered by another user";
            }
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
        // POST /api/Register  //Register a new user and make sure the mailbox is valid
        [HttpPost("Register")]
        public string Register(Register user) //Register function
        {
            User user1 = _repository.Getuser(user.UserName); //Username alread exist or not
            if (user1 == null)
            {
                Verificationcode c = _repository.Getverificationcode(user.Email, user.Code);
                if (c == null)
                {
                    return "verification code Wrong";
                }
                else if (c.Date.AddMinutes(30) <= DateTime.Now)
                {
                    _repository.Deleteverificationcode(c);
                    return "verification code timeout";
                }
                else
                {
                    _repository.Deleteverificationcode(c);
                }
                User c1 = new User { UserName = user.UserName, Password = user.Password, Email = user.Email, Score = 0 }; //From user input get data and store in database
                _repository.Register(c1);
                return "User successfully registered.";
            }
            else { return "Username not available"; }

        }
        // GET /api/Login
        [Authorize]
        [Authorize(Policy = "UserOnly")] //Vaild user login
        [HttpGet("Login")]
        public string Login() //if Vaild success, give back to front-end. Otherwise return error
        {
            return "Yes";
        }
        [Authorize]
        [Authorize(Policy = "UserOnly")] //Vaild user login
        [HttpPost("Changepassword")]
        public string ChangePassword(Changepassword password)  //Allows users to change passwords
        {
            User c = _repository.Getuser(password.UserName);
            c.Password = password.Password;
            _repository.UpdateUserDetail(c);
            return "success";
        }
        [HttpGet("Resetpasswordcode/{email}")]   //Forget password option
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
        [HttpPost("ResetPassword")]
        public string ResetPassword(ResetPassword code)
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
                User c1 = _repository.Getuserbyemail(code.Email);
                c1.Password = code.Password;
                _repository.UpdateUserDetail(c1);
                return "success";
            }
        }
        [Authorize]
        [Authorize(Policy = "UserOnly")] //Vaild user login
        [HttpPost("UpdateUserDetail")] //Allows users to add personal information
        public string UpdateUserDetail(UpdateUser user)
        {
            User c = _repository.Getuser(user.UserName);
            c.Name = user.Name;
            c.Dataofbirth = user.Dataofbirth;
            c.Gerder = user.Gerder;
            _repository.UpdateUserDetail(c);
            return "success";
        }
        [Authorize]
        [Authorize(Policy = "UserOnly")] //Vaild user login
        [HttpPost("UpdateEmail")] //Allows users to change mailboxes
        public string UpdateEmail(UpdateEmail user)
        {
            Verificationcode c = _repository.Getverificationcode(user.Email, user.Code);
            if (c == null)
            {
                return "verification code Wrong";
            }
            else if (c.Date.AddMinutes(30) <= DateTime.Now)
            {
                _repository.Deleteverificationcode(c);
                return "verification code timeout";
            }
            else
            {
                _repository.Deleteverificationcode(c);

                User c1 = _repository.Getuser(user.UserName);
                c1.Email = user.Email;
                _repository.UpdateUserDetail(c1);
                return "success";
            }
        }
        [HttpGet("UpdateEmailverificationcode/{email}")]  //Verify the mailbox changed by the user
        public string UpdateEmailverificationcode(string email)
        {
            Random random = new Random();
            int single;
            string code = string.Empty;
            for (int p = 0; p < 6; p++)
            {
                single = Convert.ToInt32(random.NextDouble() * 10);
                code += single;
            }
            string content = "Update Email verification code：" + code;
            _repository.Send(email, "【Retype】Update Email verification code", content);//收件人邮箱，邮箱标题，邮箱内容
            Verificationcode c = new Verificationcode { Email = email, code = code, Date = DateTime.Now };
            _repository.Storeverificationcode(c);
            return "yes";
        }
    }
}

