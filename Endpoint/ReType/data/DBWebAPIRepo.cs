using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ReType.Model;
using ReType.Data;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Collections;
using System.Net.Mail;
using System.Text;

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
            User c = _dbContext.User.FirstOrDefault(e => e.UserName == userName && e.Password == password); //Vaild username and password from database and user input
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
        public void Storeverificationcode(Verificationcode code)
        {
            EntityEntry<Verificationcode> e = _dbContext.Verificationcode.Add(code);
            _dbContext.SaveChanges();
        }
        public Verificationcode Getverificationcode(string email, string code)
        {
            Verificationcode fullcode = _dbContext.Verificationcode.FirstOrDefault(e => e.Email == email && e.code == code); //Find verification code exist in database or not
            return fullcode;
        }
        public void Deleteverificationcode(Verificationcode code)
        {
            _dbContext.Verificationcode.Remove(code);
            _dbContext.SaveChanges();
        }
        public Verificationcode findemail(string email)
        {
            Verificationcode fullcode = _dbContext.Verificationcode.FirstOrDefault(e => e.Email == email); //Find verification code exist in database or not
            return fullcode;
        }
        public User Getuserbyemail(string Email)
        {
            User user = _dbContext.User.FirstOrDefault(e => e.Email == Email); //Find username exist in database or not
            return user;
        }
        public void UpdateUserDetail(User user)
        {
            _dbContext.Update(user);
            _dbContext.SaveChanges();
        }
    }
}
