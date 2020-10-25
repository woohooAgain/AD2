using AgileDiary2.Models;
using Microsoft.AspNetCore.Identity;

namespace AgileDiary2.Infrastructure
{
    public static class UserInitializer
    {
        public static void SeedData(UserManager<ApplicationUser> userManager)
        {
            SeedUsers(userManager);
        }

        private static void SeedUsers(UserManager<ApplicationUser> userManager)
        {
            if (userManager.FindByNameAsync("admin").Result == null)
            {
                var user = new ApplicationUser {UserName = "admin", Email = "ilia.s.kulikov@gmail.com"};
                userManager.CreateAsync(user, "admin");
            }
        }
    }
}
