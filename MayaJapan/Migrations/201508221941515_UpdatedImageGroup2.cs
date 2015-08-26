namespace MayaJapan.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdatedImageGroup2 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ImageGroup",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Description = c.String(),
                        Date = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ID);
            
            AddColumn("dbo.Image", "ImageValue", c => c.Binary());
            AddColumn("dbo.Image", "ImageGroup_ID", c => c.Int());
            CreateIndex("dbo.Image", "ImageGroup_ID");
            AddForeignKey("dbo.Image", "ImageGroup_ID", "dbo.ImageGroup", "ID");
            DropColumn("dbo.Image", "Name");
            DropColumn("dbo.Image", "Description");
            DropColumn("dbo.Image", "Date");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Image", "Date", c => c.DateTime(nullable: false));
            AddColumn("dbo.Image", "Description", c => c.String());
            AddColumn("dbo.Image", "Name", c => c.String());
            DropForeignKey("dbo.Image", "ImageGroup_ID", "dbo.ImageGroup");
            DropIndex("dbo.Image", new[] { "ImageGroup_ID" });
            DropColumn("dbo.Image", "ImageGroup_ID");
            DropColumn("dbo.Image", "ImageValue");
            DropTable("dbo.ImageGroup");
        }
    }
}
