class Arrow extends THREE.Group
{
    constructor(size= 1.)
    {
        super();
        // PARAMS
        this.size = size;
        // MODELS
        var vertices = [new THREE.Vector3(0., 0. , 0.), new THREE.Vector3(1., 0. , 0.)];
        var geometryLine = new THREE.BufferGeometry().setFromPoints(vertices);  
        var geometryCone = new THREE.ConeGeometry(0.05, 0.2, 10, 10);
        // MATERIAL
        var material = new THREE.MeshBasicMaterial();
        // MESH (GEOMETRY + MATERIAL)
        var line = new THREE.Line(geometryLine, material); 
        var cone= new THREE.Mesh(geometryCone, material); 
        // TRANSFORM
        cone.position.x = 1.;  
        cone.rotation.z = -Math.PI / 2.;
        // GROUP
        this.add(line);
        this.add(cone);
    }
    setLength(size)
    {
        this.size = size;
        this.scale.set(size, 1., 1.);
    }
    setColor(r, g, b, a)
    {
       this.children[1].material.color.setRGB(r, g, b, a);
    }
    setRedColor()
    {
        this.setColor(1., 0., 0., 1.);
    }
    setGreenColor()
    {
        this.setColor(0., 1., 0., 1.);
    }
    setBlueColor()
    {
        this.setColor(0., 0., 1., 1.);
    }
    setWhiteColor()
    {
        this.setColor(1., 1., 1., 1.);
    }
}

class Axes extends THREE.Group
{
    constructor(size = 1.)
    {
        super();
        // PARAMS
        this.size = size;
        this.colorX = [1., 0., 0.];
        this.colorY = [0., 1., 0.];
        this.colorZ = [0., 0., 1.];
        // MODELS
        this.axesX = new Arrow(size);
        this.axesY = new Arrow(size);
        this.axesZ = new Arrow(size);
        // TRANSFORM
        this.axesY.rotation.z = Math.PI / 2.;
        this.axesZ.rotation.y = -Math.PI / 2.;
        // GROUP
        this.add(this.axesX);
        this.add(this.axesY);
        this.add(this.axesZ);
        // DEFAULTS
        this.scale.set(size, size, size);
        this.setColorX(1., 0., 0., 1.);
        this.setColorY(0., 1., 0., 1.);
        this.setColorZ(0., 0., 1., 1.);
    }
    setSize(size)
    {
        this.size = size;
        this.scale.set(size, size, size);
    }
    setColorX(r = 1., g = 0., b = 0., a = 1.)
    {
        this.axesX.setColor(r, g, b, a);
    }
    setColorY(r = 0., g = 1., b = 0., a = 1.)
    {
        this.axesY.setColor(r, g, b, a);
    }
    setColorZ(r = 0., g = 0., b = 1., a = 1.)
    {
        this.axesZ.setColor(r, g, b, a);
    }
}
