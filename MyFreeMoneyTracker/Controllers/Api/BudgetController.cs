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
    [RoutePrefix("api")]
    public class BudgetController : ApiController
    {
        private WifeBudgetSystemDbEntities db = new WifeBudgetSystemDbEntities();

        // GET: api/Budget
        [HttpGet]
        [Route("GetBudgetById/{id}")]
        public BudgetModel GetBudgetById(int id)
        {
            var result = (from budget in db.Budgets
                           where budget.BudgetId == id
                           select new BudgetModel {
                               UserId = budget.UserId,
                               BudgetId = budget.BudgetId,
                               DateReceived = budget.DateReceived,
                               ReceivedAmount = budget.ReceivedAmount,
                               Earnings = (from bill in budget.Bills
                                           where bill.AmountPaid != 0
                                           select bill.CustomBill.EstimatedAmount - bill.AmountPaid).Sum() ?? 0M,
                               TotalPaid = (from bill in budget.Bills
                                            select bill.AmountPaid).Sum(),
                               RemainingIncome = budget.ReceivedAmount - (from bill in budget.Bills
                                                                          select bill.AmountPaid).Sum(),
                               Bills = (from bill in budget.Bills
                                        select new BillModel()
                                        {
                                            BillId = bill.BillId,
                                            AmountPaid = bill.AmountPaid,
                                            BillStatus = bill.BillStatus,
                                            BudgetId = bill.BudgetId,
                                            CustomBill = new CustomBillModel() {
                                                CustomBillId = bill.CustomBillId,
                                                UserId = budget.UserId,
                                                BillName = bill.CustomBill.BillName,
                                                EstimatedAmount = bill.CustomBill.EstimatedAmount
                                            },
                                            PaymentDate = bill.PaymentDate,
                                            PaymentType = new PaymentTypeModel() {
                                                PaymentTypeId = bill.PaymentType.PaymentTypeId,
                                                UserId = bill.PaymentType.UserId,
                                                Name = bill.PaymentType.Name
                                            }
                                        }).ToList()
                           }).FirstOrDefault();

            return result;
        }

        // GET: api/Budget/5
        [ResponseType(typeof(BudgetModel))]
        public List<BudgetModel> GetBudget(string id)
        {
            var results = (from budget in db.Budgets
                           where budget.UserId == id
                           orderby budget.DateReceived descending
                           select new BudgetModel
                           {
                               UserId = budget.UserId,
                               BudgetId = budget.BudgetId,
                               DateReceived = budget.DateReceived,
                               ReceivedAmount = budget.ReceivedAmount,
                               Earnings = (from bill in budget.Bills
                                           where bill.AmountPaid != 0
                                           select (bill.CustomBill.EstimatedAmount - bill.AmountPaid)).Sum() ?? 0,
                               TotalPaid = (from bill in budget.Bills
                                            select bill.AmountPaid).Sum(),
                               RemainingIncome = budget.ReceivedAmount - (from bill in budget.Bills
                                                                          select bill.AmountPaid).Sum(),
                               Bills = (from bill in budget.Bills
                                        select new BillModel()
                                        {
                                            BillId = bill.BillId,
                                            AmountPaid = bill.AmountPaid,
                                            BillStatus = bill.BillStatus,
                                            BudgetId = bill.BudgetId,
                                            CustomBill = new CustomBillModel()
                                            {
                                                CustomBillId = bill.CustomBillId,
                                                UserId = budget.UserId,
                                                BillName = bill.CustomBill.BillName,
                                                EstimatedAmount = bill.CustomBill.EstimatedAmount
                                            },
                                            PaymentDate = bill.PaymentDate,
                                            PaymentType = new PaymentTypeModel()
                                            {
                                                PaymentTypeId = bill.PaymentType.PaymentTypeId,
                                                UserId = bill.PaymentType.UserId,
                                                Name = bill.PaymentType.Name
                                            }
                                        }).ToList()
                           }).ToList();

            return results;
        }

        // POST: api/UpdateBudget
        [ResponseType(typeof(BudgetModel))]
        [HttpPost]
        [Route("UpdateBudget")]
        public IHttpActionResult UpdateBudget(BudgetModel budgetModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (budgetModel.BudgetId == 0)
            {
                return BadRequest();
            }

            var billDbs = db.Bills.Where(o => o.BudgetId == budgetModel.BudgetId).ToList();
            var budgetDb = db.Budgets.Where(o => o.BudgetId == budgetModel.BudgetId).FirstOrDefault();

            db.Bills.RemoveRange(billDbs);
            db.Budgets.Remove(budgetDb);

            List<Bill> bills = new List<Bill>();
            foreach (var bill in budgetModel.Bills)
            {
                bills.Add(new Bill()
                {
                    AmountPaid = bill.AmountPaid,
                    BillId = bill.BillId,
                    BillStatus = bill.BillStatus,
                    BudgetId = bill.BudgetId,
                    CustomBillId = bill.CustomBillId,
                    PaymentDate = bill.PaymentDate,
                    PaymentTypeId = bill.PaymentTypeId
                });
            }

            var budget = new Budget()
            {
                BudgetId = budgetModel.BudgetId,
                DateReceived = budgetModel.DateReceived,
                ReceivedAmount = budgetModel.ReceivedAmount,
                UserId = budgetModel.UserId,
                Bills = bills
            };

            db.Budgets.Add(budget);
            db.Bills.AddRange(bills);
            
            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BudgetExists(budgetModel.BudgetId))
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

        // POST: api/Budget
        [ResponseType(typeof(BudgetModel))]
        public IHttpActionResult PostBudget(BudgetModel budgetModel)
        {
            if (!ModelState.IsValid)
            {
                return NotFound();
            }

            List<Bill> bills = new List<Bill>();
            foreach (var billModel in budgetModel.Bills)
            {
                var bill = new Bill()
                {
                    AmountPaid = billModel.AmountPaid,
                    BillId = billModel.BillId,
                    BillStatus = billModel.BillStatus,
                    CustomBillId = billModel.CustomBillId,
                    PaymentTypeId = billModel.PaymentTypeId,
                    PaymentDate = billModel.PaymentDate
                };

                bills.Add(bill);
            }

            var budget = new Budget()
            {
                BudgetId = budgetModel.BudgetId,
                UserId = budgetModel.UserId,
                DateReceived = budgetModel.DateReceived,
                ReceivedAmount = budgetModel.ReceivedAmount,
                Bills = bills
            };

            db.Budgets.Add(budget);
            db.SaveChanges();

            var budgetData = GetBudget(budget.UserId);

            return Ok(budgetData);
        }

        // DELETE: api/Budget/5
        [ResponseType(typeof(Budget))]
        public IHttpActionResult DeleteBudget(int id)
        {
            Budget budget = db.Budgets.Find(id);
            if (budget == null)
            {
                return NotFound();
            }

            db.Budgets.Remove(budget);
            db.SaveChanges();

            return Ok(budget);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BudgetExists(int id)
        {
            return db.Budgets.Count(e => e.BudgetId == id) > 0;
        }
    }
}