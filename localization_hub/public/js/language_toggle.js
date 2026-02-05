/**
 * Language Toggle for Frappe Navbar - V3 (Toolbar Extension)
 * Extends frappe.ui.toolbar.Toolbar to add language switcher
 * Based on working implementation pattern
 */

frappe.provide('frappe.ui.toolbar');
// Store the original Toolbar class
const OriginalToolbar = frappe.ui.toolbar.Toolbar;

// Extend the Toolbar class
frappe.ui.toolbar.Toolbar = class Toolbar extends OriginalToolbar {
    make() {
        super.make();
        this.add_language_switcher();
    }

    add_language_switcher() {
        $(document).ready(() => {
            // Language configuration
            const languages = [
                { code: 'en', name: 'English', flag: '🇬🇧', shortName: 'EN' },
                { code: 'ar', name: 'العربية', flag: '🇸🇦', shortName: 'AR' },
                { code: 'fr', name: 'Français', flag: '🇫🇷', shortName: 'FR' },
                { code: 'sw', name: 'Kiswahili', flag: '🇰🇪', shortName: 'SW' },
            ];

            const currentLanguage = frappe.boot.user.language || 'en';
            const currentLang = languages.find(l => l.code === currentLanguage) || languages[0];

            // Create language toggle dropdown
            const languageToggle = $(`
                <li class="nav-item dropdown dropdown-language" style="align-self: center;">
                    <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" aria-expanded="false">
                        <div class="language-toggle-container">
                            <span class="language-flag">${currentLang.flag}</span>
                            <span class="language-short">${currentLang.shortName}</span>
                        </div>
                    </a>
                    <div class="dropdown-menu dropdown-menu-right language-menu">
                        <div class="dropdown-header">Select Language</div>
                        ${this.generate_language_options(languages, currentLanguage)}
                    </div>
                </li>
            `);

            // Insert before the last dropdown (usually the user dropdown)
            $('.navbar .dropdown').last().before(languageToggle);

            // Add click handlers for language options
            $('.language-option').click(function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                const selectedLang = $(this).data('lang');
                
                if (selectedLang !== currentLanguage) {
                    // Show loading message
                    frappe.show_alert({
                        message: __('Switching language...'),
                        indicator: 'blue'
                    });

                    // Update user language
                    frappe.call({
                        method: 'frappe.client.set_value',
                        args: {
                            doctype: 'User',
                            name: frappe.session.user,
                            fieldname: 'language',
                            value: selectedLang
                        },
                        callback: (response) => {
                            if (response.message) {
                                frappe.show_alert({
                                    message: __('Language changed successfully'),
                                    indicator: 'green'
                                });
                                // Reload page to apply new language
                                setTimeout(() => {
                                    location.reload();
                                }, 500);
                            }
                        },
                        error: () => {
                            frappe.show_alert({
                                message: __('Failed to change language'),
                                indicator: 'red'
                            });
                        }
                    });
                }
            });

            // console.log('Language Toggle: Successfully added to navbar');
        });
    }

    generate_language_options(languages, currentLanguage) {
        return languages.map(lang => `
            <a class="dropdown-item language-option ${lang.code === currentLanguage ? 'active' : ''}" 
               href="#" 
               data-lang="${lang.code}">
                <span class="lang-flag">${lang.flag}</span>
                <span class="lang-name">${lang.name}</span>
                ${lang.code === currentLanguage ? '<span class="checkmark">✓</span>' : ''}
            </a>
        `).join('');
    }
}