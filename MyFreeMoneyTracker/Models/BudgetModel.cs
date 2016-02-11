using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WifeBudgetSystem.Models
{
    public class BudgetModel
    {
        public int BudgetId { get; set; }
        public string UserId { get; set; }
        public decimal ReceivedAmount { get; set; }
        public DateTime? DateReceived { get; set; }
       
        public decimal? Earnings { get; set; }
        public decimal? TotalPaid { get; set; }
        public decimal? RemainingIncome { get; set; }

        public List<BillModel> Bills { get; set; }
       
    }
}