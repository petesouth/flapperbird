
KPI_LEVEL_CHOICES = (
    (1, '1'),
    (2, '2'),
    (3, '3'),
    (4, '4'),
    (5, '5'),
)

# Note: Okay was deliberately removed.
KPI_UPDATE_CLOSED_QUALITY_CHOICES = (
    ("Poor", "Poor"),
    ("Fair", "Fair"),
    ("Good", "Good"),
    ("Excellent", "Excellent"),
)

KPI_UPDATE_SOURCE_CHOICES = (
    ("supplierkpiupdateform", "supplierkpiupdateform"),
    ("caseupdate", "caseupdate"),
)

KPI_UPDATE_PROGRESS_CHOICES = (
    ("None", "None"),
    ("A little", "A little"),
    ("A lot", "A lot"),
)

TASK_SOURCE_TYPE = (
    ("Call", "Call"),
    ("Business Response", "Business Response"),
)

SHARED_FILE_TYPES = (
    ('NF', 'FlagIcon'),
    ('SP', 'Strategic Partner'),
    ('RA', 'Recruitment Agency'),
    ('S', 'Supplier'),
    ('IS', 'Issara Staff'),
    ('O', 'Other')
)
