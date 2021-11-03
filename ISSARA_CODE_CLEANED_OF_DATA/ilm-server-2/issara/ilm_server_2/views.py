from django.contrib.auth.models import User, Group
from django.conf import settings
from django.utils.decorators import method_decorator
from django.utils.html import strip_tags
from django.views.decorators.cache import cache_page
from django.shortcuts import render
from django.db import models
from django.db.models.expressions import RawSQL
from django.db.models import F, Q, Avg, Count, Min, Max, Sum
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
import json
import copy
from rest_framework import viewsets, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.core import serializers
from django.db.models.functions import TruncMonth, TruncYear

from rest_framework.viewsets import ReadOnlyModelViewSet
from drf_renderer_xlsx.mixins import XLSXFileMixin
from drf_renderer_xlsx.renderers import XLSXRenderer


from issara.ilm_server_2.serializers import (
    UserTaskSerializer, UserSerializer, PersonContactSerializer, NewsUpdateSerializer, PartnerMessageBoardSerializer,
    GroupSerializer, SupplierSerializer, RecruiterSerializer, DistrictSerializer,
    EthnicitySerializer, InteractionChannelSerializer, CountrySerializer,
    ProvinceSerializer, IndustrySerializer, SubIndustrySerializer, VesselTypeSerializer,
    DocumentTypeSerializer, ContractTypeSerializer, HowHearIssaraSerializer,
    NationalitySerializer, InteractionReasonSerializer, IssueCategorySerializer,
    KpiCategorySerializer, KpiSerializer, WorkPlaceSerializer, StrategicPartnerSerializer,
    CaseStatusSerializer, CaseSerializer, CaseDeepSerializer, CaseLeanSerializer, SupplierKpiSerializer, CallsByCount, CallsByCountSerializer,
    SupplierKpiUpdateSerializer, BusinessResponseSerializer, CaseInteractionSerializer,
    SupplierCRCResponseSerializer, RecruiterCRCResponseSerializer, FieldworkActivitySerializer, FieldworkActivityTypeSerializer,
    FieldworkActivityPrimaryFocusSerializer, ClientTypeSerializer, ClientStatusSerializer, MonthlyWorkerVoiceSerializer, CaseCategorySerializer,
    BusinessResponseInteractionTypeSerializer, StrategicPartnerResponseSerializer, ReferralActionSerializer,
    EthicalRecruitmentMeetingSerializer, KpiLegalViolationSerializer, CaseExcelSerializer, FactoryTypeSerializer,
    MmThaiDemandDataSerializer, MmThaiSendingDataSerializer, MmThaiSendingDataSerializerOriginal, SupplierKpiUpdateStatusSerializer, SupplyChainSerializer,
    GroupedFieldworkActivityTypeSerializer, SharedFileSerializer, ChangePasswordSerializer, UserLoginSerializer
)
from issara.ilm_server_2.models import (
    Supplier, Recruiter, Country, District, Province, Industry, SubIndustry, NewsUpdate, PartnerMessageBoard,
    VesselType, DocumentType, ContractType, Ethnicity, InteractionChannel,
    Nationality, InteractionReason, IssueCategory, KpiCategory, Kpi,
    WorkPlace, StrategicPartner, HowHearIssara, UserTask, CaseInteraction,
    SupplierCRCResponse, CaseStatus, Case, SupplierKpi, SupplierKpiUpdate,
    BusinessResponse, SupplierCRCResponse, FieldworkActivity, FieldworkActivityType, FieldworkActivityPrimaryFocus,
    FieldworkActivityTypeCategory, ClientStatus, ClientType, MonthlyWorkerVoice, CaseCategory,
    ResponseInteractionType, StrategicPartnerResponse, ReferralAction, EthicalRecruitmentMeeting, KpiLegalViolation,
    Config, FactoryType, MmThaiDemandData, MmThaiSendingData, SupplierKpiUpdateStatus,
    RecruiterCRCResponse, RecruiterResponse, RecruiterIssue, SupplyChain, PersonContact,
    SharedFile, KpiEmailNotificationTemplate, KpiEmailNotification, UserLogin, StrategicPartnerUser
)

from datetime import datetime, timedelta, date


class HelloView(APIView):
    """
    permission_classes = (IsAuthenticated,)
    """

    def get(self, request):
        content = {'message': 'Hello ilm_server_2 is running!!!'}
        return Response(content)


class UserLoginView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = UserLogin.objects.all().order_by('-id')
    serializer_class = UserLoginSerializer


class ChangePasswordView(generics.UpdateAPIView):

    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = ChangePasswordSerializer

class NewsUpdateViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = NewsUpdate.objects.all().order_by('-id')
    serializer_class = NewsUpdateSerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)

class PartnerMessageBoardViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = PartnerMessageBoard.objects.all().order_by('-id')
    serializer_class = PartnerMessageBoardSerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class PersonContactViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = PersonContact.objects.all().order_by('-id')
    serializer_class = PersonContactSerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class SupplyChainViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = SupplyChain.objects.all().order_by('-id')
    serializer_class = SupplyChainSerializer

    def get_queryset(self):
        qs = self.queryset.select_related('strategic_partner').prefetch_related(
            'suppliers'
        )
        return qs


class KpiLegalViolationViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = KpiLegalViolation.objects.all().order_by('-id')
    serializer_class = KpiLegalViolationSerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class CaseCategoryViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = CaseCategory.objects.all().order_by('-id')
    serializer_class = CaseCategorySerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class ClientTypeViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = ClientType.objects.all().order_by('-id')
    serializer_class = ClientTypeSerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class SupplierKpiUpdateStatusViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = SupplierKpiUpdateStatus.objects.all().order_by('-id')
    serializer_class = SupplierKpiUpdateStatusSerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class ClientStatusViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = ClientStatus.objects.all().order_by('-id')
    serializer_class = ClientStatusSerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class ReferralActionViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = ReferralAction.objects.all().order_by('-id')
    serializer_class = ReferralActionSerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class CaseViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = Case.objects.all().order_by('-id')
    serializer_class = CaseSerializer

class CaseLeanViewSet(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        getAll = self.request.query_params.get('getAll')

        big_ass_query = """
        select cases.*,
                                suppliers.name as supplier_name,
                                rec_src.name as source_recruiter_name,
                                rec_dest.name as destination_recruiter_name,
                                cases.issue_description as description,
                                cases.issue_offender_description as offender_description,
                                cases.risk_assessment as risk_assessment,
                                issue_categories.name as issue_category_name,
                                genders.name as client_gender_name,
                                nationalities.name as client_nationality_name,
                                ethnicities.name as client_ethnicity_name,
                                issara_users.email as issara_user,
                                issara_users.id as issara_user_id,
                                cases.interacted as interaction_date,
                                cases.interactiontype as interaction_type,
                                (select kpis.level as kpi_level from kpis
                                                            left outer join cases_kpis on cases_kpis.kpi_id=kpis.id
                                                            where cases_kpis.case_id=cases.id order by kpis.level desc limit 1) as kpi_level,
                                (select kpis.description as kpi_description from kpis
                                                            left outer join cases_kpis on cases_kpis.kpi_id=kpis.id
                                                            where cases_kpis.case_id=cases.id order by kpis.level desc limit 1) as kpi_description,
                                auth_user.email as next_steps_issara_user,
                                auth_user.id as next_steps_issara_user_id,
                                GROUP_CONCAT(distinct(cases_kpis.kpi_id)) as kpi_ids
                                from cases
                                inner join suppliers on suppliers.id=cases.supplier_id
                                left outer join cases_kpis on cases_kpis.case_id=cases.id
                                left outer join recruiters as rec_src on rec_src.id=cases.source_recruiter_id
                                left outer join recruiters as rec_dest on rec_dest.id=cases.destination_recruiter_id
                                left outer join issue_categories on issue_categories.id = cases.issue_category_id
                                left outer join genders on genders.id=cases.client_gender_id
                                left outer join nationalities on nationalities.id=cases.client_nationality_id
                                left outer join ethnicities on ethnicities.id=cases.client_ethnicity_id
                                left outer join auth_user on auth_user.id=cases.next_steps_issara_staff_id
                                left outer join auth_user as issara_users on issara_users.id = cases.interaction_issara_staff_id
                                """

        if getAll in [None, '']:

            after = self.request.query_params.get('after')
            before = self.request.query_params.get('before')
            supplier_ids = self.request.query_params.get('supplier_ids')
            src_recruiter_ids = self.request.query_params.get(
                'src_recruiter_ids')
            dest_recruiter_ids = self.request.query_params.get(
                'dest_recruiter_ids')
            issara_staff_id = self.request.query_params.get('issara_staff_id')
            next_steps_issara_staff_id = self.request.query_params.get(
                'next_steps_issara_staff_id')

            if before in [None, '']:
                before = before = datetime.now()
            else:
                before = datetime.fromtimestamp(int(before)/1000)

            if after in [None, '']:
                after = None
            else:
                after = datetime.fromtimestamp(int(after)/1000)

            supplier_ids_str = ''
            src_recruiter_ids_str = ''
            dest_recruiter_ids_str = ''
            issara_staff_id_str = ''
            next_steps_issara_staff_id_str = ''

            if supplier_ids not in [None, '']:
                supplier_ids_str = 'and supplier_id in ' + supplier_ids + ' '

            if src_recruiter_ids not in [None, '']:
                src_recruiter_ids_str = 'and source_recruiter_id in ' + src_recruiter_ids + ' '

            if dest_recruiter_ids not in [None, '']:
                dest_recruiter_ids_str = 'and destination_recruiter_id in ' + dest_recruiter_ids + ' '

            if issara_staff_id not in [None, '']:
                issara_staff_id_str = 'and issara_users.id=' + \
                    str(int(issara_staff_id)) + ' '

            if next_steps_issara_staff_id not in [None, '']:
                next_steps_issara_staff_id_str = 'and and auth_user.id=' + \
                    str(int(next_steps_issara_staff_id)) + ' '

            after_str = ' '
            before_str = "cases.interacted <= '" + str(before) + "' "

            if after not in [None, '']:
                after_str = "cases.interacted >= '" + \
                    str(after) + "' and "

            big_ass_query += " where " + after_str + \
                before_str + \
                supplier_ids_str + \
                issara_staff_id_str + \
                next_steps_issara_staff_id_str + \
                src_recruiter_ids_str + \
                dest_recruiter_ids_str

        big_ass_query += " group by interaction_date, cases.id, issara_users.id, interaction_type order by cases.last_modified desc, cases.id desc"
        return Response(CaseLeanSerializer(Case.objects.raw(big_ass_query), many=True).data)


'''
Note.. This is best used to get post or put a single object
the load time is obnovious.  Use CaseLeanViewSet for a list
'''


class CaseDeepViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = Case.objects.all()

    def get_queryset(self):
        qs = self.queryset.select_related(
            'case_status', 'supplier', 'work_place', 'issara_staff',
            'next_steps_issara_staff', 'source_recruiter', 'destination_recruiter',
            'client_contract_type', 'client_document_type', 'client_gender',
            'client_ethnicity', 'client_nationality', 'case_category', 'client_type',
            'client_status', 'referral_action', 'country', 'province', 'district',
            'client_origin_country', 'client_origin_province', 'client_origin_district',
            'client_crossing_country', 'client_crossing_province', 'client_crossing_province',
            'issue_category')
        return qs

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return CaseDeepSerializer
        return CaseSerializer

    def create(self, request):
        case_interactions = request.data.pop('posted_case_interactions')
        listCreatedInteractions = []
        for interaction in case_interactions:

            interaction_user = interaction.get('issara_staff')
            if interaction_user:
                interaction['issara_staff'] = User.objects.get(
                    pk=interaction_user)

            interaction_reason = interaction.get('interaction_reason')
            if interaction_reason:
                interaction['interaction_reason'] = InteractionReason.objects.get(
                    pk=interaction_reason)

            interaction_channel = interaction.get('interaction_channel')
            if interaction_channel:
                interaction['interaction_channel'] = InteractionChannel.objects.get(
                    pk=interaction_channel)

            interaction['type'] = interaction.get('type')

            listCreatedInteractions.append(
                CaseInteraction.objects.create(**interaction).id)

        request.data['case_interactions'] = listCreatedInteractions

        return super().create(request)

    def update(self, request, pk=None):

        case_interactions = request.data.pop('posted_case_interactions')
        listCreatedInteractions = []
        for interaction in case_interactions:
            if interaction.get("id") != None:
                listCreatedInteractions.append(interaction.get("id"))
            else:
                interaction_user = interaction.get('issara_staff')
                if interaction_user:
                    interaction['issara_staff'] = User.objects.get(
                        pk=interaction_user)

                interaction_reason = interaction.get('interaction_reason')
                if interaction_reason:
                    interaction['interaction_reason'] = InteractionReason.objects.get(
                        pk=interaction_reason)

                interaction_channel = interaction.get('interaction_channel')
                if interaction_channel:
                    interaction['interaction_channel'] = InteractionChannel.objects.get(
                        pk=interaction_channel)

                interaction['type'] = interaction.get('type')

                listCreatedInteractions.append(
                    CaseInteraction.objects.create(**interaction).id)

        request.data['case_interactions'] = listCreatedInteractions

        return super().update(request, pk)


class CaseStatusViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = CaseStatus.objects.all().order_by('name')
    serializer_class = CaseStatusSerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class UserTaskViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = UserTask.objects.all()
    serializer_class = UserTaskSerializer

    def get_queryset(self):
        qs = self.queryset.select_related('assigned_by', 'assigned_to')
        return qs


class WorkPlaceViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = WorkPlace.objects.all().order_by('name')
    serializer_class = WorkPlaceSerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class IssueCategoryViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = IssueCategory.objects.all().order_by('name')
    serializer_class = IssueCategorySerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class KpiCategoryViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = KpiCategory.objects.all().order_by('name')
    serializer_class = KpiCategorySerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class KpiViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    """
    API endpoint that allows KPIs to be viewed or edited.
    """
    queryset = Kpi.objects.all()
    serializer_class = KpiSerializer

    def get_queryset(self):
        qs = self.queryset.prefetch_related(
            'kpi_category', 'eti_base_code', 'kpi_legal_violation',
            'kpi_recommended_remediation', 'kpi_systems_change'
        )
        return qs


class NationalityViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Nationality.objects.all().select_related(
        'imageicon'
    ).order_by('name')
    serializer_class = NationalitySerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class InteractionReasonViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = InteractionReason.objects.all().order_by('name')
    serializer_class = InteractionReasonSerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class InteractionChannelViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = InteractionChannel.objects.all().order_by('name')
    serializer_class = InteractionChannelSerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class EthnicityViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Ethnicity.objects.all().order_by('name')
    serializer_class = EthnicitySerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class ContractTypeViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = ContractType.objects.all().order_by('name')
    serializer_class = ContractTypeSerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class DocumentTypeViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = DocumentType.objects.all().order_by('name')
    serializer_class = DocumentTypeSerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class CaseViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = Case.objects.all().order_by('-id')
    serializer_class = CaseSerializer


class MmThaiDemandDataViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = MmThaiDemandData.objects.all().order_by('-record_date')
    serializer_class = MmThaiDemandDataSerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({"results": serializer.data})


class MmThaiSendingDataRawViewSet(APIView):

    def get(self, request):

        big_ass_query = """select mm_thai_sending_data.*,
                            (select suppliers.name from suppliers where suppliers.id=mm_thai_sending_data.supplier_id) as supplier_name,
                            (select factory_types.name from factory_types where factory_types.id=mm_thai_sending_data.factory_type_id) as factory_type_name,
                            (select recruiters.name from recruiters where recruiters.id=mm_thai_sending_data.recruiter_id) as recruiter_name,
                            (select industries.name from industries where industries.id=mm_thai_sending_data.industry_id) as industry_name,
                            (select subindustries.name from subindustries where subindustries.id=mm_thai_sending_data.subindustry_id) as subindustry_name,
                            (select provinces.name from provinces where provinces.id=mm_thai_sending_data.province_id) as province_name
                        from mm_thai_sending_data order by mm_thai_sending_data.record_date desc """

        return Response(MmThaiSendingDataSerializer(MmThaiSendingData.objects.raw(big_ass_query), many=True).data)


class MmThaiSendingDataViewSet(viewsets.ModelViewSet):
    # permission_classes = (IsAuthenticated,)
    queryset = MmThaiSendingData.objects.all()
    serializer_class = MmThaiSendingDataSerializerOriginal

    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset().select_related(
            'recruiter', 'supplier', 'industry',
            'subindustry', 'factory_type', 'province'
        )
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class FactoryTypeViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = FactoryType.objects.all().order_by('name')
    serializer_class = FactoryTypeSerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class VesselTypeViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = VesselType.objects.all().order_by('name')
    serializer_class = VesselTypeSerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class IndustryViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Industry.objects.all().order_by('name')
    serializer_class = IndustrySerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class SubIndustryViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = SubIndustry.objects.all().order_by('name')
    serializer_class = SubIndustrySerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class CountryViewSet(viewsets.ModelViewSet):
    # permission_classes = (AllowAny,)

    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Country.objects.all().order_by('name')
    serializer_class = CountrySerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class ProvinceViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Province.objects.all().order_by('name')
    serializer_class = ProvinceSerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class DistrictViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = District.objects.all().order_by('name')
    serializer_class = DistrictSerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class RecruiterViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Recruiter.objects.all().order_by('name')
    serializer_class = RecruiterSerializer

    def get_queryset(self):
        qs = self.queryset.select_related(
            'industry', 'country', 'province', 'district'
        )
        return qs


class SupplierViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Supplier.objects.all().select_related(
        'vessel_type', 'industry', 'subindustry', 'country', 'province', 'district'
    ).prefetch_related(
        'additional_contacts'
    ).order_by('name')

    serializer_class = SupplierSerializer

    # def list(self, request):
    #     queryset = self.get_queryset()
    #     paginated_queryset = self.paginate_queryset(queryset)
    #     serializer = self.get_serializer(paginated_queryset, many=True)
    #     return self.get_paginated_response(serializer.data)

    # def get_queryset(self):
    #     qs = self.queryset.select_related(
    #         'vessel_type', 'industry', 'subindustry', 'country', 'province', 'district'
    #     ).prefetch_related(
    #         'additional_contacts'
    #     )
    #     return qs


class StregicPartnerViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = StrategicPartner.objects.all().order_by('name')
    serializer_class = StrategicPartnerSerializer

    def get_queryset(self):
        qs = self.queryset.prefetch_related(
            'strategic_partner_files', 'imageicon'
        )
        return qs


class StregicPartnerResponseViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    """
    API endpoint that allows strategic partner responses to be viewed or edited.
    """
    queryset = StrategicPartnerResponse.objects.all()
    serializer_class = StrategicPartnerResponseSerializer


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        qs = self.queryset.prefetch_related(
            'groups', 'strategic_partner_user__strategic_partner')
        return qs


class GroupViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class HowHearIssaraViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = HowHearIssara.objects.all()
    serializer_class = HowHearIssaraSerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class SupplierKpiRawViewSet(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        big_ass_query = """select supplier_kpis.*,
                            suppliers.name as supplier_name,
                            kpi_categories.name as category,
                            kpis.description as description,
                            kpis.level as level,
                            supplier_kpi_update_statuses.name as status_name,
                            kpi_recommended_remediations.name as remediation,
                            kpi_systems_changes.name as systems_change,
                            kpi_legal_violations.name as law,

                                                    (SELECT GROUP_CONCAT(cases_kpis.case_id)
                                                                    FROM ilm_2.supplier_kpis temp_supplier_kpis
                                                                    LEFT OUTER JOIN ilm_2.cases_kpis on ilm_2.cases_kpis.kpi_id=temp_supplier_kpis.kpi_id
                                                                    LEFT OUTER JOIN ilm_2.cases on ilm_2.cases.id=ilm_2.cases_kpis.case_id
                                                                    WHERE ilm_2.cases.supplier_id=temp_supplier_kpis.supplier_id and temp_supplier_kpis.id=supplier_kpis.id
                                                                    GROUP by temp_supplier_kpis.id) as calls,
                                                        (SELECT GROUP_CONCAT(cases.source_recruiter_id)
                                                                    FROM ilm_2.supplier_kpis temp_supplier_kpis
                                                                    LEFT OUTER JOIN ilm_2.cases_kpis on ilm_2.cases_kpis.kpi_id=temp_supplier_kpis.kpi_id
                                                                    LEFT OUTER JOIN ilm_2.cases on ilm_2.cases.id=ilm_2.cases_kpis.case_id
                                                                    WHERE ilm_2.cases.supplier_id=temp_supplier_kpis.supplier_id and temp_supplier_kpis.id=supplier_kpis.id
                                                                    GROUP by temp_supplier_kpis.id) as source_recruiters,
                                                        (SELECT GROUP_CONCAT(cases.destination_recruiter_id)
                                                                    FROM ilm_2.supplier_kpis temp_supplier_kpis
                                                                    LEFT OUTER JOIN ilm_2.cases_kpis on ilm_2.cases_kpis.kpi_id=temp_supplier_kpis.kpi_id
                                                                    LEFT OUTER JOIN ilm_2.cases on ilm_2.cases.id=ilm_2.cases_kpis.case_id
                                                                    WHERE ilm_2.cases.supplier_id=temp_supplier_kpis.supplier_id and temp_supplier_kpis.id=supplier_kpis.id
                                                                    GROUP by temp_supplier_kpis.id) as destination_recruiters
                                                        from supplier_kpis
                                                        left outer join suppliers on suppliers.id = supplier_kpis.supplier_id
                                                        left outer join kpis on kpis.id = supplier_kpis.kpi_id
                                                        left outer join supplier_kpi_update_statuses on supplier_kpi_update_statuses.id=supplier_kpis.status_id
                                                        left outer join kpi_recommended_remediations on kpi_recommended_remediations.id=kpis.kpi_recommended_remediation_id
                                                        left outer join kpi_systems_changes on kpi_systems_changes.id=kpis.kpi_systems_change_id
                                                        left outer join kpi_legal_violations on kpi_legal_violations.id=kpis.kpi_legal_violation_id
                                                        left outer join kpi_categories on kpi_categories.id=kpis.kpi_category_id """

        return Response(SupplierKpiSerializer(SupplierKpi.objects.prefetch_related('updates').raw(big_ass_query), many=True).data)


class SupplierKpiViewSet(viewsets.ModelViewSet):
    # permission_classes = (IsAuthenticated,)

    queryset = SupplierKpi.objects.all()
    serializer_class = SupplierKpiSerializer

    """
    REMOVED FROM QUERY TO SEE IF GET CALLS BACK
    Although.. jmaybe it's useful to show the entire call history?

    AND ilm_2.supplier_kpis.opened_at <= ilm_2.cases.created
    """

    def get_queryset(self):
        qs = self.queryset.prefetch_related('kpi__kpi_category', 'supplier', 'updates').annotate(
            calls=RawSQL(
                '''
                    SELECT GROUP_CONCAT(cases_kpis.case_id)
                    FROM ilm_2.supplier_kpis temp_supplier_kpis
                    LEFT OUTER JOIN ilm_2.cases_kpis on ilm_2.cases_kpis.kpi_id=temp_supplier_kpis.kpi_id
                    LEFT OUTER JOIN ilm_2.cases on ilm_2.cases.id=ilm_2.cases_kpis.case_id
                    WHERE ilm_2.cases.supplier_id=temp_supplier_kpis.supplier_id and ilm_2.supplier_kpis.id = temp_supplier_kpis.id
                    GROUP by temp_supplier_kpis.id
                ''', ()
            ),
            source_recruiters=RawSQL(
                '''
                    SELECT GROUP_CONCAT(cases.source_recruiter_id)
                    FROM ilm_2.supplier_kpis temp_supplier_kpis
                    LEFT OUTER JOIN ilm_2.cases_kpis on ilm_2.cases_kpis.kpi_id=temp_supplier_kpis.kpi_id
                    LEFT OUTER JOIN ilm_2.cases on ilm_2.cases.id=ilm_2.cases_kpis.case_id
                    WHERE ilm_2.cases.supplier_id=temp_supplier_kpis.supplier_id and ilm_2.supplier_kpis.id = temp_supplier_kpis.id
                    GROUP by temp_supplier_kpis.id
                ''', ()
            ),
            destination_recruiters=RawSQL(
                '''
                    SELECT GROUP_CONCAT(cases.destination_recruiter_id)
                    FROM ilm_2.supplier_kpis temp_supplier_kpis
                    LEFT OUTER JOIN ilm_2.cases_kpis on ilm_2.cases_kpis.kpi_id=temp_supplier_kpis.kpi_id
                    LEFT OUTER JOIN ilm_2.cases on ilm_2.cases.id=ilm_2.cases_kpis.case_id
                    WHERE ilm_2.cases.supplier_id=temp_supplier_kpis.supplier_id and ilm_2.supplier_kpis.id = temp_supplier_kpis.id
                    GROUP by temp_supplier_kpis.id
                ''', ()
            ),
        )
        return qs


class SupplierKpiUpdateViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = SupplierKpiUpdate.objects.all()
    serializer_class = SupplierKpiUpdateSerializer

    """
    REMOVED FROM QUERY TO SEE IF GET CALLS BACK
    Although.. jmaybe it's useful to show the entire call history?

                                  AND supplier_kpi_updates.opened_at <= ilm_2.cases.created
                                  AND supplier_kpi_updates.overview_date >= ilm_2.cases.created
    """

    def get_queryset(self):
        qs = self.queryset.select_related(
            'status', 'supplier_kpi__supplier', 'supplier_kpi__kpi__kpi_category'
        ).annotate(
            calls=RawSQL(
                '''
                        SELECT GROUP_CONCAT(cases_kpis.case_id)
                        FROM ilm_2.supplier_kpis temp_supplier_kpis
                        LEFT OUTER JOIN ilm_2.cases_kpis on ilm_2.cases_kpis.kpi_id=temp_supplier_kpis.kpi_id
                        LEFT OUTER JOIN ilm_2.cases on ilm_2.cases.id=ilm_2.cases_kpis.case_id
                            WHERE ilm_2.cases.supplier_id=temp_supplier_kpis.supplier_id
                                  AND ilm_2.supplier_kpi_updates.supplier_kpi_id = temp_supplier_kpis.id
                        GROUP by supplier_kpi_updates.id
                    ''', ()
            ),
        )
        return qs


class BusinessResponseViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = BusinessResponse.objects.all().order_by('-id')
    serializer_class = BusinessResponseSerializer

    def get_queryset(self):
        qs = self.queryset.prefetch_related(
            'suppliers', 'recruiters', 'global_buyers',
            'issara_focal_points', 'event_interaction_type'
        )
        return qs


class SupplierCRCResponseViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = SupplierCRCResponse.objects.all().order_by('-id')
    serializer_class = SupplierCRCResponseSerializer


class RecruiterCRCResponseViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = RecruiterCRCResponse.objects.all()
    serializer_class = RecruiterCRCResponseSerializer


class FieldworkActivityViewSet(viewsets.ModelViewSet):
    # permission_classes = (IsAuthenticated,)

    queryset = FieldworkActivity.objects.all().select_related(
        'fieldwork_type', 'district', 'province', 'country', 'nationality', 'primary_focus', 'created_by'
    ).prefetch_related('suppliers', 'recruiters', 'strategic_partners')

    serializer_class = FieldworkActivitySerializer

    # def get_queryset(self):
    #     queryset = self.queryset.all().select_related(
    #         'fieldwork_type', 'district', 'province', 'country', 'nationality', 'primary_focus', 'created_by'
    #     ).prefetch_related('suppliers', 'recruiters','strategic_partners')
    #     return queryset

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    # def list(self, request):
    #     queryset = self.get_queryset()
    #     paginated_queryset = self.paginate_queryset(queryset)
    #     serializer = self.get_serializer(paginated_queryset, many=True)
    #     return self.get_paginated_response(serializer.data)


class FieldworkActivityTypeViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = FieldworkActivityType.objects.all()
    serializer_class = FieldworkActivityTypeSerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class GroupedFieldworkActivityTypeViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = FieldworkActivityTypeCategory.objects.all()
    serializer_class = GroupedFieldworkActivityTypeSerializer

    def get_queryset(self):
        queryset = self.queryset.prefetch_related('types')
        return queryset


class FieldworkActivityPrimaryFocusViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = FieldworkActivityPrimaryFocus.objects.all()
    serializer_class = FieldworkActivityPrimaryFocusSerializer


class MonthlyWorkerVoiceViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = MonthlyWorkerVoice.objects.all()
    serializer_class = MonthlyWorkerVoiceSerializer


class BusinessResponseInteractionTypeViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = ResponseInteractionType.objects.all()
    serializer_class = BusinessResponseInteractionTypeSerializer

    # Cache requested url for 7 days
    # @method_decorator(cache_page(60*60*24*7))
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)


class EthicalRecruitmentMeetingViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    queryset = EthicalRecruitmentMeeting.objects.all()
    serializer_class = EthicalRecruitmentMeetingSerializer


# METRICS API used in dashboards

class MetricsWorkersView(APIView):

    def get(self, request):
        queryset = Supplier.objects.all()
        supplier_ids = self.request.query_params.get('supplierIds')

        if supplier_ids and supplier_ids != "":
            queryset = queryset.filter(id__in=list(
                map(int, supplier_ids.split(','))))

        data = queryset.aggregate(
            total=Sum('total_num_workers'),
            men=Sum('total_num_men_workers'),
            women=Sum('total_num_women_workers'),
            burmese=Sum('total_num_myanmar_workers'),
            khmer=Sum('total_num_cambodian_workers'),
            thai=Sum('total_num_thai_workers')
        )

        return Response(data)


class MetricsInteractionsView(APIView):

    def get(self, request):
        suppliers_queryset = Supplier.objects.all()
        kpis_queryset = Kpi.objects.all()
        crc_scores_queryset = SupplierCRCResponse.objects.all()
        cases_queryset = Case.objects.all()
        supplierKpi_queryset = SupplierKpi.objects.all()
        interactions_queryset = CaseInteraction.objects.all()
        nationalities_queryset = Nationality.objects.all()

        supplier_ids = self.request.query_params.get('supplierIds')
        if supplier_ids and supplier_ids != "":
            suppliers_queryset = suppliers_queryset.filter(
                id__in=list(map(int, supplier_ids.split(','))))

        start_timestamp = self.request.query_params.get('start')
        end_timestamp = self.request.query_params.get('end')

        if start_timestamp:
            start = datetime.fromtimestamp(int(start_timestamp))
            interactions_queryset = interactions_queryset.filter(
                interacted__gte=start
            )
            cases_queryset = cases_queryset.filter(
                created__gte=start
            )
            supplierKpi_queryset = supplierKpi_queryset.filter(
                opened_at__gte=start
            )
            crc_scores_queryset = crc_scores_queryset.filter(
                created_at__gte=start
            )
        if end_timestamp:
            end = datetime.fromtimestamp(int(end_timestamp))
            interactions_queryset = interactions_queryset.filter(
                interacted__lte=end
            )
            cases_queryset = cases_queryset.filter(
                created__lte=end
            )
            supplierKpi_queryset = supplierKpi_queryset.filter(
                opened_at__lte=end
            )
            crc_scores_queryset = crc_scores_queryset.filter(
                created_at__lte=end
            )

        caseDataSummary = interactions_queryset.filter(case__supplier__in=suppliers_queryset).aggregate(
            total=Count('id'),
            issue_workers_affected=Sum("case__issue_workers_affected"),
            total_suppliers_in_worker_cases=Count(
                "case__supplier", distinct=True),
            total_recruiters_in_worker_cases=(Count(
                "case__destination_recruiter", distinct=True) + Count("case__source_recruiter", distinct=True)),
            total_destination_recruiters_in_worker_cases=Count(
                "case__destination_recruiter", distinct=True),
            total_source_recruiters_in_worker_cases=Count(
                "case__source_recruiter", distinct=True),
            rating_dest_employer_avg=Avg('case__rating_dest_employer'),
            rating_dest_recruiter_avg=Avg('case__destination_recruiter'),
            rating_source_broker_avg=Avg('case__source_recruiter'),
            rating_source_recruiter_avg=Avg('case__rating_source_recruiter'),
            cases_closed=Count('id', filter=Q(case__case_status__id=2)),
            cases_open=Count('id', filter=Q(case__case_status__id=1)),
            men=Count('id', filter=Q(case__client_gender__name='Male')),
            women=Count('id', filter=Q(case__client_gender__name='Female'))
        )

        supplierKpiDataSummary = supplierKpi_queryset.filter(supplier__in=suppliers_queryset).aggregate(
            total_supplier_kpis=Count('id'),
            total_supplier_kpi_violation=Count('kpi'),
            total_supplier_affected_workers=Sum('kpi'),

            closed_quality_poor=Count('id', filter=Q(closed_quality="Poor")),
            # Okay... was deliberately removed it's now been changed to Fair.. This is the most recet
            # Please check with lisa.. The value is now fair.
            closed_quality_fair=Count('id', filter=Q(closed_quality="Fair")),
            closed_quality_good=Count('id', filter=Q(closed_quality="Good")),
            closed_quality_very_good=Count(
                'id', filter=Q(closed_quality="Very good")),
            closed_quality_excelent=Count(
                'id', filter=Q(closed_quality="Excelent")),

            remediation_aligned_none=Count(
                'id', filter=Q(remediation_aligned="None")),
            remediation_aligned_alot=Count(
                'id', filter=Q(remediation_aligned="A lot")),
            remediation_aligned_alittle=Count(
                'id', filter=Q(remediation_aligned="A little")),

            remediation_progress_none=Count(
                'id', filter=Q(remediation_progress="None")),
            remediation_progress_alot=Count(
                'id', filter=Q(remediation_progress="A lot")),
            remediation_proress_alittle=Count(
                'id', filter=Q(remediation_progress="A little")),

            systems_change_aligned_none=Count(
                'id', filter=Q(systems_change_aligned="None")),
            systems_change_aligned_alot=Count(
                'id', filter=Q(systems_change_aligned="A lot")),
            systems_change_aligned_alittle=Count(
                'id', filter=Q(systems_change_aligned="A little")),

            systems_change_progress_none=Count(
                'id', filter=Q(systems_change_progress="None")),
            systems_change_progress_alot=Count(
                'id', filter=Q(systems_change_progress="A lot")),
            systems_change_progress_alittle=Count(
                'id', filter=Q(systems_change_progress="A little")),

            total_supplier_open_kpis=Count('id', filter=Q(status__in=[1, 2])),
            total_supplier_closed_kpis=Count('id', filter=Q(status__in=[3, 4]))
        )

        kpiDataSummary = kpis_queryset.filter(case__supplier__in=suppliers_queryset).aggregate(
            total_kpis_level_1_violation_cases=Count(
                'case__id', filter=(Q(level=1))),
            total_kpis_level_2_violation_cases=Count(
                'case__id', filter=(Q(level=2))),
            total_kpis_level_3_violation_cases=Count(
                'case__id', filter=(Q(level=3))),
            total_kpis_level_4_violation_cases=Count(
                'case__id', filter=(Q(level=4))),
            total_kpis_violation_cases=Count('case__id')
        )

        nationalityByCallCount = cases_queryset.filter(supplier__in=suppliers_queryset, client_nationality__isnull=False).values(
            'client_nationality', 'client_nationality__name').annotate(Count('client_nationality'))
        ethnicityByCallCount = cases_queryset.filter(supplier__in=suppliers_queryset, client_ethnicity__isnull=False).values(
            'client_ethnicity', 'client_ethnicity__name').order_by().annotate(Count('client_ethnicity'))

        countriesByCallCount = cases_queryset.filter(supplier__in=suppliers_queryset, country__isnull=False).values(
            'country', 'country__name', 'country__lng', 'country__lat').order_by().annotate(Count('country'))
        provincesByCallCount = cases_queryset.filter(supplier__in=suppliers_queryset, province__isnull=False).values(
            'province', 'province__name', 'province__lng', 'province__lat').order_by().annotate(Count('province'))
        districtsByCallCount = cases_queryset.filter(supplier__in=suppliers_queryset, district__isnull=False).values(
            'district', 'district__name', 'district__lng', 'district__lat').order_by().annotate(Count('district'))

        big_ass_query = """select DATE_FORMAT(case_interactions.interacted, '%%Y-%%m') as month_year, COUNT(DISTINCT cases.id) AS call_count
                            from cases
                            inner join cases_case_interactions on cases_case_interactions.case_id=cases.id
                            inner join case_interactions on case_interactions.id=cases_case_interactions.caseinteraction_id """
        if supplier_ids and supplier_ids != "":
            big_ass_query += " where supplier_id in (" + supplier_ids + ")"

        if start_timestamp:
            big_ass_query += " and case_interactions.interacted >=  DATE_FORMAT(FROM_UNIXTIME(" + \
                start_timestamp + "),  '%%Y-%%m-%%d')"

        if end_timestamp:
            big_ass_query += " and case_interactions.interacted <=  DATE_FORMAT(FROM_UNIXTIME(" + \
                end_timestamp + "),  '%%Y-%%m-%%d')"

        big_ass_query += " group by month_year"

        caseCountByYearMonth = CallsByCountSerializer(
            CallsByCount.objects.raw(big_ass_query), many=True).data

        crcRawScored = crc_scores_queryset.filter(supplier__in=suppliers_queryset).order_by('-id').values()

        return Response({"caseDataSummary": caseDataSummary,
                         "crcRawScored": crcRawScored,
                         "supplierKpiDataSummary": supplierKpiDataSummary,
                         "kpiDataSummary": kpiDataSummary,
                         "caseCountByYearMonth": caseCountByYearMonth,
                         "countriesByCallCount": countriesByCallCount,
                         "provincesByCallCount": provincesByCallCount,
                         "districtsByCallCount": districtsByCallCount,
                         "nationalityByCallCount": nationalityByCallCount,
                         "ethnicityByCallCount": ethnicityByCallCount})


class MetricsCRCScoresView(APIView):

    def get(self, request):
        suppliers_queryset = Supplier.objects.all()

        supplier_ids = self.request.query_params.get('supplierIds')
        if supplier_ids and supplier_ids != "":
            suppliers_queryset = suppliers_queryset.filter(
                id__in=list(map(int, supplier_ids.split(','))))

        crc_scores_queryset = SupplierCRCResponse.objects.all()
        start_timestamp = self.request.query_params.get('start')
        end_timestamp = self.request.query_params.get('end')

        if start_timestamp:
            start = datetime.fromtimestamp(int(start_timestamp))
            crc_scores_queryset = crc_scores_queryset.filter(
                created_at__gte=start
            )
        if end_timestamp:
            end = datetime.fromtimestamp(int(end_timestamp))
            crc_scores_queryset = crc_scores_queryset.filter(
                created_at__lte=end
            )

        crcRawScored = crc_scores_queryset.filter(supplier__in=suppliers_queryset).values()

        return Response({"crcRawScored": crcRawScored })


class MetricsMonthlyWorkerVoiceView(generics.ListAPIView):
    model = MonthlyWorkerVoice
    queryset = MonthlyWorkerVoice.objects.all()
    serializer_class = MonthlyWorkerVoiceSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = self.queryset.all()

        start_timestamp = self.request.query_params.get('start')
        end_timestamp = self.request.query_params.get('end')

        if start_timestamp:
            start = datetime.fromtimestamp(int(start_timestamp))
            queryset = queryset.filter(month_year__gte=start)
        if end_timestamp:
            end = datetime.fromtimestamp(int(end_timestamp))
            queryset = queryset.filter(month_year__lte=end)

        return queryset

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)



class CurrentUserView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class IncrementClientVersionView(APIView):
    def post(self, request, format=None):
        config = Config.objects.all().first()
        client_version = config.client_version
        sub_version = int(client_version.split('.')[1])
        sub_version += 1
        client_version = '{}.{}'.format(client_version[0], sub_version)
        config.client_version = client_version
        config.save()
        return Response({'client_version': client_version}, status=200)

    def get(self, request, format=None):
        config = Config.objects.all().first()
        client_version = config.client_version
        sub_version = int(client_version.split('.')[1])
        sub_version += 1
        client_version = '{}.{}'.format(client_version[0], sub_version)
        return Response({'client_version': client_version}, status=200)

class DeleteSupplierKpiUpdateView(APIView):
    def post(self, request, format=None):
        kpisZeroCases = request.data
        SupplierKpiUpdate.objects.filter(supplier_kpi__in=kpisZeroCases).delete()
        SupplierKpi.objects.filter(id__in=kpisZeroCases).delete()

        return Response({}, status=200)

class DeleteSupplierKpiBatchUpdateView(APIView):
    def post(self, request, format=None):
        duplicates = request.data
        SupplierKpiUpdate.objects.filter(id__in=duplicates).delete()
        return Response({}, status=200)


class SupplierBatchUpdateView(APIView):
    def post(self, request, format=None):
        suppliers = request.data
        for supplier in suppliers:
            if supplier['vessel_type'] is not None:
                supplier['vessel_type'] = VesselType.objects.get(pk=supplier['vessel_type'])

            if supplier['industry'] is not None:
                supplier['industry'] = Industry.objects.get(pk=supplier['industry'])

            if supplier['subindustry'] is not None:
                supplier['subindustry'] = SubIndustry.objects.get(pk=supplier['subindustry'])

            if supplier['country'] is not None:
                supplier['country'] = Country.objects.get(pk=supplier['country'])

            if supplier['province'] is not None:
                supplier['province'] = Province.objects.get(pk=supplier['province'])

            if supplier['district'] is not None:
                supplier['district'] = District.objects.get(pk=supplier['district'])

            additional_contacts = supplier['additional_contacts']
            del supplier['additional_contacts']

            updateSupplier = Supplier(**supplier)

            if additional_contacts is not None:
                updateSupplier.additional_contacts.set(additional_contacts);



            updateSupplier.save()

        return Response({}, status=200)


class MergeSupplierDuplicatesView(APIView):
    def post(self, request, format=None):
        duplicates = request.data

        
        '''
        Pop minimum supplier ID from duplicates list to be used as a merging point
        (other duplicates will be merged into this one)

        Note: minimum is used because it's the earliest supplier
        '''
        allSuppliers = duplicates[:]
        min_supplier_id = duplicates.pop(0)
        
        # cases
        cases = Case.objects.filter(supplier_id__in=duplicates)
        cases.update(supplier_id=min_supplier_id)

        # mm thai sending data
        mm_thai_sending_data = MmThaiSendingData.objects.filter(
            supplier_id__in=duplicates)
        mm_thai_sending_data.update(supplier_id=min_supplier_id)

        # mm thai demand data
        mm_thai_demand_data = MmThaiDemandData.objects.filter(
            supplier_id__in=duplicates)
        mm_thai_demand_data.update(supplier_id=min_supplier_id)

        # er meetings
        er_meetings = EthicalRecruitmentMeeting.objects.filter(
            supplier_id__in=duplicates)
        er_meetings.update(supplier_id=min_supplier_id)

        # crc responses
        crc_responses = SupplierCRCResponse.objects.filter(
            supplier_id__in=duplicates)
        crc_responses.update(supplier_id=min_supplier_id)

        # supply chains (M2M)
        # Hey Andrei.. Hoepfully I didn't do this dumb
        # seems to work.
        # Sense you can have all the suppliers in one supply chain.  And if you replaced to just the source
        # id it makes duplicates.  So I thought....  Remove the duplicates array first..
        # Then go through the ones that didn't already have target suppleir and add target supplier in that case.
        # Same theory for the rest.  If you know a slicker way love to see how I messed it up hacker style ;)
        # But basically in the ManyToMany.. Replace all the duplicates.. Then make sure the source is in all of them.
        # but that source is also.. Not duplicated. Cool man Happy Coding sir
        supply_chains = SupplyChain.objects.filter(
            suppliers__in=duplicates)

        for supplychain in supply_chains.iterator():
            for supplier in duplicates:
                supplychain.suppliers.remove(supplier)

            found = False
            for supplier in supplychain.suppliers.iterator():
                if supplier.id == min_supplier_id:
                    found = True
                    break

            if found == False:
                supplychain.suppliers.add(min_supplier_id);

            supplychain.save()

        # fieldwork activities (M2M)Team.objects.filter(members__id=acc_pk1).filter(members__id=acc_pk2).exists()
        fieldwork_activities = FieldworkActivity.objects.filter(
            suppliers__in=duplicates)

        for activity in fieldwork_activities.iterator():
            for supplier in duplicates:
                activity.suppliers.remove(supplier)

            found = False
            for supplier in activity.suppliers.iterator():
                if supplier.id == min_supplier_id:
                    found = True
                    break

            if found == False:
                activity.suppliers.add(min_supplier_id);

            activity.save()

        # business responses (M2M)
        business_responses = BusinessResponse.objects.filter(
            suppliers__in=duplicates)

        for businesresponse in business_responses.iterator():
            for supplier in duplicates:
                businesresponse.suppliers.remove(supplier)

            found = False
            for supplier in businesresponse.suppliers.iterator():
                if supplier.id == min_supplier_id:
                    found = True
                    break

            if found == False:
                businesresponse.suppliers.add(min_supplier_id);

            businesresponse.save()

        # remove supplier duplicates
        Supplier.objects.filter(id__in=duplicates).delete()

        return Response({}, status=200)


class MergeRecruiterDuplicatesView(APIView):
    def post(self, request, format=None):
        duplicates = request.data
        
        '''
        Pop minimum recruiter ID from duplicates list to be used as a merging point
        (other duplicates will be merged into this one)

        Note: minimum is used because it's the earliest recruiter
        '''
        min_recruiter_id = duplicates.pop(0)
        
        # cases source recruiter
        cases = Case.objects.filter(source_recruiter_id__in=duplicates)
        cases.update(source_recruiter_id=min_recruiter_id)

        # cases destination recruiter
        cases = Case.objects.filter(destination_recruiter_id__in=duplicates)
        cases.update(destination_recruiter_id=min_recruiter_id)

        # mm thai sending data
        mm_thai_sending_data = MmThaiSendingData.objects.filter(
            recruiter_id__in=duplicates)
        mm_thai_sending_data.update(recruiter_id=min_recruiter_id)

        # mm thai demand data
        mm_thai_demand_data = MmThaiDemandData.objects.filter(
            recruiter_id__in=duplicates)
        mm_thai_demand_data.update(recruiter_id=min_recruiter_id)

        # er meetings
        er_meetings = EthicalRecruitmentMeeting.objects.filter(
            recruiter_id__in=duplicates)
        er_meetings.update(recruiter_id=min_recruiter_id)

        # crc responses
        crc_responses = RecruiterCRCResponse.objects.filter(
            recruiter_id__in=duplicates)
        crc_responses.update(recruiter_id=min_recruiter_id)

        # recruiter responses
        responses = RecruiterResponse.objects.filter(
            recruiter_id__in=duplicates)
        responses.update(recruiter_id=min_recruiter_id)

        # recruiter issues
        issues = RecruiterIssue.objects.filter(recruiter_id__in=duplicates)
        issues.update(recruiter_id=min_recruiter_id)

        # fieldwork activities (M2M)
        fieldwork_activities = FieldworkActivity.recruiters.through.objects.filter(
            recruiter_id__in=duplicates)
        fieldwork_activities.update(recruiter_id=min_recruiter_id)

        # business responses (M2M)
        business_responses = BusinessResponse.recruiters.through.objects.filter(
            recruiter_id__in=duplicates)
        business_responses.update(recruiter_id=min_recruiter_id)

        # remove recruiter duplicates
        Recruiter.objects.filter(id__in=duplicates).delete()

        return Response({}, status=200)





class SharedFileViewSet(viewsets.ModelViewSet):
    permission_classes = (AllowAny,)
    queryset = SharedFile.objects.all()
    serializer_class = SharedFileSerializer

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

    def retrieve(self, request, pk=None):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

    def update(self, request, pk=None):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

    def partial_update(self, request, pk=None):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

    def destroy(self, request, pk=None):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)



def send_kpi_email_partner(kpi_template, kpis, strategic_partner):

    context = {
        'context': {
            'kpi_template': kpi_template,
            'kpis': kpis,
            'url': settings.FRONTEND_URL,
            'strategic_partner': strategic_partner
        }
    }

    html_message = render_to_string('emails/partner_kpi_alert.html', context)
    plain_message = strip_tags(html_message)
    email_to = list(kpi_template.email_to.values_list('email', flat=True))
        

    if kpi_template.golive == True and strategic_partner.email_notify == True:
        strategic_partner_users = StrategicPartnerUser.objects.filter(strategic_partner=strategic_partner)
        for partnerUser in strategic_partner_users:
            email_to.append(partnerUser.user.email)
    

    try:
        
        send_mail(kpi_template.subject,
            plain_message,
            'issaranotify@issarainstitute.org',
            email_to,
            html_message=html_message,
            fail_silently=True
            )

        kpi_email_notification = KpiEmailNotification.objects.create(
            template=kpi_template,
            error_message=str(strategic_partner.name) + str(": (SUCCESS)") + str(serializers.serialize("json", [kpi_template])),
            delivered=True
        )
      

    except Exception as e:
        kpi_email_notification = KpiEmailNotification.objects.create(
            template=kpi_template,
            error_message=str(strategic_partner.name) + str(": (") + str(e) + str(")"),
            delivered=False,
        )
    finally:
        kpi_email_notification.supplier_kpis.set(kpis)
        kpi_email_notification.recipients.set(kpi_template.email_to.all())

def send_kpi_email(kpi_template, kpis):

    context = {
        'context': {
            'kpi_template': kpi_template,
            'kpis': kpis,
            'url': settings.FRONTEND_URL
        }
    }

    html_message = render_to_string('emails/internal_kpi_email.html', context)
    plain_message = strip_tags(html_message)

    try:
        send_mail(
            kpi_template.subject,
            plain_message,
            'issaranotify@issarainstitute.org',
            kpi_template.email_to.values_list('email', flat=True),
            html_message=html_message,
            fail_silently=True,
        )

        kpi_email_notification = KpiEmailNotification.objects.create(
            template=kpi_template,
            delivered=True
        )

    except Exception as e:
        kpi_email_notification = KpiEmailNotification.objects.create(
            template=kpi_template,
            error_message=str(e),
            delivered=False,
        )
    finally:
        kpi_email_notification.supplier_kpis.set(kpis)
        kpi_email_notification.recipients.set(kpi_template.email_to.all())




class ExternalKpiEmailCronJobView(APIView):
    permission_classes = [AllowAny, ]

    def get(self, request):
        is_appengine = request.headers.get('X-Appengine-Cron')

        if is_appengine or settings.DEBUG or settings.TESTING:

            external_kpi_email_templates = KpiEmailNotificationTemplate.objects.filter(type='SP')

            for kpi_template in external_kpi_email_templates:
                strategic_partners_kpis = {}

                kpis = SupplierKpi.objects.filter(status__in=kpi_template.kpi_statuses.all()).prefetch_related(
                    'supplier__supply_chains__strategic_partner'
                )

                if kpi_template.days_eq:
                    kpis = kpis.filter(opened_at=(date.today()-timedelta(days=kpi_template.days_eq)))

                if kpi_template.level_eq:
                    kpis = kpis.filter(kpi__level=kpi_template.level_eq)

                if kpi_template.level_gte:
                    kpis = kpis.filter(kpi__level__gte=kpi_template.level_gte)

                if kpi_template.level_lte:
                    kpis = kpis.filter(kpi__level__lte=kpi_template.level_lte)

                kpis_to_exclude  = []

                for kpi in kpis:
                    sent_previously = KpiEmailNotification.objects.filter(template=kpi_template, supplier_kpis=kpi, date__gte=kpi.opened_at).count() > 0

                    if sent_previously:
                        kpis_to_exclude.append(kpi.id)

                kpis = kpis.exclude(id__in=kpis_to_exclude)

                for kpi in kpis:
                    supply_chains = kpi.supplier.supply_chains.all()

                    for supply_chain in supply_chains:
                        if strategic_partners_kpis.get(supply_chain.strategic_partner):
                            strategic_partners_kpis[supply_chain.strategic_partner].append(kpi)
                        else:
                            strategic_partners_kpis[supply_chain.strategic_partner] = [kpi]

                for (strategic_partner, kpis) in strategic_partners_kpis.items():
                    if len(kpis) > 0:
                        send_kpi_email_partner(kpi_template, kpis, strategic_partner)

            return Response(status=status.HTTP_200_OK)

        return Response(status=status.HTTP_401_UNAUTHORIZED)



class InternalKpiEmailCronJobView(APIView):
    permission_classes = [AllowAny, ]

    def get(self, request):
        is_appengine = request.headers.get('X-Appengine-Cron')

        if is_appengine or settings.DEBUG or settings.TESTING:

            internal_kpi_email_templates = KpiEmailNotificationTemplate.objects.filter(type='I')

            for kpi_template in internal_kpi_email_templates:

                kpis = SupplierKpi.objects.filter(status__in=kpi_template.kpi_statuses.all()).prefetch_related(
                    'supplier__supply_chains__strategic_partner'
                )


                if kpi_template.days_eq:
                    kpis = kpis.filter(opened_at=(datetime.now()-timedelta(days=kpi_template.days_eq)))

                if kpi_template.level_eq:
                    kpis = kpis.filter(kpi__level=kpi_template.level_eq)

                if kpi_template.level_gte:
                    kpis = kpis.filter(kpi__level__gte=kpi_template.level_gte)

                if kpi_template.level_lte:
                    kpis = kpis.filter(kpi__level__lte=kpi_template.level_lte)


                kpis_to_exclude  = []

                for kpi in kpis:
                    sent_previously = KpiEmailNotification.objects.filter(template=kpi_template, supplier_kpis=kpi, date__gte=kpi.opened_at).count() > 0

                    if sent_previously:
                        kpis_to_exclude.append(kpi.id)


                kpis = kpis.exclude(id__in=kpis_to_exclude)

                if kpis.count() > 0:
                    send_kpi_email(kpi_template, kpis)

            return Response(status=status.HTTP_200_OK)

        return Response(status=status.HTTP_401_UNAUTHORIZED)
