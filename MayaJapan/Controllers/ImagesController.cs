using MayaJapan.DAL;
using MayaJapan.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MayaJapan.Controllers
{
    public class ImagesController : Controller
    {
        private static Context db = new Context();

        // GET: Images
        public ActionResult Index()
        {
            return View();
        }

        public static void Create(Image image)
        {
            if (image.ImageUrl != null)
            {
                // To prevent EF from preventing creation we have to create a new object
                Image tempImage = image;
                db.Images.Add(tempImage);
                return;
            }

            throw new ArgumentException("Image entered is not of the correct format");
        }
        
        public ActionResult DeleteAll()
        {
            var entities = db.Images.ToList();
            db.Images.RemoveRange(entities);
            db.SaveChanges();
            return View("Home");
        }
    }
}