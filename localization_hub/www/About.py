import frappe

def get_context(context):
    """Get context for about page"""
    context.no_cache = 1
    context.title = "About the Localisation Alliance | Localisation Hub"
    
    return context