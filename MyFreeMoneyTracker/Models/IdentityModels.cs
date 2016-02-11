using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;

namespace WifeBudgetSystem.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager, string authenticationType)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }
    }

    public class WifeBudgetIdentityDbContext : IdentityDbContext<ApplicationUser>
    {
        public WifeBudgetIdentityDbContext()
            : base("IdentityConnection", throwIfV1Schema: false)
        {
        }
        
        public static WifeBudgetIdentityDbContext Create()
        {
            return new WifeBudgetIdentityDbContext();
        }

        public System.Data.Entity.DbSet<WifeBudgetSystem.DataContext.Budget> Budgets { get; set; }

        public System.Data.Entity.DbSet<WifeBudgetSystem.DataContext.Bill> Bills { get; set; }
    }
}