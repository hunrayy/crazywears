<?php

// namespace App\Http\Controllers;
// use Illuminate\Support\Facades\Validator;
// // use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
// use Cloudinary\Cloudinary;

// use App\Models\Product; 

// use Illuminate\Http\Request;

// class ProductController extends Controller
// {
//     //

//     public function createProduct(Request $request){
//         // Validate request input
//         $validator = Validator::make($request->all(), [
//             'productName' => 'required|string|max:255',
//             'productPrice' => 'required|numeric',
//             'productImage' => 'image|mimes:jpeg,png,jpg,gif',
//         ]);
//         if ($validator->fails()) {
//             return response()->json([
//                 'message' => 'All fields are required.',
//                 'code' => 'error',
//                 'errors' => $validator->errors()
//             ]);
//         }

//         try{
//             // Handle file uploads
//             $uploadedProductImage = $this->uploadToCloudinary($request->file('productImage'));
//             $uploadedSubImage1 = $this->uploadToCloudinary($request->file('subImage1'));
//             $uploadedSubImage2 = $this->uploadToCloudinary($request->file('subImage2'));
//             $uploadedSubImage3 = $this->uploadToCloudinary($request->file('subImage3'));

//             // Create new product
//             Product::create([
//                 // 'id' => 
//                 'productName' => $request->input('productName'),
//                 'productPrice' => $request->input('productPrice'),
//                 'productImage' => $uploadedProductImage,
//                 'subImage1' => $uploadedSubImage1,
//                 'subImage2' => $uploadedSubImage2,
//                 'subImage3' => $uploadedSubImage3
//             ]);
//             return response()->json([
//                 'message' => 'Product created successfully.',
//                 'code' => 'success',
//             ]);
//         }catch(\Exception $e){
//             return response()->json([
//                 'message' => 'Error creating product.',
//                 'code' => 'error',
//                 'reason' => $e->getMessage()
//             ]);
//         }
//     }
//     /**
//      * Upload file to Cloudinary
//      *
//      * @param \Illuminate\Http\UploadedFile $file
//      * @return string $url - The uploaded image URL
//      */
//     // public function uploadToCloudinary($file){
//     //     if (!$file) {
//     //         return null; // If no file is uploaded, return null
//     //     }

//     //     $uploadedFileUrl = Cloudinary::upload($file->getRealPath(), [
//     //         'folder' => env('FOLDER_FOR_IMAGES_IN_CLOUDINARY'), // Optional: Set a folder name in Cloudinary for organizing images
//     //         'resource_type' => 'image'
//     //     ])->getSecurePath(); // Fetch the secure URL of the uploaded image

//     //     return $uploadedFileUrl;
//     // }




//     public function uploadToCloudinary($file)
//     {
    
//         $cloudinary = new Cloudinary();
    
//         // Upload the image
//         $uploadedImage = $cloudinary->upload($file->getRealPath(), [
//             'folder' => env('FOLDER_FOR_IMAGES_IN_CLOUDINARY'),
//             'resource_type' => 'image',
//         ]);
    
//         // Get the secure URL of the uploaded image
//         $imageUrl = $uploadedImage->getSecurePath();
    
//         // You can now save $imageUrl to your database or return it in your response
//         return $image;
//     }
// }












































namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

use Illuminate\Support\Facades\Cache;

use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\DB;

use App\Models\Product; 
use App\Models\ProductsCategory; 
use Exception;

use Illuminate\Http\Request;

class ProductController extends Controller
{
    //
    public function fetchProductCategories(){
        try{
            //check if product categories exist in cache
            $cachedProductCategories = Cache::get('productCategories');
            if($cachedProductCategories){
                return response()->json([
                    'code' => 'success',
                    'message' => 'product categories successfully fetched from cache',
                    'data' => $cachedProductCategories
                ]);
            }
            //no product categories in cache, fetch from database and store in cache
            $allCategories = ProductsCategory::all();
            Cache::put('productCategories', $allCategories, now()->addWeek());
            return response()->json([
                'code' => 'success',
                'message' => 'product categories feteched successfully',
                'data' => $allCategories
            ]);
        }catch(Exception $e){
            return response()->json([
                'code' => 'error',
                'message' => "An error occured while fetching product categories: $e"
            ]);
        }

    }


    // public function createProduct(Request $request)
    // {
    //     // Step 1: Decode prices if sent as JSON
    //     $prices = json_decode($request->input('productPrices'), true);

    //     // Step 2: Validation
    //     $validator = Validator::make([
    //         'productImage' => $request->file('productImage'),
    //         'productName' => $request->input('productName'),
    //         'productCategory' => $request->input('productCategory'),
    //         'productPrices' => $prices
    //     ], [
    //         'productImage' => 'required|image|mimes:jpeg,png,jpg,gif',
    //         'productName' => 'required|string|max:255',
    //         'productCategory' => 'nullable|string|exists:products_category,name',
    //         'productPrices' => 'required|array|min:1',
    //         'productPrices.*.size' => 'required|string|max:100',
    //         'productPrices.*.price' => 'required|numeric|min:0'
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json([
    //             'message' => 'Validation failed.',
    //             'code' => 'error',
    //             'errors' => $validator->errors()
    //         ]);
    //     }

    //     try {

    //         // Upload main image
    //         $uploadedProductImage = $this->uploadToCloudinary($request->file('productImage'));

    //         if (!$uploadedProductImage) {
    //             return response()->json([
    //                 'code' => 'error',
    //                 'message' => 'Failed to upload the main product image.'
    //             ]);
    //         }

    //         // Upload optional images
    //         $uploadedSubImage1 = $request->hasFile('subImage1') ? $this->uploadToCloudinary($request->file('subImage1')) : null;
    //         $uploadedSubImage2 = $request->hasFile('subImage2') ? $this->uploadToCloudinary($request->file('subImage2')) : null;
    //         $uploadedSubImage3 = $request->hasFile('subImage3') ? $this->uploadToCloudinary($request->file('subImage3')) : null;

    //         // Get category ID
    //         $categoryId = null;

    //         if ($request->productCategory) {

    //             $category = ProductsCategory::where('name', $request->productCategory)->first();

    //             if (!$category) {
    //                 return response()->json([
    //                     'code' => 'error',
    //                     'message' => 'Product category does not exist.'
    //                 ]);
    //             }

    //             $categoryId = $category->id;
    //         }

    //         // Create product
    //         $newProduct = Product::create([
    //             'productName' => $request->productName,
    //             'productImage' => $uploadedProductImage,
    //             'category_id' => $categoryId,
    //             'subImage1' => $uploadedSubImage1,
    //             'subImage2' => $uploadedSubImage2,
    //             'subImage3' => $uploadedSubImage3,

    //             // Save sizes + prices as JSON
    //             'productPrices' => json_encode($prices)
    //         ]);

    //         // Cache update
    //         $cachedProducts = Cache::get('allProducts');

    //         if ($cachedProducts) {

    //             array_unshift($cachedProducts, $newProduct->toArray());

    //             Cache::put('allProducts', $cachedProducts, now()->addWeek());

    //         } else {

    //             $allProducts = Product::orderBy('created_at', 'desc')->get()->toArray();

    //             Cache::put('allProducts', $allProducts, now()->addWeek());
    //         }

    //         return response()->json([
    //             'message' => 'Product created successfully.',
    //             'code' => 'success'
    //         ]);

    //     } catch (\Exception $e) {

    //         return response()->json([
    //             'message' => 'Error creating product.',
    //             'code' => 'error',
    //             'reason' => $e->getMessage()
    //         ]);
    //     }
    // }



    public function createProduct(Request $request)
    {
        $prices = json_decode($request->input('productPrices'), true);

        // Extract sub images
        $subImages = [];
        foreach ($request->allFiles() as $key => $file) {
            if (str_starts_with($key, 'subImage')) {
                $subImages[] = $file;
            }
        }

        $validator = Validator::make(
            [
                'productImage'       => $request->file('productImage'),
                'productName'        => $request->input('productName'),
                'productCategoryId'  => $request->input('productCategoryId'),
                'productPrices'      => $prices,
                'subImages'          => $subImages
            ],
            [
                'productImage' => 'required|image|mimes:jpeg,png,jpg,gif|max:1024',
                'productName'  => 'required|string|max:255',
                'productCategoryId' => 'nullable|exists:products_category,id',

                'productPrices' => 'required|array|min:1',
                'productPrices.*.size'  => 'required|string|max:100',
                'productPrices.*.price' => 'required|numeric|min:0',

                'subImages'   => 'nullable|array|max:5',
                'subImages.*' => 'image|mimes:jpeg,png,jpg,gif|max:1024'
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'message' => "An error occurred: " . $validator->errors()->first(),
                'code'    => 'error',
                'errors'  => $validator->errors()
            ]);
        }

        // 🔥 Track URLs instead of public_id
        $uploadedUrls = [];
        $uploadedSubMedia = [];

        try {
            DB::beginTransaction();

            /*
            |--------------------------------------------------------------------------
            | Upload Main Image
            |--------------------------------------------------------------------------
            */
            $mainUrl = $this->uploadToCloudinary($request->file('productImage'));

            if (!$mainUrl) {
                throw new \Exception("Main image upload failed");
            }

            $uploadedUrls[] = $mainUrl;

            /*
            |--------------------------------------------------------------------------
            | Upload Sub Images (STRICT)
            |--------------------------------------------------------------------------
            */
            foreach ($subImages as $file) {
                $url = $this->uploadToCloudinary($file);

                if (!$url) {
                    throw new \Exception("One or more sub images failed");
                }

                $uploadedUrls[] = $url;
                $uploadedSubMedia[] = $url;
            }

            /*
            |--------------------------------------------------------------------------
            | Normalize Prices
            |--------------------------------------------------------------------------
            */
            $cleanedPrices = [];

            foreach ($prices as $item) {
                $cleanedPrices[] = [
                    'size'  => trim($item['size']),
                    'price' => (float) $item['price']
                ];
            }

            /*
            |--------------------------------------------------------------------------
            | Create Product
            |--------------------------------------------------------------------------
            */
            $newProduct = Product::create([
                'productName'      => $request->productName,
                'mainProductMedia' => $mainUrl,
                'category_id'      => $request->input('productCategoryId'),
                'subMedia'         => !empty($uploadedSubMedia) ? json_encode($uploadedSubMedia) : null,
                'productPrices'    => json_encode($cleanedPrices)
            ]);

            Cache::forget('allProducts');

            DB::commit();

            return response()->json([
                'message' => 'Product created successfully.',
                'code'    => 'success',
                'data'    => $newProduct
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            /*
            |--------------------------------------------------------------------------
            | 🔥 CLEANUP USING HELPER
            |--------------------------------------------------------------------------
            */
            foreach ($uploadedUrls as $url) {
                try {
                    $publicId = $this->getPublicIdFromUrl($url);
                    $this->deleteFromCloudinary($publicId);
                } catch (\Exception $cleanupError) {
                    // ignore cleanup failure
                }
            }

            return response()->json([
                'message' => 'Error creating product.',
                'code'    => 'error',
                'reason'  => $e->getMessage()
            ]);
        }
    }















    
// public function createProduct(Request $request)
// {

// $totalSize = 0;

// if ($request->hasFile('mainProductMedia')) {
//     $totalSize += $request->file('mainProductMedia')->getSize();
// }

// if ($request->hasFile('subMedia')) {
//     foreach ($request->file('subMedia') as $file) {
//         $totalSize += $file->getSize();
//     }
// }

// $totalSizeMB = $totalSize / (1024 * 1024);

// if ($totalSizeMB > 30) {
//     return response()->json([
//         'code' => 'error',
//         'message' => "Total upload size exceeds 30MB limit. Current: {$totalSizeMB}MB"
//     ]);
// }








//     // ✅ VALIDATION
//     $validator = Validator::make($request->all(), [
//         'mainProductMedia' => 'required|file|mimes:jpeg,png,jpg,webp,mp4,webm,ogg|max:10240',
//         'productName' => 'required|string|max:255',
//         'productCategory' => 'required|exists:products_category,id',
//         'subMedia.*' => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,webm,ogg|max:10240',
//         'productPrices' => 'required|json',
//     ]);

//     if ($validator->fails()) {
//         return response()->json([
//             'code' => 'error',
//             'message' => 'Validation failed.',
//             'errors' => $validator->errors(),
//             'debug_files' => $_FILES
//         ]);
//     }

//     // ✅ Decode and validate productPrices structure
//     $prices = json_decode($request->input('productPrices'), true);

//     if (!is_array($prices) || empty($prices)) {
//         return response()->json([
//             'code' => 'error',
//             'message' => 'Invalid or empty product prices.'
//         ]);
//     }

//     foreach ($prices as $price) {
//         if (
//             !isset($price['size']) ||
//             !isset($price['price']) ||
//             empty($price['size']) ||
//             empty($price['price'])
//         ) {
//             return response()->json([
//                 'code' => 'error',
//                 'message' => 'Each price must have a valid size and price.'
//             ]);
//         }
//     }

//     DB::beginTransaction();

//     // Track uploaded files for rollback safety
//     $uploadedFiles = [];

//     try {

//         // ✅ Upload MAIN media
//         $mainUpload = $this->uploadToCloudinary(
//             $request->file('mainProductMedia')
//         );

//         if (!$mainUpload) {
//             throw new \Exception('Failed to upload main media.');
//         }

//         $uploadedFiles[] = $mainUpload;

//         // ✅ Upload SUB media
//         $subMediaUrls = [];

//         if ($request->hasFile('subMedia')) {
//             foreach ($request->file('subMedia') as $file) {

//                 $uploaded = $this->uploadToCloudinary($file);

//                 if (!$uploaded) {
//                     throw new \Exception('Failed to upload one of the sub media files.');
//                 }

//                 $uploadedFiles[] = $uploaded;
//                 $subMediaUrls[] = $uploaded;
//             }
//         }

//         // ✅ Create product
//         $product = Product::create([
//             'productName' => $request->productName,
//             'mainProductMedia' => $mainUpload,
//             'category_id' => $request->productCategory,
//             'subMedia' => json_encode($subMediaUrls),
//             'productPrices' => json_encode($prices)
//         ]);

//         // ✅ Cache update
//         $cachedProducts = Cache::get('allProducts');

//         if ($cachedProducts) {
//             array_unshift($cachedProducts, $product->toArray());
//             Cache::put('allProducts', $cachedProducts, now()->addWeek());
//         } else {
//             Cache::put(
//                 'allProducts',
//                 Product::orderBy('created_at', 'desc')->get()->toArray(),
//                 now()->addWeek()
//             );
//         }

//         DB::commit();

//         return response()->json([
//             'code' => 'success',
//             'message' => 'Product created successfully.'
//         ]);

//     } catch (\Exception $e) {

//         DB::rollBack();

//         // ✅ Cleanup uploaded files (VERY IMPORTANT)
//         foreach ($uploadedFiles as $file) {
//             try {
//                 $this->deleteFromCloudinary($file);
//             } catch (\Exception $cleanupError) {
//                 // silently fail cleanup (don't override main error)
//             }
//         }

//         return response()->json([
//             'code' => 'error',
//             'message' => 'Error creating product.',
//             'reason' => $e->getMessage()
//         ]);
//     }
// }





    /**
     * Upload file to Cloudinary
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @return string $url - The uploaded image URL
     */




    // public static function uploadToCloudinary($file){
    //     if(!$file){
    //         return null;
    //     }
    
    //     try {

    //         // Specify the folder you want the file to be uploaded to
    //         $folderName = env('FOLDER_FOR_IMAGES_IN_CLOUDINARY');

    //         // Upload the file to Cloudinary, specify the folder, and get the secure URL
    //         $uploadedFileUrl = Cloudinary::upload($file->getRealPath(), [
    //             'folder' => $folderName,
    //         ])->getSecurePath();

    //         return $uploadedFileUrl;

    //     }catch (\Exception $e) {
    //         // Handle the exception
    //         // return response()->json([
    //             //     'message' => 'Error creating product.',
    //             //     'code' => 'error',
    //             //     'reason' => $e->getMessage()
    //             // ]);
    //             return false;
    //     }
    // }


    // public function getAllProducts(Request $request){
    //     $category = $request->query('productCategory');
    //     $page = (int) $request->query('page', 1);
    //     $perPage = (int) $request->query('perPage', 12);

    //     // If category is "All products", return everything
    //     if (strtolower($category) === "all products") {
    //         return $this->fetchAndPaginateProducts(Product::orderBy('created_at', 'desc'), $page, $perPage, "All products fetched successfully");
    //     }

    //     $categoryId = null;

    //     // Check if category exists (case insensitive)
    //     if ($category) {
    //         $categoryRecord = ProductsCategory::whereRaw('LOWER(name) = ?', [strtolower($category)])->first();
    //         if (!$categoryRecord) {
    //             return response()->json([
    //                 'code' => 'error',
    //                 'message' => 'Category not found',
    //                 'data' => [
    //                     'data' => [],
    //                     'total' => 0,
    //                     'current_page' => 1,
    //                     'per_page' => $perPage,
    //                 ],
    //             ]);
    //         }
    //         $categoryId = $categoryRecord->id;
    //     }

    //     // If no category is passed, fetch products with category_id = null
    //     $query = Product::orderBy('created_at', 'desc');
    //     if ($category === null) {
    //         $query->whereNull('category_id');
    //     } else {
    //         $query->where('category_id', $categoryId);
    //     }

    //     return $this->fetchAndPaginateProducts($query, $page, $perPage, "Filtered products fetched successfully");
    // }


    public static function uploadToCloudinary($file, $subFolder = null)
    {
        if (!$file) {
            \Log::error('uploadToCloudinary received null file');
            return false;
        }

        try {
            $folderName = rtrim(env('FOLDER_FOR_IMAGES_IN_CLOUDINARY'), '/');

            if ($subFolder) {
                $folderName .= '/' . trim($subFolder, '/');
            }

            // 🔥 safer unique ID (not tied only to file content)
            $publicId = uniqid() . '_' . pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);

            $uploadResult = Cloudinary::upload($file->getRealPath(), [
                'folder'        => $folderName,
                'public_id'     => $publicId,
                'overwrite'     => false,
                'resource_type' => 'image',
            ]);

            return $uploadResult->getSecurePath();

        } catch (\Exception $e) {
            \Log::error('Cloudinary upload error: ' . $e->getMessage());
            return false;
        }
    }



    
    // public static function uploadToCloudinary($file, $subFolder = null)
    // {
    //     if (!$file) {
    //         \Log::error('uploadToCloudinary received null file');
    //         return false;
    //     }

    //     try {
    //         $folderName = env('FOLDER_FOR_IMAGES_IN_CLOUDINARY');
    //         // Append subfolder only if it's provided
    //         if ($subFolder) {
    //             $folderName .= '/' . trim($subFolder, '/'); // remove any leading/trailing slashes
    //         }
    //         $hash = md5_file($file->getRealPath());
    //         $publicId = $folderName . '/' . $hash;

    //         // Upload the file with a unique public ID, avoid overwriting if it exists
    //         $uploadResult = Cloudinary::upload($file->getRealPath(), [
    //             'folder' => $folderName,
    //             'public_id' => $hash,
    //             'overwrite' => false,
    //         ]);

    //         return $uploadResult->getSecurePath();

    //     } catch (\Exception $e) {
    //         \Log::error('Cloudinary upload error: ' . $e->getMessage());
    //         return false;
    //     }
    // }

    // public function getAllProducts(Request $request) {
    //     $category = $request->query('productCategory');
    //     $page = (int) $request->query('page', 1);
    //     $perPage = (int) $request->query('perPage', 12);

    //     // ====> Handle "All products"
    //     if (strtolower($category) === "all products") {
    //         // Try to get all products from cache
    //         $allProducts = Cache::remember('allProducts', now()->addMinutes(10), function () {
    //             return Product::orderBy('created_at', 'desc')->get();
    //         });

    //         // Paginate the in-memory collection
    //         $paginated = $allProducts->slice(($page - 1) * $perPage, $perPage)->values(); // use values() to reset keys

    //         return response()->json([
    //             'code' => 'success',
    //             'message' => 'All products fetched successfully',
    //             'data' => [
    //                 'data' => $paginated,
    //                 'total' => $allProducts->count(),
    //                 'current_page' => $page,
    //                 'per_page' => $perPage,
    //             ],
    //         ]);
    //     }

    //     // ====> Handle filtered categories
    //     $categoryId = null;

    //     if ($category) {
    //         $categoryRecord = ProductsCategory::whereRaw('LOWER(name) = ?', [strtolower($category)])->first();
    //         if (!$categoryRecord) {
    //             return response()->json([
    //                 'code' => 'error',
    //                 'message' => 'Category not found',
    //                 'data' => [
    //                     'data' => [],
    //                     'total' => 0,
    //                     'current_page' => 1,
    //                     'per_page' => $perPage,
    //                 ],
    //             ]);
    //         }
    //         $categoryId = $categoryRecord->id;
    //     }

    //     $query = Product::orderBy('created_at', 'desc');
    //     if ($category === null) {
    //         $query->whereNull('category_id');
    //     } else {
    //         $query->where('category_id', $categoryId);
    //     }

    //     return $this->fetchAndPaginateProducts($query, $page, $perPage, "Filtered products fetched successfully");
    // }


    public function getAllProducts(Request $request) {
        $category = $request->query('productCategory');
        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('perPage', 12);
        // return $category;

        // ====> Handle "all"
        if (strtolower($category) === "all") {
            // Force result into a collection to avoid "slice on string" error
            $allProducts = collect(Cache::remember('allProducts', now()->addMinutes(10), function () {
                return Product::with('category')->orderBy('created_at', 'desc')->get()->toArray();
            }));

            // Paginate manually
            $paginated = $allProducts->slice(($page - 1) * $perPage, $perPage)->values();

            return response()->json([
                'code' => 'success',
                'message' => 'All products fetched successfully',
                'data' => [
                    'data' => $paginated,
                    'total' => $allProducts->count(),
                    'current_page' => $page,
                    'per_page' => $perPage,
                ],
            ]);
        }

        // ====> Handle filtered categories
        $categoryId = null;

        if ($category) {
            $categoryRecord = ProductsCategory::whereRaw('LOWER(name) = ?', [strtolower($category)])->first();
            if (!$categoryRecord) {
                return response()->json([
                    'code' => 'error',
                    'message' => 'Category not found',
                    'data' => [
                        'data' => [],
                        'total' => 0,
                        'current_page' => 1,
                        'per_page' => $perPage,
                    ],
                ]);
            }
            $categoryId = $categoryRecord->id;
        }

        $query = Product::with('category')->orderBy('created_at', 'desc');
        if ($category === null) {
            $query->whereNull('category_id');
        } else {
            $query->where('category_id', $categoryId);
        }

        return $this->fetchAndPaginateProducts($query, $page, $perPage, "Filtered products fetched successfully");
    }


    private function fetchAndPaginateProducts($query, $page, $perPage, $message){
        $totalProducts = $query->count();
        $products = $query->offset(($page - 1) * $perPage)->limit($perPage)->get();

        return response()->json([
            'code' => 'success',
            'message' => $message,
            'data' => [
                'data' => $products,
                'total' => $totalProducts,
                'current_page' => $page,
                'per_page' => $perPage,
            ],
        ]);
    }






    // public function getAllProducts(Request $request) {

    //     $category = (string)$request->query('productCategory');
    //     $categoryId = null;
    
    //     // Check if category is passed and set categoryId
    //     if ($category) {
    //         $categoryRecord = ProductsCategory::where('name', $category)->first();
    //         $categoryId = $categoryRecord ? $categoryRecord->id : null;
    //     }
    
    //     $page = (int)$request->query('page', 1); // Fallback to 1 if no page is passed
    //     $perPage = (int)$request->query('perPage', 12); // Fallback to 12 if no perPage is passed
    
    //     // Retrieve the products array from cache
    //     $cachedProducts = Cache::get('allProducts');
    //     if ($cachedProducts) {
    //         // Decode the products array
    //         $products = json_decode($cachedProducts, true);
    
    //         // Filter products by category if category is provided
    //         if ($categoryId) {
    //             $products = array_filter($products, function ($product) use ($categoryId) {
    //                 return $product['category_id'] == $categoryId;
    //             });
    //         }
    
    //         // Calculate total number of products
    //         $totalProducts = count($products);
    
    //         // Calculate pagination offset
    //         $offset = ($page - 1) * $perPage;
    
    //         // Slice the array to get the products for the current page
    //         $paginatedProducts = array_slice($products, $offset, $perPage);
    
    //         return response()->json([
    //             'code' => 'success',
    //             'message' => 'Products successfully fetched from cache',
    //             'data' => [
    //                 'data' => $paginatedProducts,
    //                 'total' => $totalProducts,
    //                 'current_page' => $page,
    //                 'per_page' => $perPage,
    //             ],
    //         ]);
    //     }
    
    //     // No product exists in the cache, query the database for products
    //     $allProducts = Product::orderBy('created_at', 'desc')->get()->toArray();
    
    //     // Save all products fetched to the cache
    //     Cache::put('allProducts', json_encode($allProducts, true));
    
    //     // If a category is passed, filter products by category
    //     if ($categoryId) {
    //         $allProducts = array_filter($allProducts, function ($product) use ($categoryId) {
    //             return $product['category_id'] == $categoryId;
    //         });
    //     }
    
    //     // Calculate total number of products
    //     $totalProducts = count($allProducts);
    
    //     // Calculate pagination offset
    //     $offset = ($page - 1) * $perPage;
    
    //     // Slice the array to get the products for the current page
    //     $paginatedProducts = array_slice($allProducts, $offset, $perPage);
    
    //     return response()->json([
    //         'code' => 'success',
    //         'message' => 'Products successfully fetched from the database',
    //         'data' => [
    //             'data' => $paginatedProducts,
    //             'total' => $totalProducts,
    //             'current_page' => $page,
    //             'per_page' => $perPage,
    //         ],
    //     ]);
    // }
    
    public function getSingleProduct(Request $request)
    {
        $productId = $request->query('productId');
    
        // Check if product exists in cache
        $cachedProduct = Cache::get("singleProduct_{$productId}");
        if ($cachedProduct) {
            return response()->json([
                "code" => "success",
                "message" => "Single product successfully retrieved from cache",
                "data" => json_decode($cachedProduct, true), // Decode JSON before returning
            ]);
        }
    
        // If not in cache, fetch from the database 
        try {
            $fetchedProduct = Product::with('category')->find($productId);
    
            if ($fetchedProduct) {
                // Convert to array before caching
                $productArray = $fetchedProduct->toArray();
    
                // Save the product in the cache (expiration time: 1 day)
                Cache::put("singleProduct_{$productId}", json_encode($productArray), 1440);
    
                return response()->json([
                    "code" => "success",
                    "message" => "Single product successfully retrieved from database",
                    "data" => $productArray, // Return the array format
                ]);
            } else {
                return response()->json([
                    "message" => "Product could not be retrieved",
                    "code" => "error",
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                "message" => "Product could not be retrieved",
                "code" => "error",
                "reason" => $e->getMessage(),
            ]);
        }
    }

    public function updateProduct(Request $request)
    {
        try {

            /*
            ========================
            VALIDATION
            ========================
            */
            $request->validate([
                'productName'   => 'required|string',
                'category_id'   => 'required|exists:products_category,id',
                'productPrices' => 'required|string',
            ]);

            // Validate files dynamically
            foreach ($request->files as $key => $file) {
                if (str_starts_with($key, 'subImage') || $key === 'productImage') {
                    $request->validate([
                        $key => 'image|max:1024' // 1MB
                    ]);
                }
            }

            /*
            ========================
            FIND PRODUCT
            ========================
            */
            $productId = $request->query('productId');
            $product = Product::findOrFail($productId);

            /*
            ========================
            DECODE PRICES
            ========================
            */
            $productPrices = json_decode($request->productPrices, true);

            if (!is_array($productPrices)) {
                return response()->json([
                    "code" => "error",
                    "message" => "Invalid product prices format"
                ]);
            }

            foreach ($productPrices as $item) {
                if (
                    empty($item['size']) ||
                    empty($item['price'])
                ) {
                    return response()->json([
                        "code" => "error",
                        "message" => "Each size must have a corresponding price"
                    ]);
                }
            }

            /*
            ========================
            MAIN IMAGE
            ========================
            */
            if ($request->hasFile('productImage')) {

                if ($product->mainProductMedia) {
                    $oldId = $this->getPublicIdFromUrl($product->mainProductMedia);
                    if ($oldId) Cloudinary::destroy($oldId);
                }

                $product->mainProductMedia = $this->uploadToCloudinary(
                    $request->file('productImage')
                );
            }

            /*
            ========================
            SUB MEDIA (DYNAMIC)
            ========================
            */
            $finalSubMedia = [];

            // Loop through ALL request keys
            foreach ($request->all() as $key => $value) {

                // Match subImageX
                if (preg_match('/^subImage(\d+)$/', $key, $matches)) {

                    $index = $matches[1];
                    $fileKey = "subImage{$index}";
                    $oldKey  = "subImage{$index}_oldUrl";

                    // Case 1: New file uploaded
                    if ($request->hasFile($fileKey)) {

                        // delete old if exists
                        if ($request->has($oldKey)) {
                            $oldUrl = $request->input($oldKey);
                            $oldId = $this->getPublicIdFromUrl($oldUrl);
                            if ($oldId) Cloudinary::destroy($oldId);
                        }

                        $uploadedUrl = $this->uploadToCloudinary(
                            $request->file($fileKey)
                        );

                        $finalSubMedia[] = $uploadedUrl;
                    }

                    // Case 2: Keep old image
                    elseif ($request->has($oldKey)) {
                        $finalSubMedia[] = $request->input($oldKey);
                    }
                }
            }

            // Also handle old images that were sent WITHOUT new file
            foreach ($request->all() as $key => $value) {
                if (preg_match('/^subImage(\d+)_oldUrl$/', $key)) {

                    $index = str_replace(['subImage', '_oldUrl'], '', $key);
                    $fileKey = "subImage{$index}";

                    // If no new file, keep old
                    if (!$request->hasFile($fileKey)) {
                        $finalSubMedia[] = $value;
                    }
                }
            }

            /*
            ========================
            UPDATE PRODUCT
            ========================
            */
            $product->productName   = $request->productName;
            $product->category_id   = $request->category_id;
            $product->productPrices = $productPrices; // cast handles JSON
            $product->subMedia      = array_values(array_unique($finalSubMedia)); // clean + reindex

            $product->save();

            /*
            ========================
            CACHE UPDATE
            ========================
            */
            Cache::put("singleProduct_{$productId}", $product, now()->addDay());

            $cachedProducts = Cache::get('allProducts');

            if ($cachedProducts) {
                $cachedProducts = collect($cachedProducts);

                $index = $cachedProducts->search(function ($item) use ($product) {
                    return $item['id'] === $product->id;
                });

                if ($index !== false) {
                    $cachedProducts[$index] = $product->toArray();
                }

                Cache::put('allProducts', $cachedProducts->toArray(), now()->addWeek());
            }

            /*
            ========================
            RESPONSE
            ========================
            */
            return response()->json([
                "code" => "success",
                "message" => "Product updated successfully",
            ]);

        } catch (\Exception $e) {

            return response()->json([
                "code" => "error",
                "message" => "An error occurred while updating product",
                "reason" => $e->getMessage()
            ]);
        }
    }
    


    // public function updateProduct(Request $request){
    //     try{
    //         $request->validate([
    //             'productImage' => 'required|string',
    //             'productName' => 'required|string',
    //             'productPrice12Inches' => 'required|numeric',
    //             'productPrice14Inches' => 'required|numeric',
    //             'productPrice16Inches' => 'required|numeric',
    //             'productPrice18Inches' => 'required|numeric',
    //             'productPrice20Inches' => 'required|numeric',
    //             'productPrice22Inches' => 'required|numeric',
    //             'productPrice24Inches' => 'required|numeric',
    //             'productPrice26Inches' => 'required|numeric',
    //             'productPrice28Inches' => 'required|numeric',

    //         ]);
    //         $productId = $request->query('productId');
    //         $product = Product::where('id', $productId)->first();
            
    //         //if newProductImage, newSubImage1, newSubImage2, or newSubImage3 exists, there is an intention to update the image
    
    //         // Process Product Image
    //         if ($request->hasFile('productImage')) {
    //             // Check if there is an existing product image
    //             if ($product->productImage) {
    //                 // Delete old product image from Cloudinary
    //                 $oldProductImagePublicId = $this->getPublicIdFromUrl($product->productImage);
    //                 if ($oldProductImagePublicId) {
    //                     Cloudinary::destroy($oldProductImagePublicId);
    //                 }
    //             }
    
    //             // Upload new product image to Cloudinary
    //             $newProductImage = $this->uploadToCloudinary($request->file('productImage'));
    
    //             // Update the product image in the database
    //             $product->productImage = $newProductImage;
    //         }
    
    //         // Process Sub Image 1
    //         if ($request->hasFile('subImage1')) {
    //             if ($product->subImage1) {
    //                 $oldSubImage1PublicId = $this->getPublicIdFromUrl($product->subImage1);
    //                 if ($oldSubImage1PublicId) {
    //                     Cloudinary::destroy($oldSubImage1PublicId);
    //                 }
    //             }
    
    //             $newSubImage1 = $this->uploadToCloudinary($request->file('subImage1'));
    //             $product->subImage1 = $newSubImage1;
    //         }
    
    //         // Process Sub Image 2
    //         if ($request->hasFile('subImage2')) {
    //             if ($product->subImage2) {
    //                 $oldSubImage1PublicId = $this->getPublicIdFromUrl($product->subImage2);
    //                 if ($oldSubImage2PublicId) {
    //                     Cloudinary::destroy($oldSubImage2PublicId);
    //                 }
    //             }
    
    //             $newSubImage2 = $this->uploadToCloudinary($request->file('subImage2'));
    //             $product->subImage2 = $newSubImage2;
    //         }
    
    //         // Process Sub Image 3
    //         if ($request->hasFile('subImage3')) {
    //             if ($product->subImage3) {
    //                 $oldSubImage3PublicId = $this->getPublicIdFromUrl($product->subImage3);
    //                 if ($oldSubImage3PublicId) {
    //                     Cloudinary::destroy($oldSubImage3PublicId);
    //                 }
    //             }
    
    //             $newSubImage3 = $this->uploadToCloudinary($request->file('subImage3'));
    //             $product->subImage3 = $newSubImage3;
    //         }
    
    //         //process the product price
    //         // if($request->has('productName')){
    //         //     // Update the name in the database
    //         //     $product->productName = $request->input('productName');
    //         // }
    
    //         // //process the product price
    //         // if($request->has('productPrice12Inches')){
    //         //     // Update the price in the database
    //         //     $product->productPrice = $request->input('productPrice');
    //         // }

    //         $product->productName = $request->input('productName');
    //         $product->productPrice12Inches = $request->input('productPrice12Inches');
    //         $product->productPrice14Inches = $request->input('productPrice14Inches');
    //         $product->productPrice16Inches = $request->input('productPrice16Inches');
    //         $product->productPrice18Inches = $request->input('productPrice18Inches');
    //         $product->productPrice20Inches = $request->input('productPrice20Inches');
    //         $product->productPrice22Inches = $request->input('productPrice22Inches');
    //         $product->productPrice24Inches = $request->input('productPrice24Inches');
    //         $product->productPrice26Inches = $request->input('productPrice26Inches');
    //         $product->productPrice28Inches = $request->input('productPrice28Inches');



    
    //         // Save the updated product in the database
    //         $product->save();
    //         $product->refresh();

    //         //update the cache to hold the current data
    //         $allProducts = Product::orderBy('created_at', 'desc')->get()->toArray();
    //         // Cache::put('allProducts', json_encode($allProducts, true));
    //         Cache::put('allProducts', $allProducts, now()->addWeek(1));
    //         Cache::put("singleProduct_{$productId}", $product, 1440); //expiry date of 1 day in minutes

        
    
    //         return response()->json([
    //             "code" => "success",
    //             "message" => "Product updated successfully",
    //         ]);
    //     }catch(Exception $e){
    //         return response()->json([
    //             "code" => "error",
    //             "message" => "An error occured while updating product",
    //             "reason" => $e->getMessage()
    //         ]);
    //     }

        
    // }

    // function getPublicIdFromUrl($secureUrl){
    //     // First, remove the base URL (domain, resource type, etc.)
    //     $urlParts = parse_url($secureUrl);
        
    //     // Extract the path from the URL
    //     $path = $urlParts['path'];

    //     // Remove '/image/upload/' from the path
    //     $pathWithoutBase = str_replace('/image/upload/', '', $path);

    //     // Split the path into version and public_id with format (e.g., 'v1312461204/sample.jpg')
    //     $pathParts = explode('/', $pathWithoutBase);

    //     // Remove the version part (e.g., 'v1312461204')
    //     array_shift($pathParts);

    //     // Get the public_id with the file extension (e.g., 'sample.jpg')
    //     $publicIdWithExtension = implode('/', $pathParts);

    //     // Remove the file extension (e.g., '.jpg')
    //     $publicId = pathinfo($publicIdWithExtension, PATHINFO_FILENAME);

    //     return $publicId;
    // }


    public static function getPublicIdFromUrl($secureUrl, $subFolder = null) {
        // Parse the URL
        $urlParts = parse_url($secureUrl);
        
        // Extract the path from the URL
        $path = $urlParts['path'];
        
        // Remove '/image/upload/' from the path
        $pathWithoutBase = str_replace('/image/upload/', '', $path);
        
        // Split the path into parts
        $pathParts = explode('/', $pathWithoutBase);
        
        // Remove the version part (first element)
        array_shift($pathParts); // Remove the version part
        
        // Remove the last part (the file name with extension)
        $fileNameWithExtension = array_pop($pathParts); // Get the file name
        $publicIdWithoutExtension = pathinfo($fileNameWithExtension, PATHINFO_FILENAME); // Get just the file name without extension
        
        // Return the public ID being preceeded by the public Id
        return env('FOLDER_FOR_IMAGES_IN_CLOUDINARY') . ($subFolder ? '/' . $subFolder : '') . '/' . $publicIdWithoutExtension;
    }
// public static function getPublicIdFromUrl($secureUrl) {
//     $urlParts = parse_url($secureUrl);
//     $path = $urlParts['path'];

//     // Remove '/image/upload/' base path
//     $pathWithoutBase = str_replace('/image/upload/', '', $path);

//     // Split path into parts
//     $pathParts = explode('/', $pathWithoutBase);

//     // Remove version part if present
//     if (preg_match('/^v\d+$/', $pathParts[0])) {
//         array_shift($pathParts);
//     }

//     // Remove file extension from last part
//     $fileNameWithExtension = array_pop($pathParts);
//     $fileName = pathinfo($fileNameWithExtension, PATHINFO_FILENAME);

//     // Rebuild public ID with all subfolders intact
//     $publicId = count($pathParts) ? implode('/', $pathParts) . '/' . $fileName : $fileName;

//     return $publicId; // Do NOT prepend anything
// }










    public function deleteProduct(Request $request){
        try{
            //extract the id
            $productId = $request->input('productToDelete.id');

            //fetch the product in the database using the id gotten
            $productToDelete = Product::find($productId);

            //delete the product image
            $productImage = $productToDelete->productImage;
            if($productImage){
                //extract the public id and use it to delete the product in cloudinary
                $publicId = $this->getPublicIdFromUrl($productImage);
                //public id extracted...next, delete product image in cloudinary
                $response = Cloudinary::destroy($publicId);
            }

            //delete the product sub image 1
            $subImage1 = $productToDelete->subImage1;
            if($subImage1){
                //extract the public id and use it to delete the product in cloudinary
                $publicId = $this->getPublicIdFromUrl($subImage1);
                //public id extracted...next, delete product image in cloudinary
                Cloudinary::destroy($publicId, ['invalidate' => true]);

                
            }

            //delete the product sub image 2
            $subImage2 = $productToDelete->subImage2;
            if($subImage2){
                //extract the public id and use it to delete the product in cloudinary
                $publicId = $this->getPublicIdFromUrl($subImage2);
                //public id extracted...next, delete product image in cloudinary
                Cloudinary::destroy($publicId);
            }

            //delete the product sub image 3
            $subImage3 = $productToDelete->subImage3;
            if($subImage3){
                //extract the public id and use it to delete the product in cloudinary
                $publicId = $this->getPublicIdFromUrl($subImage3);
                //public id extracted...next, delete product image in cloudinary
                Cloudinary::destroy($publicId);
            }

            $productToDelete->delete();

            // delete the single product from cache
            Cache::forget("singleProduct_{$productId}");
            
            //delete successful, fetch all products and save to cache
            $newProducts = Product::orderBy('created_at', 'desc')->get()->toArray();
            Cache::put("allProducts", json_encode($newProducts, true));



            return response()->json([
                "code" => "success",
                "message" => "Product deleted successfully",
            ]);
        }catch(\Exception $e){
            return response()->json([
                "code" => "error",
                "message" => "An error occured while deleting product",
                "reason" => $e->getMessage()
            ]);
        }
    }
    // $products = Product::where('productName', 'LIKE', '%' . $query . '%')->get();
    // return response()->json([
    //                 'code' => 'success',
    //                 'message' => 'Products successfully retrieved',
    //                 'data' => $products
    //             ]);

    // public function searchProducts(Request $request){
    //     $query = $request->query('query');
        
    //     // Get products from cache if available
    //     $cachedProducts = Cache::get('allProducts');
    
    //     if ($cachedProducts) {
    //         // Filter cached products based on the query
    //         $filteredProducts = $this->filterProducts(collect($cachedProducts), $query);
            
    //         return response()->json([
    //             'message' => 'Products successfully retrieved from cache',
    //             'code' => 'success',
    //             'data' => $filteredProducts
    //         ]);
    //     } else {
    //         // Query the database if products are not found in cache
    //         $products = Product::where('productName', 'LIKE', '%' . $query . '%')->get()->toArray();
    
    //         // Cache all products for future requests
    //         // Cache::put('allProducts', $products);
    
    //         return response()->json([
    //             'message' => 'Products successfully retrieved from database',
    //             'code' => 'success',
    //             'data' => $products
    //         ]);
    //     }
       
    // }
public function searchProducts(Request $request){
    $query = $request->query('query');
    $query = strtolower(trim($query));
    
    $cachedProducts = Cache::get('allProducts');

    if ($cachedProducts) {
        $filteredProducts = $this->filterProducts(collect($cachedProducts), $query);

        return response()->json([
            'message' => 'Products retrieved from cache',
            'code' => 'success',
            'data' => $filteredProducts
        ]);
    } else {
        $products = Product::all()->toArray(); // full product list
        Cache::put('allProducts', $products, now()->addDay(1));  // optional

        $filteredProducts = $this->filterProducts(collect($products), $query);

        return response()->json([
            'message' => 'Products retrieved from database',
            'code' => 'success',
            'data' => $filteredProducts
        ]);
    }
}

private function filterProducts($products, $query) {
    // return $products->filter(function ($product) use ($query) {
    //     $productName = strtolower(trim($product['productName']));
    //     $words = preg_split('/[\s,\-\/]+/', $productName, -1, PREG_SPLIT_NO_EMPTY);

    //     foreach ($words as $word) {
    //         if (strpos($word, $query) === 0) {
    //             return true;
    //         }
    //     }

    //     return false;
    // })->values()->toArray();

    return $products->filter(function ($product) use ($query) {
        $productName = strtolower(trim($product['productName']));
        $words = preg_split('/[\s,\-\/]+/', $productName, -1, PREG_SPLIT_NO_EMPTY);

        foreach ($words as $word) {
            if (strpos($word, $query) === 0) {
                return true;
            }
        }

        return false;
    })
    ->take(10) // ✅ Limit results to 10
    ->values()
    ->toArray();

}

    
    // private function filterProducts($products, $query) {
    //     return $products->filter(function($product) use ($query) {
    //         // return stripos($product['productName'], $query) !== false;
    //         return stripos($product['productName'], $query) === 0;

    //     })->values()->toArray();
    // }

    public function getProductDetails(Request $request){
        $arrayOfIds = $request->query('ids');
        //retrive products from cache
        // $cachedProducts = json_decode(Cache::get('allProducts'), true);
        $cachedProducts = Cache::get('allProducts');
        if ($cachedProducts) {
            // Filter the cached products to only those whose ID is in $arrayOfIds
            $matchedProducts = array_filter($cachedProducts, function ($product) use ($arrayOfIds) {
                return in_array($product['id'], $arrayOfIds); // Check if product id exists in arrayOfIds
            });

            // Reset keys to ensure it's seen as an indexed array
            $matchedProducts = array_values($matchedProducts);
    
            return response()->json([
                'message' => 'product details successfully retrieved from cache',
                'code' => 'success',
                'data' => $matchedProducts
            ]);
        }
        //no product in cache, query the database for products
        $allProducts = Product::all()->toArray();

        // Filter the products to only those whose ID is in $arrayOfIds
        $matchedProducts = array_filter($allProducts, function ($product) use ($arrayOfIds) {
            return in_array($product['id'], $arrayOfIds); // Check if product id exists in arrayOfIds
        });

        return response()->json([
            'message' => 'product details successfully retrieved from database',
            'code' => 'success',
            'data' => $matchedProducts
        ]);
    }

    // $query = $request->query('query');
    
    // // Assume $products contains the results of your search
    // $products = Product::where('productName', 'LIKE', '%' . $query . '%')->get();

    // return response()->json([
    //     'message' => 'Product successfully retrieved',
    //     'code' => 'success',
    //     'data' => $products
    // ]);


    
    // $queryWords = explode(' ', strtolower($query)); // Split query into words
    
    // Check cache first
    // $cachedProducts = Cache::get('products');

    // if ($cachedProducts) {
    //     // Filter products from the cache
    //     $filteredProducts = $this->filterProducts($cachedProducts, $queryWords);
    //     return response()->json([
    //         'message' => 'Product successfully retrieved',
    //         'code' => 'success',
    //         'data' => $filteredProducts
    //     ]);
    // } else {
    //     // Fetch products from the database if not in cache
    //     $responseData = $this->getAllProducts($request);

    //     // Decode the response data
    //     $response = $responseData->getData();
        // if ($response->code === 'success') {
        //     $cachedProducts = $response->data; // Extract data from the response
        //     $filteredProducts = $this->filterProducts($cachedProducts, $queryWords);
        //     return response()->json([
        //         'message' => 'Product successfully retrieved',
        //         'code' => 'success',
        //         'data' => $filteredProducts
        //     ]);
        // } else {
        //     // Handle the error if products could not be retrieved
        //     return response()->json([
        //         'code' => 'error',
        //         'message' => 'An error occurred while retrieving products',
        //         'reason' => $response->reason
        //     ]);
        // }
    // }


    // private function filterProducts($products, $queryWords)
    // {
    //     return array_filter($products, function($product) use ($queryWords) {
    //         foreach ($queryWords as $word) {
    //             if (stripos($product['productName'], $word) !== false) {
    //                 return true;
    //             }
    //         }
    //         return false;
    //     });
    // }

}
