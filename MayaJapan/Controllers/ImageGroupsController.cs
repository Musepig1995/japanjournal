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
using System.Resources;
using PagedList;

namespace MayaJapan.Controllers
{
    public class ImageGroupsController : Controller
    {
        private Context db = new Context();

        // GET: ImageGroups
        public ActionResult Index(int? page)
        {
            int pageSize = 8;
            int pageNumber = page ?? 1;
            return View(db.ImageGroups.OrderByDescending(i => i.ID).ToPagedList(pageNumber, pageSize));
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
        [ValidateInput(false)]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "ID,Name,Description,Date")] ImageGroup imageGroup)
        {
            if (ModelState.IsValid)
            {
                var unformattedUrlSet = Request["images"] != null ? Request["images"] : null;
                string[] imageUrlSet = null;

                if (!string.IsNullOrEmpty(unformattedUrlSet))
                {
                    imageUrlSet = this.stripImageUrl(unformattedUrlSet);

                    imageGroup.ImageValue = new List<Image>();

                    foreach (var image in imageUrlSet)
                    {

                        Image imageEntity = new Image();
                        imageEntity.ImageUrl = image.Trim();

                        ImagesController.Create(imageEntity);

                        imageGroup.ImageValue.Add(imageEntity);

                    }
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
        [ValidateInput(false)]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "ID,Date,Name,Description")] ImageGroup imageGroup)
        {
            if (ModelState.IsValid)
            {

                var password = Request["Password"] != null ? Request["Password"] : null;

                if (password == Properties.Resources.Password)
                {
                    db.Entry(imageGroup).State = EntityState.Modified;
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }
            }
            return View(imageGroup);
        }

        public ActionResult Delete(int? id)
        {
            if(id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            var imageGroup = db.ImageGroups.Find(id.Value);

            if(imageGroup == null)
            {
                return HttpNotFound();
            }

            return View(imageGroup);
        }

        public void Clear()
        {
            var imageGroups = db.ImageGroups.ToArray();
            foreach (var imageGroup in imageGroups)
            {
                var images = imageGroup.ImageValue.ToArray();

                foreach (var image in images)
                {
                    db.Images.Remove(image);
                }
                db.ImageGroups.Remove(imageGroup);
            }

            db.SaveChanges();
        }

        [HttpPost]
        // POST: ImageGroups/Delete/5
        public ActionResult Delete([Bind(Include = "Id")] ImageGroup imageGroup)
        {
            var password = Request["Password"] != null ? Request["Password"] : null;

            var realImageGroup = db.ImageGroups.Find(imageGroup.ID);

            if(password == null)
            {
                return View(imageGroup);
            } else if(password != Properties.Resources.Password)
            {
                return new HttpUnauthorizedResult();
            } else
            {
                var images = realImageGroup.ImageValue.ToArray();

                foreach (var image in images)
                {
                    db.Images.Remove(image);
                }

                db.ImageGroups.Remove(realImageGroup);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private string[] stripImageUrl(string urlSet)
        {
            var imageArray = urlSet.Split(',');
            return imageArray;
        }
    }
}
