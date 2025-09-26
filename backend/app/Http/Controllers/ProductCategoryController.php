<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Exception;
use App\Models\ProductsCategory; 
use App\Http\Controllers\ProductController;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;


class ProductCategoryController extends Controller
{
    //
    public function createCategory(Request $request) {
        try {
            $request->validate([
                'newCategory' => 'required|string',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048'
            ]);
    
            // Check if category already exists
            $existingCategory = ProductsCategory::where('name', $request->newCategory)->first();
            if ($existingCategory) {
                return response()->json([
                    'code' => 'error',
                    'message' => 'Product Category exists  already'
                ]);
            }
    
            // Upload image (guaranteed to be present)
            $imageFile = $request->file('image');
            $imageUrl = ProductController::uploadToCloudinary($imageFile); // or self::uploadToCloudinary
            if (!$imageUrl) {
                return response()->json([
                    'code' => 'error',
                    'message' => 'Failed to upload image. Please try again.'
                ]);
            }


    
            // Create category
            $createCategory = ProductsCategory::create([
                'name' => $request->newCategory,
                'image' => $imageUrl
            ]);
    
            // Cache updated categories
            $allCategories = ProductsCategory::all()->toArray();
            Cache::put('productCategories', $allCategories, now()->addWeek());
    
            return response()->json([
                'code' => 'success',
                'message' => 'Product Category created successfully',
                'data' => $createCategory
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'code' => 'error',
                'message' => "An error occurred: " . $e->getMessage()
            ]);
        }
    }
    


    public function editCategory(Request $request)
    {
        try {
            // Validate the input
            $request->validate([
                'oldCategory' => 'required|string',  // The existing category name
                'newCategory' => 'required|string',  // The new category name
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048' // Optional image
            ]);

            // Start a database transaction
            DB::beginTransaction();
            
            // Find the category by the old name
            $category = ProductsCategory::where('name', $request->oldCategory)->first();

            if (!$category) {
                DB::rollBack();
                return response()->json([
                    'code' => 'error',
                    'message' => "Product Category not found"
                ]);
            }
            
            // Check if the new name already exists (except if it's the same as the current one)
            $existingCategory = ProductsCategory::where('name', $request->newCategory)->first();
            if ($existingCategory && $existingCategory->id !== $category->id) {
                DB::rollBack();
                return response()->json([
                    'code' => 'error',
                    'message' => "A category with this name already exists"
                ]);
            }
            
            // If image is provided, delete the old image and upload the new one
            if ($request->hasFile('image')) {
                // Get the old image URL stored in the database
                $oldImageUrl = $category->image;
                
                // Delete the old image from Cloudinary if it exists
                if ($oldImageUrl) {
                    $publicId = ProductController::getPublicIdFromUrl($oldImageUrl);
                    $cloudinaryResponse = Cloudinary::destroy($publicId);
                    // Check if Cloudinary deletion was successful
                    if (isset($cloudinaryResponse['result']) && $cloudinaryResponse['result'] !== 'ok') {
                        // Rollback transaction if deletion fails
                        DB::rollBack();
                        return response()->json([
                            'code' => 'error',
                            'message' => "Failed to edit product category. Please retry."
                        ]);
                    }
                }
                
                // Upload the new image to Cloudinary
                $newImageUrl = ProductController::uploadToCloudinary($request->file('image'));

                if (!$newImageUrl) {
                    DB::rollBack();
                    return response()->json([
                        'code' => 'error',
                        'message' => 'Failed to upload new image. Please try again.'
                    ]);
                }

                // Update both the name and the new image URL
                $category->update([
                    'name' => $request->newCategory,
                    'image' => $newImageUrl
                ]);
            } else {
                // If no new image is provided, just update the name
                $category->update([
                    'name' => $request->newCategory
                ]);
            }

            // Refresh cache with the updated categories
            $allCategories = ProductsCategory::all()->toArray();
            Cache::put('productCategories', $allCategories, now()->addWeek()); // Cache for 7 days

            // Commit the transaction
            DB::commit();

            return response()->json([
                'code' => 'success',
                'message' => "Product Category updated successfully",
                'data' => $category
            ]);

        } catch (\Exception $e) {
            // Rollback the transaction in case of any errors
            DB::rollBack();
            return response()->json([
                'code' => 'error',
                'message' => "An error occurred while updating the product category: " . $e->getMessage()
            ]);
        }
    }


    public function deleteCategory(Request $request) {
        DB::beginTransaction();
        try {
            $request->validate([
                'category' => 'required|string'  // Expecting category name
            ]);
    
            // Find the category by name
            $category = ProductsCategory::where('name', $request->category)->first();
    
            // Check if category exists
            if (!$category) {
                return response()->json([
                    'code' => 'error',
                    'message' => "Product Category not found"
                ]);
            }
            $categoryImage = $category->image;
            $publicId = ProductController::getPublicIdFromUrl($categoryImage);
            $response = Cloudinary::destroy($publicId);

            // Check if Cloudinary deletion was successful
            if (isset($response['result']) && $response['result'] !== 'ok') {
                // Rollback transaction if deletion fails
                DB::rollBack();
                return response()->json([
                    'code' => 'error',
                    'message' => "Failed to delete product category. Please retry."
                ]);
            }
    
            // Delete the category
            $category->delete();

            // Commit the transaction if everything succeeds
            DB::commit();
    
            // Refresh cache after deleting
            $allCategarories = ProductsCategory::all()->toArray();
            Cache::put('productCategories', $allCategories, now()->addWeek()); // Cache for 7 days
    
            return response()->json([
                'code' => 'success',
                'message' => "Product Category deleted successfully"
            ]);
    
        } catch (Exception $e) {

            // Rollback the transaction if anything fails
            DB::rollBack();
            return response()->json([
                'code' => 'error',
                'message' => "An error occurred while deleting the product category: " . $e->getMessage()
            ]);
        }
    }
    
    
    
}
