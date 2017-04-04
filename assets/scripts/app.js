

var bpoApps = angular.module('bpoApps', [
	'ngAnimate',
	'ngAria',
	'angular.filter',
	'ngResource',
	'ngSanitize',
	'toastr',
	'ngRoute',
	'ngProgress',
	'ngTable',
	'ngFileUpload',
	'ui.bootstrap',
	'checklist-model',
	'ui.select',
	'ngMaterial',
	'ngTableToCsv',
	'ngMask',
	'jsonFormatter','CanvasViewer',
	'ui.mask'		
	    ]);



bpoApps.run(function ($rootScope, sessionService,$location,APPCONSTANTS) {

 
		$rootScope.SESS_USER = sessionService.get(APPCONSTANTS.SESS_USER);

	 	$rootScope.isSession = function() {
//			console.log(">>"+JSON.stringify(sessionService.get(APPCONSTANTS.SESS_USER)));
            if (!sessionService.get(APPCONSTANTS.SESS_USER) > 0) {
              	return false;
            }else
			{
				return true;
			}
        };

        $rootScope.$on('$locationChangeStart', function (ev, to, toParams, from, fromParams) {

			 
				$rootScope.$emit('loadMenus', null);				
			$rootScope.SESS_USER = sessionService.get(APPCONSTANTS.SESS_USER);

//alert($location.path());
            if (!sessionService.get(APPCONSTANTS.SESS_USER) > 0 && $location.path() != "/Core/forgot" && $location.path() != "/Core/newPass") {    $location.path("/login");     }
			
			if(sessionService.get(APPCONSTANTS.SESS_MODULES)){
				$rootScope.rootModules = sessionService.get(APPCONSTANTS.SESS_MODULES);	
				$rootScope.childModules = sessionService.get(APPCONSTANTS.SESS_MODULES);					
				console.log(JSON.stringify($rootScope.rootModules));
			}


        });

});


bpoApps.config(['$routeProvider',
  function ($routeProvider) {

  	$routeProvider.
	  when('/login', {
		  
	  controller: 'coreLoginController',
		templateUrl: WEB_URL+'assets/views/CORE/login.html'
	  }).
  	  when('/Core/forgot', {
	  controller: 'coreForgotController',
		templateUrl: WEB_URL+'assets/views/CORE/forgot.html'
	  }).
	  when('/Core/newPass', {
	  controller: 'coreNewPassController',
		templateUrl: WEB_URL+'assets/views/CORE/newPass.html'
	  }).
	  when('/Core/Company', {
	  	controller: 'coreCompanyController',
		templateUrl: WEB_URL+'assets/views/CORE/company.html'
	  }).
	  when('/Core/Users', {
	  	controller: 'coreUsersController',
		templateUrl: WEB_URL+'assets/views/CORE/users.html'
	  }).
	  when('/Core/Apps', {
	  	controller: 'coreAppsController',
		templateUrl: WEB_URL+'assets/views/CORE/apps.html'
	  }).
	  when('/Core/Locations', {
	  	controller: 'coreLocationsController',
		templateUrl: WEB_URL+'assets/views/CORE/locations.html'
	  }).
	  when('/Core/Contract', {
	  	controller: 'coreContractController',
		templateUrl: WEB_URL+'assets/views/CORE/contracts.html'
	  }).
	  when('/Core/Roles', {
	  	controller: 'coreRolesController',
		templateUrl: WEB_URL+'assets/views/CORE/roles.html'
	  }).
	  when('/Core/Roles/Modules', {
	  	controller: 'coreRoleModulesController',
		templateUrl: WEB_URL+'assets/views/CORE/rolemodules.html'
	  }).
	  when('/Core/Contract/Users', {
	  	controller: 'coreContractUsersController',
		templateUrl: WEB_URL+'assets/views/CORE/contractusers.html'
	  }).
	  when('/CASA/imageindex', {
	  	controller: 'casaImageIndexController',
		templateUrl: WEB_URL+'assets/views/CASA/imageindex.html'
	  }).
		when('/CASA/imagerename', {
	  	controller: 'casaImageRenameController',
		templateUrl: WEB_URL+'assets/views/CASA/imagerename.html'
	  }).
		when('/CASA/imageoptimization', {
	  	controller: 'casaImageOptimization',
		templateUrl: WEB_URL+'assets/views/CASA/imageoptimization.html'
	  }).
	  when('/ALPL/masterimport', {
	  controller: 'ALPLMasterImport',
		templateUrl: WEB_URL+'assets/views/ALPL/masterimport.html'
	  }).
	  when('/ALPL/upload', {
	  cache: false,
	  controller: 'ALPL_uploadController',
		templateUrl: WEB_URL+'assets/views/ALPL/upload.html'
	  }).
	when('/ALPL/batchallocation', {
	  	cache: false,
		controller: 'ALPL_batchallocationController',
		templateUrl: WEB_URL+'assets/views/ALPL/batchallocation.html'
	  }).
	  when('/ALPL/release', {
		cache: false,
		controller: 'ALPL_releaseController',
		templateUrl: WEB_URL+'assets/views/ALPL/release.html'
	  }).
	  when('/ALPL/dataEntry', {
	  cache: false,
	  controller: 'ALPL_dataEntryController',
		templateUrl: WEB_URL+'assets/views/ALPL/dataEntry.html'
	  }).
		when('/ALPL/misreport',{
		cache: false,
		controller: 'ALPL_misReportController',
		templateUrl:WEB_URL+'assets/views/ALPL/misreport.html'
		}).
		when('/ALPL/report',{
		cache: false,
		controller: 'ALPL_reportController',
		templateUrl:WEB_URL+'assets/views/ALPL/report.html'
		}).
		when('/ALPL/report/consolidated',{
		cache: false,
		controller: 'ALPL_reportConsolidatedController',
		templateUrl:WEB_URL+'assets/views/ALPL/reportConsolidated.html'
		}).
		when('/ALPL/report/summary',{
		cache: false,
		controller: 'ALPL_reportSummaryController',
		templateUrl:WEB_URL+'assets/views/ALPL/reportSummary.html'
		}).
		when('/ALPL/userreport',{
		cache: false,
		controller: 'ALPL_userreportController',
		templateUrl:WEB_URL+'assets/views/ALPL/userreport.html'
		}).
		when('/ALPL/userreport/performance',{
		cache: false,
		controller: 'ALPL_userreportPerformanceController',
		templateUrl:WEB_URL+'assets/views/ALPL/userreportPerformance.html'
		}).
		when('/ALPL/userreport/rejection',{
		cache: false,
		controller: 'ALPL_userreportRejectionController',
		templateUrl:WEB_URL+'assets/views/ALPL/userreportRejection.html'
		}).
		when('/ALPL/missummary',{
		cache: false,
		controller: 'ALPL_missummaryController',
		templateUrl:WEB_URL+'assets/views/ALPL/missummary.html'
		}).
		when('/ALPL/userProcess',{
		cache: false,
		controller: 'ALPL_processUserAllocation',
		templateUrl:WEB_URL+'assets/views/ALPL/processUserAllocation.html'
		}).
		when('/ALPL/statusSearch',{
		cache: false,
		controller: 'ALPL_statusSearch',
		templateUrl:WEB_URL+'assets/views/ALPL/statusSearch.html'
		}).
	    when('/CC/snippetsettings', {
	  	controller: 'ccSnippetSettings',
		templateUrl: WEB_URL+'assets/views/CC/snippetSettings.html'
	  }).
	    when('/CC/testsnippet', {
	  	controller: 'testSnippet',
		templateUrl: WEB_URL+'assets/views/CC/testsnippet.html'
	  }).
	    when('/CC/dataEntry', {
	  	controller: 'ccDataEntryController',
		templateUrl: WEB_URL+'assets/views/CC/dataEntry.html'
	  }).
	   when('/CC/imagetype', {
	  	controller: 'ccImageTypeController',
		templateUrl: WEB_URL+'assets/views/CC/ImageType.html'
	  }).
		  when('/CC/allocate', {
	  	controller: 'ccAllocateController',
		templateUrl: WEB_URL+'assets/views/CC/allocate.html'
	  }).
		when('/CC/upload', {
	  	controller: 'ccUploadController',
		templateUrl: WEB_URL+'assets/views/CC/uploadCC.html'
	  }).
		when('/CC/imageIndexing', {
	  	controller: 'ccImageIndexingController',
		templateUrl: WEB_URL+'assets/views/CC/imageIndexing.html'
	  }).
		when('/CC/executequery', {
	  	controller: 'ccqueryexecutecontroller',
		templateUrl: WEB_URL+'assets/views/CC/executequery.html'
	  }).
	  when('/CC/masterUpload', {
	  	controller: 'ccMasterUploadController',
		templateUrl: WEB_URL+'assets/views/CC/uploadMaster.html'
	  }).
	   when('/CC/agencyCode', {
		controller: 'ccAgencyCodeController',
	  templateUrl: WEB_URL+'assets/views/CC/agencyCode.html'
	   }).
	   when('/CC/auditSetting', {
		controller: 'ccAuditSettingController',
	  templateUrl: WEB_URL+'assets/views/CC/auditSetting.html'
	   }).
		when('/CC/MISSummaryReport', {
			controller: 'ccMISSummaryReportController',
		  templateUrl: WEB_URL+'assets/views/CC/MISSummaryReport.html'
		}).
	   when('/CC/report', {
		controller: 'ccReportController',
	  templateUrl: WEB_URL+'assets/views/CC/report.html'

	   }).
	   when('/CC/MISRejectionReport', {
		controller: 'ccMISRejectionReportController',
	  templateUrl: WEB_URL+'assets/views/CC/MISRejectionReport.html'
	   }).
	    when('/CC/dateWiseProductivity', {
		controller: 'ccdateWiseProductivityController',
	  templateUrl: WEB_URL+'assets/views/CC/dateWiseReport.html'
	   }).
	    when('/CC/processSetting', {
		controller: 'CCprocessSettingsController',
	  templateUrl: WEB_URL+'assets/views/CC/ccprocessSettings.html'
	   }).
	    when('/CC/indexImage', {
		controller: 'CCindexImageController',
	  templateUrl: WEB_URL+'assets/views/CC/indexImage.html'
	   }).
	    when('/CC/WIP', {
		controller: 'ccWIPReportController',
	  templateUrl: WEB_URL+'assets/views/CC/WIP.html'
	   }).
	    when('/CC/searchApp', {
		controller: 'ccSearchAppController',
	  templateUrl: WEB_URL+'assets/views/CC/SearchApp.html'
	   }).
		// when('/OCTM/Newchequeentry', {
	  // 	controller: 'OCTMnewchequeentrycontroller',
		// templateUrl: WEB_URL+'assets/views/OCTM/Newchequeentry.html'
		// }).
	   when('/CC/hourlyProductivity', {
		controller: 'cchourlyProductivityController',
	  templateUrl: WEB_URL+'assets/views/CC/hourlyReport.html'
	   }).

	   when('/CC/dashboardSummaryReport', {
		controller: 'ccdashboardSummaryReportController',
	  templateUrl: WEB_URL+'assets/views/CC/dashboardSummaryReport.html'
	   }).

	    when('/CC/dashboardDownload', {
		controller: 'ccdashboardDownloadController',
	  templateUrl: WEB_URL+'assets/views/CC/dashboardDownload.html'
	   }).
		
		when('/OCTM/newchequeentry', {
	  	controller: 'OCTMnewchequeentrycontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/newchequeentry.html'
		}).
		when('/OCTM/newchequeentry2', {
	  	controller: 'OCTMnewchequeentry2controller',
		templateUrl: WEB_URL+'assets/views/OCTM/newchequeentry2.html'
		}).
		when('/OCTM/categoryLotselection', {
	  	controller: 'OCTMchequeentrycontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/categoryLotselection.html'
	  }).
		when('/OCTM/Chequeentry', {
	  controller: 'OCTMchequeentrycontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/Chequeentry.html'
	  }).
		when('/OCTM/Otherchequeentry', {
	  controller: 'OCTMOtherchequeentrycontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/Otherchequeentry.html'
	  }).
	  when('/OCTM/batchwiseslip', {
	  controller: 'OCTMbatchwiseslipreportcontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/batchwiseslip.html'
	  }).
		when('/OCTM/dailymis', {
	  controller: 'OCTMdailymiscontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/dailymis.html'
	  }).
		when('/OCTM/creditcardmis', {
	  controller: 'OCTMcreditcardmiscontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/creditcardmis.html'
	  }).
		// when('/OCTM/dailymis', {
	  // controller: 'OCTMdailymiscontroller',
		// templateUrl: WEB_URL+'assets/views/OCTM/dailymis.html'
	  // }).
		when('/OCTM/userreport', {
	  controller: 'OCTMuserreportcontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/userreport.html'
	  }).
		when('/OCTM/creditcardslip', {
	  controller: 'OCTMcreditcardslipcontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/creditcardslip.html'
	  }).
		when('/OCTM/icicirejection', {
	  controller: 'OCTMicicirejectioncontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/icicirejection.html'
	  }).
		when('/OCTM/chequerequest', {
	  controller: 'OCTMchequerequestcontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/chequerequest.html'
	  }).
		when('/OCTM/outstation', {
	  controller: 'OCTMoutstationcontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/outstation.html'
	  }).
		when('/OCTM/categoryreport', {
	  controller: 'OCTMcategoryreportcontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/categoryreport.html'
	  }).
		when('/OCTM/lotreport', {
	  controller: 'OCTMlotreportcontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/lotreport.html'
	  }).
		when('/OCTM/secondpassentry', {
	  controller: 'OCTMsecondpassentrycontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/secondpassentry.html'
	  }).
		when('/OCTM/secondpassdataentry', {
	  controller: 'OCTMsecondpassdataentrycontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/secondpassdataentry.html'
	  }).
		when('/OCTM/secondpassdataentry2', {
	  controller: 'OCTMsecondpassdataentry2controller',
		templateUrl: WEB_URL+'assets/views/OCTM/secondpassdataentry2.html'
	  }).
		when('/OCTM/secondpassentry2', {
	  controller: 'OCTMsecondpassentry2controller',
		templateUrl: WEB_URL+'assets/views/OCTM/secondpassentry2.html'
	  }).
	  //sangam
	  when('/OCTM/misAllReport', {
	  controller: 'OCTMmisAllreportcontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/MISAllReport.html'
	  }).
	  when('/OCTM/dataentryReport', {
	  controller: 'OCTMdataentryreportcontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/dataentryreport.html'
	  }).
	  when('/OCTM/datemaster', {
	  controller: 'OCTMdatemastercontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/datemaster.html'
	  }).
	   when('/OCTM/amountlog', {
	  controller: 'OCTMamountlogcontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/amountLog.html'
	  }).
	  when('/OCTM/replaceBatchAndLotNumber', {
	  controller: 'OCTMreplaceBatchAndLotNumbercontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/replaceBatchAndLotNumber.html'
	  }).
	  when('/OCTM/batchStatus', {
	  controller: 'OCTMbatchStatuscontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/batchStatus.html'
	  }).
	   when('/OCTM/dailyOutput', {
	  controller: 'OCTMdailyOutputcontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/dailyOutput.html'
	  }).
	  when('/OCTM/productivityreport', {
	  controller: 'OCTMproductivityreportcontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/productivityreport.html'
	  }).
	  when('/OCTM/hourlyProductivityreport', {
	  controller: 'OCTMhourlyproductivityreportcontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/hourlyproductivityreport.html'
	  }).
	   when('/OCTM/chequebookrequestMIS', {
	  controller: 'OCTMchequebookrequestMIScontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/chequebookrequestMIS.html'
	  }).
	  when('/OCTM/categorybillingreport', {
	  controller: 'OCTMcategorybillingreportcontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/categoryBillingReport.html'
	  }).
	   when('/OCTM/drwaeepayeebillingreport', {
	  controller: 'OCTMdrwaeepayeebillingreportcontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/drwaeePayeeBillingReport.html'
	  }).
	  when('/OCTM/userentrybillingreport', {
	  controller: 'OCTMuserentrybillingreportcontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/userEntryBillingReport.html'
	  }).
	  when('/OCTM/generatereport', {
	  controller: 'OCTMgeneratereportcontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/generateReport.html'
	  }).
	  when('/OCTM/batchStatusForSecondPass', {
	  controller: 'OCTMbatchStatusForSecondPasscontroller',
		templateUrl: WEB_URL+'assets/views/OCTM/batchStatusForSecondPass.html'
	  }).
	  when('/JLA/masterupload', {
	  controller: 'JLAuploadController',
		templateUrl: WEB_URL+'assets/views/JLA/JlaUpload.html'
	  }).
	  when('/TechnicalScrutiny/Reasons', {
	  	controller: 'TechnicalScrutinyReasonsController',
		templateUrl: WEB_URL+'assets/views/TechnicalScrutiny/reasons.html'
	  }).	  
	  when('/TechnicalScrutiny/backUp', {
	  controller: 'TechnicalScrutiny_backUp',
		templateUrl: WEB_URL+'assets/views/TechnicalScrutiny/backUp.html'
	  }).
	  when('/TechnicalScrutiny/dataEntry', {
	  controller: 'TechnicalScrutiny_dataEntry',
		templateUrl: WEB_URL+'assets/views/TechnicalScrutiny/dataEntry.html'
	  }).
	  when('/TechnicalScrutiny/uploadCheques', {
	  controller: 'TechnicalScrutiny_uploadCheques',
		templateUrl: WEB_URL+'assets/views/TechnicalScrutiny/uploadCheques.html'
	  }).
		when('/TechnicalScrutiny/batchallocation', {
		controller: 'TechnicalScrutinybatchallocationController',
		templateUrl: WEB_URL+'assets/views/TechnicalScrutiny/batchallocation.html'
	  }).
	   when('/TechnicalScrutiny/technicalScrutinyMIS', {
	  controller: 'TechnicalScrutiny_technicalScrutiyReport',
		templateUrl: WEB_URL+'assets/views/TechnicalScrutiny/technicalScrutinyMIS.html'
	  }).
	   when('/TechnicalScrutiny/processStatus', {
	  controller: 'TechnicalScrutiny_processStatusReport',
		templateUrl: WEB_URL+'assets/views/TechnicalScrutiny/processStatus.html'
	  }).
	   when('/TechnicalScrutiny/pendingWork', {
	  controller: 'TechnicalScrutiny_pendingWorkReport',
		templateUrl: WEB_URL+'assets/views/TechnicalScrutiny/pendingWork.html'
	  }).
	   when('/TechnicalScrutiny/inwardTechnicalScrutiny', {
	  controller: 'TechnicalScrutiny_inwardTechnicalScrutinyReport',
		templateUrl: WEB_URL+'assets/views/TechnicalScrutiny/inwardTechnicalScrutiny.html'
	  }).
	   when('/TechnicalScrutiny/pendencyCheck', {
	  controller: 'TechnicalScrutiny_pendencyCheckReport',
		templateUrl: WEB_URL+'assets/views/TechnicalScrutiny/pendencyCheck.html'
	  }).
	  when('/TechnicalScrutiny/userProductivityStatus', {
	  controller: 'TechnicalScrutiny_userProductivityStatusReport',
		templateUrl: WEB_URL+'assets/views/TechnicalScrutiny/userProductivityStatus.html'
	  }).
	  when('/TechnicalScrutiny/hourlyStatus', {
	  controller: 'TechnicalScrutiny_hourlyStatusReport',
		templateUrl: WEB_URL+'assets/views/TechnicalScrutiny/hourlyStatus.html'
	  }).
	  when('/TechnicalScrutiny/releaseRecords', {
	  controller: 'releaseRecordsControllers',
		templateUrl: WEB_URL+'assets/views/TechnicalScrutiny/releaseRecords.html'
	  }).
	  when('/TechnicalScrutiny/upload', {
	  controller: 'TechnicalScrutinyUploadController',
		templateUrl: WEB_URL+'assets/views/TechnicalScrutiny/upload.html'
	  }).
	  when('/TechnicalScrutiny/deleteData', {
	  	controller: 'TechnicalScrutinyDeleteDataController',
		templateUrl: WEB_URL+'assets/views/TechnicalScrutiny/deleteData.html'
	  }).
	  when('/TechnicalScrutiny/searchStatus', {
	  	controller: 'TechnicalScrutinySearchStatusController',
		templateUrl: WEB_URL+'assets/views/TechnicalScrutiny/searchStatus.html'
	  }).
	  when('/PDCCTS/dataPurging', {
	  controller: 'PDCCTSdataPurging',
		templateUrl: WEB_URL+'assets/views/PDCCTS/dataPurging.html'
	  }).

	  when('/PDCCTS/communicationmaster', {
	  controller: 'PDCCTScommunicationmaster',
		templateUrl: WEB_URL+'assets/views/PDCCTS/communicationmaster.html'
	  }).
	  
	  when('/PDCCTS/cpdataupload', {
	  controller: 'PDCCTScpdataupload',
		templateUrl: WEB_URL+'assets/views/PDCCTS/cpdataupload.html'
	  }).
	   when('/PDCCTS/payslipsummaryreport', {
	  controller: 'PDCCTSpayslipsummaryreport',
		templateUrl: WEB_URL+'assets/views/PDCCTS/payslipsummaryreport.html'
	  }).
	  when('/PDCCTS/chequeliteuploaddownload', {
	  controller: 'PDCCTSchequeuploaddownload',
		templateUrl: WEB_URL+'assets/views/PDCCTS/chequeliteuploaddownload.html'
	  }).
	  when('/GOLDBOND/uploads', {
	  controller: 'GOLDBOND_uploadController',
		templateUrl: WEB_URL+'assets/views/GOLDBOND/upload.html'
	  }).
	  
	  when('/GOLDBOND/dataEntry', {
	  controller: 'GOLDBOND_dataEntryController',
		templateUrl: WEB_URL+'assets/views/GOLDBOND/dataEntry.html'
	  }).
	  
	  when('/GOLDBOND/batchAllocation', {
	  controller: 'GOLDBOND_batchallocationController',
		templateUrl: WEB_URL+'assets/views/GOLDBOND/batchallocation.html'
	  }).
	  
	  when('/GOLDBOND/report', {
	  controller: 'GOLDBOND_reportController',
		templateUrl: WEB_URL+'assets/views/GOLDBOND/report.html'
	  }).
	  when('/playground', {
	  controller: 'playgroundController',
		templateUrl: WEB_URL+'assets/views/playground.html'
	  }).
	  when('/playgroundnew', {
	  controller: 'playgroundnewController',
		templateUrl: WEB_URL+'assets/views/playgroundnew.html'
	  }).
	  when('/canvas', {
	  controller: 'canvasController',
		templateUrl: WEB_URL+'assets/views/canvas.html'
	  }).
	  when('/playground/importer', {
	  controller: 'importerController',
		templateUrl: WEB_URL+'assets/views/importer.html'
	  }).
	  when('/PLDE/dataEntry', {
	  controller: 'pldeDataEntryController',
		templateUrl: WEB_URL+'assets/views/PLDE/dataEntry.html'
	  }).
	  when('/PLDE/processSettings', {
	  controller: 'processSettingsController',
		templateUrl: WEB_URL+'assets/views/PLDE/processSettings.html'
	  }).
	  otherwise({
      	redirectTo: '/login'
      });
  }]);
  
  
