import os
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import MinValueValidator
from django.core.validators import MaxValueValidator

from .choices import (
    KPI_LEVEL_CHOICES,
    KPI_UPDATE_SOURCE_CHOICES,
    KPI_UPDATE_CLOSED_QUALITY_CHOICES,
    KPI_UPDATE_PROGRESS_CHOICES,
    TASK_SOURCE_TYPE,
    SHARED_FILE_TYPES
)

from .utilities import get_type_path





class SharedFile(models.Model):
    def get_upload_path(instance, filename):
        path = os.path.join(get_type_path(instance.type), 'shared', filename)
        return path

    name = models.CharField(max_length=256)
    sort_number = models.IntegerField(null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    type = models.CharField(
        max_length=20,
        choices=SHARED_FILE_TYPES,
        default='O', # O - Other, please see choices.py
    )
    file_path = models.FileField(
        blank=True,
        null=True,
        upload_to=get_upload_path,
    )

    created_at = models.DateField(blank=True, null=True, auto_now_add=True)

    class Meta:
        managed = True
        db_table = 'shared_files'

    def __str__(self):
        return self.name


class NewsUpdate(models.Model):

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=1024)
    title = models.CharField(max_length=1024, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created = models.DateField(blank=True, null=True, auto_now_add=True)
    sort_number = models.IntegerField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "NewsUpdates"
        managed = True
        db_table = 'news_updates'

    def __str__(self):
        return self.name




class PersonContact(models.Model):

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=1024)
    email = models.CharField(max_length=1024, blank=True, null=True)
    phone = models.CharField(max_length=1024, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created = models.DateField(blank=True, null=True, auto_now_add=True)

    class Meta:
        verbose_name_plural = "PersonContacts"
        managed = True
        db_table = 'person_contacts'

    def __str__(self):
        return self.name


class KpiLegalViolation(models.Model):

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=1024)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Kpi Legal Violations"
        managed = True
        db_table = 'kpi_legal_violations'

    def __str__(self):
        return self.name


class KpiRecommendedRemediation(models.Model):

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=1024)
    description = models.TextField(blank=True, null=True)


    class Meta:
        verbose_name_plural = "Kpi Recommended Remediations"
        managed = True
        db_table = 'kpi_recommended_remediations'

    def __str__(self):
        return self.name


class KpiSystemsChange(models.Model):

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=1024)
    description = models.TextField(blank=True, null=True)


    class Meta:
        verbose_name_plural = "Kpi Systems Changes"
        managed = True
        db_table = 'kpi_systems_changes'

    def __str__(self):
        return self.name


class EtiBaseCode(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=1024)

    code = models.CharField(max_length=1024)
    description = models.TextField(blank=True, null=True)

    sub_code = models.CharField(max_length=1024)
    sub_description = models.TextField(blank=True, null=True)

    created = models.DateField(blank=True, null=True, auto_now_add=True)
    last_modified = models.DateField(blank=True, null=True, auto_now=True)

    class Meta:
        verbose_name_plural = "Eti Base Codes"
        managed = True
        db_table = 'eti_base_codes'

    def __str__(self):
        return self.name


class ReferralAction(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Referral Actions"
        managed = True
        db_table = 'referral_actions'

    def __str__(self):
        return self.name


class Referral(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    created = models.DateField(blank=True, null=True, auto_now_add=True)
    last_modified = models.DateField(blank=True, null=True, auto_now=True)

    referral_actions = models.ManyToManyField(ReferralAction, blank=True)

    class Meta:
        verbose_name_plural = "Referrals"
        managed = True
        db_table = 'referrals'

    def __str__(self):
        return self.name


class CaseCategory(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Case Categories"
        managed = True
        db_table = 'case_categories'

    def __str__(self):
        return self.name


class ClientStatus(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Client Statuses"
        managed = True
        db_table = 'client_statuses'

    def __str__(self):
        return self.name


class ClientType(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Client Types"
        managed = True
        db_table = 'client_types'

    def __str__(self):
        return self.name


class FactoryType(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Factory Types"
        managed = True
        db_table = 'factory_types'

    def __str__(self):
        return self.name


class Broker(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Brokers"
        managed = True
        db_table = 'brokers'

    def __str__(self):
        return self.name


class Gender(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Genders"
        managed = True
        db_table = 'genders'

    def __str__(self):
        return self.name


class CaseStatus(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Case Statuses"
        managed = True
        db_table = 'case_statuses'

    def __str__(self):
        return self.name


class HowHearIssara(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'how_hear_issara'

    def __str__(self):
        return self.name


class WorkPlace(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'workplaces'

    def __str__(self):
        return self.name


class IssueCategory(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Issue categories"
        managed = True
        db_table = 'issue_categories'

    def __str__(self):
        return self.name


class KpiCategory(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    issue_category = models.ForeignKey(
    IssueCategory, on_delete=models.CASCADE, null=True)

    class Meta:
        verbose_name = "KPI category"
        verbose_name_plural = "KPI categories"
        managed = True
        db_table = 'kpi_categories'

    def __str__(self):
        return self.name


class Kpi(models.Model):
    id = models.AutoField(primary_key=True)
    description = models.CharField(max_length=1024)
    level = models.PositiveSmallIntegerField(
        choices=KPI_LEVEL_CHOICES, default=1)
    goal = models.TextField(blank=True, null=True)

    kpi_category = models.ForeignKey(
        KpiCategory, on_delete=models.CASCADE, blank=True, null=True)

    eti_base_code = models.ForeignKey(
        EtiBaseCode, on_delete=models.CASCADE, blank=True, null=True)


    kpi_legal_violation = models.ForeignKey(
        KpiLegalViolation, on_delete=models.CASCADE, blank=True, null=True)

    kpi_recommended_remediation = models.ForeignKey(
        KpiRecommendedRemediation, on_delete=models.CASCADE, blank=True, null=True)

    kpi_systems_change = models.ForeignKey(
        KpiSystemsChange, on_delete=models.CASCADE, blank=True, null=True)



    class Meta:
        verbose_name = "KPI"
        verbose_name_plural = "KPIs"
        managed = True
        db_table = 'kpis'

    def __str__(self):
        return str(self.kpi_category) + ' : ' + self.description


class InteractionReason(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'interaction_reasons'

    def __str__(self):
        return self.name


class InteractionChannel(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'interaction_channels'

    def __str__(self):
        return self.name


class ContractType(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'contract_types'

    def __str__(self):
        return self.name


class DocumentType(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'document_types'

    def __str__(self):
        return self.name


class VesselType(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'vessel_types'
        indexes = [
            models.Index(fields=['id']),
        ]

    def __str__(self):
        return self.name


class Industry(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Industries"
        managed = True
        db_table = 'industries'

    def __str__(self):
        return self.name


class SubIndustry(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    industry = models.ForeignKey(Industry, on_delete=models.CASCADE, null=False, blank=False)

    class Meta:
        verbose_name_plural = "SubIndustries"
        managed = True
        db_table = 'subindustries'

    def __str__(self):
        return self.name


class Country(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    lng = models.CharField(max_length=20, blank=True, null=True)
    lat = models.CharField(max_length=20, blank=True, null=True)


    class Meta:
        verbose_name_plural = "Countries"
        managed = True
        db_table = 'countries'

    def __str__(self):
        return self.name


class Province(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    gis_code = models.CharField(blank=True, null=True, max_length=100)
    crossing = models.IntegerField(blank=True, null=True)
    lng = models.CharField(max_length=20, blank=True, null=True)
    lat = models.CharField(max_length=20, blank=True, null=True)

    country = models.ForeignKey(
    Country, on_delete=models.CASCADE, null=True)

    class Meta:
        managed = True
        db_table = 'provinces'

    def __str__(self):
        return self.name


class District(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    lng = models.CharField(max_length=20, blank=True, null=True)
    lat = models.CharField(max_length=20, blank=True, null=True)

    gis_code = models.CharField(blank=True, null=True, max_length=100)
    crossing = models.IntegerField(blank=True, null=True)
    province = models.ForeignKey(
    Province, on_delete=models.CASCADE, null=True)

    class Meta:
        verbose_name_plural = "Districts"
        managed = True
        db_table = 'districts'

    def __str__(self):
        return self.name


class Nationality(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    imageicon = models.ForeignKey(
        SharedFile, on_delete=models.SET_NULL, blank=True, null=True
    )

    class Meta:
        verbose_name_plural = "Nationalities"
        managed = True
        db_table = 'nationalities'

    def __str__(self):
        return self.name


class Ethnicity(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    nationality = models.ForeignKey(
        Nationality, on_delete=models.CASCADE, null=True)

    country = models.ForeignKey(
        Country, on_delete=models.CASCADE, null=True)

    class Meta:
        verbose_name_plural = "Ethnicities"
        managed = True
        db_table = 'ethnicities'

    def __str__(self):
        return self.name


class Supplier(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    anonymous = models.BooleanField(default=False, blank=True, null=True)
    created = models.DateField(blank=True, null=True, auto_now_add=True)
    tier_id = models.IntegerField(blank=True, null=True)
    address = models.CharField(max_length=500, blank=True, null=True)
    zipcode = models.CharField(max_length=20, blank=True, null=True)
    gps = models.CharField(max_length=1024, blank=True, null=True)
    vessel_number = models.CharField(max_length=100, blank=True, null=True)
    fishing_gear_liscense_number = models.CharField(
        max_length=100, blank=True, null=True)
    contact_name = models.CharField(max_length=1024, blank=True, null=True)
    contact_phone = models.CharField(max_length=100, blank=True, null=True)
    contact_email = models.CharField(max_length=100, blank=True, null=True)
    name_harvesting_business = models.CharField(
        max_length=100, blank=True, null=True)
    num_vessels_sourced_from = models.IntegerField(blank=True, null=True)
    total_num_workers = models.IntegerField(blank=True, null=True)
    total_num_men_workers = models.IntegerField(blank=True, null=True)
    total_num_women_workers = models.IntegerField(blank=True, null=True)
    total_num_thai_workers = models.IntegerField(blank=True, null=True)
    total_num_cambodian_workers = models.IntegerField(blank=True, null=True)
    total_num_myanmar_workers = models.IntegerField(blank=True, null=True)
    total_num_lao_workers = models.IntegerField(blank=True, null=True)
    total_num_vietnamese_workers = models.IntegerField(blank=True, null=True)
    hiring_practice = models.TextField(blank=True, null=True)
    other = models.TextField(blank=True, null=True)

    vessel_type = models.ForeignKey(
        VesselType, on_delete=models.CASCADE, null=True, blank=True)
    industry = models.ForeignKey(Industry, on_delete=models.CASCADE, null=True, blank=True)
    subindustry = models.ForeignKey(SubIndustry, on_delete=models.CASCADE, null=True, blank=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, null=True, blank=True)
    province = models.ForeignKey(Province, on_delete=models.CASCADE, null=True, blank=True)
    district = models.ForeignKey(District, on_delete=models.CASCADE, null=True, blank=True)

    golden_dreams_employer_id = models.IntegerField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    website = models.TextField(blank=True, null=True)
    lng = models.TextField(blank=True, null=True)
    lat = models.TextField(blank=True, null=True)

    additional_contacts = models.ManyToManyField(PersonContact, blank=True)

    class Meta:
        managed = True
        db_table = 'suppliers'
        indexes = [
            models.Index(fields=['-name']),
        ]

    def __str__(self):
        return str(self.id) + ' - ' + self.name



class SupplierKpiUpdateStatus(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Supplier KPI Update Statuses"
        managed = True
        db_table = 'supplier_kpi_update_statuses'

    def __str__(self):
        return self.name


class SupplierKpi(models.Model):
    id = models.AutoField(primary_key=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='kpis')
    kpi = models.ForeignKey(Kpi, on_delete=models.CASCADE)

    overview_date = models.DateField(blank=True, null=True)
    status = models.ForeignKey(
        SupplierKpiUpdateStatus, on_delete=models.CASCADE, null=True, blank=True)

    kpi_update_source = models.CharField(
        max_length=512,
        choices=KPI_UPDATE_SOURCE_CHOICES,
        null=True
        )

    closed_quality = models.CharField(
        max_length=10,
        choices=KPI_UPDATE_CLOSED_QUALITY_CHOICES,
        null=True
        )
    closed_notes = models.TextField(blank=True, null=True)
    affected_workers = models.IntegerField(default=0, blank=True, null=True)
    retaliation = models.BooleanField(default=False)

    remediation_issara_recommendation = models.TextField(blank=True, null=True)

    remediation_progress = models.CharField(
        max_length=8,
        choices=KPI_UPDATE_PROGRESS_CHOICES,
        default='None',
        null=True
        )
    remediation_aligned = models.CharField(
        max_length=8,
        choices=KPI_UPDATE_PROGRESS_CHOICES,
        default='None',
        null=True
        )
    remediation_business_steps_taken = models.TextField(blank=True, null=True)
    remediation_business_steps_remaining = models.TextField(blank=True, null=True)
    remediation_payment_deadline = models.DateField(blank=True, null=True)

    remediation_owed_baht = models.IntegerField(default=0, blank=True)
    remediation_owed_kyat = models.IntegerField(default=0, blank=True)
    remediation_owed_ringitt = models.IntegerField(default=0, blank=True)
    remediation_owed_usd = models.IntegerField(default=0, blank=True)

    remediation_paid_baht = models.IntegerField(default=0, blank=True)
    remediation_paid_kyat = models.IntegerField(default=0, blank=True)
    remediation_paid_ringitt = models.IntegerField(default=0, blank=True)
    remediation_paid_usd = models.IntegerField(default=0, blank=True)

    remediation_workers_paid = models.IntegerField(default=0, blank=True)
    remediation_documents_owed = models.IntegerField(default=0, blank=True)
    remediation_documents_provided = models.IntegerField(default=0, blank=True)
    remediation_documents_deadline = models.DateField(blank=True, null=True)

    remediation_notes = models.TextField(blank=True, null=True)
    remediation_action = models.TextField(blank=True, null=True)
    remediation_validation = models.TextField(blank=True, null=True)
    remediation_results = models.TextField(blank=True, null=True)

    systems_change_issara_recommendation = models.TextField(blank=True, null=True)
    systems_change_progress = models.CharField(
        max_length=8,
        choices=KPI_UPDATE_PROGRESS_CHOICES,
        default='None',
        null=True
        )
    systems_change_aligned = models.CharField(
        max_length=8,
        choices=KPI_UPDATE_PROGRESS_CHOICES,
        default='None',
        null=True
        )
    systems_change_business_steps_taken = models.TextField(blank=True, null=True)
    systems_change_business_steps_remaining = models.TextField(blank=True, null=True)
    systems_change_deadline = models.DateField(blank=True, null=True)

    open = models.BooleanField(default=True)
    opened_at = models.DateField(blank=True, null=True, default=timezone.now)
    closed_at = models.DateField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Supplier KPIs"
        managed = True
        db_table = 'supplier_kpis'

    def __str__(self):
            return str(self.supplier) + ' - ' + str(self.kpi)




class SupplierKpiUpdate(models.Model):
    id = models.AutoField(primary_key=True)
    supplier_kpi = models.ForeignKey(SupplierKpi, on_delete=models.CASCADE, related_name='updates')
    overview_date = models.DateField(blank=True, null=True)

    status = models.ForeignKey(
        SupplierKpiUpdateStatus, on_delete=models.CASCADE, null=True, blank=True)

    kpi_update_source = models.CharField(
        max_length=512,
        choices=KPI_UPDATE_SOURCE_CHOICES,
        null=True
        )

    closed_quality = models.CharField(
        max_length=10,
        choices=KPI_UPDATE_CLOSED_QUALITY_CHOICES,
        null=True
        )
    closed_notes = models.TextField(blank=True, null=True)
    affected_workers = models.IntegerField(default=0, blank=True, null=True)
    retaliation = models.BooleanField(default=False)

    remediation_issara_recommendation = models.TextField(blank=True, null=True)


    remediation_progress = models.CharField(
        max_length=8,
        choices=KPI_UPDATE_PROGRESS_CHOICES,
        default='None',
        null=True
        )
    remediation_aligned = models.CharField(
        max_length=8,
        choices=KPI_UPDATE_PROGRESS_CHOICES,
        default='None',
        null=True
        )
    remediation_business_steps_taken = models.TextField(blank=True, null=True)
    remediation_business_steps_remaining = models.TextField(blank=True, null=True)
    remediation_payment_deadline = models.DateField(blank=True, null=True)

    remediation_owed_baht = models.IntegerField(default=0, blank=True)
    remediation_owed_kyat = models.IntegerField(default=0, blank=True)
    remediation_owed_ringitt = models.IntegerField(default=0, blank=True)
    remediation_owed_usd = models.IntegerField(default=0, blank=True)

    remediation_paid_baht = models.IntegerField(default=0, blank=True)
    remediation_paid_kyat = models.IntegerField(default=0, blank=True)
    remediation_paid_ringitt = models.IntegerField(default=0, blank=True)
    remediation_paid_usd = models.IntegerField(default=0, blank=True)

    remediation_workers_paid = models.IntegerField(default=0, blank=True)
    remediation_documents_owed = models.IntegerField(default=0, blank=True)
    remediation_documents_provided = models.IntegerField(default=0, blank=True)
    remediation_documents_deadline = models.DateField(blank=True, null=True)
    remediation_notes = models.TextField(blank=True, null=True)
    remediation_action = models.TextField(blank=True, null=True)
    remediation_validation = models.TextField(blank=True, null=True)
    remediation_results = models.TextField(blank=True, null=True)


    systems_change_issara_recommendation = models.TextField(blank=True, null=True)
    systems_change_progress = models.CharField(
        max_length=8,
        choices=KPI_UPDATE_PROGRESS_CHOICES,
        default='None',
        null=True
        )
    systems_change_aligned = models.CharField(
        max_length=8,
        choices=KPI_UPDATE_PROGRESS_CHOICES,
        default='None',
        null=True
        )
    systems_change_business_steps_taken = models.TextField(blank=True, null=True)
    systems_change_business_steps_remaining = models.TextField(blank=True, null=True)
    systems_change_deadline = models.DateField(blank=True, null=True)

    opened_at = models.DateField(blank=True, null=True, default=timezone.now)
    closed_at = models.DateField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Supplier KPI Updates"
        managed = True
        db_table = 'supplier_kpi_updates'


class Recruiter(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    created = models.DateField(blank=True, null=True, auto_now_add=True)
    tier_id = models.IntegerField(blank=True, null=True)
    address = models.CharField(max_length=500, blank=True, null=True)
    zipcode = models.CharField(max_length=20, blank=True, null=True)
    gps = models.CharField(max_length=1024, blank=True, null=True)
    facebook_website = models.CharField(max_length=1024, blank=True, null=True)
    contact_name = models.CharField(max_length=100, blank=True, null=True)
    contact_phone = models.CharField(max_length=100, blank=True, null=True)
    contact_email = models.CharField(max_length=100, blank=True, null=True)
    num_of_staff = models.IntegerField(blank=True, null=True)
    num_lisc_agents = models.IntegerField(blank=True, null=True)
    worker_placement_industries = models.TextField(blank=True, null=True)
    other = models.TextField(blank=True, null=True)

    industry = models.ForeignKey(
        Industry, on_delete=models.CASCADE, blank=True, null=True)
    country = models.ForeignKey(
        Country, on_delete=models.CASCADE, blank=True, null=True)
    province = models.ForeignKey(
        Province, on_delete=models.CASCADE, blank=True, null=True)
    district = models.ForeignKey(
        District, on_delete=models.CASCADE, blank=True, null=True)

    golden_dreams_recruiter_id = models.IntegerField(blank=True, null=True)

    description = models.TextField(blank=True, null=True)
    website = models.TextField(blank=True, null=True)

    lng = models.TextField(blank=True, null=True)
    lat = models.TextField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'recruiters'

    def __str__(self):
        return str(self.id) + ' - ' + self.name


class RecruiterIssue(models.Model):
    id = models.AutoField(primary_key=True)
    issue_category = models.ForeignKey(
        IssueCategory, on_delete=models.CASCADE, null=True)

    kpis = models.ManyToManyField(Kpi, blank=True)

    case_status = models.ForeignKey(
        CaseStatus, on_delete=models.CASCADE, null=True)

    recruiter = models.ForeignKey(
        Recruiter, on_delete=models.CASCADE, null=True)

    class Meta:
        verbose_name_plural = "Recruiter Issues"
        managed = True
        db_table = 'recruiter_issues'

    def __str__(self):
            return str(self.recruiter) + ' - ' + str(self.issue_category)


class UserTask(models.Model):
    id = models.AutoField(primary_key=True)
    source_id = models.PositiveIntegerField() # ID of a call/business response
    source_type = models.CharField(
        max_length=20,
        choices=TASK_SOURCE_TYPE,
        default='Call',
        )
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="tasks_assigned_by_user",
        null=True, blank=True, on_delete=models.SET_NULL
        )
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="tasks_assigned_to_user",
        null=True, blank=True, on_delete=models.SET_NULL
        )
    deadline = models.DateField(blank=True, null=True)
    done = models.BooleanField(default=False)

    # extra
    created_at = models.DateField(blank=True, null=True, auto_now_add=True)
    modified_at = models.DateField(blank=True, null=True, auto_now=True)

    class Meta:
        verbose_name_plural = "Users Tasks"
        managed = True
        db_table = 'user_tasks'

    def __str__(self):
        return '{}:{} - {} to {}'.format(
         self.source_type, self.source_id, self.assigned_by, self.assigned_to
        )


class ResponseInteractionType(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'response_interaction_types'

    def __str__(self):
        return self.name


class StrategicPartnerFile(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=1024)
    url = models.CharField(max_length=1024)
    description = models.TextField(blank=True, null=True)
    created = models.DateField(blank=True, null=True, auto_now_add=True)

    class Meta:
        managed = True
        db_table = 'strategic_partner_files'

    def __str__(self):
        return self.name




class StrategicPartnerResponseFile(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=1024)
    url = models.CharField(max_length=1024)
    description = models.TextField(blank=True, null=True)
    created = models.DateField(blank=True, null=True, auto_now_add=True)

    class Meta:
        managed = True
        db_table = 'strategic_partner_response_files'

    def __str__(self):
        return self.name


class StrategicPartner(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    created = models.DateField(blank=True, null=True, auto_now_add=True)
    country = models.ForeignKey(
        Country, on_delete=models.CASCADE, blank=True, null=True)
    address = models.CharField(max_length=1024, blank=True, null=True)
    zipcode = models.CharField(max_length=1024, blank=True, null=True)
    contract_start_date = models.DateField(blank=True, null=True)
    contract_end_date = models.DateField(blank=True, null=True)
    payment_amount = models.IntegerField(blank=True, null=True)
    payment_receipt_date = models.DateField(blank=True, null=True)
    date_last_annual_risk_report = models.DateField(blank=True, null=True)
    date_last_call_meeting_visit = models.DateField(blank=True, null=True)
    focal_point_name = models.CharField(max_length=1024, blank=True, null=True)
    focal_point_title = models.CharField(
        max_length=1024, blank=True, null=True)
    focal_point_email = models.CharField(
        max_length=1024, blank=True, null=True)
    focal_point_phone_number = models.CharField(
        max_length=56, blank=True, null=True)
    products_sourced = models.TextField(blank=True, null=True)

    lng = models.CharField(max_length=1024, blank=True, null=True)
    lat = models.CharField(max_length=1024, blank=True, null=True)

    background = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    agreement = models.TextField(blank=True, null=True)
    image = models.CharField(
        max_length=1024, blank=True, null=True)

    imageicon = models.ForeignKey(
        SharedFile, on_delete=models.SET_NULL, blank=True, null=True
    )

    website = models.CharField(
        max_length=1024, blank=True, null=True)

    created = models.DateTimeField(auto_now_add=True, null=True)
    last_modified = models.DateTimeField(auto_now=True, null=True)

    strategic_partner_files = models.ManyToManyField(
        StrategicPartnerFile, blank=True)

    email_notify = models.BooleanField(default=False)


    class Meta:
        verbose_name_plural = "Strategic partners"
        managed = True
        db_table = 'strategic_partners'

    def __str__(self):
        return str(self.id) + ' - ' + self.name


class StrategicPartnerResponse(models.Model):
    id = models.AutoField(primary_key=True)
    interaction_date = models.DateField(blank=True, null=True)
    interaction_event_location = models.TextField(blank=True, null=True)
    response_focal_point = models.CharField(
        max_length=1024, blank=True, null=True)
    general_notes = models.TextField(blank=True, null=True)
    next_steps = models.TextField(blank=True, null=True)

    response_interaction_type = models.ForeignKey(
        ResponseInteractionType, on_delete=models.CASCADE, blank=True, null=True
    )

    issara_user_focal_point = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True, null=True
    )

    strategic_partner_response_files = models.ManyToManyField(
        StrategicPartnerResponseFile, blank=True)

    strategic_partner = models.ForeignKey(
        StrategicPartner, on_delete=models.CASCADE, blank=True, null=True
    )

    created = models.DateField(blank=True, null=True, auto_now_add=True)
    last_modified = models.DateField(blank=True, null=True, auto_now=True)

    class Meta:
        managed = True
        db_table = 'strategic_partner_responses'

    # def __str__(self):
    #     return self.name

class PartnerMessageBoard(models.Model):

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=1024)
    title = models.CharField(max_length=1024, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created = models.DateField(blank=True, null=True, auto_now_add=True)
    sort_number = models.IntegerField(null=True, blank=True)

    strategic_partner = models.ForeignKey(
        StrategicPartner, on_delete=models.CASCADE, blank=True, null=True
    )

    class Meta:
        verbose_name_plural = "PartnerMessageBoards"
        managed = True
        db_table = 'partner_news_updates'

    def __str__(self):
        return self.name


class CaseIssue(models.Model):
    id = models.AutoField(primary_key=True)
    created = models.DateField(blank=True, null=True, auto_now_add=True)
    last_modified = models.DateField(blank=True, null=True, auto_now=True)
    description = models.TextField(blank=True, null=True)
    affected_workers = models.IntegerField(blank=True, null=True)

    level = models.IntegerField(blank=True, null=True)

    issue_category = models.ForeignKey(
        IssueCategory, on_delete=models.CASCADE, null=True, blank=True)

    kpis = models.ManyToManyField(Kpi, blank=True)

    case_status = models.ForeignKey(
        CaseStatus, on_delete=models.CASCADE, null=True, blank=True)


    class Meta:
        verbose_name_plural = "Case Issues"
        managed = True
        db_table = 'case_issues'

    def __str__(self):
        return self.description



class CaseInteraction(models.Model):
    id = models.AutoField(primary_key=True)
    type = models.CharField(
        max_length=20,
        default='Incoming',
        null=True,
        blank=True,
        choices=(
            ("Incoming", "Incoming"),
            ("Outgoing", "Outgoing"),
        )
    )
    summary = models.TextField(blank=True, null=True)
    interacted = models.DateField(blank=True, null=True)
    created = models.DateField(blank=True, null=True, auto_now_add=True)
    last_modified = models.DateField(blank=True, null=True, auto_now=True)

    issara_staff = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    interaction_reason = models.ForeignKey(
        InteractionReason, on_delete=models.CASCADE, null=True, blank=True)
    interaction_channel = models.ForeignKey(
        InteractionChannel, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        verbose_name_plural = "Case Interactions"
        managed = True
        db_table = 'case_interactions'


class Case(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=512, null=True, blank=True)
    created = models.DateField(blank=True, null=True, auto_now_add=True)
    last_modified = models.DateField(blank=True, null=True, auto_now=True)
    client_nickname = models.CharField(blank=True, null=True, max_length=45)
    client_phonenumber = models.CharField(blank=True, null=True, max_length=45)
    client_line_account = models.CharField(blank=True, null=True, max_length=1024)
    client_facebook_account = models.CharField(blank=True, null=True, max_length=1024)
    client_viber_account = models.CharField(blank=True, null=True, max_length=1024)
    client_share_info_consent = models.CharField(blank=True, null=True, max_length=112)
    client_time_at_job = models.IntegerField(blank=True, null=True)
    issara_supply_chain = models.CharField(blank=True, null=True, max_length=512)
    non_supply_chain = models.CharField(blank=True, null=True, max_length=512)
    description = models.TextField(blank=True, null=True)
    debt_bondage = models.CharField(blank=True, null=True, max_length=45)
    debt_bondage_detail = models.TextField(blank=True, null=True)
    debt_bondage_broker = models.CharField(blank=True, null=True, max_length=45)
    debt_bondage_detail_broker = models.TextField(blank=True, null=True)
    vot_needs = models.TextField(blank=True, null=True)
    referral_notes = models.TextField(blank=True, null=True)
    next_steps = models.TextField(blank=True, null=True)
    work_place_details = models.TextField(blank=True, null=True)

    dead_line_date = models.DateField(blank=True, null=True)
    final_remarks = models.TextField(blank=True, null=True)
    risk_assessment = models.TextField(blank=True, null=True)

    source_upstream_broker = models.CharField(blank=True, null=True, max_length=112);


    rating_source_broker = models.PositiveIntegerField(blank=True, null=True, validators=[MinValueValidator(1), MaxValueValidator(5)])
    rating_source_recruiter = models.PositiveIntegerField(blank=True, null=True,validators=[MinValueValidator(1), MaxValueValidator(5)])
    rating_dest_recruiter = models.PositiveIntegerField(blank=True, null=True,validators=[MinValueValidator(1), MaxValueValidator(5)])
    rating_dest_employer = models.PositiveIntegerField(blank=True, null=True, validators=[MinValueValidator(1), MaxValueValidator(5)])


    case_status = models.ForeignKey(
        CaseStatus, on_delete=models.CASCADE, null=True, blank=True)


    supplier = models.ForeignKey(
        Supplier, related_name="cases", on_delete=models.CASCADE, null=True, blank=True)
    work_place = models.ForeignKey(
        WorkPlace, on_delete=models.CASCADE, null=True, blank=True)


    issara_staff = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="cases", null=True, blank=True, on_delete=models.SET_NULL)
    next_steps_issara_staff = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="cases_next_step", null=True, blank=True, on_delete=models.SET_NULL)
    source_recruiter = models.ForeignKey(
        Recruiter, related_name="source_recruiter", null=True, blank=True, on_delete=models.CASCADE)
    destination_recruiter = models.ForeignKey(
        Recruiter, related_name="destination_recruiter", null=True, blank=True, on_delete=models.CASCADE)

    client_contract_type = models.ForeignKey(
        ContractType, on_delete=models.CASCADE, null=True, blank=True)
    client_document_type = models.ForeignKey(
        DocumentType, on_delete=models.CASCADE, null=True, blank=True)
    client_gender = models.ForeignKey(
        Gender, on_delete=models.CASCADE, null=True, blank=True)
    client_ethnicity = models.ForeignKey(
        Ethnicity, on_delete=models.CASCADE, null=True, blank=True)
    client_nationality = models.ForeignKey(
        Nationality, on_delete=models.CASCADE, blank=True, null=True)
    case_category = models.ForeignKey(
        CaseCategory, on_delete=models.CASCADE, null=True, blank=True)
    client_type = models.ForeignKey(
        ClientType, on_delete=models.CASCADE, null=True, blank=True)
    client_status = models.ForeignKey(
        ClientStatus, on_delete=models.CASCADE, null=True, blank=True)
    referral_action = models.ForeignKey(
        ReferralAction, on_delete=models.CASCADE, null=True, blank=True)

    country = models.ForeignKey(
        Country, on_delete=models.CASCADE, null=True, blank=True)

    province = models.ForeignKey(
        Province, on_delete=models.CASCADE, null=True, blank=True)


    district = models.ForeignKey(
        District, on_delete=models.CASCADE, null=True, blank=True)


    client_origin_country = models.ForeignKey(
        Country, related_name="client_origin_country", null=True, blank=True, on_delete=models.CASCADE)
    client_origin_province = models.ForeignKey(
        Province, related_name="client_origin_province", null=True, blank=True, on_delete=models.CASCADE)
    client_origin_district = models.ForeignKey(
        District, related_name="client_origin_district", null=True, blank=True, on_delete=models.CASCADE)


    client_crossing_country = models.ForeignKey(
        Country, related_name="client_crossing_country", null=True, blank=True, on_delete=models.CASCADE)
    client_crossing_province = models.ForeignKey(
        Province, related_name="client_crossing_province", null=True, blank=True, on_delete=models.CASCADE)
    client_crossing_district = models.ForeignKey(
        District, related_name="client_crossing_district", null=True, blank=True, on_delete=models.CASCADE)


    case_how_hear_issara = models.ManyToManyField(HowHearIssara, blank=True)

    case_interactions = models.ManyToManyField(CaseInteraction, blank=True)


    issue_description = models.TextField(blank=True, null=True)

    issue_offender_description = models.TextField(blank=True, null=True)

    issue_legacy_level = models.IntegerField(blank=True, null=True)

    issue_category = models.ForeignKey(IssueCategory, on_delete=models.CASCADE, null=True, blank=True)

    issue_workers_affected =  models.PositiveIntegerField(blank=True, null=True)

    issue_workers_affected_description = models.TextField(blank=True, null=True)

    issue_getting_better = models.CharField(blank=True, null=True, max_length=45)

    issue_getting_better_description = models.TextField(blank=True, null=True)

    kpis = models.ManyToManyField(Kpi, blank=True)

    # Optional fields for legacy data
    original_ilm_one_id = models.IntegerField(blank=True, null=True)
    industry = models.ForeignKey(
        Industry, on_delete=models.SET_NULL, null=True, blank=True)
    subindustry = models.ForeignKey(
        SubIndustry, on_delete=models.SET_NULL, null=True, blank=True)


    interactiontype = models.CharField(
        max_length=20,
        default='Incoming',
        null=True,
        blank=True,
        choices=(
            ("Incoming", "Incoming"),
            ("Outgoing", "Outgoing"),
        )
    )

    interaction_summary = models.TextField(blank=True, null=True)
    interacted = models.DateField(blank=True, null=True)
    interaction_reason = models.ForeignKey(
        InteractionReason, on_delete=models.CASCADE, null=True, blank=True)
    interaction_channel = models.ForeignKey(
        InteractionChannel, on_delete=models.CASCADE, null=True, blank=True)

    interaction_issara_staff = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="cases_interactions_user", null=True, blank=True, on_delete=models.SET_NULL)


    class Meta:
        managed = True
        db_table = 'cases'

    # def __str__(self):
    #     return self.name


class SupplyChain(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=512)
    strategic_partner = models.ForeignKey(
    StrategicPartner, on_delete=models.CASCADE, null=True, blank=True)
    suppliers = models.ManyToManyField(Supplier, blank=True, related_name='supply_chains')

    class Meta:
        verbose_name_plural = "Supplier Chains"
        managed = True
        db_table = 'supply_chains'

    def __str__(self):
        return self.name

    def __repr__(self):
        repr = (
            f'ID: {self.id} \n'
            f'NAME: {self.name} \n'
            f'SP: {self.strategic_partner} \n'
            f'suppliers: [{", ".join([supplier.name for supplier in self.suppliers.all()])}] \n'
        )

        return repr


class SupplierCRCResponse(models.Model):
    id = models.AutoField(primary_key=True)

    supplier = models.ForeignKey(
        Supplier, related_name="crc_scores", on_delete=models.CASCADE, null=True
    )

    created_at = models.DateField(blank=True, null=True, auto_now_add=True)

    avg_worker_response_feedback = models.IntegerField(blank=True, null=True)
    avg_worker_recruitment_mngmt_feedback = models.IntegerField(blank=True, null=True)
    issara_tech_assessment_response_quality_hr = models.IntegerField(blank=True, null=True)
    issara_tech_assessment_response_quality_production = models.IntegerField(blank=True, null=True)
    issara_tech_assessment_response_quality_sr_mngmt = models.IntegerField(blank=True, null=True)

    duration_of_time_taken_to_respond = models.IntegerField(blank=True, null=True)
    duration_of_time_taken_to_revert_on_action_plan = models.IntegerField(blank=True, null=True)
    duration_of_time_taken_to_resolve_issues = models.IntegerField(blank=True, null=True)

    site_cooperation_with_ethicall_distribution  = models.IntegerField(blank=True, null=True)
    business_attitude_toward_suggested_remedies  = models.IntegerField(blank=True, null=True)
    business_attitude_toward_capacity_and_risks  = models.IntegerField(blank=True, null=True)
    business_attitude_toward_promoting_worker_voice  = models.IntegerField(blank=True, null=True)
    business_attitude_toward_worker_treatment = models.IntegerField(blank=True, null=True)
    business_attitude_toward_issara = models.IntegerField(blank=True, null=True)

    response_quality_comments = models.TextField(blank=True, null=True)
    response_timeliness_comments = models.TextField(blank=True, null=True)
    response_openness_comments = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Supplier CRC *Ratings/Responses"
        managed = True
        db_table = 'supplier_crc_responses'

    def __str__(self):
        return '{} - {}'.format(self.supplier, self.created_at)


class SupplierResponseFile(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=1024)
    url = models.CharField(max_length=1024)
    description = models.TextField(blank=True, null=True)
    created = models.DateField(blank=True, null=True, auto_now_add=True)

    class Meta:
        verbose_name_plural = "Supplier Response Files"
        managed = True
        db_table = 'supplier_response_files'

    def __str__(self):
        return self.name


class BusinessResponse(models.Model):
    id = models.AutoField(primary_key=True)

    # Participants
    suppliers = models.ManyToManyField(Supplier, blank=True)
    suppliers_notes = models.TextField(blank=True, null=True)

    recruiters = models.ManyToManyField(Recruiter, blank=True)
    recruiters_notes = models.TextField(blank=True, null=True)

    global_buyers = models.ManyToManyField(StrategicPartner, blank=True)
    global_buyers_notes = models.TextField(blank=True, null=True)

    other_parties_notes = models.TextField(blank=True, null=True)

    # Details
    event_details = models.TextField(blank=True, null=True)
    event_location = models.CharField(max_length=256, blank=True, null=True)
    event_date = models.DateField(blank=True, null=True)
    event_interaction_type = models.ForeignKey(
        ResponseInteractionType, on_delete=models.SET_NULL, blank=True, null=True
    )

    # Actions
    suppliers_next_steps = models.TextField(blank=True, null=True)
    suppliers_next_steps_deadline = models.DateField(blank=True, null=True)
    suppliers_focal_points = models.CharField(max_length=512, null=True, blank=True)

    recruiters_next_steps = models.TextField(blank=True, null=True)
    recruiters_next_steps_deadline = models.DateField(blank=True, null=True)
    recruiters_focal_points = models.CharField(max_length=512, null=True, blank=True)

    global_buyers_next_steps = models.TextField(blank=True, null=True)
    global_buyers_next_steps_deadline = models.DateField(blank=True, null=True)
    global_buyers_focal_points = models.CharField(max_length=512, null=True, blank=True)

    issara_next_steps = models.TextField(blank=True, null=True)
    issara_next_steps_deadline = models.DateField(blank=True, null=True)
    issara_focal_points = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True)

    # Extra
    created_at = models.DateField(auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='created_business_responses',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    modified_at = models.DateField(blank=True, null=True, auto_now=True)

    class Meta:
        verbose_name_plural = "Business Responses"
        managed = True
        db_table = 'business_responses'

    def __str__(self):
        return self.event_details


class RecruiterResponseFile(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=1024)
    url = models.CharField(max_length=1024)
    description = models.TextField(blank=True, null=True)
    created = models.DateField(blank=True, null=True, auto_now_add=True)

    class Meta:
        verbose_name_plural = "Recruiter Response Files"
        managed = True
        db_table = 'recruiter_response_files'

    def __str__(self):
        return self.name


class RecruiterResponse(models.Model):
    id = models.AutoField(primary_key=True)

    name = models.CharField(max_length=512)
    description = models.TextField(blank=True, null=True)
    response_proposed = models.TextField(blank=True, null=True)
    intro_meeting = models.TextField(blank=True, null=True)
    ethical_requirement_related_meeting = models.TextField(blank=True, null=True)
    strategy_meeting = models.TextField(blank=True, null=True)
    business_specific_training = models.TextField(blank=True, null=True)
    stakeholer_multi_training = models.TextField(blank=True, null=True)
    business_called_issara = models.TextField(blank=True, null=True)
    issara_called_business = models.TextField(blank=True, null=True)
    general_notes = models.TextField(blank=True, null=True)
    next_steps = models.TextField(blank=True, null=True)

    proposed_response_impacted_qty = models.IntegerField(blank=True, null=True)
    response_focal_point = models.CharField(max_length=512)

    created = models.DateField(blank=True, null=True, auto_now_add=True)
    last_modified = models.DateField(blank=True, null=True, auto_now=True)


    recruiter = models.ForeignKey(
        Recruiter, on_delete=models.CASCADE, null=True)

    interaction_reason = models.ForeignKey(
        InteractionReason, on_delete=models.CASCADE, null=True)

    interaction_channel = models.ForeignKey(
        InteractionChannel, on_delete=models.CASCADE, null=True)

    issue_category = models.ForeignKey(
        IssueCategory, on_delete=models.CASCADE, null=True)

    kpis = models.ManyToManyField(Kpi, blank=True)


    recruiter_issue = models.ForeignKey(
        RecruiterIssue, on_delete=models.CASCADE, null=True)

    issara_staff_involved = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True)
    recruiter_response_files = models.ManyToManyField(RecruiterResponseFile, blank=True)

    class Meta:
        verbose_name_plural = "Recruiter Responses"
        managed = True
        db_table = 'recruiter_responses'

    def __str__(self):
        return self.recruiter.name


class MmThaiDemandData(models.Model):
    id = models.AutoField(primary_key=True)
    created = models.DateField(blank=True, null=True, auto_now_add=True)
    record_date = models.DateField(blank=True, null=True, auto_now_add=True)

    week = models.CharField(max_length=512)
    year = models.CharField(max_length=512)
    month = models.CharField(max_length=512)
    year_month = models.CharField(max_length=512)
    recruiter_name = models.CharField(max_length=512)
    supplier_name = models.CharField(max_length=512)
    province = models.CharField(max_length=512)
    type_of_factory = models.CharField(max_length=512)
    industry = models.CharField(max_length=512)
    subindustry = models.CharField(max_length=512)
    num_males = models.IntegerField(blank=True, null=True)
    num_females = models.IntegerField(blank=True, null=True)
    num_total = models.IntegerField(blank=True, null=True)


    recruiter = models.ForeignKey(Recruiter, on_delete=models.CASCADE, null=True)

    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, null=True)

    factorytype = models.ForeignKey(FactoryType, on_delete=models.CASCADE, null=True)

    ilm_industry = models.ForeignKey(Industry, on_delete=models.CASCADE, null=True)

    ilm_subindustry = models.ForeignKey(SubIndustry, on_delete=models.CASCADE, null=True)

    class Meta:
        verbose_name_plural = "MM Thai Demand Data"
        managed = True
        db_table = 'mm_thai_demand_data'

    def __str__(self):
        return self.supplier_name + ":" + self.recruiter_name + ":" + self.industry + ":" + self.subindustry + ":" + self.type_of_factory


class MmThaiSendingData(models.Model):
    id = models.AutoField(primary_key=True)
    created = models.DateField(blank=True, null=True, auto_now_add=True)
    record_date = models.DateField(blank=True, null=True, auto_now_add=True)

    demand_approved_male = models.IntegerField(blank=True, null=True)
    demand_approved_female = models.IntegerField(blank=True, null=True)
    demand_approved_total = models.IntegerField(blank=True, null=True)

    visa_issued_male = models.IntegerField(blank=True, null=True)
    visa_issued_female = models.IntegerField(blank=True, null=True)
    visa_issued_total = models.IntegerField(blank=True, null=True)

    sending_male = models.IntegerField(blank=True, null=True)
    sending_female = models.IntegerField(blank=True, null=True)
    sending_total = models.IntegerField(blank=True, null=True)

    smart_card_issued_male = models.IntegerField(blank=True, null=True)
    smart_card_issued_female = models.IntegerField(blank=True, null=True)
    smart_card_issued_total = models.IntegerField(blank=True, null=True)

    recruiter = models.ForeignKey(Recruiter, on_delete=models.CASCADE, null=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, null=True)

    industry = models.ForeignKey(Industry, on_delete=models.CASCADE, null=True)
    subindustry = models.ForeignKey(SubIndustry, on_delete=models.CASCADE, null=True)

    factory_type = models.ForeignKey(FactoryType, on_delete=models.SET_NULL, null=True)
    province = models.ForeignKey(Province, on_delete=models.SET_NULL, null=True)

    class Meta:
        verbose_name_plural = "MM Thai Sending Data"
        managed = True
        db_table = 'mm_thai_sending_data'
        indexes = [
            models.Index(fields=['-record_date']),
        ]

    def __str__(self):
        return self.supplier.name


class RecruiterCRCResponse(models.Model):
    id = models.AutoField(primary_key=True)

    recruiter = models.ForeignKey(
        Recruiter, related_name="crc_recruiter_scores", on_delete=models.CASCADE, null=True
    )

    created_at = models.DateField(blank=True, null=True, auto_now_add=True)

    avg_worker_response_feedback = models.IntegerField(blank=True, null=True)
    avg_worker_recruitment_mngmt_feedback = models.IntegerField(blank=True, null=True)
    issara_tech_assessment_response_quality_hr = models.IntegerField(blank=True, null=True)
    issara_tech_assessment_response_quality_production = models.IntegerField(blank=True, null=True)
    issara_tech_assessment_response_quality_sr_mngmt = models.IntegerField(blank=True, null=True)

    duration_of_time_taken_to_respond = models.IntegerField(blank=True, null=True)
    duration_of_time_taken_to_revert_on_action_plan = models.IntegerField(blank=True, null=True)
    duration_of_time_taken_to_resolve_issues = models.IntegerField(blank=True, null=True)

    site_cooperation_with_ethicall_distribution  = models.IntegerField(blank=True, null=True)
    business_attitude_toward_suggested_remedies  = models.IntegerField(blank=True, null=True)
    business_attitude_toward_capacity_and_risks  = models.IntegerField(blank=True, null=True)
    business_attitude_toward_promoting_worker_voice  = models.IntegerField(blank=True, null=True)
    business_attitude_toward_worker_treatment = models.IntegerField(blank=True, null=True)
    business_attitude_toward_issara = models.IntegerField(blank=True, null=True)

    response_quality_comments = models.TextField(blank=True, null=True)
    response_timeliness_comments = models.TextField(blank=True, null=True)
    response_openness_comments = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Recruiter CRC *Ratings/Responses"
        managed = True
        db_table = 'recruiter_crc_responses'

    def __str__(self):
        return '{} - {}'.format(self.recruiter, self.created_at)


class FieldworkActivityTypeCategory(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=256, null=True, blank=True)

    class Meta:
        verbose_name_plural = "Fieldwork Activity Type Categories"
        managed = True
        db_table = 'fieldwork_type_categories'

    def __str__(self):
        return self.name


class FieldworkActivityType(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=256, null=True, blank=True)
    category = models.ForeignKey(
        FieldworkActivityTypeCategory,
        related_name='types',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    class Meta:
        verbose_name_plural = "Fieldwork Activity Types"
        managed = True
        db_table = 'fieldwork_types'

    def __str__(self):
        return self.name


class FieldworkActivityPrimaryFocus(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=256, null=True, blank=True)

    class Meta:
        verbose_name_plural = "Fieldwork Activity Primary Focuses"
        managed = True
        db_table = 'fieldwork_primary_focuses'

    def __str__(self):
        return self.name


class FieldworkActivity(models.Model):
    id = models.AutoField(primary_key=True)

    fieldwork_date = models.DateField(blank=True, null=True)
    fieldwork_type = models.ForeignKey(
        FieldworkActivityType, on_delete=models.SET_NULL, null=True, blank=True
    )
    nationality = models.ForeignKey(
        Nationality, on_delete=models.SET_NULL, null=True, blank=True
    )
    country = models.ForeignKey(
        Country, on_delete=models.SET_NULL, null=True, blank=True
    )
    province = models.ForeignKey(
        Province, on_delete=models.SET_NULL, null=True, blank=True
    )
    district = models.ForeignKey(
        District, on_delete=models.SET_NULL, null=True, blank=True
    )

    outreach_target = models.IntegerField(blank=True, null=True)
    suppliers = models.ManyToManyField(Supplier, blank=True)
    recruiters = models.ManyToManyField(Recruiter, blank=True)
    notes = models.TextField(blank=True, null=True)

    # OUTREACH
    total_workers_reached = models.IntegerField(blank=True, null=True)
    female_workers_reached = models.IntegerField(blank=True, null=True)
    male_workers_reached = models.IntegerField(blank=True, null=True)
    myanmar_workers_reached = models.IntegerField(blank=True, null=True)
    cambodian_workers_reached = models.IntegerField(blank=True, null=True)
    thai_workers_reached = models.IntegerField(blank=True, null=True)
    lao_workers_reached = models.IntegerField(blank=True, null=True)
    other_workers_reached = models.IntegerField(blank=True, null=True)

    # TRAINING / MULTI-STAKEHOLDER / OTHER
    strategic_partners = models.ManyToManyField(StrategicPartner, blank=True)
    total_people_reached = models.IntegerField(blank=True, null=True)
    male_reached = models.IntegerField(blank=True, null=True)
    female_reached = models.IntegerField(blank=True, null=True)
    primary_focus = models.ForeignKey(
        FieldworkActivityPrimaryFocus, on_delete=models.SET_NULL, blank=True, null=True
    )
    primary_focus_other_description = models.CharField(max_length=256, blank=True, null=True)

    # Extra
    created_at = models.DateField(auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )

    class Meta:
        verbose_name_plural = "Fieldwork Activity"
        managed = True
        db_table = 'fieldwork_activities'

    def __str__(self):
        return '{} - {}'.format(self.notes, self.fieldwork_date)


class MonthlyWorkerVoice(models.Model):
    id = models.AutoField(primary_key=True)

    month_year = models.DateField(blank=True, null=True)
    mm_hotline_total = models.IntegerField(blank=True, null=True)
    yangon_hotline_total = models.IntegerField(blank=True, null=True)
    mm_fb_total = models.IntegerField(blank=True, null=True)
    mm_line_total = models.IntegerField(blank=True, null=True)
    mm_viber_total = models.IntegerField(blank=True, null=True)
    cb_hotline_total = models.IntegerField(blank=True, null=True)
    cb_fb_total = models.IntegerField(blank=True, null=True)
    cb_line_total = models.IntegerField(blank=True, null=True)
    cb_viber_total = models.IntegerField(blank=True, null=True)
    thai_hotline_total = models.IntegerField(blank=True, null=True)
    thai_fb_total = models.IntegerField(blank=True, null=True)
    thai_line_total = models.IntegerField(blank=True, null=True)
    thai_viber_total = models.IntegerField(blank=True, null=True)

    # Extra
    created_at = models.DateField(auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )

    class Meta:
        verbose_name_plural = "Monthly Worker Voice"
        managed = True
        db_table = 'monthly_worker_voice'

    def __str__(self):
        return '{}'.format(self.month_year)


class EthicalRecruitmentMeeting(models.Model):
    id = models.AutoField(primary_key=True)

    # GENERAL INFORMATION
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, null=True)
    recruiter = models.ForeignKey(Recruiter, on_delete=models.CASCADE, null=True)
    issara_staff = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True)
    location = models.CharField(max_length=512, blank=True, null=True)
    assesment = models.CharField(max_length=512, blank=True, null=True)
    supplier_contacts = models.CharField(max_length=512, blank=True, null=True)
    recruiter_contacts = models.CharField(max_length=512, blank=True, null=True)

    # LEGAL COMPLIENCE
    legal_complience_labour_laws = models.IntegerField(blank=True, null=True)
    legal_complience_criminal_laws = models.IntegerField(blank=True, null=True)
    legal_complience_recruitment_policies = models.IntegerField(blank=True, null=True)
    legal_complience_notes = models.TextField(blank=True, null=True)
    legal_complience_priority_notes = models.TextField(blank=True, null=True)

    # ETHICAL AND PROFESSIONAL CONDUCT
    professional_conduct_agency = models.IntegerField(blank=True, null=True)
    professional_conduct_employer = models.IntegerField(blank=True, null=True)
    professional_conduct_agency_capacity = models.IntegerField(blank=True, null=True)
    professional_conduct_employer_capacity = models.IntegerField(blank=True, null=True)
    professional_conduct_cooperation_efficiency = models.IntegerField(blank=True, null=True)
    professional_conduct_notes = models.TextField(blank=True, null=True)
    professional_conduct_priority_notes = models.TextField(blank=True, null=True)

    # FREE OF CHARGE SERVICES
    free_of_charge_recruitment_fees = models.IntegerField(blank=True, null=True)
    free_of_charge_transparency = models.IntegerField(blank=True, null=True)
    free_of_charge_other_fees = models.IntegerField(blank=True, null=True)
    free_of_charge_passport_fees = models.IntegerField(blank=True, null=True)
    free_of_charge_destination_fees = models.IntegerField(blank=True, null=True)
    free_of_charge_notes = models.TextField(blank=True, null=True)
    free_of_charge_priority_notes = models.TextField(blank=True, null=True)

    # TERMS OF ENGAGEMENT
    terms_of_engagement_business_information = models.IntegerField(blank=True, null=True)
    terms_of_engagement_job_description = models.IntegerField(blank=True, null=True)
    terms_of_engagement_recruitment_process = models.IntegerField(blank=True, null=True)
    terms_of_engagement_overall_management = models.IntegerField(blank=True, null=True)
    terms_of_engagement_complete_job_information = models.IntegerField(blank=True, null=True)
    terms_of_engagement_interview_process = models.IntegerField(blank=True, null=True)
    terms_of_engagement_medical_checks = models.IntegerField(blank=True, null=True)
    terms_of_engagement_contract_terms = models.IntegerField(blank=True, null=True)
    terms_of_engagement_original_contract_provision = models.IntegerField(blank=True, null=True)
    terms_of_engagement_predeparture_training = models.IntegerField(blank=True, null=True)
    terms_of_engagement_predeparture_training_worker_rights = models.IntegerField(blank=True, null=True)
    terms_of_engagement_travel_to_workplace = models.IntegerField(blank=True, null=True)
    terms_of_engagement_notes = models.TextField(blank=True, null=True)
    terms_of_engagement_priority_notes = models.TextField(blank=True, null=True)

    # WAGES DEDUCTIONS BENEFITS
    wages_deductions_benefits_information = models.IntegerField(blank=True, null=True)
    wages_deductions_benefits_predeparture_training = models.IntegerField(blank=True, null=True)
    wages_deductions_benefits_multilingualism = models.IntegerField(blank=True, null=True)
    wages_deductions_benefits_digitalization = models.IntegerField(blank=True, null=True)
    wages_deductions_benefits_notes = models.TextField(blank=True, null=True)
    wages_deductions_benefits_priority_notes = models.TextField(blank=True, null=True)

    # WORKING AND LIVING CONDITIONS
    conditions_health_and_safety = models.IntegerField(blank=True, null=True)
    conditions_document_control = models.IntegerField(blank=True, null=True)
    conditions_workers_housing = models.IntegerField(blank=True, null=True)
    conditions_freedom_of_movement = models.IntegerField(blank=True, null=True)
    conditions_notes = models.TextField(blank=True, null=True)
    conditions_priority_notes = models.TextField(blank=True, null=True)

    # GRIEVANCE MECHANISM
    grievance_mechanism_encouragement = models.IntegerField(blank=True, null=True)
    grievance_mechanism_punitive_action = models.IntegerField(blank=True, null=True)
    grievance_mechanism_credibility = models.IntegerField(blank=True, null=True)
    grievance_mechanism_hr_staff = models.IntegerField(blank=True, null=True)
    grievance_mechanism_notes = models.TextField(blank=True, null=True)
    grievance_mechanism_priority_notes = models.TextField(blank=True, null=True)

    # Extra
    created_at = models.DateField(auto_now_add=True)
    modified_at = models.DateField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='created_ethical_recruitment_meetings'
    )

    class Meta:
        verbose_name_plural = "Ethical Recruitment Meetings"
        managed = True
        db_table = 'ethical_recruitment_meetings'


class Config(models.Model):
    client_version = models.CharField(max_length=4)

    class Meta:
        managed = True
        db_table = 'config'

    def save(self, *args, **kwargs):
        if not self.pk and Config.objects.exists():
            raise ValidationError('There is can be only one Config instance')
        return super(Config, self).save(*args, **kwargs)

    def __str__(self):
        return 'Client version {}'.format(self.client_version)


class KpiEmailNotificationTemplate(models.Model):
    type = models.CharField(
        max_length=2,
        choices=(
            ('I', 'Internal'),
            ('SP', 'Partners')
        ),
        default='I'
    )

    golive = models.BooleanField(default=False)

    # conditions
    kpi_statuses = models.ManyToManyField(SupplierKpiUpdateStatus)
    days_eq = models.IntegerField(null=True, blank=True)
    # days_gt = models.IntegerField(null=True, blank=True)
    # days_lt = models.IntegerField(null=True, blank=True)

    level_eq = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(4)],
        help_text='Level equals (min: 1, max: 4)'
    )
    level_gte = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(4)],
        help_text='Level greater than or equals (min: 1, max: 4)'
    )
    level_lte = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(4)],
        help_text='Level less than or equals (min: 1, max: 4)'
    )

    # email
    subject = models.CharField(max_length=256)
    email_to = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True)
    text = models.TextField()

    class Meta:
        verbose_name_plural = "KPI Email Notification Templates"

    def __str__(self):
        return self.subject

    def __repr__(self):
        repr = (
            f'Type: {self.type} \n'
            f'Subject: {self.subject} \n'
            f'Go live (SP emails will be dynamically appended to email_to): {self.golive} \n'
            f'KPI statuses: {" ".join([status.name for status in self.kpi_statuses.all()])} \n'
            f'Days equals: {self.days_eq} \n'
            f'Level equals: {self.level_eq} \n'
            f'Level greater than: {self.level_gte} \n'
            f'Level less than: {self.level_lte} \n'
            f'Email to: {", ".join([user.email for user in self.email_to.all()])} \n'
        )

        return repr


class KpiEmailNotification(models.Model):
    template = models.ForeignKey(KpiEmailNotificationTemplate, on_delete=models.CASCADE)
    supplier_kpis = models.ManyToManyField(SupplierKpi, related_name='notifications')
    delivered = models.BooleanField(default=False)
    recipients = models.ManyToManyField(settings.AUTH_USER_MODEL)
    error_message = models.TextField(null=True)
    date = models.DateField(default=timezone.now)

    class Meta:
        verbose_name_plural = "KPI Email Notifications"


class StrategicPartnerUser(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        models.CASCADE,
        primary_key=True,
        related_name='strategic_partner_user'
    )
    strategic_partner = models.ForeignKey(StrategicPartner, on_delete=models.CASCADE, related_name='users')
    email_notify = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Strategic partner users"
        managed = True
        db_table = 'strategic_partner_users'

    def __str__(self):
        return self.user.username + ":" + self.strategic_partner.name


class UserLogin(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        StrategicPartnerUser, on_delete=models.DO_NOTHING, null=False, blank=False
    )
    created_at = models.DateTimeField(blank=True, null=True, auto_now_add=True)
    loggedout_at = models.DateTimeField(blank=True, null=True, auto_now_add=False)
