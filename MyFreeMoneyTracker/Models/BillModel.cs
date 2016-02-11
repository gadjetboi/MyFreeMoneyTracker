using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WifeBudgetSystem.Models
{
    public class BillModel
    {
        public int BillId { get; set; }
        public int BudgetId { get; set; }
        public decimal AmountPaid { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string BillStatus { get; set; }
        public int CustomBillId { get; set; }
        public int PaymentTypeId { get; set; }

        public CustomBillModel CustomBill { get; set; }
        public PaymentTypeModel PaymentType { get; set; }
    }
}