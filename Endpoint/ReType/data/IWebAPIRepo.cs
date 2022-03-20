using ReType.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReType.data
{
    public interface IWebAPIRepo
    {
        void SaveChanges();
        bool ValidLogin(string userName, string password);
        void Register(User user);
        User Getuser(string Username);
        bool Send(string to, string subject, string body);
    }
}
