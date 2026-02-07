frappe.pages['localization_dashboard'].on_page_load = function(wrapper) {
    // Create the Frappe page without header
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: '', // Empty title
        single_column: true
    });

    // Hide the Frappe navbar at the top (search, notifications, user menu)
    $('.navbar.navbar-expand').hide();
    
    // Hide the page header (title bar)
    $(wrapper).find('.page-head').hide();
    
    // Remove ALL padding and margins for full-width layout
    $(wrapper).css({
        'padding': '0',
        'margin': '0'
    });
    
    $(page.main).css({
        'padding': '0',
        'margin': '0'
    });
    
    $(page.body).css({
        'padding': '0',
        'margin': '0',
        'height': '100%',
        'width': '100%'
    });

    // Create a div for Vue to mount to
    const vueContainer = $('<div id="vue-dashboard-app" style="width: 100%; height: 100vh;"></div>');
    $(page.body).append(vueContainer);

    // Load the compiled Vue bundle
    frappe.require('/assets/localization_hub/js/dashboard/dashboard.compiled.js', function() {
        // Initialize the Vue app
        if (window.initDashboardApp) {
            window.initDashboardApp('#vue-dashboard-app');
        } else {
            console.error('Vue Dashboard App not found. Did you run npm run build?');
            $(vueContainer).html(`
                <div style="padding: 40px; text-align: center;">
                    <h3 style="color: #d63939;">⚠️ Build Required</h3>
                    <p>Please run: <code>npm run build</code></p>
                </div>
            `);
        }
    });
};

// When leaving the page, show the navbar again
frappe.pages['localization_dashboard'].on_page_show = function(wrapper) {
    // Hide navbar when showing this page
    $('.navbar.navbar-expand').hide();
};

frappe.pages['localization_dashboard'].on_page_hide = function(wrapper) {
    // Show navbar again when leaving this page
    $('.navbar.navbar-expand').show();
};