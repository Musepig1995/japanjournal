using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using MayaJapan.DAL;
using MayaJapan.Models;
using System.IO;

namespace MayaJapan.Controllers
{
    public class ImageGroupsController : Controller
    {
        private Context db = new Context();

        // GET: ImageGroups
        public ActionResult Index()
        {
            return View(db.ImageGroups.ToList());
        }

        // GET: ImageGroups as Grid
        public ActionResult Grid()
        {
            return View(db.ImageGroups.ToList());
        }

        // GET: ImageGroups/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ImageGroup imageGroup = db.ImageGroups.Find(id);
            if (imageGroup == null)
            {
                return HttpNotFound();
            }
            return View(imageGroup);
        }

        // GET: ImageGroups/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: ImageGroups/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "ID,Name,Description,Date")] ImageGroup imageGroup, [Bind(Include = "ImageValue")] string values)
        {
            if (ModelState.IsValid)
            {
                imageGroup.ImageValue = new List<Image>();
                foreach (var image in imageGroup.ImageValue)
                {

                    string imageUrl = image.ImageUrl;
                    Image imageEntity = new Image();
                    imageEntity.ImageUrl = imageUrl;

                    ImagesController.Create(imageEntity);

                    imageGroup.ImageValue.Add(imageEntity);

                }

                imageGroup.Date = DateTime.Now;

                db.ImageGroups.Add(imageGroup);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(imageGroup);
        }

        // GET: ImageGroups/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ImageGroup imageGroup = db.ImageGroups.Find(id);
            if (imageGroup == null)
            {
                return HttpNotFound();
            }
            return View(imageGroup);
        }

        // POST: ImageGroups/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "ID,Name,Description,Date,Url")] ImageGroup imageGroup)
        {
            if (ModelState.IsValid)
            {
                db.Entry(imageGroup).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(imageGroup);
        }

        // GET: ImageGroups/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ImageGroup imageGroup = db.ImageGroups.Find(id);
            if (imageGroup == null)
            {
                return HttpNotFound();
            }
            return View(imageGroup);
        }

        // POST: ImageGroups/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            ImageGroup imageGroup = db.ImageGroups.Find(id);
            db.ImageGroups.Remove(imageGroup);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
