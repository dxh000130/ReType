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
        [HttpGet("email")]
        public string email()
        {
            _repository.Send("shan786@aucklanduni.ac.nz", "Test", "test");
            return "yes";
        }
    }
}

