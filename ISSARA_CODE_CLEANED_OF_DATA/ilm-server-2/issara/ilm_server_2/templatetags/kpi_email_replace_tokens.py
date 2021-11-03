from django import template


register = template.Library()


@register.filter
def kpi_email_replace_tokens(text, context):
    kpis = context.get('kpis', [])
    kpis_text = ''

    for kpi in kpis:
        kpis_text += (
            f'Supplier KPI ID: {kpi.id}, supplier ID: {kpi.supplier_id}, '
            f'description: {kpi.kpi.description}, level: {kpi.kpi.level}, '
            f'closure quality: {kpi.closed_quality}\n'
        )

    text =  text.replace("{{kpis}}", kpis_text)
    return text
