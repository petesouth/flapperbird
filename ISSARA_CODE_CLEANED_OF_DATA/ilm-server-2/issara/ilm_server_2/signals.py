from django.db.models.signals import post_save, post_delete, m2m_changed
from django.contrib.auth.models import Group, User
from django_rest_passwordreset.signals import reset_password_token_created
from django.dispatch import receiver
from django.utils import timezone

from django.core.mail import send_mail
from django.conf import settings

import simplejson as json
from .models import Case, SupplierKpi, SupplierKpiUpdate, BusinessResponse, UserTask, SupplierKpiUpdateStatus, SupplierKpiUpdateStatus, StrategicPartnerUser

from issara.ilm_server_2.serializers import (
    UserTaskSerializer, UserSerializer,
    GroupSerializer, SupplierSerializer, RecruiterSerializer, DistrictSerializer,
    EthnicitySerializer, InteractionChannelSerializer, CountrySerializer,
    ProvinceSerializer, IndustrySerializer, SubIndustrySerializer, VesselTypeSerializer,
    DocumentTypeSerializer, ContractTypeSerializer, HowHearIssaraSerializer,
    NationalitySerializer, InteractionReasonSerializer, IssueCategorySerializer,
    KpiCategorySerializer, KpiSerializer, WorkPlaceSerializer, StrategicPartnerSerializer,
    CaseStatusSerializer, CaseSerializer, CaseDeepSerializer, CaseLeanSerializer, SupplierKpiSerializer,
    SupplierKpiUpdateSerializer, BusinessResponseSerializer, CaseInteractionSerializer,
    SupplierCRCResponseSerializer, FieldworkActivitySerializer, FieldworkActivityTypeSerializer,
    ClientTypeSerializer, ClientStatusSerializer, MonthlyWorkerVoiceSerializer, CaseCategorySerializer,
    BusinessResponseInteractionTypeSerializer, StrategicPartnerResponseSerializer, ReferralActionSerializer,
    EthicalRecruitmentMeetingSerializer, KpiLegalViolationSerializer, CaseExcelSerializer, FactoryTypeSerializer,
    MmThaiDemandDataSerializer, SupplierKpiUpdateStatusSerializer

)


@receiver(post_save, sender=Case)
def _from_case(sender, instance, **kwargs):
    print('M2M fire signal=a')
    supplier = instance.supplier

     # Get all KPIs for choosen supplier
    supplier_kpis = SupplierKpi.objects.filter(supplier=supplier)

    # Iterate through KPIs and create new open SupplierKPI if one is not found
    for kpi in instance.kpis.all():

        try:
            supplier_kpi = supplier_kpis.get(kpi_id=kpi.id)
           
            if supplier_kpi.status is not None and supplier_kpi.status.id in [3, 4] and ((instance.interacted is None) or (supplier_kpi.closed_at is None) or (instance.interacted > supplier_kpi.closed_at)):
                supplier_kpi.status = SupplierKpiUpdateStatus.objects.get(pk=1)
                print("supplierKPI reopened", supplier_kpi.id)

                supplier_kpi.opened_at = instance.interacted
                supplier_kpi.closed_at = None

                supplier_kpi.overview_date = None
                supplier_kpi.status_id = 1  # 1 === 'No progress'
                supplier_kpi.kpi_update_source = "caseupdate"
                supplier_kpi.closed_quality = None
                supplier_kpi.closed_notes = None
                supplier_kpi.affected_workers = 0
                supplier_kpi.retaliation = False
                supplier_kpi.remediation_issara_recommendation = None
                supplier_kpi.remediation_progress = 'None'
                supplier_kpi.remediation_aligned = 'None'
                supplier_kpi.remediation_business_steps_taken = None
                supplier_kpi.remediation_business_steps_remaining = None
                supplier_kpi.remediation_payment_deadline = None
                supplier_kpi.remediation_owed_baht = 0
                supplier_kpi.remediation_owed_kyat = 0
                supplier_kpi.remediation_owed_ringitt = 0
                supplier_kpi.remediation_owed_usd = 0
                supplier_kpi.remediation_paid_baht = 0
                supplier_kpi.remediation_paid_kyat = 0
                supplier_kpi.remediation_paid_ringitt = 0
                supplier_kpi.remediation_paid_usd = 0
                supplier_kpi.remediation_workers_paid = 0

                supplier_kpi.remediation_documents_owed = 0
                supplier_kpi.remediation_documents_provided = 0
                supplier_kpi.remediation_documents_deadline = None
                supplier_kpi.remediation_notes = None
                supplier_kpi.remediation_action = None
                supplier_kpi.remediation_validation = None
                supplier_kpi.remediation_results = None

                supplier_kpi.systems_change_issara_recommendation = None
                supplier_kpi.systems_change_progress = 'None'
                supplier_kpi.systems_change_aligned = 'None'
                supplier_kpi.systems_change_business_steps_taken = None
                supplier_kpi.systems_change_business_steps_remaining = None
                supplier_kpi.systems_change_deadline = None
                supplier_kpi.save()

        except SupplierKpi.DoesNotExist:
            
            supplier_kpi = SupplierKpi(supplier=supplier, kpi_id=kpi.id)
            supplier_kpi.status = SupplierKpiUpdateStatus.objects.get(pk=1)
            supplier_kpi.kpi_update_source = "caseupdate"
            supplier_kpi.opened_at = instance.interacted
            supplier_kpi.save()



@receiver(post_save, sender=SupplierKpi)
def supplier_kpi_save(sender, instance, **kwargs):
    newKpiUpdateData = {
            'supplier_kpi': SupplierKpi.objects.get(id=instance.id),
            'overview_date': instance.overview_date,
            'status': instance.status,
            'kpi_update_source': instance.kpi_update_source,
            'closed_quality': instance.closed_quality,
            'closed_notes': instance.closed_notes,
            'affected_workers': instance.affected_workers,
            'retaliation': instance.retaliation,

            'remediation_issara_recommendation': instance.remediation_issara_recommendation,
            'remediation_progress': instance.remediation_progress,
            'remediation_aligned': instance.remediation_aligned,
            'remediation_business_steps_taken': instance.remediation_business_steps_taken,
            'remediation_business_steps_remaining': instance.remediation_business_steps_remaining,
            'remediation_payment_deadline': instance.remediation_payment_deadline,

            'remediation_owed_baht': instance.remediation_owed_baht,
            'remediation_owed_kyat': instance.remediation_owed_kyat,
            'remediation_owed_ringitt': instance.remediation_owed_ringitt,
            'remediation_owed_usd': instance.remediation_owed_usd,

            'remediation_paid_baht': instance.remediation_paid_baht,
            'remediation_paid_kyat': instance.remediation_paid_kyat,
            'remediation_paid_ringitt': instance.remediation_paid_ringitt,
            'remediation_paid_usd': instance.remediation_paid_usd,

            'remediation_workers_paid': instance.remediation_workers_paid,
            'remediation_documents_owed': instance.remediation_documents_owed,
            'remediation_documents_provided': instance.remediation_documents_provided,
            'remediation_documents_deadline': instance.remediation_documents_deadline,
            'remediation_notes': instance.remediation_notes,
            'remediation_action': instance.remediation_action,
            'remediation_validation': instance.remediation_validation,
            'remediation_results': instance.remediation_results,

            'systems_change_issara_recommendation': instance.systems_change_issara_recommendation,
            'systems_change_progress': instance.systems_change_progress,
            'systems_change_aligned': instance.systems_change_aligned,
            'systems_change_business_steps_taken': instance.systems_change_business_steps_taken,
            'systems_change_business_steps_remaining': instance.systems_change_business_steps_remaining,
            'systems_change_deadline': instance.systems_change_deadline,
            'closed_at': instance.closed_at,
            'opened_at': instance.opened_at,
        }
    
    try:
        kpiUpdateData = SupplierKpiUpdate.objects.filter(supplier_kpi=instance.id).order_by("-id")[:1].get()
        if kpiUpdateData.status.id != instance.status.id:
            kpiUpdate = SupplierKpiUpdate(**newKpiUpdateData)
            kpiUpdate.save()
        else:
            kpiUpdateData.overview_date = instance.overview_date
            kpiUpdateData.status = instance.status
            kpiUpdateData.kpi_update_source = instance.kpi_update_source
            kpiUpdateData.closed_quality = instance.closed_quality
            kpiUpdateData.closed_notes = instance.closed_notes
            kpiUpdateData.affected_workers = instance.affected_workers
            kpiUpdateData.retaliation = instance.retaliation
            
            kpiUpdateData.remediation_issara_recommendation = instance.remediation_issara_recommendation
            kpiUpdateData.remediation_progress = instance.remediation_progress
            kpiUpdateData.remediation_aligned = instance.remediation_aligned
            kpiUpdateData.remediation_business_steps_taken = instance.remediation_business_steps_taken
            kpiUpdateData.remediation_business_steps_remaining = instance.remediation_business_steps_remaining
            kpiUpdateData.remediation_payment_deadline = instance.remediation_payment_deadline
            
            kpiUpdateData.remediation_owed_baht = instance.remediation_owed_baht
            kpiUpdateData.remediation_owed_kyat = instance.remediation_owed_kyat
            kpiUpdateData.remediation_owed_ringitt = instance.remediation_owed_ringitt
            kpiUpdateData.remediation_owed_usd = instance.remediation_owed_usd
            
            kpiUpdateData.remediation_paid_baht = instance.remediation_paid_baht
            kpiUpdateData.remediation_paid_kyat = instance.remediation_paid_kyat
            kpiUpdateData.remediation_paid_ringitt = instance.remediation_paid_ringitt
            kpiUpdateData.remediation_paid_usd = instance.remediation_paid_usd
            
            kpiUpdateData.remediation_workers_paid = instance.remediation_workers_paid
            kpiUpdateData.remediation_documents_owed = instance.remediation_documents_owed
            kpiUpdateData.remediation_documents_provided = instance.remediation_documents_provided
            kpiUpdateData.remediation_documents_deadline = instance.remediation_documents_deadline
            kpiUpdateData.remediation_notes = instance.remediation_notes
            kpiUpdateData.remediation_action = instance.remediation_action
            kpiUpdateData.remediation_validation = instance.remediation_validation
            kpiUpdateData.remediation_results = instance.remediation_results
            
            kpiUpdateData.systems_change_issara_recommendation = instance.systems_change_issara_recommendation
            kpiUpdateData.systems_change_progress = instance.systems_change_progress
            kpiUpdateData.systems_change_aligned = instance.systems_change_aligned
            kpiUpdateData.systems_change_business_steps_taken = instance.systems_change_business_steps_taken
            kpiUpdateData.systems_change_business_steps_remaining = instance.systems_change_business_steps_remaining
            kpiUpdateData.systems_change_deadline = instance.systems_change_deadline
            kpiUpdateData.closed_at = instance.closed_at
            kpiUpdateData.opened_at = instance.opened_at
            
            kpiUpdateData.save()    
    
    except SupplierKpiUpdate.DoesNotExist:        
        kpiUpdate = SupplierKpiUpdate(**newKpiUpdateData)
        kpiUpdate.save()


#################################################
############### CREATE USER TASKS ###############
#################################################

@receiver(post_save, sender=Case)
def create_user_task_on_case_save(sender, instance, **kwargs):
    latest_interaction = instance.case_interactions.last()

    if latest_interaction:
        source_id = instance.id
        source_type = 'Call'
        assigned_by = latest_interaction.issara_staff.id
        assigned_to = instance.next_steps_issara_staff
        deadline = instance.dead_line_date

        if assigned_to:
            # check if the task was previously created, if not create a new one
            try:
                task = UserTask.objects.get(
                    source_id=source_id,
                    source_type=source_type,
                    assigned_by_id=assigned_by,
                    assigned_to_id=assigned_to.id
                )
            except UserTask.DoesNotExist:
                task = UserTask(
                    source_id=source_id,
                    source_type=source_type,
                    assigned_by_id=assigned_by,
                    assigned_to_id=assigned_to.id,
                    deadline=deadline

                )
                task.save()


@receiver(m2m_changed, sender=Case.case_interactions.through)
def create_user_task_on_case_intaractions_change(sender, instance, action, **kwargs):
    source_id = instance.id
    source_type = 'Call'
    assigned_to = instance.next_steps_issara_staff
    deadline = instance.dead_line_date
    print(action, assigned_to)

    if action == "post_add" and assigned_to:
        assigned_by = instance.case_interactions.last().issara_staff.id
        # check if the task was previously created, if not create a new one
        try:
            task = UserTask.objects.get(
                source_id=source_id,
                source_type=source_type,
                assigned_by_id=assigned_by,
                assigned_to_id=assigned_to.id
            )
            print('GOT task', task)
        except UserTask.DoesNotExist:
            task = UserTask(
                source_id=source_id,
                source_type=source_type,
                assigned_by_id=assigned_by,
                assigned_to_id=assigned_to.id,
                deadline=deadline

            )
            task.save()


@receiver(m2m_changed, sender=BusinessResponse.issara_focal_points.through)
def create_user_task_on_business_response_focal_points_change(sender, instance, pk_set, action, **kwargs):
    source_id = instance.id
    source_type = 'Business Response'
    assigned_to = pk_set
    assigned_by = instance.created_by
    deadline = instance.issara_next_steps_deadline

    if action == "post_add" and assigned_to:
        for user_id in assigned_to:
            # check if the task was previously created, if not create a new one
            try:
                task = UserTask.objects.get(
                    source_id=source_id,
                    source_type=source_type,
                    assigned_to_id=user_id
                )
            except UserTask.DoesNotExist:
                task = UserTask(
                    source_id=source_id,
                    source_type=source_type,
                    assigned_by=assigned_by,
                    assigned_to_id=user_id,
                    deadline=deadline

                )
                task.save()

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    # send a successfull verification message
    link = f'{settings.FRONTEND_URL}/auth/reset-password?token={reset_password_token.key}'
    title = "Your password reset link has arrived"
    message = (
        f"You're receiving this e-mail because you or someone else has "
        f"requested a password for your user account.\n"
        f"It can be safely ignored if you did not request a password reset.\n"
        f"Click here to reset the password: {link}"
    )
    sender = "ILM <issaranotify@issarainstitute.org>"
    receiver = [reset_password_token.user.email]
    send_mail(title, message, sender, receiver)
