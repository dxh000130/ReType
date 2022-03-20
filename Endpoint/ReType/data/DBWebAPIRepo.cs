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

        public DBWebAPIRepo(WebAPIDBContext dbContext)
        {
            _dbContext = dbContext;
        }
        public void SaveChanges()
        {
            _dbContext.SaveChanges();
        }
        public bool ValidLogin(string userName, string password)
        {
            User c = _dbContext.User.FirstOrDefault(e => e.UserName == userName && e.Password == password);
            if (c == null)
                return false;
            else
                return true;
        }
        public void Register(User user)
        {
            EntityEntry<User> e = _dbContext.User.Add(user);
            _dbContext.SaveChanges();
        }
        public User Getuser(string Username)
        {
            User user = _dbContext.User.FirstOrDefault(e => e.UserName == Username);
            return user;
        }
        public bool Send(string to, string subject, string body)
        {
            MailMessage message = new MailMessage();

            message.From = new MailAddress("xdua752@gmail.com");
            message.To.Add(new MailAddress(to));

            message.SubjectEncoding = Encoding.GetEncoding("UTF-8");
            message.Subject = subject;

            message.BodyEncoding = Encoding.GetEncoding("UTF-8");
            message.Body = body;
            message.IsBodyHtml = true;

            SmtpClient smtpclient = new SmtpClient("smtp.gmail.com", 587);
            smtpclient.Credentials = new System.Net.NetworkCredential("xdua752@gmail.com", "zvkfwrpekddzeedf");
            smtpclient.EnableSsl = true;
            smtpclient.Send(message);

            return true;
        }

    }
}
