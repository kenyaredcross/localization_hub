import frappe

def get_context(context):
    """Get data for landing page"""
    context.no_cache = 1
    
    # Fetch latest impacts
    context.impacts = frappe.get_all(
        'Local Impact',
        fields=['name', 'title', 'excerpt', 'society', 'category', 'creation', 'image'],
        filters={'impact_type': 'Impact', 'is_published': 1},
        order_by='creation desc',
        limit=3
    )
    
    return context