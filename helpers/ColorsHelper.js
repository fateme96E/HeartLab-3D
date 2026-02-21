
export function getMeshColor(meshName) {
    switch(meshName) {
        case 'left_atrium': return 0xE8311E;
        case 'right_atrium': return 0x095996;

        case 'left_ventricle': return 0x990000;
        case 'right_ventricle': return 0x002FA8;

        case 'aorta': return 0xA30051;
        case 'superior_vena_cava': return 0x670091;
        case 'pulmonary_trunk': 
        case 'right_pulmonary_artery':
        case 'left_pulmonary_artery': return 0x127337;

        case 'apex': return 0x9B9E00;

        default: return 0x000000;
    }

}


