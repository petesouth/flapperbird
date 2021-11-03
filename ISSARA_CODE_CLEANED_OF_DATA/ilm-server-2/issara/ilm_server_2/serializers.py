from django.contrib.auth.models import User, Group
from django.db import models
from django.conf import settings

from django.contrib.auth.password_validation import validate_password

from rest_framework import serializers

from issara.ilm_server_2.models import (Case, CaseInteraction, CaseIssue,
                                        CaseStatus, Supplier, Recruiter, Country, District, Province, Industry, SubIndustry,
                                        VesselType, DocumentType, ContractType, Ethnicity, InteractionChannel,
                                        IssueCategory, KpiCategory, Kpi, EtiBaseCode, KpiLegalViolation,
                                        KpiRecommendedRemediation, KpiSystemsChange, InteractionReason, Nationality, WorkPlace,
                                        StrategicPartner, HowHearIssara, UserTask, SupplierKpi, StrategicPartnerUser,
                                        SupplierKpiUpdateStatus, SupplierKpiUpdate, BusinessResponse, RecruiterCRCResponse, SupplierCRCResponse, FieldworkActivity,
                                        FieldworkActivityType, FieldworkActivityTypeCategory, FieldworkActivityPrimaryFocus,
                                        ClientType, ClientStatus, MonthlyWorkerVoice, CaseCategory, FactoryType,
                                        ResponseInteractionType, StrategicPartnerResponse, ReferralAction, EthicalRecruitmentMeeting, Gender,
                                        MmThaiDemandData, MmThaiSendingData, SupplyChain, PersonContact, NewsUpdate, SharedFile, UserLogin, PartnerMessageBoard
                                        )


class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLogin
        fields = "__all__"

class NewsUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsUpdate
        fields = ['id',
                  'name',
                  'title',
                  'sort_number',
                  'description',
                  'created']

class PartnerMessageBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerMessageBoard
        fields = "__all__"


class PersonContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonContact
        fields = ['id',
                  'name',
                  'email',
                  'phone',
                  'description',
                  'created']


class SupplyChainSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplyChain
        fields = ['id',
                  'name',
                  'strategic_partner',
                  'suppliers']


class MmThaiDemandDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = MmThaiDemandData
        fields = '__all__'


class MmThaiSendingDataSerializer(serializers.ModelSerializer):

    recruiter_name = serializers.CharField(read_only=True)
    supplier_name = serializers.CharField(read_only=True)
    factory_type_name = serializers.CharField(read_only=True)
    industry_name = serializers.CharField(read_only=True)
    subindustry_name = serializers.CharField(read_only=True)
    province_name = serializers.CharField(read_only=True)

    class Meta:
        model = MmThaiSendingData
        fields = '__all__'


class MmThaiSendingDataSerializerOriginal(serializers.ModelSerializer):

    recruiter_name = serializers.CharField(
        source='recruiter.name', read_only=True)
    supplier_name = serializers.CharField(
        source='supplier.name', read_only=True)
    factory_type_name = serializers.CharField(
        source='factory_type.name', read_only=True)
    industry_name = serializers.CharField(
        source='industry.name', read_only=True)
    subindustry_name = serializers.CharField(
        source='subindustry.name', read_only=True)
    province_name = serializers.CharField(
        source='province.name', read_only=True)

    class Meta:
        model = MmThaiSendingData
        fields = '__all__'


class EtiBaseCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EtiBaseCode
        fields = ['id',
                  'name',
                  'code',
                  'description',
                  'sub_code',
                  'sub_description',
                  'created',
                  'last_modified']


class SupplierKpiUpdateStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplierKpiUpdateStatus
        fields = ['id', 'name']


class KpiSystemsChangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = KpiSystemsChange
        fields = ['id',
                  'name',
                  'description']


class KpiRecommendedRemediationSerializer(serializers.ModelSerializer):
    class Meta:
        model = KpiRecommendedRemediation
        fields = ['id',
                  'name',
                  'description']


class KpiLegalViolationSerializer(serializers.ModelSerializer):
    class Meta:
        model = KpiLegalViolation
        fields = ['id',
                  'name',
                  'description']


class FactoryTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FactoryType
        fields = ['id',
                  'name', ]


class GenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gender
        fields = ['id',
                  'name', ]


class ReferralActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferralAction
        fields = ['id',
                  'name', ]


class CaseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseCategory
        fields = ['id',
                  'name', ]


class ClientTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientType
        fields = ['id',
                  'name', ]


class ClientStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientStatus
        fields = ['id',
                  'name', ]


class CaseStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseStatus
        fields = ['id',
                  'name', ]


class UserTaskSerializer(serializers.ModelSerializer):
    assigned_by = serializers.PrimaryKeyRelatedField(
        default=serializers.CurrentUserDefault(), queryset=User.objects.all()
    )
    assigned_by_name = serializers.CharField(
        source='assigned_by.first_name', allow_null=True, read_only=True
    )
    assigned_to_name = serializers.CharField(
        source='assigned_to.first_name', allow_null=True, read_only=True
    )

    class Meta:
        model = UserTask
        fields = '__all__'


class HowHearIssaraSerializer(serializers.ModelSerializer):
    class Meta:
        model = HowHearIssara
        fields = ['id',
                  'name']


class WorkPlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkPlace
        fields = ['id',
                  'name'
                  ]


class IssueCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueCategory
        fields = ['id',
                  'name'
                  ]


class KpiCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = KpiCategory
        fields = ['id',
                  'name',
                  'issue_category'
                  ]


class KpiSerializer(serializers.ModelSerializer):

    kpi_category = KpiCategorySerializer(many=False, read_only=True)
    eti_base_code = EtiBaseCodeSerializer(many=False, read_only=True)
    kpi_legal_violation = KpiLegalViolationSerializer(
        many=False, read_only=True)
    kpi_recommended_remmediation = KpiRecommendedRemediationSerializer(
        many=False, read_only=True)
    kpi_systems_change = KpiSystemsChangeSerializer(many=False, read_only=True)

    class Meta:
        model = Kpi
        fields = ['id',
                  'description',
                  'kpi_category',
                  'level',
                  'goal',
                  'eti_base_code',
                  'kpi_legal_violation',
                  'kpi_recommended_remmediation',
                  'kpi_systems_change'
                  ]


class NationalitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Nationality
        fields = ['id',
                  'name',
                  'imageicon'
                  ]


class InteractionChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = InteractionChannel
        fields = ['id',
                  'name'
                  ]


class InteractionReasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = InteractionReason
        fields = ['id',
                  'name'
                  ]


class EthnicitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Ethnicity
        fields = ['id',
                  'name'
                  ]


class ContractTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContractType
        fields = ['id',
                  'name'
                  ]


class DocumentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentType
        fields = ['id',
                  'name'
                  ]


class VesselTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VesselType
        fields = ['id',
                  'name'
                  ]


class IndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Industry
        fields = ['id',
                  'name'
                  ]


class SubIndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubIndustry
        fields = ['id',
                  'name',
                  'industry'
                  ]


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'


class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = '__all__'


class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = '__all__'


class RecruiterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recruiter
        fields = ['id',
                  'name',
                  'created',
                  'tier_id',
                  'address',
                  'zipcode',
                  'gps',
                  'facebook_website',
                  'contact_name',
                  'contact_phone',
                  'contact_email',
                  'num_of_staff',
                  'num_lisc_agents',
                  'worker_placement_industries',
                  'other',
                  'industry',
                  'country',
                  'province',
                  'district',
                  'golden_dreams_recruiter_id',
                  "description",
                  "website",
                  "lng",
                  "lat"
                  ]


class SupplierSerializer(serializers.ModelSerializer):

    class Meta:
        model = Supplier
        fields = ['id',
                  'name',
                  'created',
                  'anonymous',
                  'tier_id',
                  'address',
                  'zipcode',
                  'gps',
                  'vessel_number',
                  'fishing_gear_liscense_number',
                  'contact_name',
                  'contact_phone',
                  'contact_email',
                  'name_harvesting_business',
                  'num_vessels_sourced_from',
                  'total_num_workers',
                  'total_num_thai_workers',
                  'total_num_cambodian_workers',
                  'total_num_myanmar_workers',
                  'total_num_lao_workers',
                  'total_num_vietnamese_workers',
                  'hiring_practice',
                  'other',
                  'vessel_type',
                  'industry',
                  'subindustry',
                  'country',
                  'province',
                  'district',
                  'golden_dreams_employer_id',
                  'website',
                  'description',
                  'lng',
                  'lat',
                  'additional_contacts'
                  ]


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']


class UserSerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()
    partner = serializers.IntegerField(
        source='strategic_partner_user.strategic_partner.id')

    def get_groups(self, obj):
        return [group.name for group in obj.groups.all()]

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name',
                  'last_name', 'groups', 'partner', 'is_active']


class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    old_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('old_password', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError(
                {"old_password": "Old password is not correct"})
        return value

    def update(self, instance, validated_data):

        instance.set_password(validated_data['password'])
        instance.save()

        return instance


class StrategicPartnerSerializer(serializers.ModelSerializer):
    contract_start_date = serializers.DateField(
        input_formats=settings.DATE_INPUT_FORMATS, allow_null=True)
    contract_end_date = serializers.DateField(
        input_formats=settings.DATE_INPUT_FORMATS, allow_null=True)
    payment_receipt_date = serializers.DateField(
        input_formats=settings.DATE_INPUT_FORMATS, allow_null=True)
    date_last_annual_risk_report = serializers.DateField(
        input_formats=settings.DATE_INPUT_FORMATS, allow_null=True)
    date_last_call_meeting_visit = serializers.DateField(
        input_formats=settings.DATE_INPUT_FORMATS, allow_null=True)

    class Meta:
        model = StrategicPartner
        fields = '__all__'
        


class StrategicPartnerResponseSerializer(serializers.ModelSerializer):
    interaction_date = serializers.DateField(
        input_formats=settings.DATE_INPUT_FORMATS, allow_null=True)

    class Meta:
        model = StrategicPartnerResponse
        fields = ['id',
                  'interaction_date',
                  'interaction_event_location',
                  'response_focal_point',
                  'general_notes',
                  'next_steps',
                  'response_interaction_type',
                  'issara_user_focal_point',
                  'strategic_partner',
                  'created',
                  'last_modified'
                  ]


class CaseInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseInteraction
        fields = ['id',
                  'type',
                  'summary',
                  'interacted',
                  'created',
                  'last_modified',
                  'issara_staff',
                  'interaction_reason',
                  'interaction_channel'
                  ]


class CaseInteractionDeepSerializer(serializers.ModelSerializer):
    issara_staff = UserSerializer(read_only=True)
    interaction_reason = InteractionReasonSerializer(read_only=True)
    interaction_channel = InteractionChannelSerializer(read_only=True)

    class Meta:
        model = CaseInteraction
        fields = ['id',
                  'type',
                  'summary',
                  'interacted',
                  'created',
                  'last_modified',
                  'issara_staff',
                  'interaction_reason',
                  'interaction_channel'
                  ]


class CaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Case
        fields = ['id',
                  'name',
                  'case_status',
                  'created',
                  'last_modified',
                  'client_nickname',
                  'client_phonenumber',
                  'client_line_account',
                  'client_facebook_account',
                  'client_viber_account',
                  'client_share_info_consent',
                  'client_time_at_job',
                  'client_origin_country',
                  'client_origin_province',
                  'client_origin_district',
                  'client_crossing_country',
                  'client_crossing_province',
                  'client_crossing_district',
                  'issara_supply_chain',
                  'non_supply_chain',
                  'description',
                  'debt_bondage',
                  'debt_bondage_detail',
                  'debt_bondage_broker',
                  'debt_bondage_detail_broker',
                  'vot_needs',
                  'referral_notes',
                  'next_steps',
                  'work_place_details',
                  'supplier',
                  'work_place',
                  'dead_line_date',
                  'final_remarks',
                  'issara_staff',
                  'next_steps_issara_staff',
                  'risk_assessment',
                  'source_recruiter',
                  'destination_recruiter',
                  'source_upstream_broker',
                  'rating_source_broker',
                  'rating_source_recruiter',
                  'rating_dest_recruiter',
                  'rating_dest_employer',
                  'client_contract_type',
                  'client_document_type',
                  'client_gender',
                  'client_ethnicity',
                  'client_nationality',
                  'client_type',
                  'client_status',
                  'case_category',
                  'referral_action',
                  'case_how_hear_issara',
                  'country',
                  'province',
                  'district',
                  'case_interactions',
                  'issue_category',
                  'kpis',
                  'issue_description',
                  'issue_offender_description',
                  'issue_workers_affected',
                  'issue_workers_affected_description',
                  'issue_getting_better',
                  'issue_getting_better_description',
                  'interactiontype',
                  'interacted',
                  'interaction_summary',
                  'interaction_reason',
                  'interaction_channel',
                  'interaction_issara_staff'
                  ]


class CaseDeepSerializer(serializers.ModelSerializer):
    issara_staff = UserSerializer(read_only=True)
    next_steps_issara_staff = UserSerializer(read_only=True)
    source_recruiter = RecruiterSerializer(read_only=True)
    destination_recruiter = RecruiterSerializer(read_only=True)
    supplier = SupplierSerializer(read_only=True)
    issue_category = IssueCategorySerializer(read_only=True)
    kpis = KpiSerializer(many=True, read_only=True)
    
    interaction_issara_staff = UserSerializer(read_only=True)
    
    country = CountrySerializer(read_only=True)
    province = ProvinceSerializer(read_only=True)
    district = DistrictSerializer(read_only=True)

    client_gender = GenderSerializer(read_only=True)
    client_type = ClientTypeSerializer(read_only=True)
    client_status = ClientStatusSerializer(read_only=True)
    referral_action = ReferralActionSerializer(read_only=True)
    client_document_type = DocumentTypeSerializer(read_only=True)
    case_category = CaseCategorySerializer(read_only=True)
    client_nationality = NationalitySerializer(read_only=True)
    client_ethnicity = EthnicitySerializer(read_only=True)

    client_origin_country = CountrySerializer(read_only=True)
    client_origin_province = ProvinceSerializer(read_only=True)
    client_origin_district = DistrictSerializer(read_only=True)
    client_contract_type = ContractTypeSerializer(read_only=True)

    client_crossing_country = CountrySerializer(read_only=True)
    client_crossing_province = ProvinceSerializer(read_only=True)
    client_crossing_district = DistrictSerializer(read_only=True)
    case_interactions = CaseInteractionDeepSerializer(
        many=True, read_only=True)

    class Meta:
        model = Case
        fields = ['id',
                  'name',
                  'case_status',
                  'created',
                  'last_modified',
                  'client_nickname',
                  'client_phonenumber',
                  'client_line_account',
                  'client_facebook_account',
                  'client_viber_account',
                  'client_share_info_consent',
                  'client_time_at_job',
                  'client_origin_country',
                  'client_origin_province',
                  'client_origin_district',
                  'client_crossing_country',
                  'client_crossing_province',
                  'client_crossing_district',
                  'issara_supply_chain',
                  'non_supply_chain',
                  'description',
                  'debt_bondage',
                  'debt_bondage_detail',
                  'debt_bondage_broker',
                  'debt_bondage_detail_broker',
                  'vot_needs',
                  'referral_notes',
                  'risk_assessment',
                  'next_steps',
                  'work_place_details',
                  'supplier',
                  'work_place',
                  'dead_line_date',
                  'final_remarks',
                  'issara_staff',
                  'next_steps_issara_staff',
                  'source_recruiter',
                  'destination_recruiter',
                  'source_upstream_broker',
                  'rating_source_broker',
                  'rating_source_recruiter',
                  'rating_dest_recruiter',
                  'rating_dest_employer',
                  'client_contract_type',
                  'client_document_type',
                  'client_gender',
                  'client_ethnicity',
                  'client_nationality',
                  'case_category',
                  'client_type',
                  'client_status',
                  'referral_action',
                  'case_how_hear_issara',
                  'country',
                  'province',
                  'district',
                  'case_interactions',
                  'issue_category',
                  'kpis',
                  'issue_description',
                  'issue_offender_description',
                  'issue_legacy_level',
                  'issue_workers_affected',
                  'issue_workers_affected_description',
                  'issue_getting_better',
                  'issue_getting_better_description',
                  'interactiontype',
                  'interacted',
                  'interaction_summary',
                  'interaction_reason',
                  'interaction_channel',
                  'interaction_issara_staff'
                  ]


class CaseLeanSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    created = serializers.DateField()
    dead_line_date = serializers.DateField()
    last_modified = serializers.DateField()
    supplier_name = serializers.CharField()
    source_recruiter_name = serializers.CharField()
    destination_recruiter_name = serializers.CharField()
    description = serializers.CharField()
    issara_user = serializers.CharField()
    next_steps_issara_user = serializers.CharField()
    issue_category_name = serializers.CharField()
    kpi_description = serializers.CharField()
    kpi_level = serializers.IntegerField()
    client_gender_name = serializers.CharField()
    client_nationality_name = serializers.CharField()
    client_ethnicity_name = serializers.CharField()
    client_nickname = serializers.CharField()
    client_phonenumber = serializers.CharField()
    client_type_id = serializers.IntegerField()
    client_nationality_id = serializers.IntegerField()
    client_document_type_id = serializers.IntegerField()
    work_place_id = serializers.IntegerField()
    client_status_id = serializers.IntegerField()
    client_time_at_job = serializers.IntegerField()
    debt_bondage = serializers.CharField()
    rating_source_broker = serializers.IntegerField()
    rating_source_recruiter = serializers.IntegerField()
    rating_dest_recruiter = serializers.IntegerField()
    rating_dest_employer = serializers.IntegerField()
    issue_workers_affected = serializers.IntegerField()
    case_status_id = serializers.IntegerField()
    referral_action_id = serializers.IntegerField()
    interaction_date = serializers.DateField()
    interaction_type = serializers.CharField()
    kpi_ids = serializers.SerializerMethodField()

    def get_kpi_ids(self, obj):
        kpi_ids_list = []
        if obj.kpi_ids:
            kpi_ids_list = [int(kpi_id) for kpi_id in obj.kpi_ids.split(',')]
        return kpi_ids_list

    class Meta:
        fields = '__all__'
        read_only_fields = fields


class CallsByCount(models.Model):
    call_count = models.AutoField(primary_key=True)
    month_year = models.TextField(blank=True, null=True)

    class Meta:
        managed = False


class CallsByCountSerializer(serializers.ModelSerializer):
    call_count = serializers.IntegerField()
    month_year = serializers.CharField()

    class Meta:
        model = CallsByCount
        fields = '__all__'


class SupplierKpiSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(read_only=True)
    category = serializers.CharField(read_only=True)
    description = serializers.CharField(read_only=True)
    level = serializers.IntegerField(read_only=True)
    status_name = serializers.CharField(read_only=True)

    remediation = serializers.CharField(default=None, read_only=True)
    systems_change = serializers.CharField(default=None, read_only=True)
    law = serializers.CharField(default=None, read_only=True)

    overview_date = serializers.DateField(
        input_formats=settings.DATE_INPUT_FORMATS, allow_null=True)
    remediation_payment_deadline = serializers.DateField(
        input_formats=settings.DATE_INPUT_FORMATS, allow_null=True)
    remediation_documents_deadline = serializers.DateField(
        input_formats=settings.DATE_INPUT_FORMATS, allow_null=True)
    systems_change_deadline = serializers.DateField(
        input_formats=settings.DATE_INPUT_FORMATS, allow_null=True)
    closed_at = serializers.DateField(
        input_formats=settings.DATE_INPUT_FORMATS, allow_null=True)
    closed_quality = serializers.CharField(allow_null=True)

    calls = serializers.SerializerMethodField()
    source_recruiters = serializers.SerializerMethodField()
    destination_recruiters = serializers.SerializerMethodField()

    updates = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    def get_calls(self, obj):
        calls_list = []
        if obj.calls:
            calls_list = [int(call_id) for call_id in obj.calls.split(',')]
        return calls_list

    def get_source_recruiters(self, obj):
        recruiters_list = []
        if obj.source_recruiters:
            recruiters_list = [int(recruiter_id)
                               for recruiter_id in obj.source_recruiters.split(',')]
        return recruiters_list

    def get_destination_recruiters(self, obj):
        recruiters_list = []
        if obj.destination_recruiters:
            recruiters_list = [
                int(recruiter_id) for recruiter_id in obj.destination_recruiters.split(',')]
        return recruiters_list

    class Meta:
        model = SupplierKpi
        fields = '__all__'


class SupplierKpiUpdateSerializer(serializers.ModelSerializer):
    supplier = serializers.IntegerField(
        source='supplier_kpi.supplier.id', read_only=True)
    supplier_name = serializers.CharField(
        source='supplier_kpi.supplier.name', read_only=True)
    category = serializers.CharField(
        source='supplier_kpi.kpi.kpi_category.name', read_only=True)
    category_id = serializers.IntegerField(
        source='supplier_kpi.kpi.kpi_category.id', read_only=True)
    description = serializers.CharField(
        source='supplier_kpi.kpi.description', read_only=True)
    level = serializers.IntegerField(
        source='supplier_kpi.kpi.level', read_only=True)
    status_name = serializers.CharField(
        source='status.name', read_only=True)

    calls = serializers.SerializerMethodField(read_only=True)

    def get_calls(self, obj):
        calls_list = []
        if obj.calls:
            calls_list = [int(call_id) for call_id in obj.calls.split(',')]
        return calls_list

    class Meta:
        model = SupplierKpiUpdate
        fields = '__all__'


class BusinessResponseSerializer(serializers.ModelSerializer):
    suppliers_next_steps_deadline = serializers.DateField(
        input_formats=settings.DATE_INPUT_FORMATS, allow_null=True)
    recruiters_next_steps_deadline = serializers.DateField(
        input_formats=settings.DATE_INPUT_FORMATS, allow_null=True)
    global_buyers_next_steps_deadline = serializers.DateField(
        input_formats=settings.DATE_INPUT_FORMATS, allow_null=True)
    issara_next_steps_deadline = serializers.DateField(
        input_formats=settings.DATE_INPUT_FORMATS, allow_null=True)
    event_date = serializers.DateField(
        input_formats=settings.DATE_INPUT_FORMATS, allow_null=True)
    created_by = serializers.PrimaryKeyRelatedField(
        default=serializers.CurrentUserDefault(), queryset=User.objects.all())

    class Meta:
        model = BusinessResponse
        fields = [
            'id',
            'suppliers',
            'suppliers_notes',
            'recruiters',
            'recruiters_notes',
            'global_buyers',
            'global_buyers_notes',
            'other_parties_notes',
            'event_details',
            'event_location',
            'event_date',
            'event_interaction_type',
            'suppliers_next_steps',
            'suppliers_next_steps_deadline',
            'suppliers_focal_points',
            'recruiters_next_steps',
            'recruiters_next_steps_deadline',
            'recruiters_focal_points',
            'global_buyers_next_steps',
            'global_buyers_next_steps_deadline',
            'global_buyers_focal_points',
            'issara_next_steps',
            'issara_next_steps_deadline',
            'issara_focal_points',
            'created_by',
            'created_at'
        ]


class SupplierCRCResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplierCRCResponse
        fields = '__all__'


class RecruiterCRCResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruiterCRCResponse
        fields = '__all__'


class FieldworkActivitySerializer(serializers.ModelSerializer):
    fieldwork_date = serializers.DateField(
        input_formats=settings.DATE_INPUT_FORMATS, allow_null=True)
    created_by = serializers.PrimaryKeyRelatedField(
        default=serializers.CurrentUserDefault(), queryset=User.objects.all())
    fieldwork_type_name = serializers.CharField(
        source='fieldwork_type.name', read_only=True
    )
    province_name = serializers.CharField(
        source='province.name', read_only=True
    )
    nationality_name = serializers.CharField(
        source='nationality.name', read_only=True
    )
    location = serializers.SerializerMethodField(read_only=True)

    def get_location(self, obj):
        location = [obj.district, obj.province, obj.country]
        location_string = ', '.join(
            [i.name for i in location if i is not None])
        return location_string

    class Meta:
        model = FieldworkActivity
        fields = '__all__'


class FieldworkActivityTypeSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name')

    class Meta:
        model = FieldworkActivityType
        fields = '__all__'


class GroupedFieldworkActivityTypeSerializer(serializers.ModelSerializer):
    types = FieldworkActivityTypeSerializer(many=True)

    class Meta:
        model = FieldworkActivityTypeCategory
        fields = '__all__'


class FieldworkActivityPrimaryFocusSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldworkActivityPrimaryFocus
        fields = '__all__'


class MonthlyWorkerVoiceSerializer(serializers.ModelSerializer):
    month_year = serializers.DateField(
        input_formats=settings.DATE_INPUT_FORMATS, allow_null=True)
    created_by = serializers.PrimaryKeyRelatedField(
        default=serializers.CurrentUserDefault(), queryset=User.objects.all())

    class Meta:
        model = MonthlyWorkerVoice
        fields = '__all__'


class BusinessResponseInteractionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResponseInteractionType
        fields = '__all__'


class EthicalRecruitmentMeetingSerializer(serializers.ModelSerializer):
    created_by = serializers.PrimaryKeyRelatedField(
        default=serializers.CurrentUserDefault(), queryset=User.objects.all()
    )

    class Meta:
        model = EthicalRecruitmentMeeting
        fields = '__all__'


class CaseExcelSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    created = serializers.DateField()
    last_modified = serializers.DateField()
    client_nickname = serializers.CharField()
    client_phonenumber = serializers.CharField()
    client_line_account = serializers.CharField()
    client_facebook_account = serializers.CharField()
    client_viber_account = serializers.CharField()
    client_share_info_consent = serializers.CharField()
    client_time_at_job = serializers.IntegerField()

    issara_supply_chain = serializers.CharField()
    non_supply_chain = serializers.CharField()
    description = serializers.CharField()
    debt_bondage = serializers.CharField()
    debt_bondage_detail = serializers.CharField()
    debt_bondage_broker = serializers.CharField()
    debt_bondage_detail_broker = serializers.CharField()
    vot_needs = serializers.CharField()
    referral_notes = serializers.CharField()
    next_steps = serializers.CharField()
    work_place_details = serializers.CharField()

    dead_line_date = serializers.DateField()
    final_remarks = serializers.CharField()
    source_upstream_broker = serializers.CharField()
    rating_source_broker = serializers.IntegerField()
    rating_source_recruiter = serializers.IntegerField()
    rating_dest_recruiter = serializers.IntegerField()
    rating_dest_employer = serializers.IntegerField()

    issue_description = serializers.CharField()
    issue_offender_description = serializers.CharField()
    issue_workers_affected = serializers.IntegerField()
    issue_legacy_level = serializers.IntegerField()
    issue_workers_affected_description = serializers.CharField()
    issue_getting_better = serializers.CharField()
    issue_getting_better_description = serializers.CharField()
    case_status_name = serializers.CharField()

    supplier_name = serializers.CharField()
    source_recruiter_name = serializers.CharField()
    destination_recruiter_name = serializers.CharField()
    description = serializers.CharField()
    issara_staff_email = serializers.CharField()
    next_steps_issara_staff_email = serializers.CharField()
    next_steps = serializers.CharField()
    referral_notes = serializers.CharField()
    referral_action_name = serializers.CharField()
    final_remarks = serializers.CharField()
    issue_category_name = serializers.CharField()
    case_category_name = serializers.CharField()
    risk_assessment = serializers.CharField()
    
    client_gender_name = serializers.CharField()
    client_contract_type_name = serializers.CharField()
    client_document_type_name = serializers.CharField()
    client_ethnicity_name = serializers.CharField()
    client_nationality_name = serializers.CharField()
    client_type_name = serializers.CharField()
    client_workplace_name = serializers.CharField()

    country_name = serializers.CharField()
    district_name = serializers.CharField()
    province_name = serializers.CharField()
    client_crossing_country_name = serializers.CharField()
    client_crossing_district_name = serializers.CharField()
    client_crossing_province_name = serializers.CharField()
    client_origin_country_name = serializers.CharField()
    client_origin_province_name = serializers.CharField()
    client_origin_district_name = serializers.CharField()

    kpi_id = serializers.IntegerField()
    kpi_description = serializers.CharField()
    kpi_level = serializers.IntegerField()
    kpi_goal = serializers.CharField()
    kpi_category_name = serializers.CharField()
    kpi_eti_base_code_name = serializers.CharField()
    kpi_eti_base_code_description = serializers.CharField()
    kpi_kpi_legal_violation_name = serializers.CharField()
    kpi_kpi_legal_violation_description = serializers.CharField()
    kpi_kpi_recommended_remediation_description = serializers.CharField()
    kpi_kpi_systems_change_description = serializers.CharField()

    class Meta:
        fields = '__all__'


class SharedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedFile
        fields = '__all__'
