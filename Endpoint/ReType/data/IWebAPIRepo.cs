using ReType.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReType.data
{
    public interface IWebAPIRepo
    {
        void SaveChanges(); //Save change to database
        bool ValidLogin(string userName, string password); //Vaild username and password from database and user input
        void Register(User user);// Add new user to database
        User Getuser(string Username);//Find username exist in database or not
        bool Send(string to, string subject, string body);//Send email to user
        void Storeverificationcode(Verificationcode code);
        Verificationcode Getverificationcode(string email, string code);
        void Deleteverificationcode(Verificationcode code);
        Verificationcode findemail(string email);
        User Getuserbyemail(string Email);
        void UpdateUserDetail(User user);
        void UpdateEmail(User user);
        bool ValidLoginbyemail(string Email, string password);
    }
}
