// JavaScript Document
bpoApps.directive('dynamicModel', ['$compile', '$parse', function ($compile, $parse) {
    return {
        restrict: 'A',
        terminal: true,
        priority: 100000,
        link: function (scope, elem) {
            var name = $parse(elem.attr('dynamic-model'))(scope);
            elem.removeAttr('dynamic-model');
            elem.attr('ng-model', name);
            $compile(elem)(scope);
        }
    };
}]);

bpoApps.directive('ngBindModel',function($compile){
    return{
        compile:function(tEl,tAtr){
          tEl[0].removeAttribute('ng-bind-model')
            return function(scope){
              tEl[0].setAttribute('ng-model',scope.$eval(tAtr.ngBindModel))
              $compile(tEl[0])(scope)
                console.info('new compiled element:',tEl[0])
            }
        }
    }
})

bpoApps.factory('Process', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.PROCESS+"/:id", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);

bpoApps.factory('Batches', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.BATCHES+"/:processId", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);


bpoApps.factory('Users', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.USERS, {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);

bpoApps.factory('ProcessUsers', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.PROCESSUSERS+"/:processId", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);


bpoApps.factory('Applications', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.APPLICATION, {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);


bpoApps.factory('Release', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
//	 console.log("00000000uuuuuuuuuuu......."+CORE_CONFIG.WEB_SERVICE+WEB_API.RELEASE+"/:userId/:batchId/:applicationId", {userId:'@userId', batchId:'@batchId', applicationId:'@applicationId'})
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.RELEASE+"/:userId/:batchId/:applicationId", {}, 
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);

bpoApps.factory('SearchRelease', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
//	 console.log("00000000uuuuuuuuuuu......."+CORE_CONFIG.WEB_SERVICE+WEB_API.RELEASE+"/:userId/:batchId/:applicationId", {userId:'@userId', batchId:'@batchId', applicationId:'@applicationId'})
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.SEARCHRELEASE+"/:key/:value", {}, 
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);

bpoApps.factory('DeleteRelease', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.DELRELEASE+"/:allocationId", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);


bpoApps.factory('BatchApplication', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.BATCHAPPLICATION+"/:batchId/:processId", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);


bpoApps.factory('AllocateApplication', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
	
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.ALLOCATEAPPLICATION+"/:processId/:applicationId/:userId", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);


bpoApps.factory('AlplNextRecord', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
	
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.ALPLNEXTRECORD+"/:processId/:userId/:applicationType", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);

bpoApps.factory('Report_Performance', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
	
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.REPORT_PERFORMANCE+"/:user/:from/:to/:processId/:locationId", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);

bpoApps.factory('MIS_SUMMARY_REPORT', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
	
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.MIS_REPORT_SUMMARY+"/:from/:to/:locationId/:applicationType", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);

bpoApps.factory('Rejection_Report', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
	
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.REJECTION_REPORT+"/:user/:from/:to/:processId/:locationId", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);

bpoApps.factory('CoreUser', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
	
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.COREUSER+"/:locationId/:processId", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);

bpoApps.factory('UserProcess', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
	
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.USERPROCESS+"/:processId/:userId", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);

bpoApps.factory('ALPLUsers', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
	
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.ALPLUSER+"/:locationId/:processId", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);

bpoApps.factory('GetALPLUsers', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
	
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETALPLUSERS+"/:processId", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);

bpoApps.factory('DuplicateRecords', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
	
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.DUPLICATERECORDS+"/:batchId", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);

bpoApps.factory('ExcelDuplicateRecords', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
	
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.EXCELDUPLICATERECORDS+"/:batchId/:batchName", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('MISConsolidatedReport', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
	
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.MISCONSOLIDATED+"/:from/:to/:locationId/:applicationType", {},
  	{
		'update': { method:'PUT' }
	}  
  );
   
}]);

bpoApps.factory('InsertBatchType', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
	
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.INSERTBATCHTYPE+"/:batchId/:applicationType", {},
  	{
		'update': { method:'PUT' }
	}  
  );
   
}]);

bpoApps.factory('GetPrviousRemarks', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
	
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETPREVIOUSREMARKS+"/:processId/:applicationId", {},
  	{
		'update': { method:'PUT' }
	}  
  );
   
}]);


bpoApps.factory('CheckAps', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
	
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.CHECKAPS+"/:applicationId/:apsNo", {},
  	{
		'update': { method:'PUT' }
	}  
  );
   
}]);

bpoApps.factory('AlplSearchStatus', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
	
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.ALPLSEARCHSTATUS+"/:applicationNo/:apsNo", {},
  	{
		'update': { method:'PUT' }
	}  
  );
   
}]);



bpoApps.factory('PLDECSVImport', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.PLDECSVIMPORT+"/:tbl/:primary/:file/:folderId/:json/:extData/:extention/:separator/:prefix", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
