<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Chart;

class ChartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $filePath = storage_path('app/data.json');

        if (!file_exists($filePath)) {
            $this->command->error("data.json file not found.");
            return;
        }

        $json = file_get_contents($filePath);
        $data = json_decode($json, true);

        foreach ($data as $date => $ips) {
            // Convert ISO or any input format to d-m-Y
            // $formattedDate = \Carbon\Carbon::parse($date)->format('d-m-Y');
            $formattedDate = \Carbon\Carbon::parse($date)->format('Y-m-d');  // ISO format expected by DB

        
            Chart::updateOrCreate(
                ['date' => $formattedDate],
                ['ips' => $ips]
            );
        }
        
    }
}
