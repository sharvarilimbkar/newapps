<?php
error_reporting( E_ALL );
ini_set( 'display_errors', 1 );

defined('BASEPATH') OR exit('No direct script access allowed');


// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH . 'libraries/REST_Controller.php';

class OCTM extends REST_Controller
{
    function __construct() {
        parent::__construct();

		if (isset($_SERVER['HTTP_ORIGIN']))
		 {
			
			header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
 		    header('Access-Control-Allow-Credentials: true');
  		    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
  		    header("Access-Control-Allow-Headers: Content-Type, Content-Length, Accept-Encoding,X-Custom-Header");   
   			header('Access-Control-Max-Age: 86400');    // cache for 1 day

   		if ( "OPTIONS" === $_SERVER['REQUEST_METHOD'] )
			 {
    			die();
   			 }
		}
       // $this->load->helper('url'); 		
		$this->load->database();
		$this->load->model('OCTM_model');
		//$this->load->library('SimpleExcel');
		
		$this->load->library('PHPExcel');
	}

	function createbatchid_post()
	{
		$params = json_decode(file_get_contents('php://input'),true);
		$types = $this->OCTM_model->createbatchid($params['batchId'],$params['clgdate'],$params['categoryid'],$params['lotid'],$params['type']);
		return $this->set_response(array("status"=>"success","message"=>"List of All Indexing Types","result"=>$types));	
	}
	
	function createbatchid1_post()
	{
		$params = json_decode(file_get_contents('php://input'),true);
		$types = $this->OCTM_model->createbatchid1($params['batchId'],$params['clgdate'],$params['lotid'],$params['type']);
		return $this->set_response(array("status"=>"success","message"=>"List of All Indexing Types","result"=>$types));	
	}
 
	function getcheckrange_get($cardnumber)
	{	
		$types = $this->OCTM_model->getcheckrange($cardnumber);
		return $this->set_response(array("status"=>"success","message"=>"ALL CATEGORIES","result"=>$types));
	}
		function getlotcategory_get($batchId,$clgdate,$type)
	{	
		$types = $this->OCTM_model->getlotcategory($batchId,$clgdate,$type);
		return $this->set_response(array("status"=>"success","message"=>"ALL CATEGORIES","result"=>$types));
	}
	function getserialnumber_get($batchId,$clgdate,$lotnumber,$type)
	{	
		$types = $this->OCTM_model->getserialnumber($batchId,$clgdate,$lotnumber,$type);
		return $this->set_response(array("status"=>"success","message"=>"ALL CATEGORIES","result"=>$types));
	}
	function getbatchfinish_get($batchId,$clgdate,$lotnumber,$type)
	{	
		$types = $this->OCTM_model->getbatchfinish($batchId,$clgdate,$lotnumber,$type);
		return $this->set_response(array("status"=>"success","message"=>"ALL CATEGORIES","result"=>$types));
	}
	function getbatch_get($batchId)
	{	
		$types = $this->OCTM_model->getbatch($batchId);
		return $this->set_response(array("status"=>"success","message"=>"ALL CATEGORIES","result"=>$types));
	}
	function startentry_post()
	{
		$params = json_decode(file_get_contents('php://input'),true);
		$types = $this->OCTM_model->startentry();
		return $this->set_response(array("status"=>"success","message"=>"List of All Indexing Types","result"=>$types));	
	}
	function startOtherEntry_post()
	{
		$params = json_decode(file_get_contents('php://input'),true);
		$types = $this->OCTM_model->startotherentry();
		return $this->set_response(array("status"=>"success","message"=>"List of All Indexing Types","result"=>$types));	
	}
	
	function getbankname_get($micr)
	{	
		$types = $this->OCTM_model->getbankname($micr);
		return $this->set_response(array("status"=>"success","message"=>"Branch name is","result"=>$types));
	}
	function getreport_get($clgdate,$lotnumber)
	{	
		$types = $this->OCTM_model->getreport($clgdate,$lotnumber);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getbatchslip_get($batchId,$clgdate,$lotnumber)
	{	
		$types = $this->OCTM_model->getbatchslip($batchId,$clgdate,$lotnumber);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getuserreport_get()
	{	
		$types = $this->OCTM_model->getuserreport();
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getcategoryreport_get()
	{	
		$types = $this->OCTM_model->getcategoryreport();
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getdailymisAllLot_get($clgdate,$MIS)
	{	
		$types = $this->OCTM_model->getdailymisAllLot($clgdate,$MIS);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}//for All lot MIS and Summary
	function getdailymisOneLot_get($clgdate,$lotnumber,$MIS)
	{	
		$types = $this->OCTM_model->getdailymisOneLot($clgdate,$lotnumber,$MIS);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}//for One lot MIS and Summary
	function getdailymisSummary_get($clgdate,$lotnumber)
	{	
		$types = $this->OCTM_model->getdailymisSummary($clgdate,$lotnumber);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}//for One lot Summary
	
	function getlotreport_get($clgdate,$lotnumber)
	{	
		$types = $this->OCTM_model->getlotreport($clgdate,$lotnumber);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getrejection_get($clgdate,$lotnumber)
	{	
		$types = $this->OCTM_model->getrejection($clgdate,$lotnumber);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getoutstation_get($clgdate,$lotnumber,$batchId)
	{	
		$types = $this->OCTM_model->getoutstation($clgdate,$lotnumber,$batchId);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getsolId_get($solId)
	{	
		$types = $this->OCTM_model->getsolId($solId);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getmicrcode_get($micrCode)
	{	
		$types = $this->OCTM_model->getmicrcode($micrCode);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function last_get($user,$batchId,$clgdate)
	{	
		$types = $this->OCTM_model->last($user,$batchId,$clgdate);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function lastother_get($user,$batchId,$clgdate)
	{	
		$types = $this->OCTM_model->lastother($user,$batchId,$clgdate);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function checkdate_get()
	{	
		$types = $this->OCTM_model->checkdate();
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getcreditmis_get($clgdate,$lotnumber)
	{	
		$types = $this->OCTM_model->getcreditmis($clgdate,$lotnumber);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getshowlist_get($batchId,$clgDate,$user)
	{	
		$types = $this->OCTM_model->getshowlist($batchId,$clgDate,$user);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getshowlist1_get($batchId,$user,$clgDate)
	{	
		$types = $this->OCTM_model->getshowlist1($batchId,$user,$clgDate);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getshowlist2_get($user)
	{	
		$types = $this->OCTM_model->getshowlist2($user);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getdatemaster_get()
	{	
		$types = $this->OCTM_model->getdatemaster();
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getdatemaster1_get()
	{	
		$types = $this->OCTM_model->getdatemaster1();
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getsecondpass_get($lotnumber,$clgdate,$batchId)
	{	
		$types = $this->OCTM_model->getsecondpass($lotnumber,$clgdate,$batchId);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getallsecondpass_get($lotnumber,$clgdate,$usercode)
	{	
		$types = $this->OCTM_model->getallsecondpass($lotnumber,$clgdate,$usercode);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function deleterecord_get($batchId,$lotnumber,$serialNumber,$clgdate)
	{	
		$types = $this->OCTM_model->deleterecord($batchId,$lotnumber,$serialNumber,$clgdate);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function deleteotherrecord_get($batchId,$lotnumber,$serialNumber,$clgdate)
	{	
		$types = $this->OCTM_model->deleteotherrecord($batchId,$lotnumber,$serialNumber,$clgdate);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function updatesecondpass_get($batchId,$serialNumber,$secondpassdata)
	{	
		$types = $this->OCTM_model->updatesecondpass($batchId,$serialNumber,$secondpassdata);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getallsecondpass2_get($lotnumber,$clgdate,$usercode)
	{	
		$types = $this->OCTM_model->getallsecondpass2($lotnumber,$clgdate,$usercode);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getsecondpassallocate_get($batchId,$clgdate,$lotnumber,$user,$type)
	{	
		$types = $this->OCTM_model->getsecondpassallocate($batchId,$clgdate,$lotnumber,$user,$type);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getsecondpass2_get($lotnumber,$clgdate,$batchId,$userId)
	{	
		$types = $this->OCTM_model->getsecondpass2($lotnumber,$clgdate,$batchId,$userId);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function updatesecondpass2_get($batchId,$serialNumber,$secondpassdata)
	{	
		$types = $this->OCTM_model->updatesecondpass2($batchId,$serialNumber,$secondpassdata);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	
	function exportBatchWiseSlipText_post()
	{
		$params = json_decode(file_get_contents('php://input'),true);
		//sprint_r($params);
		$types = $this->OCTM_model->exportBatchWiseSlipText($params);
		return $this->set_response(array("status"=>"success","message"=>"List of All Indexing Types","result"=>$types));	
	}
	
	function getmisAllReport_get($batchId,$clgdate,$lotnumber)
	{	
		$types = $this->OCTM_model->getmisAllReport($batchId,$clgdate,$lotnumber);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	
	function getDataentryReport_get($batchId,$clgdate,$lotnumber)
	{	
		$types = $this->OCTM_model->getDataentryReport($batchId,$clgdate,$lotnumber);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	
	function getamountLog_get($clgdate,$category,$lotNo)
	{	
		$types = $this->OCTM_model->getamountLog($clgdate,$category,$lotNo);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	
	function getCreditCardSlipreport_get($clgdate,$category,$batchId)
	{	
		$types = $this->OCTM_model->getCreditCardSlipreport($clgdate,$category,$batchId);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	
	function genarateCreditCardSlipText_post()
	{
		$params = json_decode(file_get_contents('php://input'),true);
		//sprint_r($params);
		$types = $this->OCTM_model->genarateCreditCardSlipText($params);
		return $this->set_response(array("status"=>"success","message"=>"List of All Indexing Types","result"=>$types));	
	}
	
	function genarateExcel_post()
	{
		$params = json_decode(file_get_contents('php://input'),true);
		//sprint_r($params);
		$types = $this->OCTM_model->genarateExcel($params);
		return $this->set_response(array("status"=>"success","message"=>"List of All Indexing Types","result"=>$types));	
	}
	
	function getreplaceBatchAndLotNumber_get($clgdate,$lotNumber,$batchId,$newclgdate,$newlotNumber,$newbatchId,$chequeEntry,$otherChequeEntry)
	{	
		$types = $this->OCTM_model->getreplaceBatchAndLotNumber($clgdate,$lotNumber,$batchId,$newclgdate,$newlotNumber,$newbatchId,$chequeEntry,$otherChequeEntry);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	
	function deleteBatch_get($clgdate,$lotNumber,$batchId,$chequeEntry,$otherChequeEntry)
	{	
		$types = $this->OCTM_model->deleteBatch($clgdate,$lotNumber,$batchId,$chequeEntry,$otherChequeEntry);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	
	function getbatchStatus_get($clgdate,$lotNumber)
	{	
		$types = $this->OCTM_model->getbatchStatus($clgdate,$lotNumber);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getdailyOutput_get($fromDate,$toDate,$morethanlakh,$chequeNo)
	{	
		$types = $this->OCTM_model->getdailyOutput($fromDate,$toDate,$morethanlakh,$chequeNo);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getproductivityreport_get($fromDate,$toDate)
	{	
		$types = $this->OCTM_model->getproductivityreport($fromDate,$toDate);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function gethourlyproductivityreport_get($selectDate)
	{	
		$types = $this->OCTM_model->gethourlyproductivityreport($selectDate);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getchequebookrequestMIS_get($requestdate)
	{	
		$types = $this->OCTM_model->getchequebookrequestMIS($requestdate);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getcategoryBillingReport_get($Month)
	{	
		$types = $this->OCTM_model->getcategoryBillingReport($Month);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getdrwaeePayeeBillingReport_get($Month)
	{	
		$types = $this->OCTM_model->getdrwaeePayeeBillingReport($Month);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getuserEntryBillingReport_get($Month)
	{	
		$types = $this->OCTM_model->getuserEntryBillingReport($Month);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getGenerateReport_get($clgDate,$rejectionType,$lotNumber,$batchId,$company)
	{	
		$types = $this->OCTM_model->getGenerateReport($clgDate,$rejectionType,$lotNumber,$batchId,$company);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	
	function getGenerateTEXT_get($clgDate,$rejectionType,$lotNumber){
		//echo "json0---".$json;
		$types = $this->OCTM_model->generateTEXT($clgDate,$rejectionType,$lotNumber);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getGenerateTEXTCts_get($clgDate,$lotNumber,$batchId,$company){
		//echo "json0---".$json;
		$types = $this->OCTM_model->generateTEXTCts($clgDate,$lotNumber,$batchId,$company);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getGenerateTEXTPatti_get($clgDate,$rejectionType,$lotNumber,$batchId,$company){
		//echo "json0---".$json;
		$types = $this->OCTM_model->generateTEXTPatti($clgDate,$rejectionType,$lotNumber,$batchId,$company);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	
	function getNRECheque_get($accountNumber2){
		$types = $this->OCTM_model->getNRECheque($accountNumber2);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
	function getbatchStatusForSecondPass_get($clgdate,$lotNumber)
	{	
		$types = $this->OCTM_model->getbatchStatusForSecondPass($clgdate,$lotNumber);
		return $this->set_response(array("status"=>"success","message"=>"data for report","result"=>$types));
	}
}


?>