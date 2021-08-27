# GeoTiffReaderAPI
## Requests
### /bounds
- `Post` Request
- Body (`Form Data`) - Key: image, value: `.tif` Geotiff file
- Returns the bounding box coodinates metadata in Latitude/Longitude (`[latitude, longitude]`) format as well as other information.

## Android Example
### Retrofit Request
#### Interface
```
interface BoundsService {
    @Multipart
    @POST("/bounds")
    fun getBounds(@Part image: MultipartBody.Part): Call<BoundsResponse>
}
```
#### Network Call
```
private var service: BoundsService

init {
    //server is run locally
    val builder = Retrofit.Builder()
        .addConverterFactory(GsonConverterFactory.create())
        .baseUrl("<Server IP Address>:8080/")
        .build()

    service = builder.create(BoundsService::class.java)
}

suspend fun getBounds(image: MultipartBody.Part) = suspendCancellableCoroutine<BoundsResponse?> { cont ->
        val call = service.getBounds(image)
        call.enqueue(object: Callback<BoundsResponse> {
            override fun onResponse(call: Call<BoundsResponse>, response: Response<BoundsResponse>) {
                Log.d(TAG, "onResponse: Request: ${call.request().headers()}\n ${call.request()}")
                Log.d(TAG, "onResponse: Response: ${response.body()}\n${response.headers()}\n${response.code()}")
                cont.resume(response.body())
            }

            override fun onFailure(call: Call<BoundsResponse>, t: Throwable) {
                Log.d(TAG, "onFailure: Failed to get bounds: ${t.localizedMessage}")
                cont.resume(null)
            }
        })
    }
```
#### Response Model
```
data class BoundsResponse(
    val message: Message
)

data class Message(
    val height: Int,
    val hemisphere: String,
    val lowerLeft: List<Double>,
    val lowerRight: List<Double>,
    val upperLeft: List<Double>,
    val upperRight: List<Double>,
    val width: Int,
    val zone: Int
)
```

#### Usage
```
private suspend fun getBounds(path: String): BoundsResponse? {
        val file = File(path)
        val builder = MultipartBody.Builder()

        builder.setType(MultipartBody.FORM)
        builder.addFormDataPart(
            "image",
            file.name,
            RequestBody.create(MediaType.parse("image/tiff"), file)
        )
        val body = builder.build()

        return getBounds(body.part(0))
    }
```
  


