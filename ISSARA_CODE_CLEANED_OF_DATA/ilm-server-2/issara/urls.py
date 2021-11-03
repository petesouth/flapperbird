import sys

from django.contrib import admin
from django.urls import include, path
from django.contrib import admin
from rest_framework import routers
from django.views.decorators.clickjacking import xframe_options_exempt

from issara.ilm_server_2 import views
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt import views as jwt_views
from rest_framework_simplejwt import serializers as jwt_serializers

import json
from django.core import serializers

import drf_jwt_2fa.urls
from django.conf.urls import include, url


router = routers.DefaultRouter()

router.register("howhearissara", views.HowHearIssaraViewSet)
router.register('personcontacts', views.PersonContactViewSet)
router.register('newsupdates', views.NewsUpdateViewSet)
router.register('partnernewsupdates', views.PartnerMessageBoardViewSet)
router.register('strategicpartners', views.StregicPartnerViewSet)
router.register('strategic-partner-responses', views.StregicPartnerResponseViewSet)
router.register('workplaces', views.WorkPlaceViewSet)
router.register('issuecategories', views.IssueCategoryViewSet)
router.register('kpicategories', views.KpiCategoryViewSet)
router.register('kpis', views.KpiViewSet)
router.register('nationalities', views.NationalityViewSet)
router.register('interactionreasons', views.InteractionReasonViewSet)
router.register('interactionchannels', views.InteractionChannelViewSet)
router.register('referralactions', views.ReferralActionViewSet)
router.register('ethnicities', views.EthnicityViewSet)
router.register('contracttypes', views.ContractTypeViewSet)
router.register('documenttypes', views.DocumentTypeViewSet)
router.register('kpilegalviolations', views.KpiLegalViolationViewSet)
router.register('vesseltypes', views.VesselTypeViewSet)
router.register('industries', views.IndustryViewSet)
router.register('subindustries', views.SubIndustryViewSet)
router.register('countries', views.CountryViewSet)
router.register('provinces', views.ProvinceViewSet)
router.register('user-tasks', views.UserTaskViewSet)
router.register('districts', views.DistrictViewSet)
router.register('recruiters', views.RecruiterViewSet)
router.register('suppliers', views.SupplierViewSet)
router.register('supplier-kpis', views.SupplierKpiViewSet)
router.register('supplier-kpi-updates', views.SupplierKpiUpdateViewSet)
router.register('supplierkpiupdatestatuses', views.SupplierKpiUpdateStatusViewSet)
router.register('users', views.UserViewSet)
router.register('userpartnerlogins', views.UserLoginView)
router.register('groups', views.GroupViewSet)
router.register('casestatuses', views.CaseStatusViewSet)
router.register('clientstatuses', views.ClientStatusViewSet)
router.register('clienttypes', views.ClientTypeViewSet)
router.register('supplychains', views.SupplyChainViewSet)
router.register('casecategories', views.CaseCategoryViewSet)
router.register('cases', views.CaseViewSet)
router.register('cases_deep', views.CaseDeepViewSet)
router.register('business-responses', views.BusinessResponseViewSet)
router.register('business-response-interaction-types', views.BusinessResponseInteractionTypeViewSet)
router.register('supplier-crc-scores', views.SupplierCRCResponseViewSet)
router.register('recruiter-crc-scores', views.RecruiterCRCResponseViewSet)
router.register('fieldwork-activities', views.FieldworkActivityViewSet)
router.register('fieldwork-types', views.GroupedFieldworkActivityTypeViewSet)
router.register('fieldwork-primary-focuses', views.FieldworkActivityPrimaryFocusViewSet)
router.register('monthly-worker-voice', views.MonthlyWorkerVoiceViewSet)
router.register('ethical-recruitment-meetings', views.EthicalRecruitmentMeetingViewSet)
router.register('factorytypes', views.FactoryTypeViewSet)
router.register('mmthaidemanddata', views.MmThaiDemandDataViewSet)
router.register('mm-thai-sending-data', views.MmThaiSendingDataViewSet)
router.register('shared-files', views.SharedFileViewSet)


class TokenObtainPairPatchedSerializer(jwt_serializers.TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        data['user'] = {
            'username': self.user.username,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,

        }

        data['token'] = data['access']

        return data


class TokenObtainPairPatchedView(jwt_views.TokenObtainPairView):
    """
    Takes a set of user credentials and returns an access and refresh JSON web
    token pair to prove the authentication of those credentials.
    """
    serializer_class = TokenObtainPairPatchedSerializer


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.

urlpatterns = [
    path('two_factor_auth/', include(drf_jwt_2fa.urls)),
    path('hello', views.HelloView.as_view(), name='hello'),
    path('admin/', admin.site.urls),
    path('api/v2/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api-auth-user/password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    path('api-auth-user/change_password/<int:pk>/', views.ChangePasswordView.as_view(), name='api_auth_change_password'),
    path('api/v2/token/', TokenObtainPairPatchedView.as_view()),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v2/cases_lean', views.CaseLeanViewSet.as_view(), name='cases-lean'),
    path('api/v2/supplierkpis_raw', views.SupplierKpiRawViewSet.as_view(), name='supplierkpis-raw'),
    path('api/v2/mm-thai-sending-data-raw', views.MmThaiSendingDataRawViewSet.as_view(), name="mm-thai-sending-data-raw"),
    path('api/v2/metrics/workers', views.MetricsWorkersView.as_view(), name='metrics-workers'),
    path('api/v2/metrics/interactions', views.MetricsInteractionsView.as_view(), name='metrics-interactions'),
    path('api/v2/metrics/crc-scores', views.MetricsCRCScoresView.as_view(), name='metrics-crc-scores'),
    path('api/v2/metrics/monthly-worker-voice', views.MetricsMonthlyWorkerVoiceView.as_view(), name='metrics-monthly-worker-voice'),
    path('api/v2/me', views.CurrentUserView.as_view(), name='me'),
    path('api/v2/increment-client-version', views.IncrementClientVersionView.as_view(), name='increment-client-version'),
    path('api/v2/merge-supplier-duplicates', views.MergeSupplierDuplicatesView.as_view(), name='merge-supplier-duplicates'),
    path('api/v2/merge-recruiter-duplicates', views.MergeRecruiterDuplicatesView.as_view(), name='merge-recruiter-duplicates'),
    # path('api/v2/app-engine/cron/partner-kpi-status-email', views.KpiStatusEmailCronJobView.as_view(), name='partner-status-email-cron'),
    # path('api/v2/app-engine/cron/partner-closed-kpi-email', views.MonthlyClosedKpiEmailCronJobView.as_view(), name='partner-closed-kpi-email-cron')
    path('api/v2/app-engine/cron/internal-kpi-email', views.InternalKpiEmailCronJobView.as_view(), name='internal-kpi-email-cron'),
    path('api/v2/app-engine/cron/external-kpi-email', views.ExternalKpiEmailCronJobView.as_view(), name='external-kpi-email-cron'),
    path('api/v2/supplierkpiupdatebatchdelete', views.DeleteSupplierKpiBatchUpdateView.as_view(), name="supplier-kpi-update-batchdelete"),
    path('api/v2/supplierbatchupdate', views.SupplierBatchUpdateView.as_view(), name="supplier-batch-update"),
    path('api/v2/removesupplierkpis', views.DeleteSupplierKpiUpdateView.as_view(), name="supplier-kpi-remove")
]


if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        path('__debug__/', include(debug_toolbar.urls)),
]
