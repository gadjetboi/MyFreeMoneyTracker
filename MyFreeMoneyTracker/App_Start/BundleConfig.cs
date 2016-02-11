using System.Web;
using System.Web.Optimization;

namespace WifeBudgetSystem
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/bower_components/jquery/dist/jquery.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                        "~/Scripts/bower_components/angular/angular.min.js",
                        "~/Scripts/bower_components/angular-route/angular-route.min.js",
                        "~/Scripts/bower_components/angular-smart-table/dist/smart-table.min.js",
                        "~/Scripts/bower_components/isteven-angular-multiselect/isteven-multi-select.js",
                        "~/Scripts/bower_components/ngTouchSpin/src/js/ngTouchSpin.min.js",
                        "~/Scripts/bower_components/angular-bootstrap/ui-bootstrap.min.js",
                        "~/Scripts/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
                        "~/Scripts/bower_components/kendo-ui/js/kendo.all.min.js",
                        "~/Scripts/bower_components/angular-ui-switch/angular-ui-switch.min.js",
                        "~/Scripts/bower_components/angular-local-storage/dist/angular-local-storage.min.js",
                        "~/Scripts/bower_components/angular-sanitize/angular-sanitize.min.js",
                        "~/Scripts/bower_components/ng-notify/dist/ng-notify.min.js"
                        ));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bower_components/bootstrap/dist/js/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Scripts/bower_components/bootstrap/dist/css/bootstrap.min.css",
                      "~/Scripts/bower_components/isteven-angular-multiselect/isteven-multi-select.css",
                      "~/Content/bower_components/font-awesome/css/font-awesome.min.css",
                      "~/Scripts/bower_components/kendo-ui/styles/kendo.common.min.css",
                      "~/Scripts/bower_components/kendo-ui/styles/kendo.default.min.css",
                      "~/Scripts/bower_components/angular-ui-switch/angular-ui-switch.min.css",
                      "~/Scripts/bower_components/ng-notify/dist/ng-notify.min.css",
                      "~/Content/site.css"
                      ));

            //BundleTable.EnableOptimizations = false;

        }
    }
}
