//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace WifeBudgetSystem.DataContext
{
    using System;
    using System.Collections.Generic;
    
    public partial class Bill
    {
        public int BillId { get; set; }
        public int BudgetId { get; set; }
        public int CustomBillId { get; set; }
        public decimal AmountPaid { get; set; }
        public Nullable<System.DateTime> PaymentDate { get; set; }
        public Nullable<int> PaymentTypeId { get; set; }
        public string BillStatus { get; set; }
    
        public virtual Budget Budget { get; set; }
        public virtual CustomBill CustomBill { get; set; }
        public virtual PaymentType PaymentType { get; set; }
    }
}