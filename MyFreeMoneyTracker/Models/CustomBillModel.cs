using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WifeBudgetSystem.Models
{
    public class CustomBillModel
    {
        public int CustomBillId { get; set; }
        public string UserId { get; set; }
        public string BillName { get; set; }
        public decimal? EstimatedAmount { get; set; }
        public string WebsiteUrl { get; set; }
    }
}