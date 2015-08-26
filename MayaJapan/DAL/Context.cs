using MayaJapan.Models;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace MayaJapan.DAL
{
    public class Context : DbContext
    {
        public Context() : base("Context")
        {

        }

        public DbSet<Image> Images { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }

        public System.Data.Entity.DbSet<MayaJapan.Models.ImageGroup> ImageGroups { get; set; }
    }
}