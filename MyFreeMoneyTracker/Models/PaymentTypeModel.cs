using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WifeBudgetSystem.Models
{
    public class PaymentTypeModel
    {
        public int PaymentTypeId { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
    }
}