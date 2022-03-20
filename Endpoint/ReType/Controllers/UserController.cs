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
using Assignment2.Dtos;

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
        public string GetVersion()
        {
            return "V1";
        }
        [HttpPost("Register")]
        public ActionResult Register(Register user)
        {
            User user1 = _repository.Getuser(user.UserName);
            if (user1 == null)
            {
                User c = new User { UserName = user.UserName, Password = user.Password, Email = user.Email, Score = 0 };
                _repository.Register(c);
                return Ok("User successfully registered.");
            }
            else { return Ok("Username not available"); }

        }
        [Authorize]
        [Authorize(Policy = "UserOnly")]
        [HttpGet("Login")]
        public string Login()
        {
            return "Yes";
        }
    }
}

