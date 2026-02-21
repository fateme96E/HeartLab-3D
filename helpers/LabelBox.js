import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

const labelRenderer = new CSS2DRenderer();

export const createLabelRenderer = () => {
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '30px';
    labelRenderer.domElement.style.pointerEvents = 'none'; 
    document.body.appendChild(labelRenderer.domElement);
    return labelRenderer;
}

export const HideLabel = (currentLabel) => {
    if (currentLabel && currentLabel.parent) {
        currentLabel.parent.remove(currentLabel);
    }
    return null;
}

export const showLabel = (
    scene,
    intersect, 
    currentLabel, 
    messagesList = [],
    selectedMeshRef = { current: null },
) => {

    currentLabel = HideLabel(currentLabel);

    const messageData = messagesList[intersect.object.name];
    if (!messageData) return;

    const div = document.createElement('div');
    div.className = 'label';
    div.style.background = 'rgba(0,0,0,0.7)';
    div.style.padding = '10px';
    div.style.borderRadius = '8px';
    div.style.color = '#ffffff';
    div.style.fontFamily = 'Arial';
    div.style.fontSize = '14px';
    div.style.lineHeight = '1.3';
    div.style.maxWidth = '280px';
    div.style.position = 'absolute';
    div.style.top = '90px';
    div.style.left = '90px';
    div.innerHTML = `<b style="color:#f00;">${messageData.title}</b><br>${messageData.descriptions.join('<br>')}<br><br><i>Blood Pathway:</i></b><br>${messageData.bloodWay.join(' \u2192 ')}`;

    const closeButton = document.createElement('button');
    closeButton.textContent = '✖';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.background = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.color = '#fffff';
    closeButton.style.fontSize = '16px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.pointerEvents = 'auto'; 
    div.appendChild(closeButton);

    const label = new CSS2DObject(div);
    label.position.copy(intersect.point);
    scene.add(label);
    
    closeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        
        if (selectedMeshRef.current) {
            selectedMeshRef.current.material.emissive.set(0x000000);
            selectedMeshRef.current = null;
        }
        HideLabel(label);
    });

    return label;
}
