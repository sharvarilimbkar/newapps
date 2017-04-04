// JavaScript Document

bpoApps.controller("ALPLMasterImport",function($scope,toastr,CORE_CONFIG,WEB_API,$rootScope,Upload,PLDECSVImport)
{
	$scope.currentFileName	= "";
	$scope.logs = "";
	
	$scope.masterTbl = {
		fileAcco: {
			"tbl":"plde_accommodationtype",
			"primaryWhr":" AND accoId ",
			"primary":"accoId",
			"json":"alplmasterAcco"
		},
		fileCompNature: {
			"tbl":"plde_companynature",
			"primaryWhr":" AND companyNatureId ",
			"primary":"companyNatureId",
			"json":"alplmasterCompNature"
		},
		fileCustCategory: {
			"tbl":"plde_custcategory",
			"primaryWhr":" AND custCatId",
			"primary":"custCatId",
			"json":"alplmastercustcategory"
		},
		fileDesignation: {
			"tbl":"plde_designation",
			"primaryWhr":" AND designationId",
			"primary":"designationId",
			"json":"alplmasterDesignation"
		},
		fileOccupationType: {
			"tbl":"plde_occupationtype",
			"primaryWhr":" AND occupationTypeId",
			"primary":"occupationTypeId",
			"json":"alplmasterOccupationType"
		},
		fileCompNature: {
			"tbl":"plde_companynature",
			"primaryWhr":" AND companyNatureId ",
			"primary":"companyNatureId",
			"json":"alplmasterCompNature"
		},
		fileCompNature: {
			"tbl":"plde_companynature",
			"primaryWhr":" AND companyNatureId ",
			"primary":"companyNatureId",
			"json":"alplmasterCompNature"
		},
		fileCompNature: {
			"tbl":"plde_companynature",
			"primaryWhr":" AND companyNatureId ",
			"primary":"companyNatureId",
			"json":"alplmasterCompNature"
		},
		fileCompNature: {
			"tbl":"plde_companynature",
			"primaryWhr":" AND companyNatureId ",
			"primary":"companyNatureId",
			"json":"alplmasterCompNature"
		},
		fileCompNature: {
			"tbl":"plde_companynature",
			"primaryWhr":" AND companyNatureId ",
			"primary":"companyNatureId",
			"json":"alplmasterCompNature"
		},
	}
	
	$scope.fileObjects = {
			fileAcco: "",
			fileCompNature: "",
	};

	$scope.fileData= {
			fileAcco: "",
			fileCompNature: "",
	};
	
	$scope.serverFile= {
			fileAcco: "",
			fileCompNature: "",
	};
	
	
	$scope.subForm = function(file,masterTbl,fileObjects,fileData,serverFile,masterTbl,title){

		var arrFile = fileData.split(".");
		fileData = arrFile[0];
		
		if(arrFile[1]!="csv")
		{
			toastr.error('Only .csv file is allowed ', 'Error')
		}
		else
		{	
			$scope.formdata = {
					 "file":fileObjects,
					 "folder":"ALPL_IMPORT_CSV"
				};
										
			$file = Upload.upload({
			  url: CORE_CONFIG.WEB_SERVICE+WEB_API.UPLOAD,
			  data: $scope.formdata,
			});
						
			$file.then(function (response) {
				
					if(response.data.status == "success")
					{
						$scope.logs += title+" CSV Uploaded successfully.\n";
						serverFile = response.data.result.upload_data.file_name;	
						// INITIATE IMPORT WEB SERVICE FOR CSV IMPORT
 
						var extData = {};
						$scope.csv = PLDECSVImport.get({
							"tbl":masterTbl.tbl,
							"primary":masterTbl.primary,
							"file":serverFile.split(".")[0],
							"folderId":"ALPL_IMPORT_CSV",
							"json":masterTbl.json,
							"extData":JSON.stringify(extData),
							"extention":"csv",
							"separator":","});
							
						$scope.csv.$promise.then(function(result){	
							$scope.logs += title+" CSV Imported successfully with "+result.result.totalRows+" Records on .\n";	
							$scope.logs += "-----------------------------------------------------------------------\n";	
							toastr.success(title+' CSV Imported successfully', 'Error')
						});
					}
					else
					{
							console.log("ERROR");	
					}
				}, function (response) {
					
				  if (response.status > 0)
						$scope.logs += " Error:"+response.data+"\n";
				}, function (evt) {
					//$timeout($scope.progressbar.complete(), 1000);	
					//file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
				}
			);

		}
	}
	
});



bpoApps.controller("ALPL_uploadController",function($scope,Sections,Fields,Upload,$timeout,toastr,CORE_CONFIG,WEB_API,Batch,CSVImport,$rootScope,
DuplicateRecords,ExcelDuplicateRecords,InsertBatchType)
{	
	
	$scope.logs = "";
	$scope.currentFileName = "";
	$scope.currentRow = 0;
	$scope.formdata1={};
	$scope.formdata = {
			file: "",
			
		};
	
	$scope.formdata1.applicationType="AL";
	$scope.file = Upload;	
	$scope.sections = Sections.get({"id":"3"});
	$scope.param = {};	
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


   $scope.param={};

   $scope.duplicate=0;
	$scope.isDB=Array();
	$scope.isExcel=Array();
	//mergedarray=Array();
	$scope.subForm = function(file){
		//FETCHING FILE EXTENSION FOR VALIDATION 
		var arrFile = $scope.param.file.split(".");
		$scope.param.file = arrFile[1];
		
		if($scope.param.file!="csv")
		{
			toastr.error('Only .csv files allowed ', 'Error')
		}
		else
		{	
				$scope.formdata = {
						 "file":file,
						 "folder":"ALPL_IMPORT_CSV"
					};
					

					
				$file = Upload.upload({
				  url: CORE_CONFIG.WEB_SERVICE+WEB_API.UPLOAD,
				  data: $scope.formdata,
				});
			
				
			
				$file.then(function (response) {
					
					if(response.data.status == "success"){
						
						$scope.logs += " CSV Uploaded successfully.";
						
						$scope.currentFileName = response.data.result.upload_data.file_name;
						
						// GET BATCH ID GENERATED
						$scope.batch = new Batch();						
						$scope.batch.appId = "1"; //"{appId:'1',batchId:'0'}";
						$scope.batch.batchId = "0";
						$scope.batch.uploadedBy=$rootScope.SESS_USER.userId;
						
						$scope.batch.$save(function(result){
								
								$scope.batchType=new InsertBatchType();
								$scope.batchType.batchId= result.result;
								$scope.batchType.applicationType=$scope.formdata1.applicationType;
								$scope.batchType.$save(function(response){
								
								// INITIATE IMPORT WEB SERVICE FOR BATCH ID AND UPLOADD FILE
								var arrFile = $scope.currentFileName.split(".");
								$scope.currentFileName = arrFile[0];
								var extData = {batchId:result.result};
								$scope.batch.batchId = result.result;
								$scope.csv = CSVImport.get({"file":$scope.currentFileName,"folderId":"ALPL_IMPORT_CSV","json":"alplimport","extData":JSON.stringify(extData),"extention":"csv","separator":",","prefix":"true"});
								$scope.csv.$promise.then(function(result){		
											
									$scope.totalrows=0;
									$scope.duplicate=0;
							
									console.log("upload result --->"+JSON.stringify(result.result.total))
									$scope.batchName=result.result.batchName;
									$scope.totalrows=result.result.totalRows;
									
									$scope.batchAbr=result.result.batchAbr;
									$scope.getRecords=DuplicateRecords.get({"batchId":$scope.batch.batchId})
									$scope.getRecords.$promise.then(function(DBresult)
									{
										$scope.duplicate+=DBresult.result;
										$scope.getRecords=ExcelDuplicateRecords.get({"batchId":$scope.batch.batchId,"batchName":$scope.batchAbr})
										$scope.getRecords.$promise.then(function(Excelresponse){
										
										$scope.excel=Excelresponse.result.duplicate;
										$scope.totalForDay=Excelresponse.result.total;
										$scope.logs += "\n Batch Id : "+$scope.batchName;
										$scope.logs += "\n Database Duplicate Records : "+$scope.duplicate;
										$scope.logs += "\n Excel Duplicate Records : "+$scope.excel
										$scope.correctrecords=$scope.totalrows-$scope.duplicate-$scope.excel;
										$scope.logs += "\n Unique Records : "+$scope.correctrecords;
										toastr.success('AL/PL CSV Imported Successfully with Batch Id '+$scope.batchName, 'Done')	
										$scope.logs += "\n Total Unique Records For The Day : "+$scope.totalForDay;
										$scope.logs += "\n------------------------------------------------\n";
										$scope.formdata.file="";
										
									})
												
								})
									
									
							});	
						});
						
						
				})
						
			}
			else{
						console.log("ERROR");	
					}
					
					//$scope.file = Upload;	
				
				}, function (response) {
					
				  if (response.status > 0){
					//$scope.`Msg = response.status + ': ' + response.data;
				  	//$timeout($scope.progressbar.complete(), 1000);	

				  }
				}, function (evt) {
				
				  	//$timeout($scope.progressbar.complete(), 1000);	
                    //file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
				
				});

		}
	}


});


bpoApps.controller("ALPL_batchallocationController",function($scope,Sections,Fields,$filter,ngTableParams,ProcessUsers,Process,Batches,Users
,AllocateApplication,Release,BatchApplication,toastr,GetALPLUsers){
		
		$scope.currentRow = 0;
		$scope.formdata = {};
		$scope.batchApplications = Array();
		$scope.sections = Sections.get({"id":"4"});
	
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
		$scope.processChange=function(id){
		$scope.batches.model="";
		$scope.selectedProcessId=id;
				$scope.processUsers = GetALPLUsers.get({"processId":$scope.selectedProcessId});
				$scope.processUsers.$promise.then(function(result){
					if(result.result=="")
									{
										toastr.error('No User Allocated For The Process', 'Error!')
										//toastr.error()
										$scope.tableParams.reload();
									}
				})
		$scope.batches = Batches.get({"processId":$scope.selectedProcessId});
		$scope.batchApplications = BatchApplication.get({"batchId":0,"processId":$scope.selectedProcessId})		
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
		console.log("------>"+JSON.stringify($scope.batches));		 
		}
	

		
							
		$scope.batchChange=function(id){
				//("result-----------------------"+JSON.stringify($scope.selectedProcessId))
				$scope.batchApplications = BatchApplication.get({"batchId":id,"processId":$scope.selectedProcessId})		
	
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
				
				
				
		$scope.selectAll = function() {
		$scope.checkAll=!$scope.checkAll;
		for(var i=0;i<$scope.batchApplications.length;i++) $scope.batchApplications[i].isSelected = $scope.checkAll;
		console.log("$scope.batchApplications-------------"+JSON.stringify($scope.batchApplications))
	  };
	
	
	
	
	 $scope.allocateclicked=function(){
console.log("------<<<<<"+JSON.stringify($scope.processUsers.model));
	var arrallocationId = Array();
		if($scope.processUsers.model==null)
		{
			toastr.error("Please Select User For Allocation","Error");
		}
		else
		{
		if($scope.batchApplications!=0){
		
				for(var i=0;i< $scope.batchApplications.length;i++){
						$scope.AllocateApplication = new AllocateApplication();
						 
						if($scope.batchApplications[i].isSelected){
							arrallocationId.push($scope.batchApplications[i].applicationId);
						}
				 }

			 			$scope.AllocateApplication.applicationId=arrallocationId.toString();			
						$scope.AllocateApplication.processId=$scope.process.model;
						$scope.AllocateApplication.userId=$scope.processUsers.model;
						$scope.AllocateApplication.$save(function(response){
						toastr.success('Applications allocated to user', 'Applications Allocated!')
						$scope.batchApplications = Array();
						$scope.AllocateApplication = Array();
						$scope.tableParams.reload();	
						$scope.process.model="";
						$scope.batches.model="";
						$scope.processUsers.model="";
						});
		
		 }else{
			 alert("please select application to allocate")
		 }
	} }
	 
						
					$scope.tableParams = new ngTableParams({
						debugMode: true,
						page: 1, 
						count: 10,
						sorting: {
								//fullName: 'desc',
								ApplicationNo: 'desc',
								batchNo: 'desc'
						},
						filter: {
							//fullName: '',
							ApplicationNo: '',
							batchNo: ''
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



bpoApps.controller("ALPL_releaseController",function($scope,Release,ngTableParams,SearchRelease,Batches,Applications,Users,$filter,DeleteRelease,toastr){

$scope.searchRelease = Array();

$scope.getAllItems = function(result){ }
	
  $scope.getddlFilterData = {
    model: 1,
    availableOptions: [
      {id: '1', name: 'Users'},
      {id: '2', name: 'Batch'},
      {id: '3', name: 'Application'}
    ]
   };
   
	$scope.getddlSearchData={
		model:null,
		result:''
	}
	
	$scope.filterChange=function(id){
	
		if(id=="1")
		{
			$scope.getddlSearchData= Users.get();
			$scope.getddlSearchData.$promise.then(function(result){
						$scope.searchReleasedata= result.result;
						if(result.result=="")
									{
										toastr.error('No User Found', 'Error!')
										//toastr.error()
									}
			});
            
		}else if(id=="2"){
            
			$scope.getddlSearchData= Batches.get();
			
			$scope.getddlSearchData.$promise.then(function(result){
						$scope.searchReleasedata= result.result;
						if(result.result=="")
									{
										toastr.error('No Batch Yet Created', 'Error!')
										//toastr.error()
									}
			});
			
							

		}else if(id=="3"){
            $scope.getddlSearchData=Applications.get();
			$scope.getddlSearchData.$promise.then(function(result){
						$scope.searchReleasedata= result.result;
						if(result.result=="")
									{
										toastr.error('No Application To Release', 'Error!')
										//toastr.error()
									}
			});
	      
	}

	}
	
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

		
		 $scope.searchReleaseData = SearchRelease.get({'key':$scope.selectedKey,'value':$scope.selectedValue})		
	    	$scope.searchReleaseData.$promise.then(function(result){
						$scope.searchRelease= result.result;
						if(result.result=="")
									{
										toastr.error('No Application To Release', 'Error!')
										//toastr.error()
									}
						for(var i=0;i<$scope.searchRelease.length;i++)
						 $scope.searchRelease[i].isSelected = false;
						console.log("$scope.searchRelease---"+JSON.stringify($scope.searchRelease))
						 $scope.tableParams.reload();
		});	


	}

		$scope.selectAll = function() {
		
		$scope.checkAll=!$scope.checkAll;
		for(var i=0;i<$scope.searchRelease.length;i++) $scope.searchRelease[i].isSelected = $scope.checkAll;
		console.log("-------->>>>"+JSON.stringify($scope.searchRelease));
		
	  };
	  
	  

var arrallocationId = Array();
	
	 $scope.releaseclicked=function(){
		if($scope.searchRelease!=0){
		
			console.log("####>"+JSON.stringify($scope.searchRelease));
		
				for(var i=0;i< $scope.searchRelease.length;i++){
						 
						if($scope.searchRelease[i].isSelected){
					        console.log("SELECTED:releaseeeeeee>"+JSON.stringify($scope.searchRelease[i]));
							arrallocationId.push($scope.searchRelease[i].allocationId);
							console.log("SELECTED:releaseeeeeee>"+JSON.stringify(arrallocationId))
						}
				 }

						
				$scope.DeleteRelease = DeleteRelease.get({"allocationId": arrallocationId.toString()});
					$scope.DeleteRelease.$promise.then(function (response) {
						toastr.success('All of selected Applications are released', 'Applications Release!')
						$scope.searchButtonClicked();
					});		
		 }else{
			 toastr.error("please select application to allocate","Error")
		 }
	 }
	
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

 $scope.filterChange($scope.getddlFilterData.model);


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


bpoApps.controller("ALPL_dataEntryController",function($scope,$rootScope,Sections,Fields,$filter,ngTableParams,Process,Batches,Users,$routeParams,AlplNextRecord,toastr,GetPrviousRemarks,$parse,CheckAps){

	$scope.UserId = $rootScope.SESS_USER.userId;
	$scope.isStarted=false;
	$scope.currentRow = 0;
	$scope.formdata = {};
	$scope.application = {};
	$scope.selectedReason = {};	 
	$scope.previousRemarks=false;
	$scope.ProcessId = $routeParams.process;
	$scope.process = Process.get({"id":$scope.ProcessId});
	$scope.process.$promise.then(function(result){
		$scope.process = result.result[0];
	});
	
	$scope.sections = Sections.get({"id":"13"});
	
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
	$scope.logs="";
	$scope.showlog=false;
	$scope.getRemarks=function()
	{  $scope.showlog=true;
		$scope.remarks=GetPrviousRemarks.get({"processId":$scope.ProcessId,"applicationId":$scope.formdata.applicationId});
		$scope.remarks.$promise.then(function(result){
		
			if(result.result == ""){
				toastr.error('No Remarks found', 'Error');				
				}
				else
				{
					console.log(result);
					console.log(">>><<<><<<<<<>"+JSON.stringify(result.result[0].entryId));
		
					if($scope.process.processName=='Field Investigation')
					{
						if(result.result.DEremark!='')
						{
							$scope.logs="DE Remark :"+result.result[0].DEremark;
						}
					}
					else if($scope.process.processName=='QC')
					{
						if(result.result.DEremark!='')
						{
							$scope.logs="DE Remark :"+result.result[0].DEremark;
						}
						if(result.result.FIremark!='')
						{
							$scope.logs+="\n FI Remark :"+result.result[0].FIremark;
						}
					} 
					else if($scope.process.processName=='CAM')
					{
						if(result.result.DEremark!='')
						{
							$scope.logs="DE Remark :"+result.result[0].DEremark;
						}
						if(result.result.FIremark!='')
						{
							$scope.logs+="\n FI Remark :"+result.result[0].FIremark;
						}
						
						if(result.result.QCremark!='')
						{
							$scope.logs+="\n QC Remark :"+result.result[0].QCremark;
						}
					} 
					else if($scope.process.processName=='Audit Entry')
					{
						if(result.result.DEremark!='')
						{
							$scope.logs="DE Remark :"+result.result[0].DEremark;
						}
						if(result.result.FIremark!='')
						{
							$scope.logs+="\n FI Remark :"+result.result[0].FIremark;
						}
						if(result.result.QCremark!='')
						{
							$scope.logs+="\n QC Remark :"+result.result[0].QCremark;
						}
						if(result.result.CAMremark!='')
						{
							$scope.logs+="\n CAM Remark :"+result.result[0].CAMremark;
						}
					} 
					
				}
		})
		
	}
	$scope.getNext = function(){
		//console.log("--** Next Record"+$scope.ProcessId +"userId"+$scope.UserId);

		$scope.application = AlplNextRecord.get({"processId":$scope.ProcessId,"userId":$scope.UserId});
		$scope.application.$promise.then(function(result){
			

			if(result.status == "error"){
				toastr.error('No Application found', 'Error');				
				$scope.isStarted = false;
			}else
			{
				if(result.result.length > 0){
					//alert("in")
					
					$scope.previousRemarks=true;
	//				$scope.application = result.result[0];
					$scope.formdata.applicationNo = result.result[0].applicationNo;
					$scope.formdata.allocationId = result.result[0].allocationId;
					$scope.formdata.apsNo = result.result[0].apsNo;
					$scope.formdata.batchId = result.result[0].batchId;
					$scope.formdata.batchAlias = result.result[0].batchAlias;	
					$scope.formdata.entryId = result.result[0].entryId;	
					$scope.formdata.applicationId=result.result[0].applicationId;	
					$scope.formdata.remark = "";
					$scope.isStarted = true;
				}	
				
			}
			
			
	});
			
	}
	
	$scope.getAllItems = function(data, datalist, accessor, scopevar){
		
	}

	$scope.isValidData = false;

	
	$scope.endEntry = function(){
		console.log("-----<<<<<"+JSON.stringify($scope.formdata.apsNo));
		if($scope.formdata.apsNo=="")
		{toastr.error("Enter ApsNo To Proceed","Error")}
		else
		{
			$scope.checkAps=CheckAps.get({"applicationId":$scope.formdata.applicationId,"apsNo":$scope.formdata.apsNo});
		
		  $scope.checkAps.$promise.then(function(response){
			console.log("---->"+JSON.stringify(response));
			if(response.result==false && !$scope.formdata.rejected)
			{
				toastr.error("ApsNo Already Exists ","Error");
				$scope.isValidData = false;
			}
			else
			{
				$scope.application.entryId = $scope.formdata.entryId ;
				$scope.application.allocationId = $scope.formdata.allocationId;		
				$scope.application.processId = $scope.ProcessId;	
				if($scope.formdata.rejected)
				{
					console.log("*******************");
					console.log($scope.selectedReason.selectedItem);
					console.log($scope.formdata.remarkDescription);
					if(angular.isUndefined($scope.selectedReason.selectedItem)  && $scope.formdata.remarkDescription=="")
					{
						toastr.error("Select Or Enter Rejection Reason","Error");
						$scope.isValidData = false;
					}
					else
					{
							if($scope.formdata.remarkDescription!="")
							{
								$scope.application.rejectReasonId = 0;	
								$scope.application.customReason=$scope.formdata.remarkDescription;
							}
						
							else
							{	
						
								$scope.application.rejectReasonId = $scope.selectedReason.selectedItem.remarkId;
							}
							$scope.remarkType=""
							$scope.isValidData = true;
					}
				}
				else
				{
						$scope.application.rejectReasonId = 0;	
						$scope.remarkType="Custom"
						$scope.isValidData = true;
				}
				
				$scope.application.remark = [
				{
				"Custom":$scope.formdata.remark,
				"RV":$scope.formdata.RV,
				"OV":$scope.formdata.OV,
				"Waiver":$scope.formdata.waiverrmrk,
				"FNCB":$scope.formdata.FNCB,
				"FNCS":$scope.formdata.FNCS
				}
			]
		
			if($scope.isValidData){
				$scope.application.$save(function(response){
				toastr.success('Application Tracking Saved', 'Done')
				$scope.isStarted = false;
				$scope.formdata = {};
				$scope.application = {};
				$scope.selectedReason = {};	 
				$scope.logs="";
				$scope.showlog=false;
				$scope.previousRemarks=false;
		});
			}
	  }
    })}
}

	
	

});


bpoApps.controller("ALPL_reportController",function($scope,MIS_SUMMARY_REPORT,ngTableParams,$filter,MISConsolidatedReport){
	
	$scope.formats = ['yy/MM/dd ', 'yyyy-MM-dd ', 'dd.MM.yyyy', 'shortDate'];
  		$scope.format = $scope.formats[0];
	$scope.getAllItems = function(item){
		
	}
	$scope.formdata1={};
	$scope.formdata1.reportType="Consolidated";
	$scope.formdata1.selectedRadio="AL";
	$scope.applicationType="";
	$scope.searchparams={
		fromDate:"",
		toDate:""
		};
		$scope.formdata=Array();
		
	$scope.selectedLocation={};
	$scope.showtb="";
	$scope.report= function()
	{
		//console.log("-->Consolidated Report"+$scope.selectedRadio)
			 $scope.to="";
			$scope.from="";
			$scope.LocationId="";
			$scope.application_Type="";
			
			if($scope.searchparams.fromDate=="")
			{
				$scope.from=0;
			}
			else
			{
				//$scope.from=$scope.searchparams.fromDate;
				$scope.fromDate = $scope.searchparams.fromDate.toString();
				$scope.fromYr = ($scope.fromDate.split(' ')[0]);
				$scope.tmpFrmMnth = ($scope.fromDate.split(' ')[1]);
				$scope.frmDate= ($scope.fromDate.split(' ')[2]);
				$scope.frmMnth = ($scope.tmpFrmMnth.split(',')[0]);
				$scope.from=$scope.fromYr +'-'+$scope.frmMnth+'-'+$scope.frmDate;
			}
			if($scope.searchparams.toDate=="")
			{
				$scope.to=0;
			}
			else
			{
				//$scope.to=$scope.searchparams.fromDate;
				$scope.to=$scope.searchparams.toDate.toString();
				$scope.toDate =$scope.searchparams.toDate.toString();
    			$scope.toYr = ($scope.toDate.split(' ')[0]);
				$scope.tmpToMnth = ($scope.toDate.split(' ')[1]);
				$scope.toDate= ($scope.toDate.split(' ')[2]);
				$scope.toMnth = ($scope.tmpToMnth.split(',')[0]);
				$scope.to=$scope.toYr+'-'+$scope.toMnth+'-'+$scope.toDate;
			}
			if($scope.selectedLocation.selectedItem == null){
			
				$scope.LocationId=0;
			}
			else
			{
				$scope.LocationId=$scope.selectedLocation.selectedItem.locationId;
			}
			if($scope.applicationType == null){
			
				$scope.applicationType=0;
			}
			else
			{
				$scope.applicationType=$scope.formdata1.selectedRadio;
			}
			if(($scope.from!=0 && $scope.to!=0 ) || ($scope.from==0 && $scope.to==0) )
			{
		   		if($scope.formdata1.reportType=='Summary')
		   		{
			   
			   $scope.showtb=true;
			   //MIS_SUMMARY_REPORT
				$scope.getreport=MIS_SUMMARY_REPORT.get({
				"from":$scope.from,
				"to":$scope.to,
				"locationId":$scope.LocationId,
				"applicationType":$scope.applicationType
				})
				//alert("summary"+JSON.stringify($scope.getreport));
		    $scope.getreport.$promise.then(function(success){
				$scope.formdata=success.result;
				console.log("==>> SUMMARY"+JSON.stringify(success))
				$scope.tableParams.reload();
				$scope.formdata={};
				$scope.selectedLocation={};
				})
		  	
		   }
		   else
		   {
			   alert(">>")
			    $scope.showtb=false;
				$scope.getreport=MISConsolidatedReport.get({
				"from":$scope.from,
				"to":$scope.to,
				"locationId":$scope.LocationId,
				"applicationType":$scope.applicationType
				})
				console.log(">>>"+$scope.applicationType);
		    	$scope.getreport.$promise.then(function(success){
				$scope.formdata=success.result;
				console.log("==>> Got result"+$scope.reportType)
				$scope.tableParams.reload();
				$scope.formdata={};
				$scope.selectedLocation={};
				})
		   }
		   $scope.tableParams.reload();
		}
			else
			{
				toastr.error('Please Select From And To Date','Error'+JSON.stringify($scope.from));
				
				
			}	
				
}
		
		$scope.tableParams = new ngTableParams({
				debugMode: true,
				page: 1, 
				count: 10,
				sorting: {
  						location: 'desc',
						Batch_No: 'desc',
						applicationNo:'desc',
						apsNo:'desc',
						Uploaded_By:'desc',
						Status:'desc',
						batchNo:'desc',
						DE:'desc',
						FI:'desc',
						QC:'desc',
						CAM:'desc',
						Audit:'desc'
						
                },
				filter: {
						location: '',
						Batch_No: '',
						applicationNo:'',
						apsNo:'',
						Uploaded_By:'',
						Status:'',
						batchNo:'',
						DE:'',
						FI:'',
						QC:'',
						CAM:'',
						Audit:'',
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

		
	
});

bpoApps.controller("ALPL_reportConsolidatedController",function($scope,MIS_SUMMARY_REPORT,ngTableParams,$filter,MISConsolidatedReport,$location,toastr){
	
	
	$scope.goSummary = function(){
 
	$location.path('/ALPL/report/summary')
	}
	
	$scope.formats = ['yy/MM/dd ', 'yyyy-MM-dd ', 'dd.MM.yyyy', 'shortDate'];
  		$scope.format = $scope.formats[0];
	$scope.getAllItems = function(item){
		
	}
	$scope.formdata1={};
	$scope.formdata1.reportType="Consolidated";
	$scope.applicationType="";
	$scope.searchparams={
		fromDate:"",
		toDate:""
		};
		$scope.formdata=Array();
		
	$scope.selectedLocation={};
	$scope.showtb="";
	$scope.report= function()
	{
		//console.log("-->Consolidated Report"+$scope.selectedRadio)
			 $scope.to="";
			$scope.from="";
			$scope.LocationId="";
			$scope.application_Type="";
			
			if($scope.searchparams.fromDate=="")
			{
				$scope.from=0;
			}
			else
			{
				//$scope.from=$scope.searchparams.fromDate;
				$scope.fromDate = $scope.searchparams.fromDate.toString();
				$scope.fromYr = ($scope.fromDate.split(' ')[0]);
				$scope.tmpFrmMnth = ($scope.fromDate.split(' ')[1]);
				$scope.frmDate= ($scope.fromDate.split(' ')[2]);
				$scope.frmMnth = ($scope.tmpFrmMnth.split(',')[0]);
				$scope.from=$scope.fromYr +'-'+$scope.frmMnth+'-'+$scope.frmDate;
			}
			if($scope.searchparams.toDate=="")
			{
				$scope.to=0;
			}
			else
			{
				//$scope.to=$scope.searchparams.fromDate;
				$scope.to=$scope.searchparams.toDate.toString();
				$scope.toDate =$scope.searchparams.toDate.toString();
    			$scope.toYr = ($scope.toDate.split(' ')[0]);
				$scope.tmpToMnth = ($scope.toDate.split(' ')[1]);
				$scope.toDate= ($scope.toDate.split(' ')[2]);
				$scope.toMnth = ($scope.tmpToMnth.split(',')[0]);
				$scope.to=$scope.toYr+'-'+$scope.toMnth+'-'+$scope.toDate;
			}
			if($scope.selectedLocation.selectedItem == null){
			
				$scope.LocationId=0;
			}
			else
			{
				$scope.LocationId=$scope.selectedLocation.selectedItem.locationId;
			}
			if($scope.applicationType == null){
			
				$scope.application_Type=0;
			}
			else
			{
				$scope.application_Type=$scope.applicationType;
			}
			if(($scope.from!=0 && $scope.to!=0 ) || ($scope.from==0 && $scope.to==0) )
			{
				if($scope.formdata1.reportType=='Summary')
		   		{
			   
			   $scope.showtb=true;
			   //MIS_SUMMARY_REPORT
				$scope.getreport=MIS_SUMMARY_REPORT.get({
				"from":$scope.from,
				"to":$scope.to,
				"locationId":$scope.LocationId,
				"applicationType":$scope.application_Type
				})
				//alert("summary"+JSON.stringify($scope.getreport));
		    	$scope.getreport.$promise.then(function(success){
				$scope.formdata=success.result;
				console.log("==>> SUMMARY"+JSON.stringify(success))
				$scope.tableParams.reload();
				$scope.formdata={};
				$scope.selectedLocation={};
				})
		  	
		   }
		   else
		   {
			    $scope.showtb=false;
				$scope.getreport=MISConsolidatedReport.get({
				"from":$scope.from,
				"to":$scope.to,
				"locationId":$scope.LocationId,
				"applicationType":$scope.application_Type
				})
				
		    	$scope.getreport.$promise.then(function(success){
				$scope.formdata=success.result;
				//console.log("==>> Got result"+$scope.reportType)
				$scope.tableParams.reload();
				$scope.formdata={};
				$scope.selectedLocation={};
				})
		   }
		   $scope.tableParams.reload();
		}
			else
			{
				toastr.error('Please Select From And To Date','Error'+JSON.stringify($scope.from));
				
				
			}	
				
}
		
		$scope.tableParams = new ngTableParams({
				debugMode: true,
				page: 1, 
				count: 10,
				sorting: {
  						location: 'desc',
						Batch_No: 'desc',
						applicationNo:'desc',
						apsNo:'desc',
						Uploaded_By:'desc',
						Status:'desc',
						batchNo:'desc',
						DE:'desc',
						FI:'desc',
						QC:'desc',
						CAM:'desc',
						Audit:'desc'
						
                },
				filter: {
						location: '',
						Batch_No: '',
						applicationNo:'',
						apsNo:'',
						Uploaded_By:'',
						Status:'',
						batchNo:'',
						DE:'',
						FI:'',
						QC:'',
						CAM:'',
						Audit:'',
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

		
	
});

bpoApps.controller("ALPL_reportSummaryController",function($scope,MIS_SUMMARY_REPORT,ngTableParams,$filter,MISConsolidatedReport,$location,toastr){
	console.log("summary controller")
	$scope.goConsolidated = function(){
	$location.path('/ALPL/report/consolidated')
	}
	
	$scope.formats = ['yy/MM/dd ', 'yyyy-MM-dd ', 'dd.MM.yyyy', 'shortDate'];
  		$scope.format = $scope.formats[0];
	$scope.getAllItems = function(item){
		
	}
	$scope.formdata1={};
	$scope.formdata1.reportType="Summary";
	$scope.formdata1.selectedRadio="AL";
	$scope.applicationType="";
	$scope.searchparams={
		fromDate:"",
		toDate:""
		};
		$scope.formdata=Array();
		
	$scope.selectedLocation={};
	$scope.showtb="";
	$scope.report= function()
	{
		//console.log("-->Consolidated Report"+$scope.selectedRadio)
			 $scope.to="";
			$scope.from="";
			$scope.LocationId="";
			$scope.application_Type="";
			
			if($scope.searchparams.fromDate=="")
			{
				$scope.from=0;
			}
			else
			{
				//$scope.from=$scope.searchparams.fromDate;
				$scope.fromDate = $scope.searchparams.fromDate.toString();
				$scope.fromYr = ($scope.fromDate.split(' ')[0]);
				$scope.tmpFrmMnth = ($scope.fromDate.split(' ')[1]);
				$scope.frmDate= ($scope.fromDate.split(' ')[2]);
				$scope.frmMnth = ($scope.tmpFrmMnth.split(',')[0]);
				$scope.from=$scope.fromYr +'-'+$scope.frmMnth+'-'+$scope.frmDate;
			}
			if($scope.searchparams.toDate=="")
			{
				$scope.to=0;
			}
			else
			{
				//$scope.to=$scope.searchparams.fromDate;
				$scope.to=$scope.searchparams.toDate.toString();
				$scope.toDate =$scope.searchparams.toDate.toString();
    			$scope.toYr = ($scope.toDate.split(' ')[0]);
				$scope.tmpToMnth = ($scope.toDate.split(' ')[1]);
				$scope.toDate= ($scope.toDate.split(' ')[2]);
				$scope.toMnth = ($scope.tmpToMnth.split(',')[0]);
				$scope.to=$scope.toYr+'-'+$scope.toMnth+'-'+$scope.toDate;
			}
			if($scope.selectedLocation.selectedItem == null){
			
				$scope.LocationId=0;
			}
			else
			{
				$scope.LocationId=$scope.selectedLocation.selectedItem.locationId;
			}
			if($scope.applicationType == null){
			
				$scope.applicationType=0;
			}
			else
			{
				$scope.applicationType=$scope.formdata1.selectedRadio;
			}
			if(($scope.from!=0 && $scope.to!=0 ) || ($scope.from==0 && $scope.to==0) )
			{
		   		if($scope.formdata1.reportType=='Summary')
		   		{
			   
			   $scope.showtb=true;
			   //MIS_SUMMARY_REPORT
				$scope.getreport=MIS_SUMMARY_REPORT.get({
				"from":$scope.from,
				"to":$scope.to,
				"locationId":$scope.LocationId,
				"applicationType":$scope.applicationType
				})
				//alert("summary"+JSON.stringify($scope.getreport));
		    $scope.getreport.$promise.then(function(success){
			
					$scope.formdata=success.result;
					//console.log("==>> SUMMARY"+JSON.stringify(success.result[0].batchType))
						$scope.tableParams.reload();
						$scope.formdata={};
					$scope.selectedLocation={};
					
			})
		  	
		   }
		   else
		   {
			    $scope.showtb=false;
				$scope.getreport=MISConsolidated.get({
				"from":$scope.from,
				"to":$scope.to,
				"locationId":$scope.LocationId,
				"applicationType":$scope.application_Type
				})
				
		    	$scope.getreport.$promise.then(function(success){
				$scope.formdata=success.result;
				
				$scope.tableParams.reload();
				$scope.formdata={};
				$scope.selectedLocation={};
					
				})
		   $scope.tableParams.reload();
	
		   }
		  	}
			else
			{
				toastr.error('Please Select From And To Date','Error'+JSON.stringify($scope.from));
				
				
			}	
				
}
		
		$scope.tableParams = new ngTableParams({
				debugMode: true,
				page: 1, 
				count: 10,
				sorting: {
  						location: 'desc',
						Batch_No: 'desc',
						applicationNo:'desc',
						apsNo:'desc',
						Uploaded_By:'desc',
						Status:'desc',
						batchNo:'desc',
						DE:'desc',
						FI:'desc',
						QC:'desc',
						CAM:'desc',
						Audit:'desc'
						
                },
				filter: {
						location: '',
						Batch_No: '',
						applicationNo:'',
						apsNo:'',
						Uploaded_By:'',
						Status:'',
						batchNo:'',
						DE:'',
						FI:'',
						QC:'',
						CAM:'',
						Audit:'',
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

		
	
});


bpoApps.controller("ALPL_userreportController",function($scope,Report_Performance,ngTableParams,$filter,Rejection_Report,toastr,$filter){
	
	$scope.getAllItems = function(result){
	}
	$scope.formats = ['yy/MM/dd ', 'yyyy-MM-dd ', 'dd.MM.yyyy', 'shortDate'];
  		$scope.format = $scope.formats[0];

	$scope.formdata=Array();
	$scope.searchparams={
		fromDate:"",
		toDate:""
		};
		$scope.selectedUser={selectedItem:""}
		$scope.selectedProcess={};
		$scope.selectedLocation={};
	
		  
		$scope.showtb=true;	
		$scope.getReport=function()
		{
			
			
			$scope.showtb=true;
			
			 $scope.to="";
			$scope.from="";
			$scope.UserId="";
			$scope.ProcessId="";
			$scope.LocationId="";
			
			
			if($scope.searchparams.fromDate=="")
			{
				$scope.from=0;
			}
			else
			{
				$scope.fromDate = $scope.searchparams.fromDate.toString();
				$scope.fromYr = ($scope.fromDate.split(' ')[0]);
				$scope.tmpFrmMnth = ($scope.fromDate.split(' ')[1]);
				$scope.frmDate= ($scope.fromDate.split(' ')[2]);
				$scope.frmMnth = ($scope.tmpFrmMnth.split(',')[0]);
				$scope.from=$scope.fromYr +'-'+$scope.frmMnth+'-'+$scope.frmDate;
			}
			if($scope.searchparams.toDate=="")
			{
				$scope.to=0;
			}
			else
			{
				$scope.to=$scope.searchparams.toDate.toString();
				$scope.toDate =$scope.searchparams.toDate.toString();
    			$scope.toYr = ($scope.toDate.split(' ')[0]);
				$scope.tmpToMnth = ($scope.toDate.split(' ')[1]);
				$scope.toDate= ($scope.toDate.split(' ')[2]);
				$scope.toMnth = ($scope.tmpToMnth.split(',')[0]);
				$scope.to=$scope.toYr+'-'+$scope.toMnth+'-'+$scope.toDate;

			
			}
			if($scope.selectedUser.selectedItem ==""){
				$scope.UserId=0;
			
			}
			else
			{
				$scope.UserId=$scope.selectedUser.selectedItem.userId;
			}
			
			if($scope.selectedProcess.selectedItem ==null){
			
				$scope.ProcessId=0;
			}
			else
			{
				$scope.ProcessId=$scope.selectedProcess.selectedItem.processId;
			}
			if($scope.selectedLocation.selectedItem == null){
			
				$scope.LocationId=0;
			}
			else
			{
				$scope.LocationId=$scope.selectedLocation.selectedItem.location;
			}
			
			if(($scope.from!=0 && $scope.to!=0 ) || ($scope.from==0 && $scope.to==0) )
			{
					$scope.report=Report_Performance.get({
					"user":$scope.UserId,
					"from":$scope.from,
					"to":$scope.to,
					"processId":$scope.ProcessId,
					"locationId":$scope.LocationId		
					})
					$scope.report.$promise.then(function(success){
						$scope.formdata=success.result;
						$scope.tableParams.reload();
					
						})
			$scope.tableParams.reload();			
			}
			
			else
			{
				toastr.error('Please Select From And To Date','Error'+JSON.stringify($scope.from));
				
				
			}
			}
		
		$scope.reportRejected=function()
		{
			$scope.showtb=false;
			$scope.report=Rejection_Report.get();
			$scope.report.$promise.then(function(success){
				
				$scope.formdata=success.result;
				$scope.tableParams.reload();
			})
						
		}
		
		$scope.tableParams = new ngTableParams({
				debugMode: true,
				page: 1, 
				count: 10,
				sorting: {
  						userId: 'desc',
						fullName: 'desc',
						processName:'desc',
						location:'desc',
						ALPL_Status:'desc',
						apsNo:'desc'
						
                },
				filter: {
						userId: '',
						fullName: '',
						processName:'',
						location:'',
						ALPL_Status:'',
						apsNo:''
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



	});

bpoApps.controller("ALPL_userreportPerformanceController",function($scope,Report_Performance,ngTableParams,$filter,Rejection_Report,toastr,$filter,$location){

//alert("TEST");
	 $scope.formdata1={};
	$scope.formdata1.reportType="Performance";

	
	$scope.moveRejection = function(){
		$location.path('/ALPL/userreport/rejection');
	}
	
	$scope.getAllItems = function(result){
	}
	$scope.formats = ['yy/MM/dd ', 'yyyy-MM-dd ', 'dd.MM.yyyy', 'shortDate'];
  		$scope.format = $scope.formats[0];

	$scope.formdata=Array();
	$scope.searchparams={
		fromDate:"",
		toDate:""
		};
		$scope.selectedUser={selectedItem:""}
		$scope.selectedProcess={};
		$scope.selectedLocation={};
	
		  
		$scope.showtb=true;	
		$scope.getReport=function()
		{
			
			
			$scope.showtb=true;
			
			 $scope.to="";
			$scope.from="";
			$scope.UserId="";
			$scope.ProcessId="";
			$scope.LocationId="";
			
			
			if($scope.searchparams.fromDate=="")
			{
				$scope.from=0;
			}
			else
			{
				$scope.fromDate = $scope.searchparams.fromDate.toString();
				$scope.fromYr = ($scope.fromDate.split(' ')[0]);
				$scope.tmpFrmMnth = ($scope.fromDate.split(' ')[1]);
				$scope.frmDate= ($scope.fromDate.split(' ')[2]);
				$scope.frmMnth = ($scope.tmpFrmMnth.split(',')[0]);
				$scope.from=$scope.fromYr +'-'+$scope.frmMnth+'-'+$scope.frmDate;
			}
			if($scope.searchparams.toDate=="")
			{
				$scope.to=0;
			}
			else
			{
				$scope.to=$scope.searchparams.toDate.toString();
				$scope.toDate =$scope.searchparams.toDate.toString();
    			$scope.toYr = ($scope.toDate.split(' ')[0]);
				$scope.tmpToMnth = ($scope.toDate.split(' ')[1]);
				$scope.toDate= ($scope.toDate.split(' ')[2]);
				$scope.toMnth = ($scope.tmpToMnth.split(',')[0]);
				$scope.to=$scope.toYr+'-'+$scope.toMnth+'-'+$scope.toDate;

			
			}
			if($scope.selectedUser.selectedItem ==""){
				$scope.UserId=0;
			
			}
			else
			{
				$scope.UserId=$scope.selectedUser.selectedItem.userId;
			}
			
			if($scope.selectedProcess.selectedItem ==null){
			
				$scope.ProcessId=0;
			}
			else
			{
				$scope.ProcessId=$scope.selectedProcess.selectedItem.processId;
			}
			if($scope.selectedLocation.selectedItem == null){
			
				$scope.LocationId=0;
			}
			else
			{
				$scope.LocationId=$scope.selectedLocation.selectedItem.location;
			}
			
			if(($scope.from!=0 && $scope.to!=0 ) || ($scope.from==0 && $scope.to==0) )
			{
					$scope.report=Report_Performance.get({
					"user":$scope.UserId,
					"from":$scope.from,
					"to":$scope.to,
					"processId":$scope.ProcessId,
					"locationId":$scope.LocationId		
					})
					$scope.report.$promise.then(function(success){
						
						$scope.formdata=success.result;
						$scope.tableParams.reload();
						
						})
			$scope.tableParams.reload();			
			}
			
			else
			{
				toastr.error('Please Select From And To Date','Error'+JSON.stringify($scope.from));
				
				
			}
			}
		
		$scope.reportRejected=function()
		{
			$scope.showtb=false;
			$scope.report=Rejection_Report.get({
					"user":$scope.UserId,
					"from":$scope.from,
					"to":$scope.to,
					"processId":$scope.ProcessId,
					"locationId":$scope.LocationId		
					});
			$scope.report.$promise.then(function(success){
				$scope.formdata=success.result;
				$scope.tableParams.reload();
			})
						
		}
		
		$scope.tableParams = new ngTableParams({
				debugMode: true,
				page: 1, 
				count: 10,
				sorting: {
  						userId: 'desc',
						fullName: 'desc',
						processName:'desc',
						location:'desc',
						ALPL_Status:'desc',
						apsNo:'desc'
						
                },
				filter: {
						userId: '',
						fullName: '',
						processName:'',
						location:'',
						ALPL_Status:'',
						apsNo:''
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



	});

bpoApps.controller("ALPL_userreportRejectionController",function($scope,Report_Performance,ngTableParams,$filter,Rejection_Report,toastr,$filter,$location){
	
		 $scope.formdata1={};
	$scope.formdata1.reportType="Rejection";


	$scope.movePerformance = function(){
		$location.path('/ALPL/userreport/performance');
	}


	$scope.getAllItems = function(result){
	}
	$scope.formats = ['yy/MM/dd ', 'yyyy-MM-dd ', 'dd.MM.yyyy', 'shortDate'];
  		$scope.format = $scope.formats[0];

	$scope.formdata=Array();
	$scope.searchparams={
		fromDate:"",
		toDate:""
		};
		$scope.selectedUser={selectedItem:""}
		$scope.selectedProcess={};
		$scope.selectedLocation={};
	
		  
		$scope.showtb=true;	
		$scope.reportRejected=function()
		{
			
			
			$scope.showtb=false;
			
			 $scope.to="";
			$scope.from="";
			$scope.UserId="";
			$scope.ProcessId="";
			$scope.LocationId="";
			
			
			if($scope.searchparams.fromDate=="")
			{
				$scope.from=0;
			}
			else
			{
				$scope.fromDate = $scope.searchparams.fromDate.toString();
				$scope.fromYr = ($scope.fromDate.split(' ')[0]);
				$scope.tmpFrmMnth = ($scope.fromDate.split(' ')[1]);
				$scope.frmDate= ($scope.fromDate.split(' ')[2]);
				$scope.frmMnth = ($scope.tmpFrmMnth.split(',')[0]);
				$scope.from=$scope.fromYr +'-'+$scope.frmMnth+'-'+$scope.frmDate;
			}
			if($scope.searchparams.toDate=="")
			{
				$scope.to=0;
			}
			else
			{
				$scope.to=$scope.searchparams.toDate.toString();
				$scope.toDate =$scope.searchparams.toDate.toString();
    			$scope.toYr = ($scope.toDate.split(' ')[0]);
				$scope.tmpToMnth = ($scope.toDate.split(' ')[1]);
				$scope.toDate= ($scope.toDate.split(' ')[2]);
				$scope.toMnth = ($scope.tmpToMnth.split(',')[0]);
				$scope.to=$scope.toYr+'-'+$scope.toMnth+'-'+$scope.toDate;

			
			}
			if($scope.selectedUser.selectedItem ==""){
				$scope.UserId=0;
			
			}
			else
			{
				$scope.UserId=$scope.selectedUser.selectedItem.userId;
			}
			
			if($scope.selectedProcess.selectedItem ==null){
			
				$scope.ProcessId=0;
			}
			else
			{
				$scope.ProcessId=$scope.selectedProcess.selectedItem.processId;
			}
			if($scope.selectedLocation.selectedItem == null){
			
				$scope.LocationId=0;
			}
			else
			{
				$scope.LocationId=$scope.selectedLocation.selectedItem.location;
			}
			
			if(($scope.from!=0 && $scope.to!=0 ) || ($scope.from==0 && $scope.to==0) )
			{
					$scope.report=Rejection_Report.get({
					"user":$scope.UserId,
					"from":$scope.from,
					"to":$scope.to,
					"processId":$scope.ProcessId,
					"locationId":$scope.LocationId		
					});
			$scope.report.$promise.then(function(success){
				$scope.formdata=success.result;
				$scope.tableParams.reload();
			})
						
				//$scope.tableParams.reload();			
			}
			
			else
			{
				toastr.error('Please Select From And To Date','Error'+JSON.stringify($scope.from));
				
				
			}
		}
		
		$scope.report1=function()
		{
			$scope.showtb=false;
			$scope.report=Rejection_Report.get({
					"user":$scope.UserId,
					"from":$scope.from,
					"to":$scope.to,
					"processId":$scope.ProcessId,
					"locationId":$scope.LocationId		
					});
			$scope.report.$promise.then(function(success){
				$scope.formdata=success.result;
				$scope.tableParams.reload();
			})
						
		}
		
		$scope.tableParams = new ngTableParams({
				debugMode: true,
				page: 1, 
				count: 10,
				sorting: {
  						userId: 'desc',
						fullName: 'desc',
						processName:'desc',
						location:'desc',
						ALPL_Status:'desc',
						apsNo:'desc'
						
                },
				filter: {
						userId: '',
						fullName: '',
						processName:'',
						location:'',
						ALPL_Status:'',
						apsNo:''
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



	});
	
bpoApps.controller("ALPL_processUserAllocation",function($scope,$parse,CoreUser,filterFilter,$rootScope,UserProcess,ALPLUsers,ngTableParams,$filter,coreTable,$timeout,$route,toastr)
{	

	$scope.currentLocation = $rootScope.SESS_USER.locationId;
	
	$scope.alplUsers = Array();
	
	$scope.getAllProcesses={};
	$scope.selectedProcess={};
	$scope.selectedLocation={};
	$scope.getAllLocation={};
	$scope.search = "";
	$scope.enable=false;
	
	$scope.nonAllocatedUser=function()
	{
		$scope.showUsers=1;
		//alert("selected"+JSON.stringify($scope.selectedProcess.selectedItem))
		$scope.getUsers=CoreUser.get({"locationId":$scope.selectedLocation.selectedItem.locationId,"processId":$scope.selectedProcess.selectedItem.processId});
	
		$scope.getUsers.$promise.then(function(result){
			$scope.allUsers=result.result;
				angular.forEach($scope.allUsers, function(value, key) {
					value.isSelected = false;
			});
		})
		//$location.path('/ALPL/userProcess')
	}
	
	$scope.AllocatedUser=function()
	{
		 $scope.showUsers=0;
	 		$scope.userget();
			
			$scope.getAlplUsers=ALPLUsers.get({"locationId":$scope.selectedLocation.selectedItem.locationId,
			"processId":$scope.selectedProcess.selectedItem.processId	});
	
		$scope.getAlplUsers.$promise.then(function(result){
			$scope.alplUsers=result.result;
		
			$scope.tableParams.reload(); 
		})
	
	}
	$scope.userget=function()
	{
		$scope.getAlplUsers=ALPLUsers.get({"locationId":$scope.selectedLocation.selectedItem.locationId,
			"processId":$scope.selectedProcess.selectedItem.processId	});
	
		$scope.getAlplUsers.$promise.then(function(result){
			$scope.alplUsers=result.result;
		
			
		})
		$scope.tableParams.reload(); 
	}	
	
	$scope.getLocationUsers = function(){
			$scope.enable=true;
		}
	
	
	 	$scope.tableParams = new ngTableParams(
		{
			debugMode: true,
			page: 1, 
			count: 10,
			sorting: {
					userId: 'desc',
					fullName: 'desc'
			},
			filter: {
				userId: '',
				fullName: ''
			}
		}, 
		{
				total: $scope.alplUsers.length,
				getData: function ($defer, params) {
					
				   var filteredData = params.filter() ? $filter('filter')($scope.alplUsers, params.filter()) : $scope.alplUsers;
				   var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData; 
				   params.total(orderedData.length);
				   
				   $defer.resolve($scope.data = orderedData.slice((params.page() -1) * params.count(), params.page() * params.count())); 
				}
		});
	 	
		$scope.deleteUser = function(user){
				UserProcess.delete({ "processId": $scope.selectedProcess.selectedItem.processId, "userId":user.userId}, function() {
				//alert("deleted");
				//	console.log("response----->"+JSON.stringify(response));
				$scope.getAlplUsers=ALPLUsers.get({"locationId":$scope.selectedLocation.selectedItem.locationId,
			"processId":$scope.selectedProcess.selectedItem.processId	});
	
		$scope.getAlplUsers.$promise.then(function(result){
			$scope.alplUsers=result.result;
		
			$scope.tableParams.reload(); 
		})
			
				toastr.success('Process User deleted successfully!', 'Done')	
					//$location.path('/ALPL/userProcess')
				 //$route.reload();
				//$scope.userget();		
		//		$scope.tableParams.reload();
				
			});
	}
	$timeout(function(){
		//$scope.getCompanies();
		$scope.userget();	
	});

	
	$scope.formdata={
		'locationId':$rootScope.SESS_USER.locationId,
	};
	
	$scope.getAllItems = function(data, datalist, accessor, scopevar){
		
		var tmp = $parse(datalist) ;
		tmp.assign($scope, data);
		var accessor = $parse(accessor);
		angular.forEach(data, function(value, key) {
				if(value[scopevar] == $scope.formdata[scopevar]){
						accessor.assign($scope, {"selectedItem":value});
				}
		});
	
	}
	
	$scope.isSelected=false;
	
	$scope.show=function(objUser)
	{
		objUser.isSelected = !objUser.isSelected;
		$scope.filteredSelected = filterFilter($scope.allUsers, {isSelected: 'true'});
		
	}
	var userarray=Array();
	
	$scope.save=function()
	{
				console.log("----**********")
			$scope.userProcess=new UserProcess();
			for(i=0;i<$scope.filteredSelected.length;i++)
			{
				userarray.push($scope.filteredSelected[i].userId);
			}
			$scope.userProcess.processId=$scope.selectedProcess.selectedItem.processId;
			$scope.userProcess.userId=userarray.toString();
		
			$scope.userProcess.$save(function(response){
				if(response.status=="success")
				
				{
					
				console.log("----**********"+JSON.stringify(response))
						toastr.success('Changes Saved', 'Done!')
				$scope.getUsers=CoreUser.get({"locationId":$scope.selectedLocation.selectedItem.locationId,"processId":$scope.selectedProcess.selectedItem.processId});
	
		$scope.getUsers.$promise.then(function(result){
			$scope.allUsers=result.result;
				angular.forEach($scope.allUsers, function(value, key) {
					value.isSelected = false;
			});
		})

		//				window.location.reload();
						console.log("----*********<<<<*"+JSON.stringify(response))
				}
			});
		
	}
	//$scope.getLocationUsers($scope.currentLocation); 

});
	
bpoApps.controller("ALPL_statusSearch",function($scope,Sections,Fields,$filter,ngTableParams,AlplSearchStatus,toastr){

	$scope.formdata = {};
	$scope.sections = Sections.get({"id":"31"});
	
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

	
	$scope.statusData=Array();
	$scope.searchStaus=function()
	{	if($scope.formdata.applicationNo=="")
		{
			$scope.formdata.applicationNo=0;
		}

		if($scope.formdata.apsNo=="")
		{
			$scope.formdata.apsNo=0;
		}		
		if($scope.formdata.applicationNo==0 && $scope.formdata.apsNo==0)
		{
			toastr.error("Please Enter Data To Search","Error")
			$scope.formdata.applicationNo=""; 
			$scope.formdata.apsNo="";
			$scope.tableParams.reload();
		}
		else
		{
		console.log("Application:"+$scope.formdata.applicationNo+"aps no"+$scope.formdata.apsNo)
		$scope.getStatus=AlplSearchStatus.get({"applicationNo":$scope.formdata.applicationNo,"apsNo":$scope.formdata.apsNo});
		$scope.getStatus.$promise.then(function(response){
			$scope.statusData=response.result;
			if(response.result==false)
			{toastr.error("No Record Found","Error");
			$scope.formdata.applicationNo=""; 
			$scope.formdata.apsNo="";
			$scope.tableParams.reload();
			}
			
			$scope.tableParams.reload();
			$scope.formdata.applicationNo=""; 
			$scope.formdata.apsNo="";
		})
		
		}
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
				total: $scope.statusData.length,
				getData: function ($defer, params) {
				var filteredData = params.filter() ? $filter('filter')($scope.statusData, params.filter()) : $scope.statusData;
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData; 

				params.total(orderedData.length);
				$defer.resolve($scope.data = orderedData.slice((params.page() -1) * params.count(), params.page() * params.count())); 
				}
				});
});