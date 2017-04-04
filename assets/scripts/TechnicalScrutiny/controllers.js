bpoApps.controller("TechnicalScrutinyReasonsController",function($scope,coreTable,ngTableParams,$filter,$timeout,toastr)
{	

	$scope.showNew = false;
	
	$scope.Reasons = Array();

	$scope.Reason = new coreTable();
	
	$scope.getReasons = function(){
			$scope.Reasons = coreTable.get({"tbl":"tsreasonmaster,tsreasontype","whr":" and tsreasonmaster.type=tsreasontype.typeId"});
			
			$scope.Reasons.$promise.then(function(result){
				$scope.Reasons = result.result;
				$scope.tableParams.reload();	
			});
	}
		
		
	$scope.tableParams = new ngTableParams(
		{
			debugMode: true,
			page: 1, 
			count: 10,
			sorting: {
					reasonId: 'desc',
					reason: 'desc'
			},
			filter: {
				reasonId: '',
				reason: ''
			}
		}, 
		{
				total: $scope.Reasons.length,
				getData: function ($defer, params) {
					
				   var filteredData = params.filter() ? $filter('filter')($scope.Reasons, params.filter()) : $scope.Reasons;
				   var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData; 
				   params.total(orderedData.length);
				   
				   $defer.resolve($scope.data = orderedData.slice((params.page() -1) * params.count(), params.page() * params.count())); 
				}
		});

	$scope.newReason = function(){
		$scope.Reason.val = Object();
		$scope.Reason.primary = Object();
		$scope.showNew = true;
	}
	
	$scope.submitReason = function(){
		$scope.Reason.table = "tsreasonmaster";
		$scope.Reason.$save(function(response){
				$scope.getReasons();
				$scope.showNew = false;
				toastr.success('Reason saved successfully!', 'Done')
		});
	}
	
	$scope.getReason = function(reason){
 
		$scope.Reason.val = {  "reasonName":reason.reasonName, "type":reason.type};
		$scope.Reason.primary = {"reasonId":reason.reasonId};
		$scope.showNew = true;
	}
	
	$scope.deleteReason = function(reason){
		coreTable.delete({ "tbl": "tsreasonmaster", "delkey":"reasonId", "delval":reason.reasonId}, function() {
				toastr.success('Reason deleted successfully!', 'Done')			
		$scope.getReasons();
	  });
		
	}
	
	$timeout(function(){
		$scope.getReasons();	
	});
	
});

bpoApps.controller("TechnicalScrutiny_dataEntry",function($scope,$filter,Sections,Fields,Upload,$timeout,$routeParams,$rootScope,TSEndEntry,TSStartEntry,Process,toastr,CORE_CONFIG,WEB_API,Batch,CSVImport,UpdateStatus,
$parse,$http, getmicrcode,PreviousRecord,NextRecord,focus,sessionService)
{	
$scope.convertNumberToWords = function(amount) {
    var words = new Array();
    words[0] = '';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    amount = amount.toString();
    var atemp = amount.split(".");
	var index = 0;
	//var words=[];
	var number;
	var n_length;
	var words_string = "";
    while(index < 2)
	{
		number = atemp[index].split(",").join("");
		n_length = number.length;
		if (n_length <= 9) 
		{
			var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
			var received_n_array = new Array();
			for (var i = 0; i < n_length; i++) {
				received_n_array[i] = number.substr(i, 1);
			}
			for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
				n_array[i] = received_n_array[j];
			}
			for (var i = 0, j = 1; i < 9; i++, j++) {
				if (i == 0 || i == 2 || i == 4 || i == 7) {
					if (n_array[i] == 1) {
						n_array[j] = 10 + parseInt(n_array[j]);
						n_array[i] = 0;
					}
				}
			}
			value = "";
			for (var i = 0; i < 9; i++) {
				if (i == 0 || i == 2 || i == 4 || i == 7) {
					value = n_array[i] * 10;
				} else {
					value = n_array[i];
				}
				if (value != 0) {
					words_string += words[value] + " ";
				}
				if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
					words_string += "Crores ";
				}
				if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
					words_string += "Lakhs ";
				}
				if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
					words_string += "Thousand ";
				}
				if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
					words_string += "Hundred and ";
				} else if (i == 6 && value != 0) {
					words_string += "Hundred ";
				}
			}
			
			words_string = words_string.split("  ").join(" ");
			
		}
		//words[index]=words_string.split("  ").join(" ");
		if(index == 0)
			words_string = words_string + " Rupees And ";
		else
		{
			var tmpVar = words_string.split('And');
			console.log(">>>>>>>>" + tmpVar[1]);
			if(tmpVar[1] == ' ')
				words_string = words_string + " Zero Paise";
			else
				words_string = words_string + " Paise ";
		}
				
		index++;
		//words[index]=words_string;
	}
	return words_string;
	}
	$scope.options = { controls : { toolbar : true}};
	//$scope.overlays = [{ x : 600, y: 125, w:180, h:60,zoom:40}] ;
	$scope.getAllreason = Array();
	$scope.formdata = {};
	$scope.reasonName = "";
	$scope.isStarted=false;
	$scope.formdata.tsdataentry__reasonId = {};
	$scope.formdata.tsdataentry__chequeDate ="";
	$scope.formdata.tsdataentry__amount ="";
	$scope.formdata.tsdataentry__payeeName ="";
	$scope.isPrev=false;
	$scope.isNext=false;
	$scope.pending = 0; 
	$scope.staleDate = $scope.pdcDate = $scope.clgDate = "";
  	$scope.bankName="";
	$scope.processField = {};
	$scope.prev=true;
	$scope.nextRec=false;
	$scope.amount = "";
	$scope.msg=""
	/*$scope.getAllItems = function(data, datalist, accessor, scopevar)
	{
		var lblaccessor = accessor;
		$scope.formdata[lblaccessor]={};
		var tmp = $parse(datalist);
		tmp.assign($scope, data);
		accessor = "formdata['"+accessor+"']";
		var accessor = $parse(accessor);
		angular.forEach(data, function(value, key) {
			if(value[scopevar] == $scope.formdata[scopevar]){ 
				accessor.assign($scope, {"selectedItem":value});
			}
		});	
	}*/
	$scope.getAllItems = function(data, datalist, accessor, scopevar){
		// SCOPEVAR IS DBVAL
			var lblaccessor = accessor;
			if($scope.formdata[lblaccessor]!=null){
				if($scope.formdata[lblaccessor].selectedItem == null){
					if($scope.formdata[lblaccessor] == ""){
						$scope.formdata[lblaccessor]={};	
					}
					 
				}
			}
			else{
				$scope.formdata[lblaccessor]={};	
			}
			
			
			
			var tmp = $parse(datalist) ;
			tmp.assign($scope, data);

			accessor = "formdata['"+accessor+"']";
			var accessor = $parse(accessor); 
			angular.forEach(data, function(value, key) {
				

				if($scope.formdata[lblaccessor] != null){
					if($scope.formdata[lblaccessor].selectedItem != null){
						if(value[scopevar] == $scope.formdata[lblaccessor].selectedItem[scopevar]  ){  

							accessor.assign($scope, {"selectedItem":value});
								console.log("accessors123selecteditem----->"+JSON.stringify($scope.formdata))
						}				
					}
					else if($scope.formdata[lblaccessor] != ""){
						if(value[scopevar] == $scope.formdata[lblaccessor] ){  //||  $routeParams.process == 1|| 1==1			
							$scope.formdata[lblaccessor] = {};
							accessor.assign($scope, {"selectedItem":value});
									console.log("accessors123----->"+JSON.stringify($scope.formdata))	
							}	
					}
				}
			});
			 
			
		}

	$scope.sections = Sections.get({"id":"29"});
		
	$scope.sections.$promise.then(function(result){
		$scope.sections = result.result;
		
	angular.forEach(result.result, function(value, key) {
			var fields = Array();
			$scope.sections[key].fields = Array();
			
			$scope.sections[key].sortedFields = Array([],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]);
			$scope.getSectionRenderer(value,key);	
		});
	}); 
	
	$scope.getSectionRenderer = function(section,sectionIndex){

		 $scope.fields = Fields.get({"id":0,"sectionId":section.sectionId}); //all core fields
		 $scope.fields.$promise.then(function(result){
				$scope.sections[sectionIndex].fields = result.result;
		 		angular.forEach(result.result, function(value, key) {
			      sessionService.remove(value.fieldId);	
					$scope.sections[sectionIndex].sortedFields[value.row].push(value) ;
				});
		 });
	}
	
	$scope.ProcessId = $routeParams.process;
	
	$scope.process = Process.get({"id":$scope.ProcessId});
	
	$scope.process.$promise.then(function(result){
		$scope.process = result.result[0]; //processId, processName, nextProcessId, dataValidationProcess
	});
	
	if($scope.ProcessId == 10)	
		$scope.overlays = [{x : 85, y: 105, w:500, h:60, color:'#000000'}] ;	
	if($scope.ProcessId == 9)
		$scope.overlays = [{x : 590, y: 135, w:190, h:40, color:'#000000'}] ;
		
		
	
	$scope.fileInput="";
	$scope.isValid=true;
	$scope.isAmountValid=true;
	$scope.user1="";
	$scope.user2="";
	
	//Ng-blur events for validating wrong entry for data
	$scope.fireEvent = function(field) 
	{
		
		
		if($scope.ProcessId == 11 || $scope.ProcessId == 12)
		{
			if(field == 'tsdataentry__amount')
			{
				if($scope.formdata.tsdataentry__amount.includes(".")==false)
				{
					$scope.formdata.tsdataentry__amount=$scope.formdata.tsdataentry__amount+".00";
				}
			}
		}
		
		if($scope.ProcessId == 10 || $scope.ProcessId == 12 || $scope.ProcessId == 11)
		{
				
				if(field == 'tsdataentry__amount')
				{
				//	alert($scope.ProcessId)
					$scope.isAmountValid=true;
					$scope.EndEntry();
				}
		}
		
		if($scope.ProcessId == 9)
		{
			if(field == 'tsdataentry__amount')
			{
				if($scope.formdata.tsdataentry__amount.includes(".")==false)
				{
					$scope.formdata.tsdataentry__amount=$scope.formdata.tsdataentry__amount+".00";
				}
				if($scope.formdata.tsdataentry__amount != $scope.amount)
				{
					$scope.isAmountValid=false;
					   toastr.warning('Amount mismatch!', 'Alert!');
					  focus('tsdataentry__amount');
				}
				else
				{
					if($scope.formdata.tsdataentry__payeeName != null)
					{
						$scope.isAmountValid=true;
						$scope.EndEntry();
					}
					else
					{
						 toastr.error('PayeeName Empty', 'Alert!');
						$scope.isAmountValid=false;
						$timeout(function(){
								$("#581").focus();	
							 }, 500);
					}	
				}					
			}
			
			if(field == 'tsdataentry__chequeDate')
			{	$scope.splitdate=$scope.formdata.tsdataentry__chequeDate.split("/");
//alert($scope.splitdate[1]);
				if($scope.splitdate[1]>12)
				{
					toastr.error("Invalid month")
					
								$timeout(function(){
								$("#580").focus();	
							 }, 500);
				}
				else if($scope.splitdate[0]>31)
				{
					toastr.error("Invalid date")
					$timeout(function(){
								$("#580").focus();	
							 }, 500)
				}else{
			
				
				$scope.sDate = $scope.staleDate.split('/');
				$scope.sDate = $scope.sDate[2]+'/'+$scope.sDate[1]+'/'+$scope.sDate[0];
				$scope
				.pDate = $scope.pdcDate.split('/');
				$scope.pDate= $scope.pDate[2]+'/'+$scope.pDate[1]+'/'+$scope.pDate[0];					
				$scope.chequeDate = $scope.formdata.tsdataentry__chequeDate.split('/');
				$scope.chequeDate = $scope.chequeDate[2]+'/'+$scope.chequeDate[1]+'/'+$scope.chequeDate[0];
				if($scope.chequeDate > $scope.pDate)
				{	
					$scope.msg="Date is greater than PDC date"
				 	$scope.isValid=false;						
					toastr.warning('Date is greater than PDC date!', 'Alert!');
				//	focus('tsdataentry__chequeDate');
				}
				else if( $scope.chequeDate < $scope.sDate)	
				{
					$scope.msg="Date is greater than PDC date"
					$scope.isValid=false;
					toastr.warning('Date is smaller than Stale date!', 'Alert!');
				//	focus('tsdataentry__chequeDate');
				}
				else
				{$scope.msg=""
					$scope.isValid=true;}
				
				}
			}
			
		}			
		/*else if( $scope.ProcessId == 12 )
		{	
			if(field == 'tsdataentry__amount')
			{
				if(( $scope.formdata.tsdataentry__amount != response.result.result[1][0].amount1 ) && 
				   ( $scope.formdata.tsdataentry__amount != response.result.result[1][0].amount2 ))
				
						toastr.warning('Amount mismatch!', 'Alert!');
						focus('tsdataentry__amount');
				}
			}
			*/
					
	}
		
	//Cheque date from db : needs to convert in DD-MM-YYYY format
	$scope.myDate = function(chequeDate,flag)
	{	//alert(chequeDate);
		$scope.myDate1 = $scope.cYr = $scope.cMnth = $scope.tmpMnth = $scope.cDate = "";
		$scope.cDate = chequeDate.toString();
		
		if(flag == 1)
		{
			//DD-MM-YYYY
			$scope.cYr = ($scope.cDate.split('-')[0]);
			$scope.cMnth = ($scope.cDate.split('-')[1]);
			$scope.cDate = ($scope.cDate.split('-')[2]);
			$scope.myDate1 = $scope.cDate + '/' + $scope.cMnth + '/' + $scope.cYr;
		}
		else if(flag == 2)
		{
			//YYYY-MM-DD
			$scope.cYr = ($scope.cDate.split('/')[2]);
			$scope.tmpEndMnth = ($scope.cDate.split('/')[0]);
			$scope.cMnth = ($scope.cDate.split('/')[1]);
			$scope.cDate = ($scope.tmpEndMnth.split(',')[0]);
			$scope.myDate1 =  $scope.cYr + '-' + $scope.cMnth + '-' + $scope.cDate;
		}
		else
		{
			$scope.cYr = ($scope.cDate.split('/')[2]);
			console.log("Yr" + $scope.cYr);
			$scope.cMnth = ($scope.cDate.split('/')[1]);
			console.log("Mnth" + $scope.cMnth);
			$scope.cDate = ($scope.cDate.split('/')[0]);
			console.log("Date" + $scope.cDate);
			$scope.myDate1 =  $scope.cDate + '/' + $scope.cMnth + '/' + $scope.cYr;
		}
		return $scope.myDate1;
	}
	
	$scope.$watch(function(){
  		  return $scope.formdata.tsdataentry__payeeName;
 		 }, function(newvalue, oldvalue){
			$scope.formdata.tsdataentry__payeeName=newvalue.toUpperCase();
				  },true);
	
	$scope.StartEntry=function()	
	{
		$scope.pdcDate = new Date();	  
		$scope.pdcDate.setDate($scope.pdcDate.getDate()+ 2);
		$scope.staleDate = new Date();	
		$scope.staleDate.setDate($scope.staleDate.getDate()- 90);
		
		$scope.pdcDate = $filter('date')($scope.pdcDate,"dd/MM/yyyy");
		$scope.staleDate = $filter('date')($scope.staleDate,"dd/MM/yyyy");
		
		$scope.startEntry=TSStartEntry.get({"processId":$scope.ProcessId,"userId":$rootScope.SESS_USER.userId});
		
		$scope.startEntry.$promise.then(function(response)
		{
			$scope.formdata.tsdataentry__startDate=$filter('date')(new Date(),"yyyy-MM-dd HH:mm:ss");
			$scope.formdata.tsdataentry__processId=$scope.ProcessId;
			$scope.formdata.tsdataentry__userId=$rootScope.SESS_USER.userId;
				if(response.result[0].uploadChequesId==null )
				{
					
					if($scope.ProcessId==12)
					{
						$scope.updateStatus=UpdateStatus.get();
						$scope.updateStatus.$promise.then(function(response)
						{
							console.log("update status"+JSON.stringify(response))
						})
					}
					//$scope.isStarted=false;
					toastr.info('No more records!','Alert');
					$http.get(CORE_CONFIG.SERVER_IP+"\\storage\\apps\\Cheque.tif",{responseType: "blob"}).success(function(data) 			 {
 				 
				 	var file = new File([data], "a.jpg", {type: "image/tiff"});
					$scope.fileInput = file;
					$scope.overlays={};
					});
					
				}
				
				if(response.status=="success")
				{	
						if($scope.ProcessId == 10 || $scope.ProcessId == 12 || $scope.ProcessId == 11)
						{
							var payeename = document.getElementsByName("Payee Name")[0];
						$timeout(function(){
							payeename.focus();
					   }, 500);
						}
						else
						{
							$timeout(function(){
								$("#580").focus();
							}, 100);
						}
						$scope.isStarted=true;
						$scope.insertId = response.result[0].id;
						$scope.formdata.tsdataentry__uploadChequesId=response.result[0].uploadChequesId;
					 if($scope.ProcessId == 11)
					{ 
						//$scope.formdata.tsdataentry__startQc = $filter('date')(new Date(),"yyyy-MM-dd HH:mm:ss");
						$scope.user1 = response.result[0].fullNameD1;
						$scope.amount = response.result[0].amount1;
						$scope.amountD1 = response.result[0].amount;
						$scope.amountD2 = response.result[0].amountD2;
						$scope.date1 = response.result[0].chequeDate;
						$scope.formdata.tsdataentry__chequeDate = $scope.myDate($scope.date1,1);
						$scope.formdata.tsdataentry__reasonId.selectedItem = $scope.getAllreason[response.result[0].reasonId -1];
						$scope.reasonName = $scope.formdata.tsdataentry__reasonId.selectedItem.reasonName;
						$scope.formdata.tsdataentry__amount=response.result[0].amount;
						console.log("---payee name"+JSON.stringify(response.result[0]));
						$scope.formdata.tsdataentry__status=1;
						$scope.word = $scope.convertNumberToWords($scope.amount); 
					
					}
				    else if($scope.ProcessId == 12)
					{
						
						console.log("---payee name"+JSON.stringify(response.result[0]));
						
						$scope.user1 = response.result[0].fullNameD1;
						$scope.user2 = response.result[0].fullNameD2;
						$scope.amount = response.result[0].bnkamount;
						$scope.amountD1 = response.result[0].amountD1;
						$scope.amountD2 = response.result[0].amountD2;
						$scope.date1 = response.result[0].chequeDate;
						$scope.formdata.tsdataentry__chequeDate = $scope.myDate($scope.date1,1);
						$scope.formdata.tsdataentry__reasonId.selectedItem = $scope.getAllreason[19];
					//	$scope.reasonName = $scope.formdata.tsdataentry__reasonId.selectedItem.reasonName;
					//	$scope.formdata.tsdataentry__pendingCheque=response.result[0].pendingCount
						$scope.formdata.tsdataentry__uploadChequesId=response.result[0].UploadChequesId;
						$scope.formdata.tsdataentry__totalCheque = response.result[0].totalCheque;
						$scope.formdata.tsdataentry__status=1;
						$scope.word = $scope.convertNumberToWords($scope.amount); 
					
					}
					
					
					$http.get(CORE_CONFIG.SERVER_IP+"\\storage\\apps\\technicalscrutiny\\input\\"+response.result[0].job+"\\"+response.result[0].batchNo+"\\"+response.result[0].imageName,{responseType: "blob"}).success(function(data) 			 {
 				 
				 	var file = new File([data], "a.jpg", {type: "image/jpeg"});
					$scope.fileInput = file;
					});
					focus('tsdataentry__payeeName');
					 if($scope.ProcessId == 9 || $scope.ProcessId == 10)
					 {
					$scope.amount =  response.result[0].amount;
					 }
					$scope.formdata.tsdataentry__chequeId  = response.result[0].chequeId;
					$scope.formdata.tsdataentry__accountNo = response.result[0].accountNo;
					$scope.formdata.tsdataentry__MICR  = response.result[0].MICR;
					$scope.formdata.tsdataentry__TC  = response.result[0].TC;
			
					$scope.formdata.tsdataentry__UDKNo   = response.result[0].UDKNo;
					$scope.formdata.tsdataentry__batchNo = response.result[0].batchNo;
					$scope.formdata.tsdataentry__payeeName = response.result[0].payeeName.toUpperCase() ;
					if($scope.ProcessId!=12)
					{
					$scope.formdata.tsdataentry__pendingCheque=response.result[0].pendingCount-1
					}
					else
					{
					//	$scope.formdata.tsdataentry__totalCheque = response.result[0].totalCheque
						$scope.formdata.tsdataentry__pendingCheque=response.result[0].pendingCheque
						
					}
					$scope.formdata.tsdataentry__totalCheque = response.result[0].total;
					$scope.formdata.tsdataentry__clgDate=response.result[0].recdDate;
					$scope.formdata.tsdataentry__chequeDate=response.result[0].chequeDate;				
					$scope.name=angular.copy($scope.formdata.tsdataentry__payeeName);
					$scope.clgDate =  $filter('date')(new Date($scope.formdata.tsdataentry__clgDate),"dd/MM/yyyy");	
					$scope.formdata.tsdataentry__staleDate  = $scope.staleDate;
					$scope.formdata.tsdataentry__clgDate  = $scope.clgDate;
					$scope.formdata.tsdataentry__pdcDate  = $scope.pdcDate;
					
					$scope.micr = getmicrcode.get({"micrCode":$scope.formdata.tsdataentry__MICR});
					
					$scope.micr.$promise.then(function(response){
					$scope.bankName = response.result[0].bankName;
					})
					
					
					
					
						
				}
		
				
		
		});
	}
	
	$scope.EndEntry=function()
	{
		console.log("Amount:::::::"+$scope.formdata.tsdataentry__amount)
		if($scope.formdata.tsdataentry__amount!="" && $scope.formdata.tsdataentry__amount!=".00")
		{
			console.log("in if");
			if(JSON.stringify($scope.formdata.tsdataentry__reasonId)=="{}")
				{
					$scope.formdata.tsdataentry__reasonId=20;
				}
			//end date 
			$scope.endDate=$filter('date')(new Date(),"yyyy-MM-dd HH:mm:ss");
			$scope.formdata.tsdataentry__chequeDate =$filter('date')(new Date($scope.formdata.tsdataentry__chequeDate),"yyyy-MM-dd");
			//$scope.formdata.tsdataentry__chequeDate =  $scope.myDate( $scope.formdata.tsdataentry__chequeDate, 2); //$filter('date')(new Date($scope.formdata.tsdataentry__chequeDate),"yyyy-MM-dd");
			$scope.formdata.tsdataentry__pdcDate = $scope.myDate($scope.formdata.tsdataentry__pdcDate, 2);
			$scope.formdata.tsdataentry__clgDate = $scope.myDate($scope.formdata.tsdataentry__clgDate, 2);
			$scope.formdata.tsdataentry__staleDate = $scope.myDate($scope.formdata.tsdataentry__staleDate, 2);
			
			//$scope.formdata.tsdataentry__staleDate =$filter('date')(new Date($scope.formdata.tsdataentry__staleDate),"yyyy-MM-dd"); 
			//$scope.formdata.tsdataentry__clgDate =$filter('date')(new Date($scope.formdata.tsdataentry__chequeDate),"yyyy-MM-dd");
			//$filter('date')($scope.formdata.tsdataentry__chequeDate , 2);
			
				$scope.formdata.tsdataentry__endDate = $scope.endDate;
				$scope.Field = new Fields();            
				$scope.Field.formData = $scope.formdata;

				angular.forEach($scope.Field.formData, function(value, key) {
					if(value != "undefined" && value != null)
					{
						if(value.selectedItem){
							$scope.Field.formData[key] = value.selectedItem.dbval;
						}
					}
				});
			if($scope.isPrev==false && $scope.isNext==false)
			{
			//save
				$scope.Field.whr = "";//and dataEntryId = "+ $scope.insertId;
			
			}
			else
			{
					$scope.Field.whr = "and dataEntryId = "+ $scope.insertId;
		
			}
			
			$scope.Field.$save(function (response) 
			{
				if($scope.isPrev==false && $scope.isNext==false)
				{
					toastr.success('Record saved successfully! ','Done');
					$scope.formdata.tsdataentry__reasonId ={};
					$scope.formdata.tsdataentry__chequeId  = "";
					$scope.formdata.tsdataentry__accountNo = "";
					$scope.formdata.tsdataentry__MICR  = "";
					$scope.formdata.tsdataentry__TC  = "";
					$scope.formdata.tsdataentry__UDKNo   = "";
					$scope.formdata.tsdataentry__batchNo = "";
					$scope.formdata.tsdataentry__payeeName = "";
					$scope.formdata.tsdataentry__pendingCheque = "";
					$scope.formdata.tsdataentry__staleDate  = "";
					$scope.formdata.tsdataentry__clgDate  = "";
					$scope.formdata.tsdataentry__pdcDate  = "";
					$scope.formdata.tsdataentry__amount="";
					$scope.formdata.tsdataentry__chequeDate="";
					$scope.formdata.tsdataentry__pendingCheque="";
					//$scope.fileInput={};
				 	var file = new File([], "a.jpg", {type: "image/jpeg"});
					$scope.fileInput = file;
				/*$http.get(CORE_CONFIG.SERVER_IP+"\\storage\\apps\\Cheque.tif",{responseType: "blob"}).success(function(data) 			 {
 				 
				 	var file = new File([data], "a.jpg", {type: "image/tiff"});
					$scope.fileInput = file;
					$scope.overlays={};
					});*/
					$scope.amount='';
					$scope.bankName='';
					$scope.amountD1='';
					$scope.amountD2='';
					$scope.user1='';
					$scope.user2='';
					$scope.name='';
					$scope.word='';
					$scope.prev=true;
					$scope.nextRec=true;
					$scope.StartEntry();
				
				}
				else
				{
					
					//alert("-----"+JSON.strngify($scope.formdata.tsdataentry__reasonId));
					toastr.success('Record saved successfully! ','Done');
				}
			
		});
		}
		else
		{
			console.log("in else");
			toastr.error("Amount To Be Entered");
				$timeout(function(){
				$("#582").focus();
				},300);		
		}
	}
	
	$scope.Previous=function()
	{
		
		if($scope.insertId==undefined)
		{
			$scope.insertId=0;
		}
		$scope.previous=PreviousRecord.get({"entryId":$scope.insertId,"userId":$rootScope.SESS_USER.userId,"processId":$scope.ProcessId})
		$scope.previous.$promise.then(function(response)
		{		
		console.log("clg ----->"+JSON.stringify(response));	
			if(response.result!="")
			{	
					$scope.nextRec=true;
					$scope.isPrev=true;
					$scope.isStarted=true;
					$http.get(CORE_CONFIG.SERVER_IP+"\\storage\\apps\\technicalscrutiny\\input\\"+response.result[0].job+"\\"+response.result[0].batchNo+"\\"+response.result[0].imageName,{responseType: "blob"}).success(function(data) 			 {
 				 
				 	var file = new File([data], "a.jpg", {type: "image/jpeg"});
					$scope.fileInput = file;
					});
					
					$scope.insertId=response.result[0].dataEntryId;
					$scope.formdata.tsdataentry__reasonId.selectedItem = $scope.getAllreason[response.result[0].reasonId -1];
					$scope.formdata.tsdataentry__chequeId  =response.result[0].chequeId;
					$scope.formdata.tsdataentry__accountNo = response.result[0].accountNo;
					$scope.formdata.tsdataentry__MICR  = response.result[0].MICR;
					$scope.formdata.tsdataentry__TC  =response.result[0].TC;
					$scope.formdata.tsdataentry__UDKNo =response.result[0].UDKNo;
					$scope.formdata.tsdataentry__batchNo =response.result[0].batchNo;
					$scope.formdata.tsdataentry__payeeName =response.result[0].payeeName.toUpperCase();
					$scope.formdata.tsdataentry__pendingCheque = response.result[0].pendingCheque;
					$scope.formdata.tsdataentry__staleDate  = response.result[0].staleDate;
					$scope.formdata.tsdataentry__clgDate  =response.result[0].clgDate;
					$scope.formdata.tsdataentry__pdcDate  =response.result[0].pdcDate;
					$scope.formdata.tsdataentry__amount=response.result[0].amount;
					$scope.formdata.tsdataentry__totalCheque=response.result[0].totalCheque;
					$scope.formdata.tsdataentry__chequeDate=$filter('date')(response.result[0].chequeDate,"dd/MM/yyyy");
					$scope.formdata.tsdataentry__staleDate=$filter('date')(response.result[0].staleDate,"dd/MM/yyyy");
					$scope.formdata.tsdataentry__clgDate=$filter('date')(response.result[0].clgDate,"dd/MM/yyyy");
					$scope.formdata.tsdataentry__pdcDate=$filter('date')(response.result[0].pdcDate,"dd/MM/yyyy");
			
					$scope.micr = getmicrcode.get({"micrCode":$scope.formdata.tsdataentry__MICR});
					$scope.micr.$promise.then(function(response){
					$scope.bankName = response.result[0].bankName;
					})
					$scope.name=angular.copy($scope.formdata.tsdataentry__payeeName);
						
			}
			else
			{
				toastr.info("Reached first record")
				$scope.prev=false;
				$scope.isPrev=false;
				$scope.isStarted=false;
			}
		})
	}

	$scope.Next=function()
	{
		$scope.next=NextRecord.get({"entryId":$scope.insertId,"userId":$rootScope.SESS_USER.userId,"processId":$scope.ProcessId})
			$scope.next.$promise.then(function(response)
			{
				console.log("next---->"+JSON.stringify(response))
				if(response.result!="")
				{
					$scope.prev=true;
					$scope.isNext=true;	
					$scope.isStarted=true;	
				$http.get(CORE_CONFIG.SERVER_IP+"\\storage\\apps\\technicalscrutiny\\input\\"+response.result[0].job+"\\"+response.result[0].batchNo+"\\"+response.result[0].imageName,{responseType: "blob"}).success(function(data) 			 {
						 
							var file = new File([data], "a.jpg", {type: "image/jpeg"});
							$scope.fileInput = file;
							});
					$scope.insertId=response.result[0].dataEntryId;
					$scope.formdata.tsdataentry__reasonId.selectedItem = $scope.getAllreason[response.result[0].reasonId -1];
					$scope.formdata.tsdataentry__chequeId  =response.result[0].chequeId;
					$scope.formdata.tsdataentry__accountNo = response.result[0].accountNo;
					$scope.formdata.tsdataentry__MICR  = response.result[0].MICR;
					$scope.formdata.tsdataentry__TC  =response.result[0].TC;
					$scope.formdata.tsdataentry__UDKNo =response.result[0].UDKNo;
					$scope.formdata.tsdataentry__batchNo =response.result[0].batchNo;
					$scope.formdata.tsdataentry__payeeName =response.result[0].payeeName.toUpperCase();
					$scope.formdata.tsdataentry__pendingCheque = response.result[0].pendingCheque;
					$scope.formdata.tsdataentry__staleDate  = response.result[0].staleDate;
					$scope.formdata.tsdataentry__clgDate  =response.result[0].clgDate;
					$scope.formdata.tsdataentry__pdcDate  =response.result[0].pdcDate;
					$scope.formdata.tsdataentry__amount=response.result[0].amount;
					//$scope.formdata.tsdataentry__chequeDate=response.result[0].chequeDate;
					$scope.formdata.tsdataentry__chequeDate=$filter('date')(response.result[0].chequeDate,"dd/MM/yyyy");
					$scope.formdata.tsdataentry__staleDate=$filter('date')(response.result[0].staleDate,"dd/MM/yyyy");
					$scope.formdata.tsdataentry__clgDate=$filter('date')(response.result[0].clgDate,"dd/MM/yyyy");
					$scope.formdata.tsdataentry__pdcDate=$filter('date')(response.result[0].pdcDate,"dd/MM/yyyy");
			$scope.formdata.tsdataentry__totalCheque=response.result[0].totalCheque;
					$scope.micr = getmicrcode.get({"micrCode":$scope.formdata.tsdataentry__MICR});
							$scope.micr.$promise.then(function(response){
							$scope.bankName = response.result[0].bankName;
							})
							$scope.name=angular.copy($scope.formdata.tsdataentry__payeeName);
				}
				else
				{
					toastr.info("Reached last record","Loading next record for you")
					$scope.nextRec=false;
					$scope.isPrev=false;
					$scope.isNext=false;
					$scope.isStarted=false;
					$scope.formdata.tsdataentry__reasonId={};
					$scope.formdata.tsdataentry__amount="";
					$scope.formdata.tsdataentry__chequeDate="";
					$scope.StartEntry();
				}
			})
		}
	})



bpoApps.controller("TechnicalScrutiny_uploadCheques",function($scope,Sections,Fields,Upload,$timeout,toastr,CORE_CONFIG,WEB_API,Batch,ImportTxt,Batch,$rootScope,$filter)
{	
	$scope.logs = "";
	$scope.currentFileName = "";
	$scope.currentRow = 0;
	$scope.formdata = {
			file: "",
			folder:""
		};
	$scope.file = Upload;	

	$scope.sections = Sections.get({"id":"28"});
	
	$scope.sections.$promise.then(function(result){
		$scope.sections = result.result;
		angular.forEach(result.result, function(value, key) {
			var fields = Array();
			$scope.sections[key].fields = Array();
			$scope.sections[key].sortedFields = Array([],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]);
			$scope.getSectionRenderer(value,key);		
		});
	});
	
	$scope.getSectionRenderer = function(section,sectionIndex){
		 
		 $scope.fields = Fields.get({"id":0,"sectionId":section.sectionId});
		 $scope.fields.$promise.then(function(result){
				$scope.sections[sectionIndex].fields = result.result;
		 		angular.forEach(result.result, function(value, key) {	
					$scope.formdata[value.model] = "";
					$scope.sections[sectionIndex].sortedFields[value.row].push(value) ;
				});
		 });
			
	}

	$scope.submitForm = function(file){
				$scope.formdata = {
						 "file":file,
						 "folder":"TS_IMPORT_TXT"
				};
				
				$file = Upload.upload({
				  url: CORE_CONFIG.WEB_SERVICE+WEB_API.UPLOAD,
				  data: $scope.formdata,
				});
		        console.log("------upload"+JSON.stringify($scope.formdata))	
				$file.then(function (response) {
					if(response.data.status == "success"){
		
						//$scope.logs += "Images Uploaded successfully.";
						$scope.currentFileName = response.data.result.upload_data.file_name;
						$scope.batch = new Batch();						
						$scope.batch.appId = "7"; //"{appId:'1',batchId:'0'}";
						$scope.batch.batchId = "0";
						$scope.batch.uploadedBy=$rootScope.SESS_USER.userId;
						
						$scope.batch.$save(function(result){

					console.log("------->:::::result"+JSON.stringify(result))
								var arrFile = $scope.currentFileName.split(".");
								$scope.currentFileName = arrFile[0];
								$scope.endDate=$filter('date')(new Date(),"yyyy-MM-dd");
								var extData = {batchNo:result.result,recdDate:$scope.endDate};
								
								$scope.batch.batchId = result.result;
								
								$scope.csv = ImportTxt.get({"file":$scope.currentFileName,"folderId":"TS_IMPORT_TXT","json":"tsUploadCheques",
								"extData":JSON.stringify(extData),"separator":"","extention":"txt"});
								$scope.csv.$promise.then(function(result){		
									console.log(JSON.stringify(result.status));
									//$scope.logs += "\n"+result.result.totalRows+" records imported successfully.";									
									toastr.success('Images Imported Successfully! ', 'Done')
							$scope.formdata.file="";
							});	
						});
					}else{
						console.log("ERROR");	
					}
					
					$scope.file = Upload;	
				
				}, function (response) {
					
				  if (response.status > 0){
					//$scope.errorMsg = response.status + ': ' + response.data;
				  	//$timeout($scope.progressbar.complete(), 1000);	

				  }
				}, function (evt) {
				
				  	//$timeout($scope.progressbar.complete(), 1000);	
                    //file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
				
				});		
	}
});


bpoApps.controller("TechnicalScrutiny_technicalScrutiyReport",function($scope,Sections,Fields,ngTableParams,$filter,getreport,Upload,$timeout,toastr,CORE_CONFIG,WEB_API,Batch,CSVImport)
{
	$scope.formats = ['yy/MM/dd ', 'yyyy-MM-dd ', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
	$scope.formdata={};
	$scope.formdata.endDate="";
	$scope.getAllItems = function(result){
	}
		$scope.showtb="";
	$scope.formdata1=Array();
	$scope.sections = Sections.get({"id":"30"});
	//$scope.formdata.tsuploadcheques__batchNo={};
	$scope.sections.$promise.then(function(result){
		$scope.sections = result.result;
		angular.forEach(result.result, function(value, key) {
			var fields = Array();
			$scope.sections[key].fields = Array();
			$scope.sections[key].sortedFields = Array([],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]);
			$scope.getSectionRenderer(value,key);		
		});
	});
	
	$scope.getSectionRenderer = function(section,sectionIndex){
		 
		 $scope.fields = Fields.get({"id":0,"sectionId":section.sectionId});
		 $scope.fields.$promise.then(function(result){
				$scope.sections[sectionIndex].fields = result.result;
		 		angular.forEach(result.result, function(value, key) {	
					//$scope.formdata[value.model] = "";
					$scope.sections[sectionIndex].sortedFields[value.row].push(value) ;
				});
		 });
			
	}

	$scope.report = function()
	{	
    	$scope.end="";		
		if($scope.formdata.endDate=="")
	    {
				$scope.end=0;
		}
		else
		{
				$scope.showtb=true;
				$scope.eDate = $scope.formdata.endDate.toString();
				$scope.eYr = ($scope.eDate.split(' ')[2]);
				$scope.tmpEndMnth = ($scope.eDate.split(' ')[0]);
				$scope.edDate= ($scope.eDate.split(' ')[1]);
				$scope.edMnth = ($scope.tmpEndMnth.split(',')[0]);
				$scope.end=$scope.eYr +'-'+$scope.edMnth+'-'+$scope.edDate;
		}
		console.log($scope.end);
		$scope.reportdata = getreport.get({"enddate":$scope.end})
		$scope.reportdata.$promise.then(function(success){
			if(success.status=="success")
			{
				$scope.formdata1=success.result;
				console.log(JSON.stringify(success.result))
				$scope.tableParams.reload();
			}
			else
			{
				toastr.error('No Data Found','error');
			}
				
		})
	}
			    $scope.tableParams = new ngTableParams({
				debugMode: true,
				page: 1, 
				count: 10,
				sorting: {
  						recdDate: 'desc',
						accountNo: 'desc',
						chequeId:'desc',
						MICR:'desc',
						amount:'desc',
						payeeName:'desc',
						fullName:'desc'
						
                },
				filter: {
						recdDate: '',
						accountNo: '',
						chequeId:'',
						MICR:'',
						amount:'',
						payeeName:'',
						fullName:''
						
				}

				}, {
				total: $scope.formdata1.length,
				getData: function ($defer, params) {
				var filteredData = params.filter() ? $filter('filter')($scope.formdata1, params.filter()) : $scope.formdata1;
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData; 

				params.total(orderedData.length);
				$defer.resolve($scope.data = orderedData.slice((params.page() -1) * params.count(), params.page() * params.count())); 
				}
				});
				
})
bpoApps.controller("TechnicalScrutiny_pendingWorkReport",function($scope,Sections,$parse,PendingWorkGetReport,Fields,ngTableParams,$filter,Upload,$timeout,toastr,CORE_CONFIG,WEB_API,Batch,CSVImport)
{
	$scope.getBatch={};
	$scope.formdata={};
	$scope.getAllItems = function(data, datalist, accessor, scopevar){
 			 	 
			 var lblaccessor = accessor;
			 $scope.formdata[lblaccessor]={};
 			 var tmp = $parse(datalist) ;
 			tmp.assign($scope, data);
 			accessor = "formdata['"+accessor+"']";
 			var accessor = $parse(accessor); 
 			angular.forEach(data, function(value, key) {
  			if(value[scopevar] == $scope.formdata[scopevar]){ 
   			accessor.assign($scope, {"selectedItem":value});
 	    }
 	    });
		
		}

		$scope.showtb="";
		$scope.formdata1=Array();
		$scope.sections = Sections.get({"id":"30"});
		$scope.formdata.tsuploadcheques__batchNo={};
		$scope.sections.$promise.then(function(result){
		$scope.sections = result.result;
		angular.forEach(result.result, function(value, key) {
			var fields = Array();
			$scope.sections[key].fields = Array();
			$scope.sections[key].sortedFields = Array([],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]);
			$scope.getSectionRenderer(value,key);		
		});
	});
	
	$scope.getSectionRenderer = function(section,sectionIndex){
		 
		 $scope.fields = Fields.get({"id":0,"sectionId":section.sectionId});
		 $scope.fields.$promise.then(function(result){
				$scope.sections[sectionIndex].fields = result.result;
		 		angular.forEach(result.result, function(value, key) {	
					//$scope.formdata[value.model] = "";
					$scope.sections[sectionIndex].sortedFields[value.row].push(value) ;
				});
		 });
			
	}

	$scope.pendingWorkReport = function()
	{	
    	$scope.showtb=true;
    	console.log($scope.formdata.tsuploadcheques__batchNo.selectedItem.displaylabel );
		$scope.reportdata = PendingWorkGetReport.get({"batchno":$scope.formdata.tsuploadcheques__batchNo.selectedItem.displaylabel})
		$scope.reportdata.$promise.then(function(success){			
		  if(success.status=="success")
		  {
			$scope.formdata1=success.result;
				console.log(JSON.stringify($scope.formdata1))
				$scope.tableParams.reload();
		  }
		  else
		  {
			  toastr.error('No records found','error')
		  }
		})
	}
				$scope.tableParams = new ngTableParams({
				debugMode: true,
				page: 1, 
				count: 10,
				sorting: {
  						processName: 'desc',
						totalCheque: 'desc',
						pendingCheque:'desc'
						
                },
				filter: {
						processName: '',
						totalCheque: '',
						pendingCheque:''
				}

				}, {
				total: $scope.formdata1.length,
				getData: function ($defer, params) {
				var filteredData = params.filter() ? $filter('filter')($scope.formdata1, params.filter()) : $scope.formdata1;
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData; 

				params.total(orderedData.length);
				$defer.resolve($scope.data = orderedData.slice((params.page() -1) * params.count(), params.page() * params.count())); 
				}
				});
				

})
bpoApps.controller("TechnicalScrutiny_inwardTechnicalScrutinyReport",function($scope,Sections,InwardTechnicalGetReport,Fields,ngTableParams,$filter,Upload,$timeout,toastr,CORE_CONFIG,WEB_API,Batch,CSVImport,$parse,sessionService)
{
	//$scope.formats = ['yy/MM/dd ', 'yyyy-MM-dd ', 'dd.MM.yyyy', 'shortDate'];
    //$scope.format = $scope.formats[0];
	//$scope.getBatch={};
	$scope.report = Array();
	$scope.formdata={};
	$scope.formdata.tsuploadcheques__batchNoFrom="";
	$scope.formdata.tsuploadcheques__batchNoTo="";
	$scope.formdata.tsuploadcheques__clgDate="";
	$scope.NoRecordFound=Array();
	$scope.incomplete=Array();
	$scope.complete=Array();
	$scope.alreadyExit=Array();
	$scope.logs="";
	$scope.showtb="";
	$scope.sections = Sections.get({"id":"51"});
	$scope.formdata.tsuploadcheques__batchNo={};
	
	
	$scope.getAllItems = function(data, datalist, accessor, scopevar){
			 
			 console.log(JSON.stringify(data));
			 console.log(JSON.stringify(datalist));
			 console.log(JSON.stringify(accessor));
			 console.log(JSON.stringify(scopevar));			 
			 			 			 
			 var lblaccessor = accessor;
			 $scope.formdata[lblaccessor]={};
 			 var tmp = $parse(datalist) ;
 			tmp.assign($scope, data);
 			accessor = "formdata['"+accessor+"']";
 			var accessor = $parse(accessor); 
 			angular.forEach(data, function(value, key) {
  			if(value[scopevar] == $scope.formdata[scopevar]){ 
   			accessor.assign($scope, {"selectedItem":value});
 	    }
 	    });
		
		}

	$scope.sections.$promise.then(function(result){
  	$scope.sections = result.result;
  	angular.forEach(result.result, function(value, key) {
   
   var fields = Array();
   $scope.sections[key].lastIndex=0;
   $scope.sections[key].fields = Array();
   $scope.sections[key].sortedFields = Array([],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]);
   $scope.getSectionRenderer(value,key);
  });
 });
 
 
 $scope.getSectionRenderer = function(section,sectionIndex){
   $scope.fields = Fields.get({"id":0,"sectionId":section.sectionId});
   $scope.fields.$promise.then(function(result){   
    $scope.sections[sectionIndex].fields = result.result;
     angular.forEach(result.result, function(value, key) {     
     $scope.sections[sectionIndex].sortedFields[value.row].push(value) ;
    });
   });    
 }
	$scope.inwardTechnicalScrutinyReport = function()
	{		
		$scope.report=Array();
	   //$scope.tableParams.reload();
		$scope.showtb=true;
    	//console.log($scope.formdata.tsuploadcheques__clgDate );
		$scope.reportdata = InwardTechnicalGetReport.get({"batchNoFrom":$scope.formdata.tsuploadcheques__batchNoFrom,"batchNoTo":$scope.formdata.tsuploadcheques__batchNoTo,"clgDate":$scope.formdata.tsuploadcheques__clgDate})
		$scope.reportdata.$promise.then(function(response){
			//console.log(JSON.stringify())
			//$scope.report = response.result.result1; 
			console.log("====="+JSON.stringify(response.result.result1));
			angular.forEach(response.result.result1, function(value, key) {
				angular.forEach(value, function(valuesub, keysub) {
					$scope.report.push(valuesub);				
				});
  				
			});
			console.log("==Not found==="+JSON.stringify(response.result.NoRecordFound));
			angular.forEach(response.result.NoRecordFound, function(value, key) {
				sessionService.remove(value.fieldId);				
					$scope.NoRecordFound.push(value);
									
				});
				//console.log("====="+JSON.stringify($scope.NoRecordFound));
				angular.forEach(response.result.incomplete, function(value, key) {
					sessionService.remove(value.fieldId);				
					$scope.incomplete.push(value);
								
				});
				angular.forEach(response.result.complete, function(value, key) {
					sessionService.remove(value.fieldId);				
					$scope.complete.push(value);	
							
				});
				angular.forEach(response.result.alreadyExit, function(value, key) {
					sessionService.remove(value.fieldId);				
					$scope.alreadyExit.push(value);
									
				});
			
			//console.log("====="+JSON.stringify($scope.NoRecordFound));
			$scope.logs+= " Inward Technical Scrutiny Report \n";
						
						/*if($scope.report=="")
						{
							$scope.logs+=" No batches found in data entry\n";
							//$scope.logs+= "No batches found in data entry\n";
						}*/
						if($scope.NoRecordFound=="")
						{
							
						}
						else
						{
							
							for(i=0;i<($scope.NoRecordFound.length);i++)
							{
							$scope.logs+= " batch no. "+$scope.NoRecordFound[i]+" Not found in data entry\n";
							}
							$scope.logs+= "\n";						
						}
						if($scope.incomplete!="")
						{
							
							for(i=0;i<($scope.incomplete.length);i++)
							{
							$scope.logs+= "batch no. "+$scope.incomplete[i]+" Incomplete \n";
							}
							$scope.logs+= "\n";
						}
						if($scope.complete!="")
						{
													
							for(i=0;i<($scope.complete.length);i++)
							{
							$scope.logs+= "batch no. "+$scope.complete[i]+" Complete \n";
							}						
							$scope.logs+= "\n";
						}
						if($scope.alreadyExit!="")
						{
							
							for(i=0;i<($scope.alreadyExit.length);i++)
							{
							$scope.logs+= "batch no. "+$scope.alreadyExit[i]+" Already Exist \n";
							}
							$scope.logs+= "\n";
						}
						
				$scope.tableParams.reload();
				
				
		})
	}
				$scope.tableParams = new ngTableParams({
				debugMode: true,
				page: 1, 
				count: 10,
				sorting: {
  						UDKNo: 'desc',
						rejectReasonId: 'desc',
						reasonName:'desc',
						payeeName:'desc'
						
                },
				filter: {
						UDKNo: '',
						rejectReasonId: '',
						reasonName:'',
						payeeName:''
				}

				}, {
				total: $scope.report.length,
				getData: function ($defer, params) {
				var filteredData = params.filter() ? $filter('filter')($scope.report, params.filter()) : $scope.report;
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData; 

				params.total(orderedData.length);
				$defer.resolve($scope.data = orderedData.slice((params.page() -1) * params.count(), params.page() * params.count())); 
				}
				});
				

})
bpoApps.controller("TechnicalScrutiny_processStatusReport",function($scope,Sections,ProcessStatusGetReport,Fields,ngTableParams,$filter,Upload,$timeout,toastr,CORE_CONFIG,WEB_API,Batch,CSVImport)
{
	 $scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  	$scope.format = $scope.formats[0];
	$scope.formdata={};
	$scope.formdata.endDate="";
	$scope.getAllItems = function(result){
	}
		$scope.showtb="";
	$scope.formdata1=Array();
	$scope.sections = Sections.get({"id":"30"});
	//$scope.formdata.tsuploadcheques__batchNo={};
	$scope.sections.$promise.then(function(result){
		$scope.sections = result.result;
		angular.forEach(result.result, function(value, key) {
			var fields = Array();
			$scope.sections[key].fields = Array();
			$scope.sections[key].sortedFields = Array([],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]);
			$scope.getSectionRenderer(value,key);		
		});
	});
	
	$scope.getSectionRenderer = function(section,sectionIndex){
		 
		 $scope.fields = Fields.get({"id":0,"sectionId":section.sectionId});
		 $scope.fields.$promise.then(function(result){
				$scope.sections[sectionIndex].fields = result.result;
		 		angular.forEach(result.result, function(value, key) {	
					//$scope.formdata[value.model] = "";
					$scope.sections[sectionIndex].sortedFields[value.row].push(value) ;
				});
		 });
			
	}

	$scope.processStatusReport = function()
	{	
	//alert($scope.formdata.endDate);
    	$scope.end="";		
		if($scope.formdata.endDate=="")
	    {
	//		alert("in if");
				$scope.end=0;
		}
		else
		{
	//		alert("in else");
				$scope.showtb=true;
				$scope.eDate = $scope.formdata.endDate.toString();
				$scope.eYr = ($scope.eDate.split(' ')[2]);
				$scope.tmpEndMnth = ($scope.eDate.split(' ')[0]);
				$scope.edDate= ($scope.eDate.split(' ')[1]);
				$scope.edMnth = ($scope.tmpEndMnth.split(',')[0]);
				$scope.end=$scope.eYr +'-'+$scope.edMnth+'-'+$scope.edDate;
		}
		console.log($scope.end);
		$scope.reportdata = ProcessStatusGetReport.get({"enddate":$scope.end})
		$scope.reportdata.$promise.then(function(success){
			if(success.status=="success")
			{
			    $scope.formdata1=success.result;
				console.log(JSON.stringify(success.result))
				$scope.tableParams.reload();
			}
			else
			{
				toastr.error('No Data Found','error')
			}
		})
	}
				$scope.tableParams = new ngTableParams({
				debugMode: true,
				page: 1, 
				count: 10,
				sorting: {
  						batchNo: 'desc',
						totalCheque: 'desc',
						pendingCheque:'desc',
						processName:'desc',
						fullName:'desc'
						
                },
				filter: {
						batchNo: '',
						totalCheque: '',
						pendingCheque:'',
						processName:'',
						fullName:''
				}

				}, {
				total: $scope.formdata1.length,
				getData: function ($defer, params) {
				var filteredData = params.filter() ? $filter('filter')($scope.formdata1, params.filter()) : $scope.formdata1;
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData; 

				params.total(orderedData.length);
				$defer.resolve($scope.data = orderedData.slice((params.page() -1) * params.count(), params.page() * params.count())); 
				}
				});
				

})
bpoApps.controller("TechnicalScrutinybatchallocationController",function($scope,Sections,Fields,$filter,ngTableParams,ProcessUsers,Process,Batches,Users,TSAllocateApplication,Release,TSBatchApplication,toastr,GetALPLUsers,$parse){
		
		$scope.currentRow = 0;
		$scope.formdata = {};
		$scope.formdata.process1 = {};
		$scope.formdata.batchNo = {};
		$scope.formdata.userName = {};
		$scope.batchApplications = Array();
		$scope.sections = Sections.get({"id":"50"});
	
		$scope.sections.$promise.then(function(result){
			$scope.sections = result.result;
			angular.forEach(result.result, function(value, key) {
				var fields = Array();
				$scope.sections[key].fields = Array();
				$scope.sections[key].sortedFields = Array([],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]);
				$scope.getSectionRenderer(value,key);		
			});
		});
		
		$scope.getSectionRenderer = function(section,sectionIndex){
		
			 $scope.fields = Fields.get({"id":0,"sectionId":section.sectionId});
			 $scope.fields.$promise.then(function(result){
					$scope.sections[sectionIndex].fields = result.result;
					angular.forEach(result.result, function(value, key) {	
						$scope.formdata[value.model] = "";
                                                console.log("sharvari "+JSON.stringify(value.fieldName));
                                                $scope.sections[sectionIndex].sortedFields[value.row].push(value) ;
                                           
					});
			 });
		}
		$scope.getAllItems = function(data, datalist, accessor, scopevar)
		{
			console.log("------------- : "+JSON.stringify(data));
			console.log("-------------list : "+datalist);
			console.log("-------------acc : "+accessor);
			console.log("-------------scope : "+scopevar);
			
			var lblaccessor = accessor;
			$scope.formdata[lblaccessor]={};
// 			var tmp = $parse(datalist) ;
// 			tmp.assign($scope, data);
 			
 			var accessor = $parse(accessor); 
 			angular.forEach(data, function(value, key) {
  				if(value[scopevar] == $scope.formdata[scopevar]){ 
   					accessor.assign($scope, {"selectedItem":value});
 	    		}
 	    	});
		
		}
		
		$scope.process={
			model:null,
			result:''
		}
		$scope.batches={
				model:null,
				result:''
		}
		$scope.processUsers={
			model:null,
			result:''
		}	
    	
		$scope.batchid="";
		$scope.process = Process.get();
		$scope.processChange=function(field)
		{
			if(field == "process1")
			{
				$scope.batches.model="";
				$scope.selectedProcessId=$scope.formdata.process1.selectedItem.processId;
				console.log("------>"+JSON.stringify($scope.batches));	
                                $scope.batchApplications = TSBatchApplication.get({"processId":$scope.formdata.process1.selectedItem.processId})
				$scope.batchApplications.$promise.then(function(result){
					$scope.batchApplications= result.result;
					console.log("result-----------------------"+JSON.stringify(result))
					if(result.result=="")
					{
							toastr.error('No Application To Allocate', 'Error!')
							//toastr.error()
							$scope.tableParams.reload();
					}
					else
					{
						for(var i=0;i<$scope.batchApplications.length;i++) $scope.batchApplications[i].isSelected = false;
				     		console.log("result-------isslect"+JSON.stringify($scope.batchApplications))

						$scope.tableParams.reload();
					}
				});
			}
			
		}
		
		$scope.selectAll = function() {
		$scope.checkAll=!$scope.checkAll;
		for(var i=0;i<$scope.batchApplications.length;i++) $scope.batchApplications[i].isSelected = $scope.checkAll;
		console.log("$scope.batchApplications-------------"+JSON.stringify($scope.batchApplications))
	  };
//	 $scope.ddlUsers = getUsers.get();
         $scope.selecteddlUserType = {};
        
	$scope.allocateclicked=function(batch){
		var batchno = batch.batchNo;
	var arrallocationId = Array();
        
//		if($scope.formdata.userName.selectedItem.userId == null)
//		{
//			toastr.error("Please Select User For Allocation","Error");
//		}
//		else
//		{
//		if($scope.batchApplications!=0){
//		alert(batchno);
//                alert($scope.selecteddlUserType.selectedItem.userId);
                $scope.AllocateApplication = new TSAllocateApplication();
//                $scope.AllocateApplication.applicationId = arrallocationId.toString();	
//                console.log("--------ss fff------>" +$scope.AllocateApplication.applicationId);
                $scope.AllocateApplication.processId = $scope.formdata.process1.selectedItem.processId;
                $scope.AllocateApplication.userId = $scope.selecteddlUserType.selectedItem.userId;
                $scope.AllocateApplication.batchNo = batchno;
                console.log($scope.AllocateApplication.processId+" = "+$scope.AllocateApplication.userId+" = "+$scope.AllocateApplication.batchNo)
                $scope.AllocateApplication.$save(function(response){
                    toastr.success('Applications allocated to user', 'Applications Allocated!')
                
					batch.assigned = true;
				})
                
//				for(var i=0;i< $scope.batchApplications.length;i++){
//						
//						 console.log("==================>>>>>>>>>>>>  "+$scope.batchApplications[i].isSelected);
//						if($scope.batchApplications[i].isSelected){
//							arrallocationId.push($scope.batchApplications[i].uploadChequesId);
//						}
//				 }

//			 			$scope.AllocateApplication.applicationId = arrallocationId.toString();	
//                                                console.log("--------ss ------>" +$scope.AllocateApplication.applicationId)
//						$scope.AllocateApplication.processId = $scope.formdata.process1.selectedItem.processId;
//						$scope.AllocateApplication.userId = $scope.formdata.userName.selectedItem.userId;
//						$scope.AllocateApplication.$save(function(response){
//						toastr.success('Applications allocated to user', 'Applications Allocated!')
//						$scope.batchApplications = Array();
//						$scope.AllocateApplication = Array();
//						$scope.tableParams.reload();	
//						$scope.process.model="";
//						$scope.batches.model="";
//						$scope.processUsers.model="";
//						});
		
//		 }else{
//			 alert("please select application to allocate")
//		 }}
	
        }
	 
						
					$scope.tableParams = new ngTableParams({
						debugMode: true,
						page: 1, 
						count: 10,
						sorting: {
								//fullName: 'desc',
								accountNo: 'desc',
								batchId: 'desc'
						},
						filter: {
							//fullName: '',
							accountNo: '',
							batchId: ''
						}
	
					}, {
							total: $scope.batchApplications.length,
							getData: function ($defer, params) {
							   var filteredData = params.filter() ? $filter('filter')($scope.batchApplications, params.filter()) : $scope.batchApplications;
							   var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData; 
							   params.total(orderedData.length);
							   $defer.resolve($scope.data = orderedData.slice((params.page() -1) * params.count(), params.page() * params.count())); 
							}
					});
					
					
				


});
bpoApps.controller("TechnicalScrutiny_pendencyCheckReport",function($scope,Sections,Fields,ngTableParams,$filter,PendencyCheckGetReport,Upload,$timeout,toastr,CORE_CONFIG,WEB_API,Batch,CSVImport)
{
	$scope.formats = ['yy/MM/dd ', 'yyyy-MM-dd ', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
	$scope.formdata={};
	$scope.formdata.endDate="";
	$scope.getAllItems = function(result){
	}
		$scope.showtb="";
	$scope.formdata1=Array();
	$scope.sections = Sections.get({"id":"30"});
	//$scope.formdata.tsuploadcheques__batchNo={};
	$scope.sections.$promise.then(function(result){
		$scope.sections = result.result;
		angular.forEach(result.result, function(value, key) {
			var fields = Array();
			$scope.sections[key].fields = Array();
			$scope.sections[key].sortedFields = Array([],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]);
			$scope.getSectionRenderer(value,key);		
		});
	});
	
	$scope.getSectionRenderer = function(section,sectionIndex){
		 
		 $scope.fields = Fields.get({"id":0,"sectionId":section.sectionId});
		 $scope.fields.$promise.then(function(result){
				$scope.sections[sectionIndex].fields = result.result;
		 		angular.forEach(result.result, function(value, key) {	
					//$scope.formdata[value.model] = "";
					$scope.sections[sectionIndex].sortedFields[value.row].push(value) ;
				});
		 });
			
	}

	$scope.pendencyCheckReport = function()
	{	
    	$scope.formdata1="";
		$scope.showtb=true;
				
				
		$scope.reportdata = PendencyCheckGetReport.get({"enddate":$scope.formdata.endDate})
		$scope.reportdata.$promise.then(function(success){
			if(success.result=="no result")
			{
				toastr.error("No record found!","error");
			}
			$scope.formdata1=success.result;
				console.log(JSON.stringify(success.result))
				$scope.tableParams.reload();

		})
	}
				$scope.tableParams = new ngTableParams({
				debugMode: true,
				page: 1, 
				count: 10,
				sorting: {
  						pendingInTs: 'desc',
						pendingInCap2: 'desc',
						pendingInReject:'desc',
						totalCheque:'desc',
						batchNo:'desc',
						fileNames:'desc',
						batchNo:'desc'
						
						
                },
				filter: {
						pendingInTs: '',
						pendingInCap2: '',
						pendingInReject:'',
						totalCheque:'',
						batchNo:'',
						fileNames:'',
						batchNo:''
				}

				}, {
				total: $scope.formdata1.length,
				getData: function ($defer, params) {
				var filteredData = params.filter() ? $filter('filter')($scope.formdata1, params.filter()) : $scope.formdata1;
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData; 

				params.total(orderedData.length);
				$defer.resolve($scope.data = orderedData.slice((params.page() -1) * params.count(), params.page() * params.count())); 
				}
				});
				

})
bpoApps.controller("TechnicalScrutiny_userProductivityStatusReport",function($scope,Sections,$parse,Fields,ngTableParams,$filter,UserProductivityGetReport,Upload,$timeout,toastr,CORE_CONFIG,WEB_API,Batch,CSVImport)
{
	$scope.formdata={};
	$scope.formdata.userProductivity__batchNo={};
	$scope.formdata.userProductivity__fromDate="";
	$scope.formdata.userProductivity__ToDate="";
	//$scope.getBatch={}..;
	$scope.getAllItems = function(data, datalist, accessor, scopevar){
 			 	 
			 var lblaccessor = accessor;
			 $scope.formdata[lblaccessor]={};
 			 var tmp = $parse(datalist) ;
 			tmp.assign($scope, data);
 			accessor = "formdata['"+accessor+"']";
 			var accessor = $parse(accessor); 
 			angular.forEach(data, function(value, key) {
  			if(value[scopevar] == $scope.formdata[scopevar]){ 
   			accessor.assign($scope, {"selectedItem":value});
 	    }
 	    });
		
		}

	$scope.formats = ['yy/MM/dd ', 'yyyy-MM-dd ', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
	$scope.searchparams={
		fromDate:"",
		toDate:""
		};
	
	
		$scope.showtb="";
	$scope.formdata1=Array();
	$scope.sections = Sections.get({"id":"52"});
	//$scope.formdata.tsuploadcheques__batchNo={};
	$scope.sections.$promise.then(function(result){
		$scope.sections = result.result;
		angular.forEach(result.result, function(value, key) {
			var fields = Array();
			$scope.sections[key].fields = Array();
			$scope.sections[key].sortedFields = Array([],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]);
			$scope.getSectionRenderer(value,key);		
		});
	});
	
	$scope.getSectionRenderer = function(section,sectionIndex){
		 
		 $scope.fields = Fields.get({"id":0,"sectionId":section.sectionId});
		 $scope.fields.$promise.then(function(result){
				$scope.sections[sectionIndex].fields = result.result;
		 		angular.forEach(result.result, function(value, key) {	
					//$scope.formdata[value.model] = "";
					$scope.sections[sectionIndex].sortedFields[value.row].push(value) ;
				});
		 });
			
	}

	$scope.userProductivityStatusReport = function()
	{	
		console.log("===="+JSON.stringify($scope.formdata))
			//$scope.showtb=true;
		if($scope.formdata.userProductivity__batchNo.selectedItem==null)
		{
			toastr.error('Please select batch no.!','error')
		}
		else if($scope.formdata.userProductivity__fromDate=="")
		{
			toastr.error('Please select from date!','error')
		}
		else if($scope.formdata.userProductivity__ToDate=="")
		{
			toastr.error('Please select to date!','error')
		}
		else
		{
		$scope.reportdata = UserProductivityGetReport.get({"batchNo":$scope.formdata.userProductivity__batchNo.selectedItem.displaylabel,
		        "from":$scope.formdata.userProductivity__fromDate,
				"to":$scope.formdata.userProductivity__ToDate})
		$scope.reportdata.$promise.then(function(success){
			if(success.status=="success")
			{
			$scope.formdata1=success.result;
				console.log(JSON.stringify(success.result))
				$scope.tableParams.reload();
				//$scope.formdata1={};
			}
			else
			{
				toastr.error('No records found!','error');
			}
		})
	  }
	}
				$scope.tableParams = new ngTableParams({
				debugMode: true,
				page: 1, 
				count: 10,
				sorting: {
  						batchNo: 'desc',
						processName: 'desc',
						endDate:'desc',
						totalCount:'desc',
						fullName:'desc'
						
                },
				filter: {
						batchNo: '',
						processName: '',
						endDate:'',
						totalCount:'',
						fullName:''
				}

				},{
				total: $scope.formdata1.length,
				getData: function ($defer, params) {
				var filteredData = params.filter() ? $filter('filter')($scope.formdata1, params.filter()) : $scope.formdata1;
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData; 

				params.total(orderedData.length);
				$defer.resolve($scope.data = orderedData.slice((params.page() -1) * params.count(), params.page() * params.count())); 
				}
				});
				

})


bpoApps.controller("TechnicalScrutiny_hourlyStatusReport",function($scope,Sections,HourlyStatusGetReport,$parse,Fields,ngTableParams,$filter,Upload,$timeout,toastr,CORE_CONFIG,WEB_API,Batch,CSVImport)
{
	
	$scope.getProcess = {};
	$scope.getShift = {};
	$scope.formats = ['yy/MM/dd ', 'yyyy-MM-dd ', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
	$scope.formdata={};
	$scope.formdata.tsdataentry__date="";
	$scope.getAllItems = function(data, datalist, accessor, scopevar){
 			 	 
			 var lblaccessor = accessor;
			 $scope.formdata[lblaccessor]={};
 			 var tmp = $parse(datalist) ;
 			tmp.assign($scope, data);
 			accessor = "formdata['"+accessor+"']";
 			var accessor = $parse(accessor); 
 			angular.forEach(data, function(value, key) {
  			if(value[scopevar] == $scope.formdata[scopevar]){ 
   			accessor.assign($scope, {"selectedItem":value});
 	    }
 	    });
		
		}


	$scope.formdata1=Array();
	$scope.sections = Sections.get({"id":"47"});
	
	$scope.formdata.date="";
	$scope.formdata.tsdataentry__processName={};
	$scope.formdata.tsdataentry__shift= {};
	$scope.sections.$promise.then(function(result){
		$scope.sections = result.result;
		angular.forEach(result.result, function(value, key) {
			var fields = Array();
			$scope.sections[key].fields = Array();
			$scope.sections[key].sortedFields = Array([],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]);
			$scope.getSectionRenderer(value,key);		
		});
	});
	
	$scope.getSectionRenderer = function(section,sectionIndex){
		 
		 $scope.fields = Fields.get({"id":0,"sectionId":section.sectionId});
		 $scope.fields.$promise.then(function(result){
				$scope.sections[sectionIndex].fields = result.result;
		 		angular.forEach(result.result, function(value, key) {	
					//$scope.formdata[value.model] = "";
					$scope.sections[sectionIndex].sortedFields[value.row].push(value) ;
				});
		 });
			
	}

	$scope.hourlyStatusReport = function()
	{	
			console.log($scope.formdata.tsdataentry__date);
			if($scope.formdata.tsdataentry__date=="")	
			{
				$scope.dateValue = "0";
			}
 			else
			{
				$scope.toDate =$scope.formdata.tsdataentry__date.toString();
    			$scope.toYr = ($scope.toDate.split(' ')[2]);
				$scope.tmpToMnth = ($scope.toDate.split(' ')[0]);
				$scope.toDate= ($scope.toDate.split(' ')[1]);
				$scope.toMnth = ($scope.tmpToMnth.split(',')[0]);
				$scope.dateValue=$scope.toYr+'-'+$scope.toMnth+'-'+$scope.toDate;
				
			}
			if($scope.formdata.tsdataentry__shift.selectedItem==null)	
			{
				$scope.shiftValue = "0";
			}
 			else
			{
				$scope.shiftValue=$scope.formdata.tsdataentry__shift.selectedItem.displaylabel;
			}
	
			if($scope.formdata.tsdataentry__processName.selectedItem==null)	
			{ 
				$scope.activityValue = "0";
			}
 			else
			{
				$scope.activityValue=$scope.formdata.tsdataentry__processName.selectedItem.displaylabel;
			}
    	
		console.log($scope.dateValue)
		console.log($scope.activityValue)
		console.log("----->"+$scope.shiftValue)
		if($scope.activityValue==0)
		{
		  toastr.error('Please select activity!', 'error');
		}
		else if($scope.shiftValue==0)
		{
		  toastr.error('Please select shift!', 'error');
		}		
		else if($scope.dateValue==0)
		{
		  toastr.error('Please select date!', 'error');
		} 		
		else
		{
			$scope.reportdata = HourlyStatusGetReport.get({"date":$scope.dateValue,"shift":$scope.shiftValue,
		        "activity":$scope.activityValue})
		$scope.reportdata.$promise.then(function(success){
				if(success.status=="success")
				{
				$scope.formdata1=success.result;
					console.log(JSON.stringify(success.result))
					$scope.tableParams.reload();
				}
				else
				{
					toastr.error('No records found!', 'error');
				}
			})
			
		}
	}
				$scope.tableParams = new ngTableParams({
				debugMode: true,
				page: 1, 
				count: 10,
				sorting: {
  						Operator: 'desc',
						Eight: 'desc',
						Nine:'desc',
						Ten:'desc',
						OneOne:'desc',
						OneTwo:'desc',
						OneThree:'desc',
						OneFour:'desc',
						OneFive:'desc',
						OneSix:'desc',
						OneSeven:'desc',
						OneEight:'desc',
						OneNine:'desc'
						
						
                },
				filter: {
						Operator: '',
						Eight: '',
						Nine:'',
						Ten:'',
						OneOne:'',
						OneTwo:'',
						OneThree:'',
						OneFour:'',
						OneFive:'',
						OneSix:'',
						OneSeven:'',
						OneEight:'',
						OneNine:''
				}

				},{
				total: $scope.formdata1.length,
				getData: function ($defer, params) {
				var filteredData = params.filter() ? $filter('filter')($scope.formdata1, params.filter()) : $scope.formdata1;
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData; 

				params.total(orderedData.length);
				$defer.resolve($scope.data = orderedData.slice((params.page() -1) * params.count(), params.page() * params.count())); 
				}
				});
})


bpoApps.controller("releaseRecordsControllers",function($scope,Release,ngTableParams,SearchTSRelease,TSBatches,TSApplications,TSUsers,$filter,DeleteTSRelease,toastr){

$scope.searchRelease = Array();

$scope.getAllItems = function(result){ }
	
  $scope.getddlFilterData = {
    model: 1,
    availableOptions: [
      {id: '1', name: 'Users'},
      {id: '2', name: 'Batch'},
      {id: '3', name: 'Cheque Upload Id'}
    ]
   };
   
	$scope.getddlSearchData={
		model:null,
		result:''
	}
		$scope.getddlSearchData= TSUsers.get();
		$scope.getddlSearchData.$promise.then(function(result){
			$scope.searchReleasedata= result.result;
			if(result.result=="")
			{
				toastr.error('No User Found', 'Error!');
			}
		});
	
// 	$scope.filterChange=function(id){
// 		if(id=="1")
// 		{
// 			$scope.getddlSearchData= TSUsers.get();
// 			$scope.getddlSearchData.$promise.then(function(result){
// 						$scope.searchReleasedata= result.result;
// 						if(result.result=="")
// 									{
// 										toastr.error('No User Found', 'Error!')
// 										//toastr.error()
// 									}
// 			});
// 		}else if(id=="2"){
// 			$scope.getddlSearchData= TSBatches.get();
// 			$scope.getddlSearchData.$promise.then(function(result){
// 						$scope.searchReleasedata= result.result;
// 						if(result.result=="")
// 									{
// 										toastr.error('No Batch Yet Created', 'Error!')
// 										//toastr.error()
// 									}
// 			});
// 		}else if(id=="3"){
//             $scope.getddlSearchData=TSApplications.get();
// 			$scope.getddlSearchData.$promise.then(function(result){
// 						$scope.searchReleasedata= result.result;
// 						if(result.result=="")
// 									{
// 										toastr.error('No Application To Release', 'Error!')
// 									}
// 			});
// 	}
// }
	
	$scope.searchChange=function(filterid,searchid){
		
		if(filterid=="1")
			{
				console.log("--->"+searchid);
				$scope.selectedValue=searchid;
			    $scope.selectedKey="user";
			}else if(filterid=="2"){
				$scope.selectedValue=searchid;
				$scope.selectedKey="batch";
			}else if(filterid=="3"){
				$scope.selectedValue=searchid;
				$scope.selectedKey="application";	
		}

	}

	$scope.searchButtonClicked=function(){
	 $scope.searchReleaseData = SearchTSRelease.get({'key':$scope.selectedKey,'value':$scope.selectedValue})		
	    	$scope.searchReleaseData.$promise.then(function(result){
						$scope.searchRelease= result.result;
						if(result.result=="")
									{
										toastr.error('No Application To Release', 'Error!')
										//toastr.error()
									}
						for(var i=0;i<$scope.searchRelease.length;i++)
						 $scope.searchRelease[i].isSelected = false;
						 $scope.tableParams.reload();
		});	



	}
	
	$scope.releaseclicked=function(){
		var arrallocationId=Array();
		if($scope.searchRelease!=0){
		
			console.log("####>"+JSON.stringify($scope.searchRelease));
		
				for(var i=0;i< $scope.searchRelease.length;i++){
 						if($scope.searchRelease[i].isSelected==true){
							console.log("SELECTED:releaseeeeeee>"+JSON.stringify($scope.searchRelease[i].isSelected));
							arrallocationId.push($scope.searchRelease[i].batchNo);
						}
													console.log("SELECTED:releaseeeeeee>"+JSON.stringify(arrallocationId))

				 }

						
				$scope.DeleteTSRelease = DeleteTSRelease.get({"allocationId": arrallocationId.toString()});
					$scope.DeleteTSRelease.$promise.then(function (response) {
						toastr.success('All of selected Applications are released', 'Applications Release!')
						$scope.searchButtonClicked();
					});		
		 }else{
			 toastr.error("please select application to allocate","Error")
		 }
	 }

		$scope.selectAll = function() {
		
		$scope.checkAll=!$scope.checkAll;
		for(var i=0;i<$scope.searchRelease.length;i++) $scope.searchRelease[i].isSelected = $scope.checkAll;
		console.log("-------->>>>"+JSON.stringify($scope.searchRelease));
		
	  };
	  
	  

var arrallocationId = Array();

	
	$scope.getBatches=function(){
				$scope.batches = Batches.get();
					$scope.batches.$promise.then(function(result){
							$scope.batches= result.result;
							$scope.getUsers();
				});
		  }

	$scope.getUsers=function(){
				$scope.users = Users.get();
					$scope.users.$promise.then(function(result){
							$scope.users= result.result;
						
				});

			}

//  $scope.filterChange($scope.getddlFilterData.model);


 $scope.tableParams = new ngTableParams({
				debugMode: true,
				page: 1, 
				count: 10,
				sorting: {
  						fullName: 'desc',
						ApplicationNo: 'desc',
						batchNo: 'desc'
                },
				filter: {
				fullName: '',
				ApplicationNo: '',
				batchNo: ''
				}

				}, {
				total: $scope.searchRelease.length,
				getData: function ($defer, params) {
				var filteredData = params.filter() ? $filter('filter')($scope.searchRelease, params.filter()) : $scope.searchRelease;
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData; 

				params.total(orderedData.length);
				$defer.resolve($scope.data = orderedData.slice((params.page() -1) * params.count(), params.page() * params.count())); 
				}
				});

});

bpoApps.controller('TechnicalScrutinyUploadController', function($scope, $http, toastr, Upload, CORE_CONFIG, WEB_API,RenameBatch,folderscan,ngTableParams,$filter,toastr) 
{
	$scope.logs = "";
	$scope.arrfilesnew = {
	};
	$scope.arrfiles1 = Array();
	$scope.import1 = function() {
		//console.log("=Job===="+JSON.stringify($scope.indexObject));
		$scope.logs="";
            if ($scope.indexObject.jobno == "")
			 {
             	toastr.error("Please enter respective job no. to import!", 'error');
			 } 
			   else 
			   {
               	 $scope.arrfilesnew = folderscan.get({"job": $scope.indexObject.jobno})
                 $scope.arrfilesnew.$promise.then(function(response) {
                    $scope.arrfilesnew= response.result;
					//console.log("==Result==="+JSON.stringify(response.result.batchNo));
					if(response.result.status!=true)
					{
						toastr.error("No record imported!", 'error');
					}
					else
					{
						console.log("length=="+JSON.stringify(response.result.batchNo.length));
						$scope.logs+= " Batches successfully imported\n";
						for(i=0;i<(response.result.batchNo.length);i++)
						{
						$scope.logs+= " batch no. "+response.result.batchNo[i]+"\n";
						}
						$scope.logs+= "\n";
						//toastr.success(response.result.batchNo+" Batches successfully imported!", 'Done');
					}
					
					
				});
            }
	}
	
	
	
});

bpoApps.controller('TechnicalScrutinyDeleteDataController', function($scope,deletepurgedata,toastr)
{
   
    $scope.formdata = {};
$scope.purgeData = function(){
  //alert($scope.formdata.clgDate);
  var dt = new Date($scope.formdata.clgDate) 
  
  var date = $scope.formatDate(dt);
 
        $scope.deletepurgedata = deletepurgedata.get({"clgDate": date});
                $scope.deletepurgedata.$promise.then(function (response) {
                  //  alert(response.result);
                    if(response.result == 0){
                         toastr.success("No Record Found ", 'Information');
                    }else{
                        toastr.success(response.result + (response.result == 1 ?  +' Record ': ' Records') +" Successfully Deleted", 'Done');
                       
                    }
                });
   }
   $scope.formatDate = function(date){
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');

   }
})

bpoApps.controller('TechnicalScrutinySearchStatusController', function($scope,toastr,SearchStatus,ngTableParams,$filter)
{
   
	 $scope.formdata = {};
	
	$scope.chequeStatus = function(){
	 if($scope.formdata.accountNo==undefined || $scope.formdata.accountNo=="")
	 {
		 $scope.formdata.accountNo=0
	 }
	 if($scope.formdata.chequeNo==undefined || $scope.formdata.chequeNo=="")
	 {
		 $scope.formdata.chequeNo=0
	 }
    $scope.searchedData = SearchStatus.get({"account":$scope.formdata.accountNo,"cheque":$scope.formdata.chequeNo});
    $scope.searchedData.$promise.then(function (response) {
         	 if(response.result == 0){
				 toastr.info("No records found")
				  $scope.tableParams.reload();
			 }
			 else
			 {
				              	$scope.formdata=response.result;

                       $scope.tableParams.reload();
             }
           });
   		}

		$scope.tableParams = new ngTableParams({
				debugMode: true,
				page: 1, 
				count: 10,
				sorting: {
  						fullName: 'desc',
						ApplicationNo: 'desc',
						batchNo: 'desc'
                },
				filter: {
				fullName: '',
				ApplicationNo: '',
				batchNo: ''
				}

				}, {
				total: $scope.formdata.length,
				getData: function ($defer, params) {
				var filteredData = params.filter() ? $filter('filter')($scope.formdata, params.filter()) : $scope.formdata;
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData; 

				params.total(orderedData.length);
				$defer.resolve($scope.data = orderedData.slice((params.page() -1) * params.count(), params.page() * params.count())); 
				}
				});

})
