# GeoTiffReaderAPI
## Requests
### /bounds
- `Post` Request
- Body (`Form Data`) - Key: image, value: `.tif` Geotiff file
- Returns the bounding box coodinates metadata in Latitude/Longitude (`[latitude, longitude]`) format as well as other information.

