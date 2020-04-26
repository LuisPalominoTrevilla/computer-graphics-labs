class BBox
{
	constructor(vertices)
	{
		this.xMin = vertices[0];
		var i;
		for(i = 3; i < vertices.length; i = i + 3)
		{
			if(vertices[i] < this.xMin)
			{
				this.xMin = vertices[i];
			}
		}
		this.yMin = vertices[1];
		for(i = 4; i < vertices.length; i = i + 3)
		{
			if(vertices[i] < this.yMin)
			{
				this.yMin = vertices[i];
			}
		}
		this.zMin = vertices[2];
		for(i = 5; i < vertices.length; i = i + 3)
		{
			if(vertices[i] < this.zMin)
			{
				this.zMin = vertices[i];
			}
		}

		this.xMax = vertices[0];
		for(i = 3; i < vertices.length; i = i + 3)
		{
			if(vertices[i] > this.xMax)
			{
				this.xMax = vertices[i];
			}
		}
		this.yMax = vertices[1];
		for(i = 4; i < vertices.length; i = i + 3)
		{
			if(vertices[i] > this.yMax)
			{
				this.yMax = vertices[i];
			}
		}
		this.zMax = vertices[2];
		for(i = 5; i < vertices.length; i = i + 3)
		{
			if(vertices[i] > this.zMax)
			{
				this.zMmax = vertices[i];
			}
		}
		// Centroid
		this.xCentroid = (this.xMin + this.xMax) / 2.;
		this.yCentroid = (this.yMin + this.yMax) / 2.;
		this.zCentroid = (this.zMin + this.zMax) / 2.;
	}
}

class Camera
{
	constructor()
	{
		this.fovy = 60. * Math.PI / 180.;
		this.xEye = 0.;
		this.yEye = 0.;
		this.zEye = 10.;
		this.xTarget = 0.;
		this.yTarget = 0.;
		this.zTarget = 0.;
		this.xUp = 0.;
		this.yUp = 1.;
		this.zUp = 0.;	
	}

	autofocus(positions, offset = 0.)
	{
		var bbox = new BBox(positions);
		this.xEye = (bbox.xMin + bbox.xMax) / 2.;
		this.yEye = (bbox.yMin + bbox.yMax) / 2.;

		var xMax = Math.abs(bbox.xMax);
		if(xMax < Math.abs(bbox.xMin))
		{
			xMax = Math.abs(bbox.xMin);
		}
		var yMax = Math.abs(bbox.yMax);
		if(yMax < Math.abs(bbox.yMin))
		{
			yMax = Math.abs(bbox.yMin);
		}
		var zEye1 = Math.abs((yMax / Math.tan(this.fovy / 2) + bbox.zMax)) * (1. + offset);
		var zEye2 = Math.abs((xMax / Math.tan(this.fovy / 2) + bbox.zMax)) * (1. + offset);
		if(zEye1 > zEye2)
		{
			this.zEye = zEye1;
		}
		else
		{
			this.zEye = zEye2;
		}
		this.xTarget = bbox.xCentroid;
		this.yTarget = bbox.yCentroid;
		this.zTarget = bbox.zCentroid;
	}
}