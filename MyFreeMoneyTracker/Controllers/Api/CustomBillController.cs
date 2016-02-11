using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using WifeBudgetSystem.DataContext;
using WifeBudgetSystem.Models;

namespace WifeBudgetSystem.Controllers.Api
{
    public class CustomBillController : ApiController
    {
        private WifeBudgetSystemDbEntities db = new WifeBudgetSystemDbEntities();

        // GET: api/CustomBill
        public List<CustomBillModel> GetCustomBills()
        {
            var results = (from customBill in db.CustomBills
                           select new CustomBillModel() {
                               CustomBillId = customBill.CustomBillId,
                               UserId = customBill.UserId,
                               BillName = customBill.BillName,
                               EstimatedAmount = customBill.EstimatedAmount,
                               WebsiteUrl = customBill.WebsiteUrl
                           }).ToList();

            return results;
        }

        // GET: api/CustomBill/5
        [ResponseType(typeof(CustomBillModel))]
        public IHttpActionResult GetCustomBill(string id)
        {
            var results = (from customBill in db.CustomBills
                           where customBill.UserId == id
                           select new CustomBillModel()
                           {
                               CustomBillId = customBill.CustomBillId,
                               UserId = customBill.UserId,
                               BillName = customBill.BillName,
                               EstimatedAmount = customBill.EstimatedAmount,
                               WebsiteUrl = customBill.WebsiteUrl
                           }).ToList();
            
            if (results == null)
            {
                return NotFound();
            }

            return Ok(results);
        }

        // PUT: api/CustomBill/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCustomBill(int id, CustomBill customBill)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != customBill.CustomBillId)
            {
                return BadRequest();
            }

            db.Entry(customBill).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomBillExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/CustomBill
        [ResponseType(typeof(CustomBillModel))]
        public IHttpActionResult PostCustomBill(CustomBillModel customBillModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var customBill = new CustomBill
            {
                BillName = customBillModel.BillName,
                EstimatedAmount = customBillModel.EstimatedAmount,
                UserId = customBillModel.UserId,
                WebsiteUrl = customBillModel.WebsiteUrl
            };

            db.CustomBills.Add(customBill);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (CustomBillExists(customBill.CustomBillId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            customBillModel.CustomBillId = customBill.CustomBillId;

            return Ok(customBillModel);
        }

        // DELETE: api/CustomBill/5
        [ResponseType(typeof(CustomBill))]
        public IHttpActionResult DeleteCustomBill(int id)
        {
            CustomBill customBill = db.CustomBills.Find(id);
            if (customBill == null)
            {
                return NotFound();
            }

            db.CustomBills.Remove(customBill);
            db.SaveChanges();

            return Ok(customBill);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CustomBillExists(int id)
        {
            return db.CustomBills.Count(e => e.CustomBillId == id) > 0;
        }
    }
}