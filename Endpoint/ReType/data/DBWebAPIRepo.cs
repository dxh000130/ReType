﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ReType.Model;
using ReType.Data;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Collections;
using System.Net.Mail;
using System.Text;
using Google.Apis.Auth;

namespace ReType.data
{
    public class DBWebAPIRepo : IWebAPIRepo
    {
        private readonly WebAPIDBContext _dbContext;

        public DBWebAPIRepo(WebAPIDBContext dbContext) //Connect to database
        {
            _dbContext = dbContext;
        }
        public void SaveChanges()
        {
            _dbContext.SaveChanges(); //Sava database change
        }
        public bool ValidLogin(string userName, string password)
        {
            string str = String.Concat(userName, password);
            if (str.Contains("exec") | str.Contains("insert") | str.Contains("select") | str.Contains("delete") | str.Contains("update") | str.Contains("count") | str.Contains("*") | str.Contains("chr") | str.Contains("mid") | str.Contains("master") | str.Contains("truncate") | str.Contains("char") | str.Contains("declare") | str.Contains("="))
            {
                return false;
            }
            User c = _dbContext.User.FirstOrDefault(e => (e.UserName == userName && e.Password == password )); //Vaild username and password from database and user input
            if (c == null)
                return false;
            else
                return true;
        }
        public bool ValidLoginbyemail(string Email, string password) 
        {
            User c = _dbContext.User.FirstOrDefault(e => (e.Email == Email && e.Password == password)); //Vaild email and password from database and user input
            if (c == null)
                return false;
            else
                return true;
        }
        public void Register(User user)
        {
            EntityEntry<User> e = _dbContext.User.Add(user); // Add new user to database
            _dbContext.SaveChanges(); //Sava database change
        }
        public User Getuser(string Username)
        {
            User user = _dbContext.User.FirstOrDefault(e => e.UserName == Username); //Find username exist in database or not
            return user;
        }
        public bool Send(string to, string subject, string body) //Send email to user
        {
            MailMessage email = new MailMessage(); // Initial

            email.From = new MailAddress("xdua752@gmail.com"); // Send from my email
            email.To.Add(new MailAddress(to)); // Send to user

            email.SubjectEncoding = Encoding.GetEncoding("UTF-8"); //Title Encoding
            email.Subject = subject; //Subject

            email.BodyEncoding = Encoding.GetEncoding("UTF-8"); //Email Body endcoding
            email.Body = body; //Email body
            email.IsBodyHtml = true; //Body style

            SmtpClient smtp_Gmail = new SmtpClient("smtp.gmail.com", 587); // Email server (Use GOOGLE Gmail as server)
            smtp_Gmail.Credentials = new System.Net.NetworkCredential("xdua752@gmail.com", "zvkfwrpekddzeedf"); // Login to Gmail
            smtp_Gmail.EnableSsl = true; // Securte option (Gmail require)
            smtp_Gmail.Send(email); //Send email

            return true;
        }
        public void Storeverificationcode(Verificationcode code) //Store verification code
        {
            EntityEntry<Verificationcode> e = _dbContext.Verificationcode.Add(code);
            _dbContext.SaveChanges();
        }
        public Verificationcode Getverificationcode(string email, string code) //Vaild verification code
        {
            Verificationcode fullcode = _dbContext.Verificationcode.FirstOrDefault(e => e.Email == email && e.code == code); //Find verification code exist in database or not
            return fullcode;
        }
        public void Deleteverificationcode(Verificationcode code) //Delete the used verification code
        {
            _dbContext.Verificationcode.Remove(code);
            _dbContext.SaveChanges();
        }
        public Verificationcode findemail(string email) //Vaild email in database or not
        {
            Verificationcode fullcode = _dbContext.Verificationcode.FirstOrDefault(e => e.Email == email); //Find verification code exist in database or not
            return fullcode;
        }
        public User Getuserbyemail(string Email) //Get user by user email
        {
            User user = _dbContext.User.FirstOrDefault(e => e.Email == Email); //Find username exist in database or not
            return user;
        }
        public void UpdateUserDetail(User user) //Update User detail
        {
            _dbContext.Update(user);
            _dbContext.SaveChanges();
        }
        public void UpdateEmail(User user) //Update user email
        {
            _dbContext.Update(user);
            _dbContext.SaveChanges();
        }
        public bool preventsqlinjection(string str) //Prevent users from using SQL commands to compromise database security
        {
            str = str.ToLower();
            if (str.Contains("exec") | str.Contains("insert") | str.Contains("select") | str.Contains("delete") | str.Contains("update") | str.Contains("count") | str.Contains("*") | str.Contains("chr") | str.Contains("mid") | str.Contains("master") | str.Contains("truncate") | str.Contains("char") | str.Contains("declare") | str.Contains("="))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        public async Task<bool> VaildGoogleTokenAsync(string token, string email)
        {
            bool valid = true;
            try
            {
                GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(token);
                if (!payload.Audience.Equals("975748479216-60enjv40f4i887qegvcnsi63bqigeveq.apps.googleusercontent.com"))
                {
                    valid = false;
                    Console.Error.WriteLine("11");
                    Console.Error.WriteLine(payload.Audience.ToString());
                }
                if (!payload.Issuer.Equals("accounts.google.com") && !payload.Issuer.Equals("https://accounts.google.com"))
                {
                    valid = false;
                    Console.Error.WriteLine("22");
                }
                if (payload.ExpirationTimeSeconds == null)
                {
                    valid = false;
                    Console.Error.WriteLine("33");
                }
                if (payload.Email != email)
                {
                    valid = false;
                    Console.Error.WriteLine(payload.Email);
                }
                else
                {
                    DateTime now = DateTime.Now.ToUniversalTime();
                    DateTime expiration = DateTimeOffset.FromUnixTimeSeconds((long)payload.ExpirationTimeSeconds).DateTime;
                    if (now > expiration)
                    {
                        valid = false;
                        Console.Error.WriteLine("44");
                    }
                }
            }
            catch (Exception e)
            {
                valid = false;
                Console.Error.WriteLine("55");
            }
            return valid;
        }
        public Article ChooseArticle(string diff, string type)
        {
            Article c = _dbContext.Article.FirstOrDefault(e => (e.Difficulty == diff && e.Type == type));
            return c;
        }
    }
}
