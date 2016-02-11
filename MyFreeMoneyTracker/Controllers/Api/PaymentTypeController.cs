using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using WifeBudgetSystem.DataContext;
using WifeBudgetSystem.Models;

namespace WifeBudgetSystem.Controllers.Api
{
    public class PaymentTypeController : ApiController
    {
        private WifeBudgetSystemDbEntities db = new WifeBudgetSystemDbEntities();

        // GET: api/PaymentType
        public List<PaymentTypeModel> GetPaymentTypes()
        {
            var results = (from paymentType in db.PaymentTypes
                           where paymentType.UserId != "" //Not include the default
                           select new PaymentTypeModel()
                           {
                              PaymentTypeId = paymentType.PaymentTypeId,
                              UserId = paymentType.UserId,
                              Name = paymentType.Name
                           }).ToList();

            return results;
        }

        // GET: api/PaymentType/5
        [ResponseType(typeof(PaymentTypeModel))]
        public IHttpActionResult GetPaymentType(string id)
        {
            var result = (from paymentType in db.PaymentTypes
                           where paymentType.UserId == id
                           select new PaymentTypeModel()
                           {
                               PaymentTypeId = paymentType.PaymentTypeId,
                               UserId = paymentType.UserId,
                               Name = paymentType.Name
                           }).ToList();
            
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }


        // PUT: api/PaymentType/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutPaymentType(int id, PaymentType paymentType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != paymentType.PaymentTypeId)
            {
                return BadRequest();
            }

            db.Entry(paymentType).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymentTypeExists(id))
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

        // POST: api/PaymentType
        [ResponseType(typeof(PaymentType))]
        public IHttpActionResult PostPaymentType(PaymentType paymentType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.PaymentTypes.Add(paymentType);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (PaymentTypeExists(paymentType.PaymentTypeId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = paymentType.PaymentTypeId }, paymentType);
        }

        // DELETE: api/PaymentType/5
        [ResponseType(typeof(PaymentType))]
        public IHttpActionResult DeletePaymentType(int id)
        {
            PaymentType paymentType = db.PaymentTypes.Find(id);
            if (paymentType == null)
            {
                return NotFound();
            }

            db.PaymentTypes.Remove(paymentType);
            db.SaveChanges();

            return Ok(paymentType);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PaymentTypeExists(int id)
        {
            return db.PaymentTypes.Count(e => e.PaymentTypeId == id) > 0;
        }
    }
}