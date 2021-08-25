const express = require('express');
const formidable = require('express-formidable');
const GeoTIFF = require('geotiff');
const { fromUrl, fromUrls, fromArrayBuffer, fromBlob } = GeoTIFF;
const app = express()
const PORT = 8080;
app.listen(PORT)
app.use(formidable())


app.post('/bounds', async (req, res) => {
    try {
        const {image} = req.files
        if (!image) {
            console.log('No image')
            res.status(418).json({message: 'No image given.'})
        } else if(image.type != 'image/tiff') {
            console.log('Wrong image.')
            res.status(415).json({message: 'Unsupported image type.'})
        } else{
            console.log("Type:" + image.type)
            console.log('Image')
            const tiff = await GeoTIFF.fromFile(image.path)
            const geoImage = await tiff.getImage()
            const bbox = geoImage.getBoundingBox();
            const zoneAndHemisphere = geoImage.geoKeys.GTCitationGeoKey.slice(18)
            const zone = parseInt(zoneAndHemisphere.substring(0, zoneAndHemisphere.length - 1))
            const hemisphere = zoneAndHemisphere.slice(-1)
            const pixelWidth = geoImage.getWidth();
            const pixelHeight = geoImage.getHeight();
            const upperLeftLat = bbox[0]
            const upperLeftLng = bbox[3]
            const upperLeft = [upperLeftLat, upperLeftLng]

            const lowerRightLat = bbox[2]
            const lowerRightLng = bbox[1]
            const lowerRight = [lowerRightLat, lowerRightLng]

            const lowerLeftLat = bbox[0]
            const lowerLeftLng = bbox[1]
            const lowerLeft = [lowerLeftLat, lowerLeftLng]

            const upperRightLat = bbox[2]
            const upperRightLng = bbox[3]
            const upperRight = [upperRightLat, upperRightLng]

            const output = {message: {
                height: pixelHeight,
                window: pixelWidth,
                hemisphere: hemisphere,
                zone: zone,
                upperLeft: upperLeft,
                upperRight: upperRight,
                lowerLeft: lowerLeft,
                lowerRight: lowerRight
            }}
            res.status(200).json(output)
        }   
    } catch (error) {
        res.status(500).json({message: 'Error with file!'})
    }
})

