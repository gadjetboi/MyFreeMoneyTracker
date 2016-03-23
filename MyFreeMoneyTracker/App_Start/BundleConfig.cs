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
                        "~/Scripts/bower_components/jquery/dist/jquery.min.js",
                        "~/Scripts/script.js"));

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
            
            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bower_components/bootstrap/dist/js/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Styles/css").Include(
                      "~/Scripts/bower_components/bootstrap/dist/css/bootstrap.min.css",
                      "~/Scripts/bower_components/isteven-angular-multiselect/isteven-multi-select.css",
                      "~/Scripts/bower_components/font-awesome/css/font-awesome.min.css",
                      "~/Scripts/bower_components/kendo-ui/styles/kendo.common.min.css",
                      "~/Scripts/bower_components/kendo-ui/styles/kendo.default.min.css",
                      "~/Scripts/bower_components/angular-ui-switch/angular-ui-switch.min.css",
                      "~/Scripts/bower_components/ng-notify/dist/ng-notify.min.css",

                      "~/Content/css/animate.css",
                      "~/Content/css/form-elements.css",
                      "~/Content/css/media-queries.css",
                      "~/Content/css/site.css"
                      ));

            BundleTable.EnableOptimizations = false;

        }
    }
}
