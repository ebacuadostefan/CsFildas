<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // List notifications
    public function index()
    {
        return Notification::orderBy('created_at', 'desc')->get();
    }

    // Mark single notification as read
    public function markAsRead($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->is_read = true;
        $notification->save();

        return response()->json(['message' => 'Notification marked as read']);
    }

    // Mark all as read
    public function markAllAsRead()
    {
        Notification::where('is_read', false)->update(['is_read' => true]);
        return response()->json(['message' => 'All notifications marked as read']);
    }

    // Delete a notification
    public function destroy($id)
    {
        Notification::findOrFail($id)->delete();
        return response()->json(['message' => 'Notification deleted']);
    }
}
