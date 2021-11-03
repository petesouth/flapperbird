

def get_type_path(type='O'):
    type_path_map = {
        'NF': 'FlagIcon',
        'SP': 'partners',
        'RA': 'recruiters',
        'S': 'suppliers',
        'IS': 'staff',
        'O': 'other'
    }
    return type_path_map[type]
