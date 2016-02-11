using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WifeBudgetSystem.DataContext;
using WifeBudgetSystem.Models;

namespace WifeBudgetSystem.DataRepository
{
    public class UserRepository
    {
        private WifeBudgetSystemDbEntities db = new WifeBudgetSystemDbEntities();

        public UserDetailViewModel GetUserDetail(string userId)
        {
            var result = (from userDetail in db.UserDetails
                          where userDetail.UserId == userId
                          select new UserDetailViewModel
                          {
                              UserDetailId = userDetail.UserDetailId,
                              UserId = userDetail.UserId,
                              FirstName = userDetail.FirstName,
                              LastName = userDetail.LastName
                          }).FirstOrDefault();

            return result;
        }

        public bool RegisterUserDetail(UserDetail model)
        {
            db.UserDetails.Add(model);
            db.SaveChanges();

            return true;
        }
    }
}