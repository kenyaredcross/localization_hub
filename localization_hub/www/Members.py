import frappe

def get_context(context):
    """Get context for members page"""
    context.no_cache = 1
    context.title = "Members & Partners | Localisation Hub"
    
    return context