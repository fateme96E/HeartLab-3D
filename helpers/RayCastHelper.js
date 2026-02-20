import * as THREE from 'three'

export function getMouseVector2(event, renderer) {
    const rect = renderer.domElement.getBoundingClientRect();

    const mousePointer = new THREE.Vector2();

    mousePointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mousePointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    return mousePointer;
}

export function checkRayIntersections(mousePointer, camera, rayCaster, heartMeshes) {
    rayCaster.setFromCamera(mousePointer, camera);
    
    let intersections = rayCaster.intersectObjects(heartMeshes, true);
    intersections = intersections[0];

    return intersections;
}