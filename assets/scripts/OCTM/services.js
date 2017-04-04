
bpoApps.factory('categoryName', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETCATEGORYNAME+"/:id", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('createbatchid', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.CREATEBATCHID+"/:batchId/:clgdate/:categoryid/:lotid/:type", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('createbatchid1', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.CREATEBATCHID1+"/:batchId/:clgdate/:lotid/:type", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('GetBatch', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETBATCH+"/:batchId", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);

bpoApps.directive('enter', function() {
  return {
    restrict: 'A',
    link: function($scope,elem,attrs) {

      elem.bind('keydown', function(e) {
        var code = e.keyCode || e.which;
        if (code === 13) {
          e.preventDefault();
          elem.next().focus();
        }
      });
    }
  }
});

bpoApps.directive('focusMe', function($timeout) {
  return {
    scope: { trigger: '@focusMe' },
    link: function(scope, element) {
      scope.$watch('trigger', function(value,field) {
        if(value === "true") { 
          // console.log('trigger',value);
          $timeout(function() {
            element[0].focus(field); 
          });
        }
      });
    }
  };
});

bpoApps.factory('getlotcategory', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETLOTCATEGORY+"/:batchId/:clgdate/:type", {},
  	{
		'update': { method:'PUT' }
	} 
  ); 
}]); 
bpoApps.factory('getserialnumber', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETSERIALNUMBER+"/:batchId/:clgdate/:lotnumber/:type", {},
  	{
		'update': { method:'PUT' }
	} 
  ); 
}]);
bpoApps.factory('getcheckrange', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETCHECKRANGE+"/:cardnumber", {},
  	{
		'update': { method:'PUT' }
	} 
  ); 
}]);
bpoApps.factory('getbankname', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETBANKNAME+"/:micr", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getreport1', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETREPORT1+"/:clgdate/:lotnumber", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getbatchslip', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETBATCHSLIP+"/:batchId/:clgdate/:lotnumber", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('exportBatchWiseSlipText', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.EXPORTBATCHWISESLIP, {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getuserreport', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETUSERREPORT+"/:clgdate", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getdailymisAllLot', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETDAILYMISALLLOT+"/:clgdate/:MIS", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);//for all lot MIS and summary
bpoApps.factory('getdailymisOneLot', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETDAILYMISONELOT+"/:clgdate/:lotnumber/:MIS", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);//for One lot MIS and summary
bpoApps.factory('getdailymisSummary', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETDAILYMISSUMMARY+"/:clgdate/:lotnumber", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);//for one lot summary
bpoApps.factory('getrejection', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETREJECTION+"/:clgdate/:lotnumber", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getoutstation', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETOUTSTATION+"/:clgdate/:lotnumber/:batchId", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getcategoryreport', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETCATEGORYREPORT+"/:clgdate/:lotnumber/:batchId", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getlotreport', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETLOTREPORT+"/:clgdate/:lotnumber", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getbatchfinish', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETBATCHFINISH+"/:batchId/:clgdate/:lotnumber/:type", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('last', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.LAST+"/:user/:batchId/:clgdate", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('lastother', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.LASTOTHER+"/:user/:batchId/:clgdate", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('checkdate', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.CHECKDATE+"", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getcreditmis', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETCREDITMIS+"/:clgdate/:lotnumber", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);

bpoApps.factory('getsolId', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETSOLID+"/:solId", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);

bpoApps.factory('getmicrcode', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETMICRCODE+"/:micrCode", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('StartEntry', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.STARTENTRY, {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('deleterecord', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.DELETERECORD+"/:batchId/:lotNumber/:serialNumber/:clgDate", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('deleteotherrecord', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.DELETEOTHERRECORD+"/:batchId/:lotNumber/:serialNumber/:clgDate", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getshowlist', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETSHOWLIST+"/:batchId/:clgDate/:user", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getshowlist1', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETSHOWLIST1+"/:batchId/:user/:clgDate", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getshowlist2', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETSHOWLIST2+"/:user", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getdatemaster1', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETDATEMASTER1+"", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getdatemaster', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETDATEMASTER+"", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);  
bpoApps.factory('getsecondpass', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETSECONDPASS+"/:lotNumber/:clgDate/:batchId", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getallsecondpass', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETALLSECONDPASS+"/:lotNumber/:clgDate/:usercode", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getsecondpassallocate', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETSECONDPASSALLOCATE+"/:batchId/:clgdate/:lotnumber/:user/:type", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getallsecondpass2', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETALLSECONDPASS2+"/:lotNumber/:clgDate/:usercode", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('updatesecondpass', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.UPDATESECONDPASS+"/:serialNumber/:secondpassdata", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getsecondpass2', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETOTHERSECONDPASS+"/:lotNumber/:clgDate/:batchId/:userId", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('updatesecondpass2', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.UPDATEOTHERSECONDPASS+"/:batchId/:serialNumber/:secondpassdata", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);

bpoApps.factory('startOtherEntry', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.STARTOTHERENTRY, {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getmisAllReport', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETMISALLREPORT+"/:batchId/:clgdate/:lotnumber", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);

bpoApps.factory('getDataEntryReport', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETDATAENTRYREPORT+"/:batchId/:clgdate/:lotnumber", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getamountLog', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETAMOUNTLOG+"/:clgdate/:category/:lotNo", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);

bpoApps.factory('getCreditCardSlipreport', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETCREDITCARDSLIPREPORT+"/:clgdate/:category/:batchId", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);

bpoApps.factory('genarateCreditCardSlipText', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GENERATECREDITCARDSLIPTEXT, {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);

bpoApps.factory('genarateExcel', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GENARATEEXCEL, {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
// bpoApps.directive('numbersOnly', function () {
//     return {
//         require: 'ngModel',
//         link: function (scope, element, attr, ngModelCtrl) {
// 					console.log("-----"+scope);
// 					console.log("-----"+element);
// 					console.log("-----"+attr);
// 					console.log("-----"+ngModelCtrl);
//             function fromUser(text) {
//                 if (text) {
//                     var transformedInput = text.replace(/[^0-9]/g, '');
// 										console.log("ngModelCtrl--->"+ngModelCtrl);
//                     if (transformedInput !== text) {
//                         ngModelCtrl.$setViewValue(transformedInput);
//                         ngModelCtrl.$render();
//                     }
//                     return transformedInput;
//                 }
//                 return undefined;
//             }            
//             ngModelCtrl.$parsers.push(fromUser);
//         }
//     };
// });



bpoApps.factory('Excel',function($window){
        var uri='data:application/vnd.ms-excel;base64,',
            template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" ><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
            base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
            format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
        return {
            tableToExcel:function(tableId,worksheetName){
                var table=$(tableId),
                    ctx={worksheet:worksheetName,table:table.html()},
                    href=uri+base64(format(template,ctx));
                return href;
            }
        };
    })
	
bpoApps.factory('getreplaceBatchAndLotNumber', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.REPLACEBATCHANDLOTNUMBER+"/:clgdate/:lotnumber/:batchId/:newclgdate/:newlotnumber/:newbatchId/:chequeEntry/:otherChequeEntry", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('deleteBatch', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.DELETEBATCH+"/:clgdate/:lotnumber/:batchId/:chequeEntry/:otherChequeEntry", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getbatchStatus', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.BATCHSTATUS+"/:clgdate/:lotnumber", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);

bpoApps.factory('getdailyOutput', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.DAILYOUTPUT+"/:fromdate/:todate/:morethanlakh/:chequeNo", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getproductivityreport', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.PRODUCTIVITYREPORT+"/:fromdate/:todate", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('gethourlyproductivityreport', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.HOURLYPRODUCTIVITYREPORT+"/:selectdate", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getchequebookrequestMIS', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.CHEQUEBOOKREQUESTMIS+"/:requestdate", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getcategoryBillingReport', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.CATEGORYBILLINGREPORT+"/:Month", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);

bpoApps.factory('getdrwaeePayeeBillingReport', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.DRWAEEPAYEEBILLINGREPORT+"/:Month", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getuserEntryBillingReport', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.USERENTRYBILLINGREPORT+"/:Month", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getGenerateReport', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GENERATEREPORT+"/:clgDate/:rejectionType/:lotNumber/:batchId/:company", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getGenerateTEXT', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GENERATETEXT+"/:clgDate/:rejectionType/:lotNumber", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getGenerateTEXTCts', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GENERATETEXTCTS+"/:clgDate/:lotNumber/:batchId/:company", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getGenerateTEXTPatti', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GENERATETEXTPATTI+"/:clgDate/:rejectionType/:lotNumber/:batchId/:company", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
bpoApps.factory('getNRECheque', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.GETNRECHEQUE+"/:accountNumber2", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);	

bpoApps.factory('getbatchStatusForSecondPass', ['$resource','CORE_CONFIG','WEB_API', function($resource,CORE_CONFIG,WEB_API)
 {
  return $resource(CORE_CONFIG.WEB_SERVICE+WEB_API.BATCHSTATUSFORSECONDPASS+"/:clgdate/:lotnumber", {},
  	{
		'update': { method:'PUT' }
	}  
  ); 
}]);
