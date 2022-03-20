using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ReType.Model;
using ReType.Data;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Collections;

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
    }
}
