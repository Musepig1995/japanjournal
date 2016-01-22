using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MayaJapan.Controllers
{
    public class CountdownController : Controller
    {
        // GET: Countdown
        public ActionResult Index()
        {
            return View();
        }
    }
}