from django.contrib import admin
from django.utils.html import format_html
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

from .models import (
    Referral, StrategicPartner, StrategicPartnerResponse, StrategicPartnerFile,
    StrategicPartnerResponseFile, Case, Country, District, Kpi, Province,
    Supplier, SupplierKpi, BusinessResponse, SupplierCRCResponse, Recruiter,
    RecruiterIssue, RecruiterResponse, RecruiterResponseFile, RecruiterCRCResponse,
    CaseIssue, CaseInteraction, SupplyChain, Industry, SubIndustry, VesselType, DocumentType,
    ContractType, Nationality, Ethnicity, InteractionChannel, InteractionReason,
    IssueCategory, KpiCategory, WorkPlace, HowHearIssara, CaseStatus, Gender,
    Broker, ResponseInteractionType, CaseCategory, ClientStatus, ClientType,
    ReferralAction, SupplierResponseFile, EtiBaseCode, KpiLegalViolation,
    KpiLegalViolation, KpiRecommendedRemediation, KpiSystemsChange, SupplierKpiUpdate,
    FieldworkActivityType, FieldworkActivityTypeCategory, FieldworkActivity, FieldworkActivityPrimaryFocus,
    MonthlyWorkerVoice, EthicalRecruitmentMeeting, UserTask, Config, FactoryType,
    MmThaiDemandData, SupplierKpiUpdateStatus, MmThaiSendingData,
    KpiEmailNotificationTemplate, KpiEmailNotification, PersonContact, NewsUpdate, PartnerMessageBoard,
    SharedFile, StrategicPartnerUser, UserLogin
)



@admin.register(UserLogin)
class UserLoginAdmin(admin.ModelAdmin):

    list_display = ('user', 'partner', 'created_at', 'loggedout_at')
    ordering = ('id',)

    def partner(self, obj):
        if obj.user:
            return obj.user.strategic_partner.name
        return '-'

    def get_queryset(self, request):
        return super(UserLoginAdmin, self).get_queryset(request).select_related(
            'user__strategic_partner'
        )

@admin.register(SubIndustry)
class SubIndustryAdmin(admin.ModelAdmin):

    list_display = ('name', 'industry')
    list_filter = ('industry',)
    search_fields = ('name', 'industry__name')
    ordering = ('id',)

    def get_queryset(self, request):
        return super(SubIndustryAdmin, self).get_queryset(request).prefetch_related(
            'industry',
        )


class ProvinceByCountryFilter(admin.SimpleListFilter):
    title = 'province'
    parameter_name = 'province'

    def lookups(self, request, model_admin):
        if 'province__country__id__exact' in request.GET:
            country_id = request.GET['province__country__id__exact']
            provinces = Province.objects.all().filter(country=country_id)
        else:
            provinces = Province.objects.all()

        return [(province.id, province.name) for province in provinces]

    def queryset(self, request, queryset):
       if self.value():
           return queryset.filter(province=self.value())


class KpiCategoryByKpi(admin.SimpleListFilter):
    title = 'kpi'
    parameter_name = 'kpi'

    def lookups(self, request, model_admin):
        if 'kpis__kpi_category__id__exact' in request.GET:
            kpi_category_id = request.GET['kpis__kpi_category__id__exact']
            kpis = Kpi.objects.all().filter(kpi_category=kpi_category_id)
        else:
            kpis = Province.objects.all()

        return [(kpi.id, kpi.name) for kpi in kpis]

    def queryset(self, request, queryset):
       if self.value():
           return queryset.filter(kpi=self.value())


@admin.register(Kpi)
class KpiAdmin(admin.ModelAdmin):

    list_display = ('description', 'level', 'kpi_category')
    list_filter = ('level', 'kpi_category',)
    search_fields = ('description', 'level', 'kpi_category__name')
    ordering = ('id',)

    def get_queryset(self, request):
        return super(KpiAdmin, self).get_queryset(request).prefetch_related(
            'kpi_category',
        )


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):

    def country(self, obj):
        return obj.province.country

    list_display = ('name', 'gis_code', 'crossing', 'province', 'country')
    list_filter = ('level', 'country', 'province')
    search_fields = ('name', 'gis_code', 'crossing',
                     'province__name', 'province__country__name')
    list_filter = ('province__country', ProvinceByCountryFilter)

    ordering = ('id',)

    def get_queryset(self, request):
        return super(DistrictAdmin, self).get_queryset(request).prefetch_related(
            'province__country',
        )


@admin.register(Province)
class ProvinceAdmin(admin.ModelAdmin):

    list_display = ('name', 'gis_code', 'crossing', 'country')
    list_filter = ('country',)
    search_fields = ('name', 'gis_code', 'crossing', 'country__name')
    ordering = ('id',)

    def get_queryset(self, request):
        return super(ProvinceAdmin, self).get_queryset(request).prefetch_related(
            'country',
        )


@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    filter_horizontal = ('referral_actions',)


@admin.register(StrategicPartner)
class StrategicPartnerAdmin(admin.ModelAdmin):
    list_display = ('name', 'imageicon','email_notify')
    filter_horizontal = ('strategic_partner_files',)


@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):

    list_display = ('name', 'tier_id', 'address', 'vessel_number',
                    'industry', 'subindustry', 'country', 'province', 'district')

    list_filter = ('industry', 'subindustry', 'country', 'province', 'district', )
    search_fields = ('name', 'industry__name', 'subindustry__name', 'country__name',
                     'province__name', 'district__name', 'tier_id')
    ordering = ('id',)

    def get_queryset(self, request):
        return super(SupplierAdmin, self).get_queryset(request).prefetch_related(
            'district', 'province', 'country', 'industry', 'subindustry',
        )


# @admin.register(SupplierKpi)
# class SupplierKpiAdmin(admin.ModelAdmin):
#
#     list_display = ('supplier',  'kpi_category', 'kpi__description', 'opened_at', 'closed_at', 'open')
#
#     list_filter = ('open', 'kpi__kpi_category', 'supplier__name')
#     search_fields = ('supplier__name', 'kpi__kpi_category__name', 'kpi__description',)
#     ordering = ('id',)
#
#     def kpi_category(self, obj):
#         return obj.kpi.kpi_category
#
#     def kpi__description(self, obj):
#         return obj.kpi.description
#
#     def get_queryset(self, request):
#         return super(SupplierKpiAdmin, self).get_queryset(request).prefetch_related(
#             'kpi__kpi_category', 'supplier'
#         )
#
#     def formfield_for_foreignkey(self, db_field, request, **kwargs):
#         if db_field.name == 'kpi':
#             kwargs["queryset"] = Kpi.objects.prefetch_related('kpi_category').all()
#         return super(SupplierKpiAdmin, self).formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(SupplierKpiUpdate)
class SupplierKpiUpdateAdmin(admin.ModelAdmin):

    list_display = (
        'id', 'supplier_kpi_id', 'supplier_name',  'status', 'kpi_category', 'kpi__description',
        'opened_at', 'overview_date', 'closed_at'
        )
    list_filter = ('status', 'supplier_kpi__kpi__kpi_category', 'supplier_kpi__supplier__name')
    search_fields = (
        'supplier_kpi__id', 'supplier_kpi__supplier__name', 'supplier_kpi__kpi__kpi_category__name',
        'supplier_kpi__kpi__description'
        )
    ordering = ('id','supplier_kpi__id')

    def status(self, obj):
        return obj.status.name

    def supplier_kpi_id(self, obj):
        return obj.supplier_kpi.id

    def supplier_name(self, obj):
        return obj.supplier_kpi.supplier.name

    def kpi_category(self, obj):
        return obj.supplier_kpi.kpi.kpi_category

    def kpi__description(self, obj):
        return obj.supplier_kpi.kpi.description

    def get_queryset(self, request):
        return super(SupplierKpiUpdateAdmin, self).get_queryset(request).prefetch_related(
            'supplier_kpi__kpi', 'supplier_kpi__kpi__kpi_category', 'supplier_kpi__supplier'
        )

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'supplier_kpi':
            kwargs["queryset"] = SupplierKpi.objects.prefetch_related('supplier', 'kpi__kpi_category').all()
        return super(SupplierKpiUpdateAdmin, self).formfield_for_foreignkey(db_field, request, **kwargs)

@admin.register(SupplierKpi)
class SupplierKpiAdmin(admin.ModelAdmin):

    list_display = (
        'id', 'supplier_name', 'status_name', 'kpi_category', 'kpi__description',
        'opened_at', 'overview_date', 'closed_at'
        )
    list_filter = ('status__name', 'kpi__kpi_category', 'supplier__name')
    search_fields = (
        'id', 'supplier__name', 'kpi__kpi_category__name',
        'kpi__description'
        )
    ordering = ('id',)

    def supplier_name(self, obj):
        return obj.supplier.name

    def status_name(self, obj):
        return obj.status.name

    def kpi_category(self, obj):
        return obj.kpi.kpi_category

    def kpi__description(self, obj):
        return obj.kpi.description

    def get_queryset(self, request):
        return super(SupplierKpiAdmin, self).get_queryset(request).prefetch_related(
            'kpi', 'kpi__kpi_category', 'supplier', 'status'
        )



@admin.register(Recruiter)
class RecruiterAdmin(admin.ModelAdmin):

    list_display = ('name', 'tier_id', 'address', 'industry',
                    'country', 'province', 'district')

    list_filter = ('industry', 'country', 'province', 'district', )
    search_fields = ('name', 'industry__name', 'country__name',
                     'province__name', 'district__name', 'tier_id')
    ordering = ('id',)

    def get_queryset(self, request):
        return super(RecruiterAdmin, self).get_queryset(request).prefetch_related(
            'district', 'province', 'country', 'industry',
        )


@admin.register(RecruiterIssue)
class RecruiterIssueAdmin(admin.ModelAdmin):

    list_display = ('recruiter', 'case_status')

    list_filter = ('case_status', 'kpis__kpi_category', 'recruiter', )
    search_fields = ('kpis__kpi_category__name', 'kpis__description',
                     'case_status__name', 'recruiter__name')
    ordering = ('id',)

    def kpi_category(self, obj):
            return obj.kpi.kpi_category


@admin.register(StrategicPartnerResponse)
class StrategicPartnerResponseAdmin(admin.ModelAdmin):
    list_display = ('strategic_partner',)
    search_fields = ('strategic_partner__name',)
    list_filter = ('strategic_partner',)
    filter_horizontal = ('strategic_partner_response_files',)


@admin.register(Case)
class CaseAdmin(admin.ModelAdmin):
    list_display = ('id','description', 'issara_staff',
                    'client_contract_type')
    search_fields = ('description',)
    list_filter = ('client_contract_type', 'supplier')


@admin.register(SupplyChain)
class SupplyChainAdmin(admin.ModelAdmin):
    list_display = ('name', 'strategic_partner')
    search_fields = ('name', 'strategic_partner__name')
    list_filter = ('strategic_partner',)
    filter_horizontal = ('suppliers',)


# @admin.register(CaseIssue)
# class CaseIssueAdmin(admin.ModelAdmin):
#     list_display = ('issue_category', 'kpi_category', 'case_status')
#     list_filter = ('issue_category', 'case__supplier',
#                    'kpis__kpi_category', 'kpis', 'case_status')
#
#     def kpi_category(self, obj):
#             array = obj.kpis.all()
#             return array[0].kpi_category if len(array) else ""
#
#     def supplier(self, obj):
#             return obj.case.supplier


@admin.register(CaseInteraction)
class CaseInteractionAdmin(admin.ModelAdmin):
    list_display = ('id', 'summary', 'interacted', 'issara_staff')
    search_fields = ('issara_staff__email', 'summary')

    def case(self, obj):
            return obj.case

    def supplier(self, obj):
            return obj.case.supplier


@admin.register(BusinessResponse)
class SupplierResponseAdmin(admin.ModelAdmin):
    list_display = ('event_details',)
    filter_horizontal = ('suppliers', 'recruiters', 'global_buyers', 'issara_focal_points')
    readonly_fields = ('created_at', 'modified_at',)
    fieldsets = (
        ('Participants', {
            'fields': ('suppliers', 'suppliers_notes', 'recruiters', 'recruiters_notes',
                        'global_buyers', 'global_buyers_notes', 'other_parties_notes')
        }),
        ('Event Details', {
            'fields': ('event_details',)
        }),
        ('Actions', {
            'fields': ('suppliers_next_steps', 'suppliers_next_steps_deadline',
                       'suppliers_focal_points', 'recruiters_next_steps',
                       'recruiters_next_steps_deadline', 'recruiters_focal_points',
                       'global_buyers_next_steps', 'global_buyers_next_steps_deadline',
                       'global_buyers_focal_points', 'issara_next_steps',
                       'issara_next_steps_deadline', 'issara_focal_points')
        }),
        ('Extra', {
            'fields': ('created_at', 'created_by', 'modified_at')
        }),
    )


@admin.register(RecruiterResponse)
class RecruiterResponseAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'recruiter',
                    'issue_category', 'issue_status')
    list_filter = ('issue_category', 'kpis__kpi_category', 'kpis',
                   'recruiter', 'recruiter_issue__case_status__name')
    search_fields = ('name', 'description', 'created', 'recruiter__name', 'issue_category__name',
                     'kpis__kpi_category__name', 'kpis__description', 'recruiter_issue__case_status__name')
    filter_horizontal = ('recruiter_response_files', 'issara_staff_involved')

    def kpi_category(self, obj):
            return obj.kpi.kpi_category

    def issue_status(self, obj):
        return obj.recruiter_issue.case_status


@admin.register(SupplierCRCResponse)
class SupplierCRCResponseAdmin(admin.ModelAdmin):

    list_display = ('supplier','created_at' )
    list_filter = ('supplier',)
    search_fields = ('supplier__name','created_at' )
    ordering = ('id',)


@admin.register(RecruiterCRCResponse)
class RecruiterCRCResponseAdmin(admin.ModelAdmin):

    list_display = ('recruiter', 'created_at')
    list_filter = ('recruiter',)
    search_fields = ('recruiter__name','created_at' )
    ordering = ('id',)

@admin.register(MmThaiDemandData)
class MmThaiDemandDataAdmin(admin.ModelAdmin):

    list_display = ('supplier_name', 'recruiter_name', 'industry', 'subindustry', 'created', 'record_date' )
    list_filter = ('supplier_name', 'recruiter_name', 'industry', 'subindustry')
    search_fields = ('supplier_name', 'recruiter_name', 'industry', 'subindustry', 'created', 'record_date' )
    ordering = ('id', 'record_date')


@admin.register(MmThaiSendingData)
class MmThaiSendingDataAdmin(admin.ModelAdmin):
    list_display = ('supplier', 'recruiter', 'industry', 'subindustry', 'created', 'record_date' )
    list_filter = ('supplier', 'recruiter', 'industry', 'subindustry')
    search_fields = ('supplier', 'recruiter', 'industry', 'subindustry', 'created', 'record_date' )
    ordering = ('id','record_date',)

    def get_queryset(self, request):
        return super(MmThaiSendingDataAdmin, self).get_queryset(request).select_related(
            'supplier', 'recruiter', 'industry',
            'subindustry', 'factory_type', 'province'
        )


# @admin.register(KpiStatusEmailNotification)
# class KpiStatusEmailNotificationAdmin(admin.ModelAdmin):
#     list_display = ('supplier_kpi', 'strategic_partner', 'delivered', 'error_message', 'date' )
#     list_filter = ('strategic_partner', 'delivered')
#     ordering = ('-date',)
#
#     def get_queryset(self, request):
#         return super(KpiStatusEmailNotificationAdmin, self).get_queryset(request).select_related(
#             'supplier_kpi', 'strategic_partner',
#         )


@admin.register(KpiEmailNotificationTemplate)
class KpiEmailNotificationTemplateAdmin(admin.ModelAdmin):
    list_display = (
        'subject', 'recipients', 'statuses', 'days_eq', 'level_eq', 'level_gte',
        'level_lte', 'type', 'golive'
    )
    list_filter = ('type',)
    filter_horizontal = ('kpi_statuses', 'email_to',)

    # ordering = ('-date',)

    fieldsets = (
        (None, {
            'fields': (
                'type',
            )
        }),
        ('Conditions', {
            'fields': (
                'kpi_statuses', 'days_eq', 'level_eq', 'level_gte', 'level_lte', 'golive'
            )
        }),
        ('Email', {
            'fields': (
                'email_to', 'subject', 'text',
            )
        }),
    )

    def statuses(self, obj):
        if obj.kpi_statuses.count() > 1:
            return ', '.join(obj.kpi_statuses.values_list('name', flat=True))
        return obj.kpi_statuses.first().name

    def recipients(self, obj):
        if obj.email_to.count() > 1:
            return ', '.join(obj.email_to.values_list('email', flat=True))
        elif obj.email_to.count() == 1:
            return obj.email_to.last().email

    def get_queryset(self, request):
        return super(KpiEmailNotificationTemplateAdmin, self).get_queryset(request).prefetch_related(
            'kpi_statuses', 'email_to',
        )


@admin.register(KpiEmailNotification)
class KpiEmailNotificationAdmin(admin.ModelAdmin):
    list_display = ('template', '_recipients', '_type', '_text', 'delivered', '_suppliers', '_kpis', 'error_message', 'date')
    list_filter = ('delivered','template', "template__type")
    filter_horizontal = ('supplier_kpis', 'recipients',)
    readonly_fields = ('template', 'supplier_kpis', 'recipients', 'delivered', 'error_message', 'date',)

    def _recipients(self, obj):
        if obj.recipients.count() > 1:
            return ', '.join(obj.recipients.values_list('email', flat=True))
        elif obj.recipients.count() == 1:
            return obj.recipients.last().email

    def _text(self, obj):
        return obj.template.text

    def _type(self, obj):
        return obj.template.type

    def _kpis(self, obj):
        if obj.supplier_kpis.count() > 1:
            return ', '.join(obj.supplier_kpis.values_list('kpi__description', flat=True))
        elif obj.supplier_kpis.count() == 1:
            return obj.supplier_kpis.last().kpi.description

    def _suppliers(self, obj):
        if obj.supplier_kpis.count() > 1:
            return ', '.join(obj.supplier_kpis.values_list('supplier__name', flat=True))
        elif obj.supplier_kpis.count() == 1:
            return obj.supplier_kpis.last().supplier.name

    def get_queryset(self, request):
        return super(KpiEmailNotificationAdmin, self).get_queryset(request).prefetch_related(
            'supplier_kpis', 'recipients', 'template'
        )


@admin.register(FieldworkActivityType)
class FieldworkActivityTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category')
    list_filter = ('category',)

    def get_queryset(self, request):
        return super(FieldworkActivityTypeAdmin, self).get_queryset(request).select_related('category')


class FieldworkActivityTypeByCategoryFilter(admin.SimpleListFilter):
    title = 'fieldwork_type'
    parameter_name = 'fieldwork_type'

    def lookups(self, request, model_admin):
        if 'fieldwork_type__category__id__exact' in request.GET:
            category_id = request.GET['fieldwork_type__category__id__exact']
            fieldwork_types = FieldworkActivityType.objects.filter(category_id=category_id)
        else:
            fieldwork_types = FieldworkActivityType.objects.all()

        return [(fieldwork_type.id, fieldwork_type.name) for fieldwork_type in fieldwork_types]

    def queryset(self, request, queryset):
       if self.value():
           return queryset.filter(fieldwork_type=self.value())


@admin.register(FieldworkActivity)
class FieldworkActivityAdmin(admin.ModelAdmin):
    list_display = ('id', 'fieldwork_date', 'fieldwork_type', 'primary_focus', 'country', 'province')
    list_filter = ('fieldwork_type__category', FieldworkActivityTypeByCategoryFilter,)
    filter_horizontal = ('suppliers', 'recruiters', 'strategic_partners')
    readonly_fields = ('created_at', 'created_by',)
    fieldsets = (
        ('General', {
            'fields': (
                'fieldwork_date', 'fieldwork_type', 'country', 'province',
                'suppliers', 'recruiters', 'notes'
            )
        }),
        ('Outreach related', {
            'fields': (
                'total_workers_reached', 'female_workers_reached', 'male_workers_reached',
                'myanmar_workers_reached', 'cambodian_workers_reached', 'thai_workers_reached',
                'lao_workers_reached', 'other_workers_reached'
            )
        }),
        ('Training/Multi-stakeholder/other related', {
            'fields': (
                'strategic_partners', 'total_people_reached', 'male_reached',
                'female_reached', 'primary_focus', 'primary_focus_other_description'
            )
        }),
        ('Extra', {
            'fields': ('created_at', 'created_by')
        }),
    )

    def get_queryset(self, request):
        return super(FieldworkActivityAdmin, self).get_queryset(request).select_related(
            'fieldwork_type', 'country', 'province', 'primary_focus'
        )


@admin.register(NewsUpdate)
class NewsUpdateAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'title', 'description', 'sort_number', 'created')


@admin.register(PartnerMessageBoard)
class PartnerMessageBoardAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'title', 'description', 'sort_number', 'created', "strategic_partner")

@admin.register(SharedFile)
class SharedFileAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'type', 'file_path', 'sort_number', 'created_at')
    list_filter = ('type',)
    readonly_fields = ['preview']

    def preview(self, obj):
        return format_html('<img src="{}" width="800" height="auto" />'.format(obj.file_path.url))


class StrategicPartnerUserInline(admin.StackedInline):
    model = StrategicPartnerUser
    max_num = 1


class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'partner', 'first_name', 'last_name', 'is_staff')
    inlines = [StrategicPartnerUserInline]

    def partner(self, obj):
        if obj.strategic_partner_user:
            return obj.strategic_partner_user.strategic_partner.name
        return '-'

    def get_queryset(self, request):
        return super(CustomUserAdmin, self).get_queryset(request).select_related(
            'strategic_partner_user__strategic_partner'
        )


# unregister old user admin
admin.site.unregister(User)
# register new user admin that includes a StrategicPartnerUserInline
admin.site.register(User, CustomUserAdmin)

admin.site.register(ContractType)
admin.site.register(Country)
admin.site.register(DocumentType)
admin.site.register(Ethnicity)
admin.site.register(EtiBaseCode)
admin.site.register(HowHearIssara)
admin.site.register(Industry)
admin.site.register(InteractionChannel)
admin.site.register(InteractionReason)
admin.site.register(Nationality)
admin.site.register(StrategicPartnerFile)
admin.site.register(StrategicPartnerResponseFile)
admin.site.register(VesselType)
admin.site.register(IssueCategory)
admin.site.register(KpiCategory)
admin.site.register(WorkPlace)
admin.site.register(ResponseInteractionType)
admin.site.register(CaseStatus)
admin.site.register(FactoryType)
admin.site.register(Gender)
admin.site.register(Broker)
admin.site.register(CaseCategory)
admin.site.register(ClientStatus)
admin.site.register(ClientType)
admin.site.register(ReferralAction)
admin.site.register(RecruiterResponseFile)
admin.site.register(SupplierResponseFile)
admin.site.register(KpiLegalViolation)
admin.site.register(KpiRecommendedRemediation)
admin.site.register(KpiSystemsChange)
admin.site.register(FieldworkActivityTypeCategory)
admin.site.register(FieldworkActivityPrimaryFocus)
admin.site.register(MonthlyWorkerVoice)
admin.site.register(EthicalRecruitmentMeeting)
admin.site.register(UserTask)
admin.site.register(Config)
admin.site.register(SupplierKpiUpdateStatus)
admin.site.register(PersonContact)