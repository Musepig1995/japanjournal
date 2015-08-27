namespace MayaJapan.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdatedToString : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Image", "ImageUrl", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Image", "ImageUrl");
        }
    }
}
