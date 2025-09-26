<?php



namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use HTMLPurifier;
use HTMLPurifier_Config;

use App\Models\Pages;
use Illuminate\Support\Facades\Redis;


class EditPagesController extends Controller
{
    //
    public function index(Request $request){
        try{

            $validator = Validator::make($request->all(), [
                'content' => 'required|string|min:10', // Ensure content is not empty and has minimum length
                'page' => 'required|string|in:shippingPolicy,refundPolicy,deliveryPolicy'
            ]);
            // If validation fails
            if ($validator->fails()) {
                return response()->json([
                    'code' => 'error',
                    'message' => 'Oops! There was a problem with your input',
                    'errors' => $validator->errors()
                ]);
            }
    
    
            $page = trim($request->input('page'));
            // Get the raw CKEditor content
            $rawContent = trim($request->input('content'));
    
            // Sanitize the HTML content (using HTMLPurifier for example)
            $config = HTMLPurifier_Config::createDefault();
            $purifier = new HTMLPurifier($config);
            $sanitizedContent = $purifier->purify($rawContent);
    
            // Find the page by identifier
            $pageContent = Pages::where('page', $page)->first();
    
            if (!$pageContent) {
                return response()->json([
                    'code' => 'error',
                    'message' => $page . ' page not found',
                ]);
            }
    
            // Save sanitized content
            $pageContent->content = $sanitizedContent;
            $pageContent->save();
    
            // Optional: Update cache
            $cacheKey = "pages.{$page}.content";
            Cache::put($cacheKey, $sanitizedContent, now()->addDays(1));
    
    
            return response()->json([
                'code' => 'success',
                'message' => $page . ' updated successfully',
            ]);
        }catch(\Exception $e){
            \Log::error('Error updating page: ' . $e->getMessage());

            return response()->json([
                'code' => 'error',
                'message' => 'An unexpected error occurred, please try again later '
            ]);
        }
        
    }
}































