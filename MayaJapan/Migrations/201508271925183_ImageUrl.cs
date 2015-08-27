namespace MayaJapan.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ImageUrl : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Image", "ImageValue");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Image", "ImageValue", c => c.Binary());
        }
    }
}
