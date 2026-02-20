
export function getMeshColor(meshName) {
    switch(meshName) {
        case 'left_atrium': return 0xE00059;
        case 'right_atrium': return 0x178CE3;

        case 'left_ventricle': return 0xB00000;
        case 'right_ventricle': return 0x0006B0;

        case 'aorta': return 0xCC7B3B;
        case 'superior_vena_cava': return 0x8028C7;
        case 'pulmonary_trunk': 
        case 'right_pulmonary_artery':
        case 'left_pulmonary_artery': return 0x5DE8BC;

        case 'apex': return 0xFBFF00;

        default: return 0x000000;
    }

}


