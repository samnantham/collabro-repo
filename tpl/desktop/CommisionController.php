<?php

namespace App\Http\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Database\Query\Builder;
use App\Models\NotificationMessage;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\ProductListing;
use App\Models\CommisionItem;
use Illuminate\Http\Response;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Models\Commision;
use App\Models\User;
use Carbon\Carbon;
use Validator;

class CommisionController extends Controller
{

    public function __construct(Commision $model)
    {   
        try
        {
            $this->user = JWTAuth::parseToken()->authenticate();
            $this->model = $model;
        }catch (TokenExpiredException $e) 
        {}catch (TokenInvalidException $e) 
        {}catch (JWTException $e) 
        {}
    }

    public function store(Request $request)
    {
        $rules = array(
            'productid' => 'required',
            'ownerid' => 'required',
            'buyerid' => 'required',
            'productdetails' => 'required',
            'status' => 'required'
        );

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) 
        {
            $messages = $validator->messages();
            return response()->json(['message'=>$messages],401);
        }
        if(!empty($request->commisionid)){
            $this->model = $this->model->find($request->commisionid);
        }

        $product = ProductListing::find($request->productid);

        $this->model->ownerid = $request->ownerid;
        $this->model->buyerid = $request->buyerid;
        $this->model->productid = $request->productid;
        $this->model->ownercommisionstatus = !empty($request->ownercommisionstatus) ? $request->ownercommisionstatus : 0;
        $this->model->buyercommisionstatus = !empty($request->buyercommisionstatus) ? $request->buyercommisionstatus : 0;
        if($request->status == 2){
            $this->model->reason = !empty($request->reason) ? $request->reason : '';
            $this->model->comments = !empty($request->comments) ? $request->comments : '';
        }

        $hasbargain = 0;
        $this->model->status = $request->status;
        if($this->user->id == $request->ownerid){
            if($request->ownercommisionstatus == 3){
                $request->ownercommisionstatus = 0;
            }
            $this->model->status = $request->ownercommisionstatus;
        }
        if ($this->model->save()) {
            if($this->user->id != $request->ownerid){
                $userid = $request->ownerid;
                $fromid = $request->buyerid;
            }else{
                $userid = $request->buyerid;
                $fromid = $request->ownerid;
            }
            $notification = Notification::where('userid',$userid)->where('fromid',$fromid)->where('productid',$request->productid)->where('notificationtype',1)->first();
            if(!$notification){
                $notification = new Notification;
            }
            $notificationmessage = new NotificationMessage;
            if($this->user->id != $request->ownerid){
                $notification->notificationclass = 2;
            }else{
                $notification->notificationclass = 1;
            }
            $notification->userid = $userid;
            $notification->fromid = $fromid;
            $notification->productid = $request->productid;
            $notification->notificationtype = 1;
            $notification->isdeleted = 0;
            $notification->status = 0;
            if($this->user->id != $request->ownerid){
                $buyer = User::find($request->buyerid);
                if($request->status == 2){
                    $notificationmessage->type = 0;
                    $notificationmessage->message = '['.ucfirst($buyer->username).'] has rejected your offer';
                    $notificationmessage->notificationclass = 4;
                    $notification->notificationclass = 4;
                    $notificationclass = 4;
                    $mymessage = 'You rejected this offer';
                }else if($request->status == 1){
                    $notificationmessage->type = 1;
                    if($product->type == 'Service'){
                        $notificationmessage->message = 'Congratulations! ['.ucfirst($buyer->username).'] has accepted your offer';
                        $mymessage = 'Congratulations! you accepted this offer';
                    }else if($product->type == 'Shop'){
                        $notificationmessage->message = 'Congratulations! ['.ucfirst($buyer->username).'] has confirmed your purchase';
                        $mymessage = 'Congratulations! you confirmed this purchase';
                    }else if($product->type == 'Rental'){
                        $notificationmessage->message = 'Congratulations! ['.ucfirst($buyer->username).'] has confirmed your booking';
                        $mymessage = 'Congratulations! you confirmed this booking';
                    }else{
                        $notificationmessage->message = 'Congratulations! ['.ucfirst($buyer->username).'] has confirmed your registration'; 
                        $mymessage = 'Congratulations! you confirmed this registration';
                    }
                    $notificationmessage->notificationclass = 1;
                    $notification->notificationclass = 1;
                    $notificationclass = 1;
                }else{
                    $notificationmessage->type = 1;
                    $notificationmessage->notificationclass = 2;
                    $notification->notificationclass = 2;
                    if($request->isnew){
                        if(!$request->iscounter){
                            if($product->type == 'Service'){
                                $notificationmessage->message = 'You have been commissioned by ['.ucfirst($buyer->username).']';
                            }else if($product->type == 'Shop'){
                                $notificationmessage->message = '['.ucfirst($buyer->username).']   would like to purchase your item';
                            }else if($product->type == 'Rental'){
                                $notificationmessage->message = '['.ucfirst($buyer->username).']  would like to made a booking';
                            }else{
                                $notificationmessage->message = '['.ucfirst($buyer->username).'] would like to register your event';
                            }

                        }else{
                            $notificationmessage->message = '['.ucfirst($buyer->username).'] would like to negotiate with you';   
                            $notification->notificationclass = 5;
                            $notificationmessage->notificationclass = 5;
                            $notificationclass = 5;
                            $hasbargain = 1;
                        }
                    } 
                    else{
                        
                        $notificationmessage->message =  '['.ucfirst($buyer->username).'] would like to negotiate with you'; 
                        $mymessage = 'You would like to negotiate this offer';  
                        $notification->notificationclass = 5;
                        $notificationmessage->notificationclass = 5;
                        $notificationclass = 5;
                        $hasbargain = 1;
                    }
                    
                    //$notificationmessage->message = 'Buyer('.$buyer->username.') replied to your service request';

                }
               
            }else{
                $seller = User::find($request->ownerid);
                if($request->status == 2){
                    $notificationmessage->type = 0;
                    $notificationmessage->message = '['.ucfirst($seller->username).'] has rejected your offer';
                    $notificationmessage->notificationclass = 4;
                    $notification->notificationclass = 4;
                    $notificationclass = 4;
                    $mymessage = 'You rejected this offer';
                }else if($request->status == 1){
                    $notificationmessage->type = 1;
                    if($product->type == 'Service'){
                        $notificationmessage->message = 'Congratulations! ['.ucfirst($seller->username).'] has accepted your offer';
                        $mymessage = 'Congratulations! you accepted this offer';
                    }else if($product->type == 'Shop'){
                        $notificationmessage->message = 'Congratulations! ['.ucfirst($seller->username).'] has confirmed your purchase';
                        $mymessage = 'Congratulations! you confirmed this purchase';
                    }else if($product->type == 'Rental'){
                        $notificationmessage->message = 'Congratulations! ['.ucfirst($seller->username).'] has confirmed your booking';
                        $mymessage = 'Congratulations! you confirmed this booking';
                    }else{
                        $notificationmessage->message = 'Congratulations! ['.ucfirst($seller->username).'] has confirmed your registration'; 
                        $mymessage = 'Congratulations! you confirmed this registration';
                    }
                    $notificationmessage->notificationclass = 1;
                    $notification->notificationclass = 1;
                    $notificationclass = 1;
                    User::find($request->buyerid)->increment('noofdeals');
                    User::find($request->ownerid)->increment('noofdeals');
                }else{
                    $notificationmessage->type = 0;
                    $notification->notificationclass = 5;
                    $notificationmessage->notificationclass = 5;
                    $notificationclass = 5;
                    $notificationmessage->message = '['.ucfirst($seller->username).'] would like to negotiate with you';
                    $mymessage = 'You would like to negotiate this offer';  
                    $hasbargain = 1;
                }
            }
            $commisionitem = new CommisionItem;
            $commisionitem->commisionid = $this->model->id;
            $commisionitem->userid = $this->user->id;
            $commisionitem->productdetails = $request->productdetails;
            $commisionitem->has_bargained = $hasbargain;
            $commisionitem->save();

            $notification->save();
            $notificationmessage->itemid = $commisionitem->id;
            $notificationmessage->notificationid = $notification->id;
            $notificationmessage->status = 0;
            $notificationmessage->save();
            if(!empty($request->commisionid)){
                $commisions = CommisionItem::where('commisionid',$request->commisionid)->where('userid',$this->user->id)->pluck('id');
                foreach ($commisions as $key => $value) {
                    $return_notification_msg = NotificationMessage::where('itemid',$value)->first();
                    $return_notification_msg->notificationclass = $notificationclass;
                    $return_notification_msg->message = $mymessage;
                    $return_notification_msg->save();
                    
                    $return_notification = Notification::find($return_notification_msg->notificationid);
                    $return_notification->notificationclass = $notificationclass;
                    $return_notification->save();
                }
            }
            $message = '';
            if($request->productdetails['type'] == 'Service'){
                $message = 'Item Commisioned Successfully';
            }else if($request->productdetails['type'] == 'Shop'){
                $message = 'Item Bought Successfully';
            }else if($request->productdetails['type'] == 'Rental'){
                $message = 'Item Registered Successfully';
            }else if($request->productdetails['type'] == 'Event'){
                $message = 'Item Booked Successfully';
            }
            return response()->json(['message'=>$message],200);
        }

        throw new HttpException(400, "Invalid data");
    }

    public function commisionitem($id,$isaccord = null){
        $item =  CommisionItem::find($id);
        $data = Commision::with(['owner','buyer'])->find($item->commisionid);
        if($isaccord == null){
            $item = CommisionItem::where('commisionid',$item->commisionid)->orderby('updated_at','desc')->first();
        }
        if(!$data->status){
            $data->isreplied = 0;
            if($data->ownerid == $this->user->id){
                if($data->ownercommisionstatus == 3){
                    $data->isreplied = 1;
                }
            }if($data->buyerid == $this->user->id){
                if($data->buyercommisionstatus == 3){
                    $data->isreplied = 1;
                }
            }
        }
        $data->commisionitem = $item;
        $data->isnew = 0;
        $isfirst = CommisionItem::where('commisionid',$item->commisionid)->orderby('created_at','desc')->first();
        if($isfirst->id == $id){
            $data->isnew = 1; 
        }
        return $data;
    }
}
