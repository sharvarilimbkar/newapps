<?php

class CC_model extends CI_Model {


public function __construct()
{
	parent::__construct();
}

//GENERATE AGENCY BATCH
public function createAgencyBatch($agencyId,$batchId)
{
			
			$sql = "insert into ccagencybatch (agencyId, batchId) values (".$agencyId.",".$batchId.")";	
			$qparent = $this->db->query($sql);
			 $insert_id = $this->db->insert_id();
		//	$insert_id;
			return $insert_id;
		}

public function getrange($agencyId,$jdNo)
{
		
		// $sql = "SELECT ccagencymaster.* FROM ccagencymaster where ccagencymaster.agencyId=".$agencyId."; 			
			$sql="SELECT count(*) as total,ccagencymaster.*  FROM `ccmaping`,ccagencymaster where ccmaping.agencyId=".$agencyId." 
			and jdNo=".$jdNo."
			 and ccagencymaster.agencyId=ccmaping.agencyId";	
			$qparent = $this->db->query($sql)->result();
			
			return $qparent;
		}

//CREATE JD FOR MAPPING
public function getBatchRange($agencyId,$jdno)
{
		
			 $sql = "SELECT ccagencymaster.*,ccmaping.applicationNo 
					FROM ccagencymaster LEFT JOIN ccmaping on ccmaping.agencyId=ccagencymaster.agencyId 
					and ccagencymaster.agencyId=".$agencyId." 
					and ccmaping.jdNo=".$jdno." 
					ORDER by ccmaping.applicationNo 
					desc limit 1 " ;	
			$qparent = $this->db->query($sql)->result();
			
			return $qparent;
		}

// GET ALL FILES FROM SCANDIR INCLUDING . AND ..
public function folderScan($job,$from,$to,$agencyCode)
{

			$arrFolder = scandir($job, 1);
			$arrFolder =array_values($arrFolder);
 			//print_r($arrFolder);
			for($f=0;$f<count($arrFolder);$f++)
			{
				if($arrFolder[$f]==$agencyCode)
				{
					$arrFiles=preg_grep('/^([^.])/', scandir($job."//".$agencyCode));//scandir($job."//".$agencyCode);
					
				}
			}
                       //echo "directory ";
                     //  print_r($arrFiles);
                           if(in_array("RAW_TIF", $arrFiles)){
                             
                               $arrFilesraw=preg_grep('/^([^.])/', scandir($job."//".$agencyCode."//"."RAW_TIF"));

                               $countarr =array("totalCountfixed"=>count($arrFiles)-2,"totalCount"=>1,"total"=>(count($arrFilesraw)+count($arrFiles))-2);
                           }else{
                                $countarr =array("totalCountfixed"=>0,"totalCount"=>1,"total"=>count($arrFiles));
                           }
                                
                            
			$arrSortedFiles = array();
			for($i=$from;$i<= $to;$i++)
			{	
			  if(isset($arrFiles[$i])){
					if(!is_dir($job.SEPARATOR.$agencyCode.SEPARATOR.$arrFiles[$i]))
					 {
						//READ IMAGE TO FIND NO. OF PAGES IN IT
						//echo  $job.SEPARATOR.$arrFiles[$i];	
						if(file_exists($job."".SEPARATOR."".$agencyCode."".SEPARATOR."".$arrFiles[$i])){
							$multiTIFF = new Imagick($job."".SEPARATOR."".$agencyCode."".SEPARATOR."".$arrFiles[$i]);
							$count=$multiTIFF->getNumberImages();
							
								if($count>1)
								{
								//MARK AS MERGED AND MOVE TO PROCESSING FOLDER 
									if (!file_exists($job."".SEPARATOR."".$agencyCode."".SEPARATOR."mergedImages".SEPARATOR)) 										                       			{
										 mkdir($job."".SEPARATOR."".$agencyCode."".SEPARATOR."mergedImages".SEPARATOR, 0777, true);                      			}
									rename($job."".SEPARATOR."".$agencyCode."".SEPARATOR.$arrFiles[$i],$job."".SEPARATOR."".$agencyCode."".SEPARATOR."mergedImages".SEPARATOR.$arrFiles[$i]);
								}
								else
								{
									
										$arrSortedFiles[] =  array("img"=>$arrFiles[$i],"isSelected"=>false);
								}
							
						}
					  }	
				   }				
				}
                              
                                //array_push($arrSortedFiles, $countarr);
				//$arrSortedFiles = array_combine(range(1, count($arrSortedFiles)), array_values($arrSortedFiles));
				//print_r($countarr);
				return ($arrSortedFiles+$countarr);
		}
	
//CREATE FOLDER OF SAVED IMAGES
public function mergeImages($image,$job,$imageName,$userId,$agencyCode)
{
	
	$extData = urldecode($image);
	$arrFiles = json_decode($extData);
	//print_r($arrFiles);
	$multiTIFF = new Imagick();
	if (!file_exists(IMAGE_INDEXING_CC_JOB_ROOT.$job."".SEPARATOR.$agencyCode.SEPARATOR."mergedImages".SEPARATOR)) 
	{
   		 mkdir(IMAGE_INDEXING_CC_JOB_ROOT.$job."".SEPARATOR.$agencyCode.SEPARATOR."mergedImages".SEPARATOR, 0777, true);
	}
	for($i=0;$i<count($arrFiles);$i++)
	{ 
		$auxIMG = new Imagick(); 
		$auxIMG->readImage(IMAGE_INDEXING_CC_JOB_ROOT.$job."".SEPARATOR."".$agencyCode.SEPARATOR.$arrFiles[$i]); 
		$multiTIFF->addImage($auxIMG); 
		$auxIMG->clear();
	} 
	$merged=$multiTIFF->writeImages(IMAGE_INDEXING_CC_JOB_ROOT.$job."".SEPARATOR.$agencyCode.SEPARATOR."mergedImages".SEPARATOR."".$imageName.'.TIF',true);
	
	
			//$multiTIFF->clear();
	if($merged==1)
	{
		if (!file_exists(IMAGE_INDEXING_CC_JOB_ROOT.$job."".SEPARATOR.$agencyCode.SEPARATOR."RAW_TIF".SEPARATOR)) 
	{
			 mkdir(IMAGE_INDEXING_CC_JOB_ROOT.$job."".SEPARATOR.$agencyCode.SEPARATOR."RAW_TIF".SEPARATOR, 0777, true);
	}
		for($i=0;$i<count($arrFiles);$i++)
		{ 
			if(file_exists(IMAGE_INDEXING_CC_JOB_ROOT.$job."".SEPARATOR."".$agencyCode.SEPARATOR.$arrFiles[$i])){
			rename(IMAGE_INDEXING_CC_JOB_ROOT.$job."".SEPARATOR."".$agencyCode.SEPARATOR.$arrFiles[$i], IMAGE_INDEXING_CC_JOB_ROOT.$job."".SEPARATOR.$agencyCode.SEPARATOR."RAW_TIF".SEPARATOR."".$arrFiles[$i]);	
			}
			
		}
	}
	$status="select statusId from corestatus where status like ('Non allocated')";
	$result=$this->db->query($status)->result();
	$agency="select agencyId from ccagencymaster where agencyCode=".$agencyCode;
	$agencyresult=$this->db->query($agency)->result();
	//print_r($agencyresult);
	$sql="insert into ccindexedimage
		(generatedApplicationNo,imageCount,creationDate,createdBy,status,jobNo,agencyId)
		 values ('".$imageName."',".count($arrFiles).",curdate(),".$userId.",".$result[0]->statusId.",".$job."
		 ,".$agencyresult[0]->agencyId.")";
	$qparent=$this->db->query($sql);
	return $multiTIFF;
}
			
//CREATE BLANK ENTRY FOR PROCESSES
public function createBlankEntry($jdNo,$applicationNo,$imageType,$agencyId,$noOfApplication,$jobNo,$userId)
{			
			$getAgency="select agencyCode from ccagencymaster where agencyId=".$agencyId;
			$rslt=$this->db->query($getAgency)->result();
			$job="";
			$job=IMAGE_INDEXING_CC_JOB_ROOT."".$jobNo;
			$arrFolder = scandir($job);
			$arrFolder =array_values($arrFolder);
			
			//$multiTIFF = new Imagick();
			if (!file_exists($job."".SEPARATOR.$rslt[0]->agencyCode.SEPARATOR."mergedImages".SEPARATOR)) 
			{
   		 		mkdir($job."".SEPARATOR.$rslt[0]->agencyCode.SEPARATOR."mergedImages".SEPARATOR,0777, true);
			}

 			for($f=0;$f<count($arrFolder);$f++)
			{
				if($arrFolder[$f]==$rslt[0]->agencyCode)
				{
					$arrmerged = array_values(array_diff(scandir($job."//".$rslt[0]->agencyCode),array('..', '.')));
				//	$arrFiles=scandir($job."\\".$rslt[0]->agencyCode."\\mergedImages");
					
				}
			}
			$arrSortedFiles = array();
			for($i=0;$i<$noOfApplication;$i++)
			{
				if(@!is_dir($job."".SEPARATOR."".$rslt[0]->agencyCode."".SEPARATOR."".$arrmerged[$i]))
					 {
					
				$multiTIFF = new Imagick($job."".SEPARATOR."".$rslt[0]->agencyCode."".SEPARATOR."".$arrmerged[$i]);
			$count=$multiTIFF->getNumberImages();	
				if($count>1)
				{
							//MARK AS MERGED AND MOVE TO PROCESSING FOLDER 
rename($job."".SEPARATOR."".$rslt[0]->agencyCode."".SEPARATOR.$arrmerged[$i],$job."".SEPARATOR."".$rslt[0]->agencyCode."".SEPARATOR."mergedImages".SEPARATOR.$arrmerged[$i]);
				}}	
				
			}
			
			for($f=0;$f<count($arrFolder);$f++)
			{
				if($arrFolder[$f]==$rslt[0]->agencyCode)
				{
					$arrFiles = array_values(array_diff(scandir($job."//".$rslt[0]->agencyCode."//mergedImages"), array('..', '.')));
				//	$arrFiles=scandir($job."\\".$rslt[0]->agencyCode."\\mergedImages");
					
				}
			}

//			echo "Application No:".$applicationNo." >>";
//			echo "New Application No:".(($applicationNo)+1)." >>";

			for($i=0;$i<$noOfApplication;$i++)
			{
				if(!empty($arrFiles[$i]))
				{
					$filename = ($applicationNo) + $i;
					//if(!file_exists($job."//".$rslt[0]->agencyCode."//mergedImages".SEPARATOR.$arrFiles[$i]))
 
//					echo "<br /> \n ".$applicationNo+":"+$job.SEPARATOR.$rslt[0]->agencyCode."//mergedImages".SEPARATOR.$filename.".tiff";
//					echo "Application No:".$filename.".tiff >>";
					if(!file_exists($job.SEPARATOR.$rslt[0]->agencyCode."//mergedImages".SEPARATOR.$filename.".tiff"))
					{
					
//							$arrSortedFiles[] =  array("img"=>$arrFiles[$i]);
							$arrSortedFiles[] =  array("img"=>$filename.".tiff");
					}	
					else
					{
							$arrSortedFiles[] =  NULL;	
					}
				}
				
			}
			$arrSortedFiles = array();
			for($i=0;$i<count($arrFiles);$i++){
				$arrSortedFiles[] = array("img"=>$arrFiles[$i]);	
			}
			
			$getBatchNo="select batchNo from corebatchmaster order by batchId desc limit 1";
			$rsltBatchNo=$this->db->query($getBatchNo)->result();
			$rsltBatchNo[0]->batchNo=$rsltBatchNo[0]->batchNo+1;
			$batch="insert into corebatchmaster (batchNo,batchDate,appId,uploadedBy) values (".$rsltBatchNo[0]->batchNo.",'now()','2','$userId')";
			$rsltbatch=$this->db->query($batch);
			
			$insert_id = $this->db->insert_id();
			$agencyBatch="insert into ccagencybatch (agencyId,batchId,creationDate) values ('$agencyId',".$insert_id.",'now()')";
			$rslagencybatch=$this->db->query($agencyBatch);
				//$arrSortedFiles = array_combine(range(1, count($arrSortedFiles)), array_values($arrSortedFiles));
			$count='';
			$imgType="select imageTypeId from ccimageinputtype where imageName like ('".$imageType."')";
			$result = $this->db->query($imgType)->result();
			
			for($i=0;$i<$noOfApplication;$i++)
			{
			$sql = "insert into ccmaping(jdNo,applicationNo,imageType,agencyId,creationDate,jobNo,batchId)
					values (".$jdNo.",'".$applicationNo."','".$result[0]->imageTypeId."',".$agencyId.",curdate(),$jobNo,".$insert_id.")";	
				$qparent = $this->db->query($sql);
				$applicationNo=$applicationNo+1;
			}
			$appNo="select applicationNo,batchId from ccmaping where jobNo=".$jobNo." and agencyId=".$agencyId." 
					and creationDate=curdate()";
			$getrslt=$this->db->query($appNo)->result();		
		return $files=array("batch"=>$rsltBatchNo[0]->batchNo,"img"=>$arrSortedFiles,"data"=>$getrslt);	
		}
//QUERY BROWSER	
public function executequery($sql)
{
$sql = rawurldecode($sql);
$query = $this->db->query($sql);
	return $query->result();
}

//ALLOCATE APPLICATION NO
public function allocateBlankEntry($params)
{
	
	$imgData=explode(",",$params['imgData']);
	$imgApplication=explode(",",$params['applicationData']);
	$imgJd=$params['jdNo'];
	$job=$params['job'];
	$agencyCode=$params['agencyId'];
	if (!file_exists(IMAGE_INDEXING_CC_JOB_ROOT.$job."".SEPARATOR.$agencyCode.SEPARATOR."Mapped_Images".SEPARATOR)) 
	{
   		 mkdir(IMAGE_INDEXING_CC_JOB_ROOT.$job."".SEPARATOR.$agencyCode.SEPARATOR."Mapped_Images".SEPARATOR,0777, true);
	}
	for($i=0;$i<count($imgApplication);$i++)
	{
		if($imgApplication[$i] != ""){
		$sql="update ccmaping set allocatedApplication='".$imgData[$i]."' where applicationNo=".$imgApplication[$i]." and jdNo=".$imgJd."";
		$qparent=$this->db->query($sql);
		if($imgData[$i]!='')
		{
		if(file_exists(IMAGE_INDEXING_CC_JOB_ROOT.$job."".SEPARATOR."".$agencyCode.SEPARATOR."mergedImages".SEPARATOR.$imgData[$i])){
			
			rename(IMAGE_INDEXING_CC_JOB_ROOT.$job."".SEPARATOR."".$agencyCode.SEPARATOR."mergedImages".SEPARATOR.$imgData[$i], IMAGE_INDEXING_CC_JOB_ROOT.$job."".SEPARATOR.$agencyCode.SEPARATOR."Mapped_Images".SEPARATOR."".$imgData[$i]);	
		}
		}	
		}
		
	}
	
}
//ADD AGENCY
public function agencyCreate($agencyCode,$agencyName,$batchId)
{
	$selectDup="select * from ccagencymaster 
				where agencyCode='".$agencyCode."' 
				or agencyName like ('$agencyName')
				or batchId='".$batchId."'";
	$selectDupresult = $this->db->query($selectDup)->result();
	if(count($selectDupresult)==0)
	{
		return true;
	}
	else
	{ return false;
	}
     		
}
  
public function updateStatus($batchId)
{
	$sql="select importId from ccimport where agencyBatchId=".$batchId;
	$result=$this->db->query($sql)->result();
	for($i=0;$i<count($result);$i++)
	{
		$updateStatus="update ccimport 
						set status=(select statusId from corestatus where status like ('Non Allocated')) 
						where importId='".$result[$i]->importId."'";
		$execute=$this->db->query($updateStatus);
	}
}
			
public function allocateRecord($processId,$userId,$agencyCode)
{
	//GET NON ALLOCATED ENTRY FOR THE PROCESS
		$prevsql="select ccdataentry.*,ccdataentry.entryId as dataentryId,ccmaping.imageType,ccmaping.mappingId,ccmaping.agencyId
		,ccmaping.allocatedApplication,ccmaping.jobNo,coreusers.fullName from ccdataentry,ccmaping,ccallocation,coreusers 
			where ccallocation.entryId=ccdataentry.entryId 
			and ccallocation.mappingId=ccmaping.mappingId 
			and ccmaping.agencyId=".$agencyCode." and ccdataentry.userId=".$userId." and ccallocation.processId=".$processId."
			and ccdataentry.currentSection!=6
			and ccdataentry.RejectionCatId!=1
			and coreusers.userId=ccdataentry.userId
			order by ccdataentry.entryId desc limit 1 ";
	$prevresult=$this->db->query($prevsql)->result();
	//echo $prevsql;
	if(count($prevresult)>0)
	{
			if($processId==3)
			{
				$entryId="select ccallocation.entryId from ccallocation where mappingId=".$prevresult[0]->mappingId." and processId=1";
				$rsltEntry=$this->db->query($entryId)->result();
						$prevresult[0]->entryId=$rsltEntry[0]->entryId;
	
			}
			else if($processId==5)
			{
				$entryId="select ccallocation.entryId from ccallocation where mappingId=".$prevresult[0]->mappingId." and processId=5";
				$rsltEntry=$this->db->query($entryId)->result();
						$prevresult[0]->entryId=$rsltEntry[0]->entryId;
	
			}
			$prevresult[0]->isIncomplete="true";
			return $prevresult;
			
		
	}
	else
	{
		//echo "else";
			if($processId==3)
			{
						
			 $sql="select *,ccallocation.entryId,coreusers.fullName,ccmaping.mappingId
					from ccmaping,ccallocation,ccagencybatch,coreusers,ccdataentry
					where 
					ccmaping.mappingId not in (select mappingId from ccallocation where ccallocation.processId=".$processId.") 
					and 
					ccmaping.mappingId in (select mappingId from ccallocation where ccallocation.processId= (SELECT processId from coreprocessmaster where processName like 'Data Entry') and userId!=".$userId.")
					and ccmaping.mappingId=ccallocation.mappingId
					and ccallocation.entryId=ccdataentry.entryId
					and coreusers.userId=ccallocation.userId
					and coreusers.userId=ccdataentry.userId
					and ccmaping.agencyId=".$agencyCode." 
					and ccmaping.allocatedApplication!='' 
					and ccdataentry.currentSection=6
					and ccdataentry.RejectionCatId!=1 limit 1 ";
				//echo $sql;	
			}
			else if($processId==5)
			{
						
				$sql="select *,ccallocation.entryId,ccmaping.mappingId from ccmaping,ccallocation,ccimageinputtype,corebatchmaster,ccagencybatch
						where 
						ccmaping.mappingId not in (select mappingId from ccallocation 
						where ccallocation.processId=".$processId.") 
						and ccmaping.mappingId in 
						 (select mappingId from ccallocation where ccallocation.processId=
						 (SELECT processId from coreprocessmaster where processName like 'QC'))
						and ccmaping.agencyId=ccagencybatch.agencyId 
						and ccmaping.agencyId=".$agencyCode." 
						and 
					ccmaping.inAppStatus not like (select statusId from corestatus where status like ('Skiped Audit')) limit 1";
					
			}
			else
			{
				$sql="select distinct ccmaping.mappingId,ccmaping.applicationNo,ccmaping.allocatedApplication,ccimageinputtype.imageName,
				ccmaping.jobNo from ccmaping,ccimageinputtype,ccagencybatch,corebatchmaster
						where 
						ccmaping.mappingId not in (select mappingId from ccallocation 
						where ccallocation.processId=".$processId.")
						and ccmaping.imageType=ccimageinputtype.imageTypeId
						 and ccagencybatch.agencyId=ccmaping.agencyId 
						 and ccagencybatch.batchId=corebatchmaster.batchId
						and ccmaping.agencyId=".$agencyCode."  and ccmaping.allocatedApplication!='' 
						limit 1";
			}
			$result=$this->db->query($sql)->result();
			//GET STATUS
			$statusSql="select statusId from corestatus
						where 
						status like ('Started')";
			$statusResult=$this->db->query($statusSql)->result();
			//ALLOCATE THE RECORD
			if(count($result)>0)
			{
				if($processId==1)
				{
				 $enter="insert into ccdataentry (entryId,userId,entryDate,varaControlNo,ApplrefNo) values ('',".$userId.",'now()',".$result[0]->applicationNo.",".$result[0]->applicationNo.")";
				$qparent = $this->db->query($enter);
				$insert_id = $this->db->insert_id();
				}
				else
				{
					$enter="insert into ccdataentry (entryId,userId,entryDate,varaControlNo,ApplrefNo) values ('',".$userId.",'now()'
					,".$result[0]->applicationNo.",".$result[0]->applicationNo.")";
					$qparent = $this->db->query($enter);
					$insert_id = $this->db->insert_id();
					if($processId==3)
					{
						$entryId="select ccallocation.entryId from ccallocation where mappingId=".$result[0]->mappingId." and processId=1";
						$rsltEntry=$this->db->query($entryId)->result();
								$result[0]->entryId=$rsltEntry[0]->entryId;
			
					}
					else if($processId==5)
					{
						$entryId="select ccallocation.entryId from ccallocation where mappingId=".$result[0]->mappingId." and processId=5";
						$rsltEntry=$this->db->query($entryId)->result();
								$result[0]->entryId=$rsltEntry[0]->entryId;
			
					}
				}
					
		
				$insert="insert into ccallocation(entryId,userId,status,processId,mappingId) 
						  values (".$insert_id.",".$userId.",".$statusResult[0]->statusId.",".$processId.",".$result[0]->mappingId.")";
		//				  echo $insert;
				$insertResult=$this->db->query($insert);
				$result[0]->dataentryId=$insert_id;
				$result[0]->isIncomplete="false";
				//unset($result[0]->jdNo);
				return $result;
			}
	 
	}
}
		
public function insertFields($keyFields,$arrFields,$whr)
{
			//1. GET TABLE NAMES
			$arrTable = array();
			for($i=0;$i<count($keyFields);$i++)
			{
				$tmp = explode(".",$keyFields[$i]);
				if(isset($tmp[0]))	$arrTable[] = $tmp[0];
			}
			$arrTable = array_unique($arrTable);
			// CREATE UPDATE QUERIES FOR EACH TABLE
			for($i=0;$i<count($arrTable);$i++){
				if($whr != ""){
					$sql = "UPDATE ccdataentry SET ".$keyFields[0]." = '".$arrFields[$keyFields[0]]."' ";					
					for($j=1;$j<count($keyFields);$j++){
						if($keyFields[$j]!=""){
							$tmp = explode(".",$keyFields[$i]);
							if($tmp[0] == $arrTable[$i]){
								$sql.=", ".$keyFields[$j]." = '".$arrFields[$keyFields[$j]]."'";
							}
						}
						
					}
					$sql.=" where 1=1 ".$whr;

				}else{
					$sql = "INSERT INTO ".$arrTable[$i]." ( "; //.implode(",",$keyFields).") values( ";
					for($j=0;$j<count($keyFields);$j++){
						if($keyFields[$j]!=""){
							$tmp = explode(".",$keyFields[$i]);
							if($tmp[0] == $arrTable[$i]){
								$sql.=$keyFields[$j].",";
							}
						}
					}
					$sql = substr($sql, 0, -1);
					$sql.=" ) VALUES ( ";
					
					$sqlcols="";
					for($j=0;$j<count($keyFields);$j++){
						if($keyFields[$j]!=""){
							$tmp = explode(".",$keyFields[$i]);
							if($tmp[0] == $arrTable[$i]){
								$sqlcols.="'".$arrFields[$keyFields[$j]]."',";
							}
						}
						
					}					
					$sqlcols = substr($sqlcols, 0, -1);
					
					$sql.=$sqlcols." )";
				}

				
				
				$this->db->query($sql);
			}
			
		}
		
//VALIDATION DATA
public function getdata($code,$table,$fieldName)
{
		// print_r($table);
		 $table = str_replace('%5B%22', ' ', $table);
		 $table = str_replace('%22', ' ', $table);
		 $table = str_replace('%22%5D', ' ', $table);
		 $table = str_replace('%5D', ' ', $table);
//		 $sql = "SELECT * from ".$table." WHERE ".$fieldName."='".$code."' group by ".$fieldName." ";     
		 $sql = "SELECT * from ".$table." WHERE ".$fieldName."='".$code."' ";     
		 $qparent = $this->db->query($sql)->result();
		 
		 return $qparent;
}
		  
//FETCH JD DATA
public function jddata($jdNo,$agencyId)
{
			$sql="select * from ccmaping 
				  where ccmaping.mappingId not in (select mappingId from ccallocation)
				  and jdNo=".$jdNo." and agencyId=".$agencyId." and ccmaping.inAppStatus not in (select statusId from corestatus where status like ('Skiped Audit'))";
			$result=$this->db->query($sql)->result();
			return $result=array("total"=>count($result),"FirstApp"=>$result[0]->applicationNo,"LastApp"=>current(array_slice($result, -1)));			  
			
		
		}
		
//DUPLICATE	  
public function ccMarkDuplicateRecords($agencyBatchId)
{
				$duplicate=0;
				$sql="SELECT * from ccimport where agencyBatchId=".$agencyBatchId;
				
				$resultsql=$this->db->query($sql)->result();
				//	print_r(count($resultsql));
				for($i=0;$i<count($resultsql);$i++)
				{
					$sqlselect="SELECT * from ccimport 
								where 
								agencyBatchId not in (".$agencyBatchId.") 
								and (CCNo  IN ('".$resultsql[$i]->CCNo."') 
								)";
						
								$resultselect=$this->db->query($sqlselect)->result();
								if(count($resultselect)>0)
								{
									$sqlupdate="Delete from ccimport where 
												CCNo='".$resultselect[0]->CCNo."'
												and agencyBatchId=".$agencyBatchId;
												$execute=$this->db->query($sqlupdate);
											$duplicate++;
								}
								
				}
					return $duplicate;	
	}
		
//REPORT
public function ccBankreportCsv($appref)
{
	 
	$arr = explode(",",$appref);
	 
	   
	   $sql="select AppSerialNo,yourFirstName,yourLastName, dateOfBirth,dmaCity,dmaId,dmeId
	from ccdataentry,ccallocation where ccdataentry.entryId=ccallocation.entryId and ccallocation.processId='3' and"; 
	 
	 for($i=0;$i<count($arr);$i++){
	  if($i != 0){
	   $sql.=" OR "; 
	  }
	  else{
	   $sql.=" ("; 
	  }
	  $sql .= "   ApplRefNo like '".$arr[$i]."'"; 
	 }
	
	 $sql.=")";
	  //$sql.=$whr;
	// echo $sql;
	  $qparent=$this->db->query($sql)->result();
	   return $qparent;
 }

//CALCULATE AGE
public function getCalculateAge($selecteddate)
{
	//	print_r($selecteddate);
		$from = date_create($selecteddate);
		//print_r($from);
		$date_to   = date('d-m-Y');
    	$to = date_create($date_to);
   		$interval = date_diff($from, $to);
		 // print_r($interval->y);
		   if($interval->y<73 && $interval->y>18 )
		  {
			return true;
		   }
		   else
		   {
			return false; 
		   }
			  
		   //return $qparent;
  		}
		
public function generateMISSummaryReport($startingNumber,$endingNumber)
{
			
			$query = "SELECT emboName,AppSerialNo,ApplRefNo FROM ccdataentry,ccallocation
					 WHERE ApplRefNo>= ".$startingNumber." AND  ApplRefNo<=".$endingNumber."
					 and ccallocation.entryId=ccdataentry.entryId 
					 and ccallocation.processId=3 and ccdataentry.currentSection=6";
			$execute=$this->db->query($query)->result();
			//$execute
		return $execute;

		}
		
public function generateMISRejectionReport($startingNumber,$endingNumber)
{
			$query_dataenrty = "SELECT emboName,AppSerialNo,ApplRefNo,RejectionCatId,remarkDescription as reason 
			FROM ccdataentry,ccreasonmaster WHERE 		       			
			ApplRefNo>= '".$startingNumber."' AND  ApplRefNo<='".$endingNumber."' 
			AND `RejectionCatId`!=0 and ccreasonmaster.remarkId=ccdataentry.rejectionReason" ;
			$execute_dataenrty=$this->db->query($query_dataenrty)->result();
		//print_r($execute_dataenrty);
			//echo count($execute_dataenrty);
		//	echo $query_dataenrty;
			return ($execute_dataenrty);
		}
	
public function generateDateWiseReport($startingDate,$endingDate)
{
			$startdate = str_replace('%20', ' ', $startingDate);
			$enddate = str_replace('%20', ' ', $endingDate);
			
			$start = date("Y-m-d", strtotime($startdate));
			$end = date("Y-m-d", strtotime($enddate));
		 $query_entryId = "SELECT `entryId` FROM `ccdataentry` WHERE `entryDate`>= '".$start." 00:00:00' or `entryDate`<='".$end." 24:00:00'";
			$execute_queryEntryID=$this->db->query($query_entryId)->result();
			//echo "<pre>";print_r($execute_queryEntryID);echo "</pre>";
			
			$query_processQC = "SELECT processId FROM `coreprocessmaster` WHERE processName like ('QC')";
			$execute_queryProcessQC = $this->db->query($query_processQC)->result();
					
			for($i=0;$i<count($execute_queryEntryID);$i++)
			{
				$query_userID = "SELECT `userId`,`processId` FROM `ccallocation` WHERE `entryId`=".$execute_queryEntryID[$i]->entryId;
				$execute_queryUserID=$this->db->query($query_userID)->result();
				
				//echo "<pre>";print_r($execute_queryUserID);echo "</pre>";
				
					$query_userID = "SELECT * FROM `coreusers` WHERE `userId`=".$execute_queryUserID[0]->userId;
					$execute_queryUserID=$this->db->query($query_userID)->result();
					$execute_queryEntryID[$i]->fullName=$execute_queryUserID[0]->fullName;
					$execute_queryEntryID[$i]->userID=$execute_queryUserID[0]->userId;
				
			//Creation Date and get total days or Agging
					
					$execute_queryEntryID[$i]->creationDate = date("d-m-Y", strtotime($execute_queryUserID[0]->creationDate));					
					$now = time(); // or your date as well
					$your_date = strtotime($execute_queryEntryID[$i]->creationDate);
					$datediff = $now - $your_date;					
					$execute_queryEntryID[$i]->Aging = floor($datediff / (60 * 60 * 24));
					
			//get CAP record
					$sql="select count(*) as total from ccallocation where userId=".$execute_queryUserID[0]->userId." and processId In(SELECT processId FROM `coreprocessmaster` WHERE processName like ('Data Entry'))";
					$qparent=$this->db->query($sql)->result();
					$execute_queryEntryID[$i]->CAP=$qparent[0]->total;
			
			//get QC record
			
					$sqlQc="select count(*) as total from ccallocation where userId=".$execute_queryUserID[0]->userId." and processId In(SELECT processId FROM `coreprocessmaster` WHERE processName like ('QC'))";
					$qparentQc=$this->db->query($sqlQc)->result();
					$execute_queryEntryID[$i]->QC=$qparentQc[0]->total;
					$execute_queryEntryID[$i]->Total = ($execute_queryEntryID[$i]->CAP)+($execute_queryEntryID[$i]->QC);		
			}
			
			return ($execute_queryEntryID);
		}

		
public function generateHourlyReport($date,$shift,$activity)
{
			//echo "date==".$date;
			//echo "shift==".$shift;
			//echo "Activity==".$activity;
			if($date=="0" && $shift=="0" && $activity=="0")
			{
				
				$checkDate = date('Y-m-d');
				$stime = "08:00:00";
				$etime = "20:00:00";
				$sql= "SELECT `userId`,Hour(entryDate) as Hour,count(*) as total FROM `ccdataentry` WHERE `entryDate`>='".$checkDate." ".$stime."' AND `entryDate`<='".$checkDate." ".$etime."' GROUP BY HOUR(entryDate)";
				$execute_result=$this->db->query($sql)->result();
				//echo "<pre>";print_r($execute_result);echo "</pre>";
				for($i=0;$i<count($execute_result);$i++)
				{			
					$query_userID = "SELECT * FROM coreusers WHERE userId=".$execute_result[$i]->userId;
					$execute_result1=$this->db->query($query_userID)->result();
					//echo "<pre>";print_r($execute_result1);echo "</pre>";
					//$execute_result[$i]->userID=$execute_result[0]->userId;
					$execute_result[$i]->Operator = $execute_result1[0]->fullName;
					
					
					if($execute_result[$i]->Hour==8)
					{
						$execute_result[$i]->Eight=$execute_result[$i]->total;	
					}
					else
					{
						$execute_result[$i]->Eight="0";
					}
					if($execute_result[$i]->Hour==9)
					{
						$execute_result[$i]->Nine=$execute_result[$i]->total;	
					}
					else
					{
						$execute_result[$i]->Nine="0";
					}
					if($execute_result[$i]->Hour==10)
					{
						$execute_result[$i]->Ten=$execute_result[$i]->total;	
					}
					else
					{
						$execute_result[$i]->Ten="0";
					}
					if($execute_result[$i]->Hour==11)
					{
						$execute_result[$i]->OneOne=$execute_result[$i]->total;	
					}
					else
					{
						$execute_result[$i]->OneOne="0";
					}
					if($execute_result[$i]->Hour==12)
					{
						$execute_result[$i]->OneTwo=$execute_result[$i]->total;	
					}
					else
					{
						$execute_result[$i]->OneTwo="0";
					}
					if($execute_result[$i]->Hour==13)
					{
						$execute_result[$i]->OneThree=$execute_result[$i]->total;	
					}
					else
					{
						$execute_result[$i]->OneThree="0";
					}
					if($execute_result[$i]->Hour==14)
					{
						$execute_result[$i]->OneFour=$execute_result[$i]->total;	
					}
					else
					{
						$execute_result[$i]->OneFour="0";
					}
					if($execute_result[$i]->Hour==15)
					{
						$execute_result[$i]->OneFive=$execute_result[$i]->total;	
					}
					else
					{
						$execute_result[$i]->OneFive="0";
					}
					if($execute_result[$i]->Hour==16)
					{
						$execute_result[$i]->OneSix=$execute_result[$i]->total;	
					}
					else
					{
						$execute_result[$i]->OneSix="0";
					}
					if($execute_result[$i]->Hour==17)
					{
						$execute_result[$i]->OneSeven=$execute_result[$i]->total;
					}
					else
					{
						$execute_result[$i]->OneSeven="0";
					}
					if($execute_result[$i]->Hour==18)
					{
						$execute_result[$i]->OneEight=$execute_result[$i]->total;	
					}
					else
					{
						$execute_result[$i]->OneEight="0";
					}
					if($execute_result[$i]->Hour==19)
					{
						$execute_result[$i]->OneNine=$execute_result[$i]->total;	
					}
					else
					{
						$execute_result[$i]->OneNine="0";
					}
					
				}
				return ($execute_result);
			}
			else if($activity=="0" && $shift=="0")
			{
				
				$startdate = str_replace('%20', ' ', $date);
				$checkDate = date("Y-m-d",strtotime($startdate));
				$stime = "00:00:00";
				$etime = "23:00:00";
				$sql= "SELECT Hour(entryDate) as Hour,count(*) as total FROM `ccdataentry` WHERE `entryDate`>='".$checkDate." ".$stime."' AND `entryDate`<='".$checkDate." ".$etime."' GROUP BY HOUR(entryDate)";
				$execute_result=$this->db->query($sql)->result();
				
				for($i=0;$i<count($execute_result);$i++)
				{			
					$query_userID = "SELECT * FROM coreusers WHERE userId=".$execute_result[$i]->userId;
					$execute_result2=$this->db->query($query_userID)->result();
					//echo "<pre>";print_r($execute_result2);echo "</pre>";
					$execute_result[$i]->userID = $execute_result2[0]->userId;
					$execute_result[$i]->Operator = $execute_result2[0]->fullName;					
				
					if($execute_result[$i]->Hour==8)
					{
						$execute_result[$i]->Eight=$execute_result[$i]->total;	
					}
					else
					{
						$execute_result[$i]->Eight="0";
					}
					if($execute_result[$i]->Hour==9)
					{
						$execute_result[$i]->Nine=$execute_result[$i]->total;	
					}
					else
					{
						$execute_result[$i]->Nine="0";
					}
					if($execute_result[$i]->Hour==10)
					{
						$execute_result[$i]->Ten=$execute_result[$i]->total;	
					}
					else
					{
						$execute_result[$i]->Ten="0";
					}
					if($execute_result[$i]->Hour==11)
					{
						$execute_result[$i]->OneOne=$execute_result[$i]->total;	
					}
					else
					{
						$execute_result[$i]->OneOne="0";
					}
					if($execute_result[$i]->Hour==12)
					{
						$execute_result[$i]->OneTwo=$execute_result[$i]->total;	
					}
					else
					{
						$execute_result[$i]->OneTwo="0";
					}
					if($execute_result[$i]->Hour==13)
					{
						$execute_result[$i]->OneThree=$execute_result[$i]->total;	
					}
					else
					{
						$execute_result[$i]->OneThree="0";
					}
					if($execute_result[$i]->Hour==14)
					{
						$execute_result[$i]->OneFour=$execute_result[$i]->total;	
					}
					else
					{
						$execute_result[$i]->OneFour="0";
					}
					if($execute_result[$i]->Hour==15)
					{
						$execute_result[$i]->OneFive=$execute_result[$i]->total;	
					}
					else
					{
						$execute_result[$i]->OneFive="0";
					}
					if($execute_result[$i]->Hour==16)
					{
						$execute_result[$i]->OneSix=$execute_result[$i]->total;	
					}
					else
					{
						$execute_result[$i]->OneSix="0";
					}
					if($execute_result[$i]->Hour==17)
					{
						$execute_result[$i]->OneSeven=$execute_result[$i]->total;
					}
					else
					{
						$execute_result[$i]->OneSeven="0";
					}
					if($execute_result[$i]->Hour==18)
					{
						$execute_result[$i]->OneEight=$execute_result[$i]->total;	
					}
					else
					{
						$execute_result[$i]->OneEight="0";
					}
					if($execute_result[$i]->Hour==19)
					{
						$execute_result[$i]->OneNine=$execute_result[$i]->total;	
					}
					else
					{
						$execute_result[$i]->OneNine="0";
					}
					
				}
					return ($execute_result);
			}
			elseif($date=="0" && $activity=="0")//Shift Selected
			{
				
				if($shift=="Day")//Shift Selected day
				{	
					$checkDate = date("Y-m-d");
					$stime = "08:00:00";
					$etime = "20:00:00";
					$sql= "SELECT `userId`, Hour(entryDate) as Hour,count(*) as total FROM `ccdataentry` WHERE `entryDate`>='".$checkDate." ".$stime."' AND `entryDate`<='".$checkDate." ".$etime."' GROUP BY HOUR(entryDate)";
					$execute_result=$this->db->query($sql)->result();
					//echo "<pre>";print_r($execute_result);echo "</pre>";
					for($i=0;$i<count($execute_result);$i++)
					{			
						$query_userID = "SELECT * FROM coreusers WHERE userId=".$execute_result[$i]->userId;
						$execute_result2=$this->db->query($query_userID)->result();
						//echo "<pre>";print_r($execute_result2);echo "</pre>";
						$execute_result[$i]->userID = $execute_result2[0]->userId;
						$execute_result[$i]->Operator = $execute_result2[0]->fullName;					
					
						if($execute_result[$i]->Hour==8)
						{
							$execute_result[$i]->Eight=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->Eight="0";
						}
						if($execute_result[$i]->Hour==9)
						{
							$execute_result[$i]->Nine=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->Nine="0";
						}
						if($execute_result[$i]->Hour==10)
						{
							$execute_result[$i]->Ten=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->Ten="0";
						}
						if($execute_result[$i]->Hour==11)
						{
							$execute_result[$i]->OneOne=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneOne="0";
						}
						if($execute_result[$i]->Hour==12)
						{
							$execute_result[$i]->OneTwo=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneTwo="0";
						}
						if($execute_result[$i]->Hour==13)
						{
							$execute_result[$i]->OneThree=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneThree="0";
						}
						if($execute_result[$i]->Hour==14)
						{
							$execute_result[$i]->OneFour=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneFour="0";
						}
						if($execute_result[$i]->Hour==15)
						{
							$execute_result[$i]->OneFive=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneFive="0";
						}
						if($execute_result[$i]->Hour==16)
						{
							$execute_result[$i]->OneSix=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneSix="0";
						}
						if($execute_result[$i]->Hour==17)
						{
							$execute_result[$i]->OneSeven=$execute_result[$i]->total;
						}
						else
						{
							$execute_result[$i]->OneSeven="0";
						}
						if($execute_result[$i]->Hour==18)
						{
							$execute_result[$i]->OneEight=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneEight="0";
						}
						if($execute_result[$i]->Hour==19)
						{
							$execute_result[$i]->OneNine=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneNine="0";
						}
						
					}
					//echo "<pre>";print_r($execute_result);echo "</pre>";
						return ($execute_result);
				
				}
				if($shift=="Night")//Shift Selected night
				{
				}
					
			}
			elseif($date=="0" && $shift=="0")//Activity Selected
			{ 
				
					$checkDate = date("Y-m-d");
					$stime = "08:00:00";
					$etime = "20:00:00";
					$sql= "SELECT `userId`, Hour(entryDate) as Hour,count(*) as total FROM `ccdataentry` WHERE `entryDate`>='".$checkDate." ".$stime."' AND `entryDate`<='".$checkDate." ".$etime."' AND entryid IN(SELECT entryid FROM `ccallocation` WHERE processId=(SELECT processId FROM `coreprocessmaster` WHERE processId='".$activity."')) GROUP BY HOUR(entryDate)";
					$execute_result=$this->db->query($sql)->result();
					//echo "<pre>";print_r($execute_result);echo "</pre>";
					for($i=0;$i<count($execute_result);$i++)
					{			
						$query_userID = "SELECT * FROM coreusers WHERE userId=".$execute_result[$i]->userId;
						$execute_result2=$this->db->query($query_userID)->result();
						//echo "<pre>";print_r($execute_result2);echo "</pre>";
						$execute_result[$i]->userID = $execute_result2[0]->userId;
						$execute_result[$i]->Operator = $execute_result2[0]->fullName;					
					
						if($execute_result[$i]->Hour==8)
						{
							$execute_result[$i]->Eight=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->Eight="0";
						}
						if($execute_result[$i]->Hour==9)
						{
							$execute_result[$i]->Nine=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->Nine="0";
						}
						if($execute_result[$i]->Hour==10)
						{
							$execute_result[$i]->Ten=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->Ten="0";
						}
						if($execute_result[$i]->Hour==11)
						{
							$execute_result[$i]->OneOne=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneOne="0";
						}
						if($execute_result[$i]->Hour==12)
						{
							$execute_result[$i]->OneTwo=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneTwo="0";
						}
						if($execute_result[$i]->Hour==13)
						{
							$execute_result[$i]->OneThree=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneThree="0";
						}
						if($execute_result[$i]->Hour==14)
						{
							$execute_result[$i]->OneFour=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneFour="0";
						}
						if($execute_result[$i]->Hour==15)
						{
							$execute_result[$i]->OneFive=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneFive="0";
						}
						if($execute_result[$i]->Hour==16)
						{
							$execute_result[$i]->OneSix=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneSix="0";
						}
						if($execute_result[$i]->Hour==17)
						{
							$execute_result[$i]->OneSeven=$execute_result[$i]->total;
						}
						else
						{
							$execute_result[$i]->OneSeven="0";
						}
						if($execute_result[$i]->Hour==18)
						{
							$execute_result[$i]->OneEight=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneEight="0";
						}
						if($execute_result[$i]->Hour==19)
						{
							$execute_result[$i]->OneNine=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneNine="0";
						}
						
					}
					//echo "<pre>";print_r($execute_result);echo "</pre>";
						return ($execute_result);
				
			}
			elseif($activity=="0")//Date and Shift Selected
			{
				$startdate = str_replace('%20', ' ', $date);
				$checkDate = date("Y-m-d",strtotime($startdate));
				
				if($shift=="Day")//Shift Selected day
				{	
					$stime = "08:00:00";
					$etime = "20:00:00";
					$sql= "SELECT `userId`, Hour(entryDate) as Hour,count(*) as total FROM `ccdataentry` WHERE `entryDate`>='".$checkDate." ".$stime."' AND `entryDate`<='".$checkDate." ".$etime."' GROUP BY HOUR(entryDate)";
					$execute_result=$this->db->query($sql)->result();
					//echo "<pre>";print_r($execute_result);echo "</pre>";
					for($i=0;$i<count($execute_result);$i++)
					{			
						$query_userID = "SELECT * FROM coreusers WHERE userId=".$execute_result[$i]->userId;
						$execute_result2=$this->db->query($query_userID)->result();
						//echo "<pre>";print_r($execute_result2);echo "</pre>";
						$execute_result[$i]->userID = $execute_result2[0]->userId;
						$execute_result[$i]->Operator = $execute_result2[0]->fullName;					
					
						if($execute_result[$i]->Hour==8)
						{
							$execute_result[$i]->Eight=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->Eight="0";
						}
						if($execute_result[$i]->Hour==9)
						{
							$execute_result[$i]->Nine=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->Nine="0";
						}
						if($execute_result[$i]->Hour==10)
						{
							$execute_result[$i]->Ten=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->Ten="0";
						}
						if($execute_result[$i]->Hour==11)
						{
							$execute_result[$i]->OneOne=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneOne="0";
						}
						if($execute_result[$i]->Hour==12)
						{
							$execute_result[$i]->OneTwo=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneTwo="0";
						}
						if($execute_result[$i]->Hour==13)
						{
							$execute_result[$i]->OneThree=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneThree="0";
						}
						if($execute_result[$i]->Hour==14)
						{
							$execute_result[$i]->OneFour=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneFour="0";
						}
						if($execute_result[$i]->Hour==15)
						{
							$execute_result[$i]->OneFive=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneFive="0";
						}
						if($execute_result[$i]->Hour==16)
						{
							$execute_result[$i]->OneSix=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneSix="0";
						}
						if($execute_result[$i]->Hour==17)
						{
							$execute_result[$i]->OneSeven=$execute_result[$i]->total;
						}
						else
						{
							$execute_result[$i]->OneSeven="0";
						}
						if($execute_result[$i]->Hour==18)
						{
							$execute_result[$i]->OneEight=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneEight="0";
						}
						if($execute_result[$i]->Hour==19)
						{
							$execute_result[$i]->OneNine=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneNine="0";
						}						
					}
					//echo "<pre>";print_r($execute_result);echo "</pre>";
						return ($execute_result);				
				}
				if($shift=="Night")//Shift Selected night
				{}
			}
			elseif($shift=="0")//Date And Activity Selected
			{
				$startdate = str_replace('%20', ' ', $date);
				$checkDate = date("Y-m-d",strtotime($startdate));	
				$stime = "08:00:00";
				$etime = "20:00:00";	
					$sql= "SELECT `userId`, Hour(entryDate) as Hour,count(*) as total FROM `ccdataentry` WHERE `entryDate`>='".$checkDate." ".$stime."' AND `entryDate`<='".$checkDate." ".$etime."' AND entryid IN(SELECT entryid FROM `ccallocation` WHERE processId=(SELECT processId FROM `coreprocessmaster` WHERE processId='".$activity."')) GROUP BY HOUR(entryDate)";
					$execute_result=$this->db->query($sql)->result();
					//echo "<pre>";print_r($execute_result);echo "</pre>";
					for($i=0;$i<count($execute_result);$i++)
					{			
						$query_userID = "SELECT * FROM coreusers WHERE userId=".$execute_result[$i]->userId;
						$execute_result2=$this->db->query($query_userID)->result();
						//echo "<pre>";print_r($execute_result2);echo "</pre>";
						$execute_result[$i]->userID = $execute_result2[0]->userId;
						$execute_result[$i]->Operator = $execute_result2[0]->fullName;					
					
						if($execute_result[$i]->Hour==8)
						{
							$execute_result[$i]->Eight=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->Eight="0";
						}
						if($execute_result[$i]->Hour==9)
						{
							$execute_result[$i]->Nine=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->Nine="0";
						}
						if($execute_result[$i]->Hour==10)
						{
							$execute_result[$i]->Ten=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->Ten="0";
						}
						if($execute_result[$i]->Hour==11)
						{
							$execute_result[$i]->OneOne=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneOne="0";
						}
						if($execute_result[$i]->Hour==12)
						{
							$execute_result[$i]->OneTwo=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneTwo="0";
						}
						if($execute_result[$i]->Hour==13)
						{
							$execute_result[$i]->OneThree=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneThree="0";
						}
						if($execute_result[$i]->Hour==14)
						{
							$execute_result[$i]->OneFour=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneFour="0";
						}
						if($execute_result[$i]->Hour==15)
						{
							$execute_result[$i]->OneFive=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneFive="0";
						}
						if($execute_result[$i]->Hour==16)
						{
							$execute_result[$i]->OneSix=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneSix="0";
						}
						if($execute_result[$i]->Hour==17)
						{
							$execute_result[$i]->OneSeven=$execute_result[$i]->total;
						}
						else
						{
							$execute_result[$i]->OneSeven="0";
						}
						if($execute_result[$i]->Hour==18)
						{
							$execute_result[$i]->OneEight=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneEight="0";
						}
						if($execute_result[$i]->Hour==19)
						{
							$execute_result[$i]->OneNine=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneNine="0";
						}
						
					}
					//echo "<pre>";print_r($execute_result);echo "</pre>";
						return ($execute_result);
			}
			elseif($date=="0")
			{
				if($shift=="Day")//Shift Selected day
				{
				$checkDate = date("Y-m-d");	
				$stime = "08:00:00";
				$etime = "20:00:00";	
					$sql= "SELECT `userId`, Hour(entryDate) as Hour,count(*) as total FROM `ccdataentry` WHERE `entryDate`>='".$checkDate." ".$stime."' AND `entryDate`<='".$checkDate." ".$etime."' AND entryid IN(SELECT entryid FROM `ccallocation` WHERE processId=(SELECT processId FROM `coreprocessmaster` WHERE processId='".$activity."')) GROUP BY HOUR(entryDate)";
					$execute_result=$this->db->query($sql)->result();
					//echo "<pre>";print_r($execute_result);echo "</pre>";
					for($i=0;$i<count($execute_result);$i++)
					{			
						$query_userID = "SELECT * FROM coreusers WHERE userId=".$execute_result[$i]->userId;
						$execute_result2=$this->db->query($query_userID)->result();
						//echo "<pre>";print_r($execute_result2);echo "</pre>";
						$execute_result[$i]->userID = $execute_result2[0]->userId;
						$execute_result[$i]->Operator = $execute_result2[0]->fullName;					
					
						if($execute_result[$i]->Hour==8)
						{
							$execute_result[$i]->Eight=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->Eight="0";
						}
						if($execute_result[$i]->Hour==9)
						{
							$execute_result[$i]->Nine=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->Nine="0";
						}
						if($execute_result[$i]->Hour==10)
						{
							$execute_result[$i]->Ten=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->Ten="0";
						}
						if($execute_result[$i]->Hour==11)
						{
							$execute_result[$i]->OneOne=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneOne="0";
						}
						if($execute_result[$i]->Hour==12)
						{
							$execute_result[$i]->OneTwo=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneTwo="0";
						}
						if($execute_result[$i]->Hour==13)
						{
							$execute_result[$i]->OneThree=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneThree="0";
						}
						if($execute_result[$i]->Hour==14)
						{
							$execute_result[$i]->OneFour=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneFour="0";
						}
						if($execute_result[$i]->Hour==15)
						{
							$execute_result[$i]->OneFive=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneFive="0";
						}
						if($execute_result[$i]->Hour==16)
						{
							$execute_result[$i]->OneSix=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneSix="0";
						}
						if($execute_result[$i]->Hour==17)
						{
							$execute_result[$i]->OneSeven=$execute_result[$i]->total;
						}
						else
						{
							$execute_result[$i]->OneSeven="0";
						}
						if($execute_result[$i]->Hour==18)
						{
							$execute_result[$i]->OneEight=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneEight="0";
						}
						if($execute_result[$i]->Hour==19)
						{
							$execute_result[$i]->OneNine=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneNine="0";
						}
						
					}
					//echo "<pre>";print_r($execute_result);echo "</pre>";
						return ($execute_result);
			
					
				}
				if($shift=="Night")//Shift Selected Night
				{
					
				}
			}
			else// Date, Shift And Activity selected
			{	
				if($shift=="Day")//Shift Selected day
				{
				$startdate = str_replace('%20', ' ', $date);
				$checkDate = date("Y-m-d",strtotime($startdate));	
				$stime = "08:00:00";
				$etime = "20:00:00";	
					$sql= "SELECT `userId`, Hour(entryDate) as Hour,count(*) as total FROM `ccdataentry` WHERE `entryDate`>='".$checkDate." ".$stime."' AND `entryDate`<='".$checkDate." ".$etime."' AND entryid IN(SELECT entryid FROM `ccallocation` WHERE processId=(SELECT processId FROM `coreprocessmaster` WHERE processId='".$activity."')) GROUP BY HOUR(entryDate)";
					$execute_result=$this->db->query($sql)->result();
					//echo "<pre>";print_r($execute_result);echo "</pre>";
					for($i=0;$i<count($execute_result);$i++)
					{			
						$query_userID = "SELECT * FROM coreusers WHERE userId=".$execute_result[$i]->userId;
						$execute_result2=$this->db->query($query_userID)->result();
						//echo "<pre>";print_r($execute_result2);echo "</pre>";
						$execute_result[$i]->userID = $execute_result2[0]->userId;
						$execute_result[$i]->Operator = $execute_result2[0]->fullName;					
					
						if($execute_result[$i]->Hour==8)
						{
							$execute_result[$i]->Eight=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->Eight="0";
						}
						if($execute_result[$i]->Hour==9)
						{
							$execute_result[$i]->Nine=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->Nine="0";
						}
						if($execute_result[$i]->Hour==10)
						{
							$execute_result[$i]->Ten=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->Ten="0";
						}
						if($execute_result[$i]->Hour==11)
						{
							$execute_result[$i]->OneOne=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneOne="0";
						}
						if($execute_result[$i]->Hour==12)
						{
							$execute_result[$i]->OneTwo=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneTwo="0";
						}
						if($execute_result[$i]->Hour==13)
						{
							$execute_result[$i]->OneThree=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneThree="0";
						}
						if($execute_result[$i]->Hour==14)
						{
							$execute_result[$i]->OneFour=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneFour="0";
						}
						if($execute_result[$i]->Hour==15)
						{
							$execute_result[$i]->OneFive=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneFive="0";
						}
						if($execute_result[$i]->Hour==16)
						{
							$execute_result[$i]->OneSix=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneSix="0";
						}
						if($execute_result[$i]->Hour==17)
						{
							$execute_result[$i]->OneSeven=$execute_result[$i]->total;
						}
						else
						{
							$execute_result[$i]->OneSeven="0";
						}
						if($execute_result[$i]->Hour==18)
						{
							$execute_result[$i]->OneEight=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneEight="0";
						}
						if($execute_result[$i]->Hour==19)
						{
							$execute_result[$i]->OneNine=$execute_result[$i]->total;	
						}
						else
						{
							$execute_result[$i]->OneNine="0";
						}
						
					}
					//echo "<pre>";print_r($execute_result);echo "</pre>";
						return ($execute_result);
				}
				if($shift=="Night")//Shift Selected Night
				{}	
			}
			//return ($execute_queryEntryID);
		}


public function generateBankDataReport($from="")
{
			$sql="select * from 
					ccdataentry,ccallocation 
					where 
					ccallocation.entryId=ccdataentry.entryId 
					and 
					ccallocation.processId=(select processId from coreprocessmaster 
					where processName like ('Audit Entry')) 
					and 
					ccallocation.status=(select statusId from corestatus 
					where status like ('Completed')) ";  //and ccdataentry.entryDate='curdate()'
			$qparent=$this->db->query($sql)->result();
			for($i=0;$i<count($qparent);$i++)
			{
				$dma="select * from ccdmamaster where dmaId=".$qparent[$i]->dmaId;
				$dmarslt=$this->db->query($sql)->result($dma);
				
			}
			print_r(strlen($qparent[0]->ApplRefNo));
			$data="kkkkk".'<br>';
			if ( ! write_file('F:\xampp\htdocs\bpoapps\test.txt', $data))
			{
			echo 'Unable to write the file';
			}
			else
			{ 
			echo 'File written!';
			}
		}
		
public function generateDashboardSummaryReport($from,$to)
{
				 $sql="SELECT distinct agencyId FROM `ccmaping` WHERE jdNo>='".$from."' AND jdNo<='".$to."'";
				 
			 	 $excecute_resultAgencyId=$this->db->query($sql)->result();
				
				 for($i=0;$i<count($excecute_resultAgencyId);$i++)
				{			
					$sql="SELECT agencycode, agencyname FROM ccagencymaster WHERE agencyid=".$excecute_resultAgencyId[$i]->agencyId; 
			 	 	$qparent=$this->db->query($sql)->result();
				 	$excecute_resultAgencyId[$i]->agencycode = $qparent[0]->agencycode;
					$excecute_resultAgencyId[$i]->Location = $qparent[0]->agencyname;
					// In Capture
					$sql="SELECT count(*) as InCapture FROM `ccmaping` WHERE jdNo>='".$from."' AND jdNo<='".$to."' AND agencyId=".$excecute_resultAgencyId[$i]->agencyId." AND mappingId IN(SELECT mappingId FROM ccallocation WHERE status In(SELECT statusId FROM corestatus WHERE status like('Started') OR status like('Pending')))"; 
					$excecute_resultAgencyId1=$this->db->query($sql)->result();
				 	$excecute_resultAgencyId[$i]->InCapture = $excecute_resultAgencyId1[0]->InCapture;
					//Pending For QC
					$sql="SELECT count(*) as PendingForQC FROM `ccmaping` WHERE jdNo>='".$from."' AND jdNo<='".$to."' AND agencyId=".$excecute_resultAgencyId[$i]->agencyId." AND mappingId IN(SELECT mappingId FROM ccallocation WHERE processId In(SELECT processId FROM coreprocessmaster WHERE processName Not LIKE('QC'))  AND status IN(SELECT statusId FROM corestatus WHERE status like('Completed')))"; 
			 		$excecute_resultAgencyId2=$this->db->query($sql)->result();
				 	$excecute_resultAgencyId[$i]->PendingForQC = $excecute_resultAgencyId2[0]->PendingForQC;
					//In QC
					$sql="SELECT count(*) as QC FROM `ccmaping` WHERE jdNo>='".$from."' AND jdNo<='".$to."' AND agencyId=".$excecute_resultAgencyId[$i]->agencyId." AND mappingId IN(SELECT mappingId FROM ccallocation WHERE processId In(SELECT processId FROM coreprocessmaster WHERE processName NOT LIKE('Audit Entry')) AND status IN(SELECT statusId FROM corestatus WHERE status like('Started')))"; 
			 		$excecute_resultAgencyId2=$this->db->query($sql)->result();
				 	$excecute_resultAgencyId[$i]->QC = $excecute_resultAgencyId2[0]->QC;
					//Final
					$sql="SELECT count(*) as Final FROM `ccmaping` WHERE jdNo>='".$from."' AND jdNo<='".$to."' AND agencyId=".$excecute_resultAgencyId[$i]->agencyId." AND mappingId IN(SELECT mappingId FROM ccallocation WHERE processId In(SELECT processId FROM coreprocessmaster WHERE processName like('Audit Entry')) AND status IN(SELECT statusId FROM corestatus WHERE status like('Completed')))"; 
			 	 	$excecute_resultAgencyId3=$this->db->query($sql)->result();
				 	$excecute_resultAgencyId[$i]->Final = $excecute_resultAgencyId3[0]->Final;
					//Rejected
					$sql="SELECT count(*) as Rejected FROM ccdataentry WHERE entryId IN(SELECT entryId FROM ccallocation WHERE mappingId In(SELECT mappingId FROM ccmaping WHERE jdNo>='".$from."' AND jdNo<='".$to."' AND agencyId=".$excecute_resultAgencyId[$i]->agencyId.")) AND RejectionCatId!=0";			
			 	 	$excecute_resultAgencyId3=$this->db->query($sql)->result();
				 	$excecute_resultAgencyId[$i]->Rejected = $excecute_resultAgencyId3[0]->Rejected;
					//pending For capture
					$sql="SELECT count(*) as PendingForCapture  FROM `ccmaping` WHERE jdNo>='".$from."' AND jdNo<='".$to."' AND agencyId=".$excecute_resultAgencyId[$i]->agencyId." AND mappingId NOT IN(SELECT mappingId FROM ccallocation WHERE 1)"; 		
			 	 	$excecute_resultAgencyId3=$this->db->query($sql)->result();
				 	$excecute_resultAgencyId[$i]->PendingForCapture = $excecute_resultAgencyId3[0]->PendingForCapture;
					$excecute_resultAgencyId[$i]->Total = $excecute_resultAgencyId[$i]->InCapture + $excecute_resultAgencyId[$i]->QC + $excecute_resultAgencyId[$i]->Final + $excecute_resultAgencyId[$i]->Rejected + $excecute_resultAgencyId3[0]->PendingForCapture;
				}
				
				 //echo "<pre>";print_r($excecute_resultAgencyId);echo "</pre>"; 
				return $excecute_resultAgencyId;
		}

//INDEXED IMAGE REPORT
public function mergedImageReport()
{
				$sql="select *,coreusers.fullName from ccindexedimage,coreusers 
						where creationDate= curdate()
						and coreusers.userId=ccindexedimage.createdBy";
			$qparent=$this->db->query($sql)->result();
			return $qparent;
		
		}
		
public function getJob($application)
{
				$sql="select jobNo from ccindexedimage where generatedApplicationNo='".$application."'";
		$qparent=$this->db->query($sql)->result();
		return $qparent;		
		}
		
public function generateDashboardDownload($from,$to,$agencyId)
{
		//	IN PROCESS
		$incap="SELECT 
		ccagencymaster.agencyCode,
		ccagencymaster.agencyName,
		count(*) as INCAPTURE
		FROM 
		ccdataentry, 
		ccmaping,
		ccallocation,
		ccagencymaster
		where
		ccdataentry.entryId = ccallocation.entryId AND
		ccallocation.mappingId = ccmaping.mappingId AND
		ccmaping.agencyId = ccagencymaster.agencyId AND
		ccdataentry.currentSection != 6 AND
		ccallocation.processId = 1 AND
		ccdataentry.RejectionCatId!=1
		and jdNo>='".$from."' AND jdNo<='".$to."' 
		and allocatedApplication!=''";
		if($agencyId!=0)
		{
			$incap.=" and ccmaping.agencyId=".$agencyId;
		}
		
		$incap.=" GROUP BY ccmaping.agencyId";
		$rsltincap=$this->db->query($incap)->result();		
		
		//IN QC
		$inQC="SELECT 
		ccagencymaster.agencyCode,
		ccagencymaster.agencyName,
		count(*) as INQC
		FROM 
		ccdataentry, 
		ccmaping,
		ccallocation,
		ccagencymaster
		where
		ccdataentry.entryId = ccallocation.entryId AND
		ccallocation.mappingId = ccmaping.mappingId AND
		ccmaping.agencyId = ccagencymaster.agencyId AND
		ccdataentry.currentSection != 6 AND
		ccallocation.processId = 3 AND
		ccdataentry.RejectionCatId!=1
		and jdNo>='".$from."' AND jdNo<='".$to."' 
		and allocatedApplication!=''";
		if($agencyId!=0)
		{
			$inQC.=" and ccmaping.agencyId=".$agencyId;
		}
		
		$inQC.=" GROUP BY ccmaping.agencyId";
		$rsltinQC=$this->db->query($inQC)->result();
		
		//PENDING D1
		$pendingCap="SELECT 
		ccagencymaster.agencyCode,
		ccagencymaster.agencyName,
		count(*) as PENDINGD1
		FROM 
		ccmaping,
		ccagencymaster
		where
		ccmaping.mappingId not in(SELECT ccallocation.mappingId from ccallocation) AND
		ccmaping.agencyId = ccagencymaster.agencyId 
		and jdNo>='".$from."' AND jdNo<='".$to."' 
		and allocatedApplication!=''";
		if($agencyId!=0)
		{
			$pendingCap.=" and ccmaping.agencyId=".$agencyId;
		}
		$pendingCap.=" GROUP BY ccmaping.agencyId";
		$rsltpendingCap=$this->db->query($pendingCap)->result();
		//PENDING QC
		$pendingQC="SELECT 
		ccagencymaster.agencyCode,
		ccagencymaster.agencyName,
		count(*) as PENDINGQC
		FROM 
		ccdataentry, 
		ccmaping,
		ccallocation,
		ccagencymaster
		where
		ccdataentry.entryId = ccallocation.entryId AND
		ccallocation.mappingId = ccmaping.mappingId AND
		ccmaping.agencyId = ccagencymaster.agencyId AND
	
		ccdataentry.RejectionCatId!=1 and
		ccdataentry.currentSection = 6 AND
		ccallocation.processId = 1
		and jdNo>='".$from."' AND jdNo<='".$to."' 
		and allocatedApplication!=''";
		if($agencyId!=0)
		{
			$pendingQC.=" and ccmaping.agencyId=".$agencyId;
		}
		$pendingQC.=" GROUP BY ccmaping.agencyId";
		$rsltpendingQC=$this->db->query($pendingQC)->result();

		//FINAL UPLOAD
		$finalUpload="SELECT 
		ccagencymaster.agencyCode,
		ccagencymaster.agencyName,
		count(*) as FINALUPLOAD
		FROM 
		ccdataentry, 
		ccmaping,
		ccallocation,
		ccagencymaster
		where
		ccdataentry.entryId = ccallocation.entryId AND
		ccallocation.mappingId = ccmaping.mappingId AND
		ccmaping.agencyId = ccagencymaster.agencyId AND
		
		ccdataentry.currentSection = 6 AND
		ccallocation.processId = 3
		AND
		ccdataentry.RejectionCatId!=1
		and jdNo>='".$from."' AND jdNo<='".$to."' 
		and allocatedApplication!=''";
		if($agencyId!=0)
		{
			$finalUpload.=" and ccmaping.agencyId=".$agencyId;
		}
		$finalUpload.=" GROUP BY ccmaping.agencyId";
		$rsltpfinalUpload=$this->db->query($finalUpload)->result();
		
		//REJECTION REPORT
		$isRejected="SELECT 
					ccagencymaster.agencyCode,
					ccagencymaster.agencyName,
					count(*) as REJECTED
					FROM 
					ccdataentry, 
					ccmaping,
					ccallocation,
					ccagencymaster
					where
					ccdataentry.entryId = ccallocation.entryId AND
					ccallocation.mappingId = ccmaping.mappingId AND
					ccmaping.agencyId = ccagencymaster.agencyId  AND
					ccdataentry.RejectionCatId=1
					and jdNo>='".$from."' AND jdNo<='".$to."'"
					;
		if($agencyId!=0)
		{
			$isRejected.=" and ccmaping.agencyId=".$agencyId;
		}
				$isRejected.=" GROUP BY ccmaping.agencyId";
		$rsltisrejected=$this->db->query($isRejected)->result();
		
		$grandtotal="SELECT ccagencymaster.agencyCode, ccagencymaster.agencyName, count(*) as GRANDTOTAL 
						FROM ccmaping, ccagencymaster 
						where ccmaping.agencyId = ccagencymaster.agencyId
						and jdNo>='".$from."' AND jdNo<='".$to."'";
		if($agencyId!=0)
		{
			$grandtotal.=" and ccmaping.agencyId=".$agencyId;
		} 
					$grandtotal.=" GROUP BY ccmaping.agencyId ";
		$rsltgrandtotal=$this->db->query($grandtotal)->result();
		//$result=array_merge($rsltincap,$rsltinQC,$rsltpendingCap,$rsltpendingQC,$rsltpfinalUpload,$rsltisrejected,$rsltgrandtotal);
	
	
		// 0. LOOP OUT EACH RECORD
		$finalArray = array();
			for($i=0;$i<count($rsltgrandtotal);$i++){
				$finalArray[] = array("agencyCode"=>$rsltgrandtotal[$i]->agencyCode,"agencyId"=>$rsltgrandtotal[$i]->agencyName,
				"grandTotal"=>$rsltgrandtotal[$i]->GRANDTOTAL);
			}
		
	
		// 1. IN CAP LOOP
			for($i=0;$i<count($rsltincap);$i++){
				for($j=0;$j<count($finalArray);$j++){
					
					
					if($finalArray[$j]['agencyCode'] == $rsltincap[$i]->agencyCode){
						$finalArray[$j]['INCAPTURE'] = $rsltincap[$i]->INCAPTURE;	
					}else{
						$finalArray[$j]['INCAPTURE'] = 0;	
						
					}
				}		
			}
		// 2. IN QC LOOP
			for($i=0;$i<count($rsltinQC);$i++){
				for($j=0;$j<count($finalArray);$j++){
					
					
					if($finalArray[$j]['agencyCode'] == $rsltinQC[$i]->agencyCode){
						$finalArray[$j]['INQC'] = $rsltinQC[$i]->INQC;	
					}else{
						$finalArray[$j]['INQC'] = 0;	
						
					}
					
				}		
			}
		
		// 3. PENDING CAP LOOP
			for($i=0;$i<count($rsltpendingCap);$i++){
				for($j=0;$j<count($finalArray);$j++){
							//print_r($rsltpendingCap[$i]->agencyCode);

					
					if($finalArray[$j]['agencyCode'] == $rsltpendingCap[$i]->agencyCode){
						$finalArray[$j]['PENDINGD1'] = $rsltpendingCap[$i]->PENDINGD1;	
					}
					else{
						$finalArray[$j]['PENDINGD1'] = 0;	
						
					}
					
				}		
			}
		// 4. PENDING QC LOOP
			for($i=0;$i<count($rsltpendingQC);$i++){
				for($j=0;$j<count($finalArray);$j++){
					
					
					if($finalArray[$j]['agencyCode'] == $rsltpendingQC[$i]->agencyCode){
						$finalArray[$j]['PENDINGQC'] = $rsltpendingQC[$i]->PENDINGQC;	
					}
					else{
						$finalArray[$j]['PENDINGQC'] = 0;	
						
					}
					
				}		
			}
		// 5. FINAL UPLOAD LOOP
			for($i=0;$i<count($rsltpfinalUpload);$i++){
				for($j=0;$j<count($finalArray);$j++){
					
					
					if($finalArray[$j]['agencyCode'] == $rsltpfinalUpload[$i]->agencyCode){
						$finalArray[$j]['FINALUPLOAD'] = $rsltpfinalUpload[$i]->FINALUPLOAD;	
					}
					else{
						$finalArray[$j]['FINALUPLOAD'] = 0;	
						
					}
				}		
			}
		// 5. REJECTED LOOP
			for($i=0;$i<count($rsltisrejected);$i++){
				for($j=0;$j<count($finalArray);$j++){
					
					
					if($finalArray[$j]['agencyCode'] == $rsltisrejected[$i]->agencyCode){
						$finalArray[$j]['REJECTED'] = $rsltisrejected[$i]->REJECTED;	
					}
					else{
						$finalArray[$j]['REJECTED'] = 0;	
						
					}
				}		
			}
		return $finalArray;
			
		}
		
public function auditsetting($agecyCode,$jdNo,$type,$value)
{
			
			$sql="select * from ccmaping 
				  where ccmaping.mappingId not in (select mappingId from ccallocation)
				  and jdNo=".$jdNo." and agencyId=".$agecyCode." and ccmaping.inAppStatus not in (select statusId from corestatus where status like ('Skiped Audit'))";
				  $result=$this->db->query($sql)->result();
			//print_r($result);	 
			if($type==1)
			{
				for($i=0;$i<count($result);$i+=2)
				{
					 $update="update ccmaping set inAppStatus=(select statusId from corestatus where status like ('Skiped Audit')) where mappingId=".$result[$i]->mappingId;
					 $updaterslt=$this->db->query($update);
				}
				
			}
			else if($type==2)
			{
				for($i=0;$i<$value;$i++)
				{
					 $update="update ccmaping set inAppStatus=(select statusId from corestatus where status like ('Skiped Audit')) where mappingId=".$result[$i]->mappingId;
					  $updaterslt=$this->db->query($update);
				}

			}
		}
		
public function generateWIPReport($applicationFrom,$applicationTo)
{
			 $sqlcap="select ccallocation.*,coreusers.fullName as CapUser,coreprocessmaster.processName,
				  	ccmaping.applicationNo,ccdataentry.entryDate,ccdataentry.endDate,ccdataentry.yourFirstName 
				  	from ccdataentry,ccallocation,ccmaping,coreusers,coreprocessmaster
					where ccallocation.entryId=ccdataentry.entryId 
					and ccmaping.mappingId=ccallocation.mappingId
					and coreprocessmaster.processId=ccallocation.processId
					and ccallocation.userId=coreusers.userId
					and ccmaping.applicationNo BETWEEN ".$applicationFrom." AND ".$applicationTo."
					and ccallocation.processId=1";
			$qparentcap=$this->db->query($sqlcap)->result();
			$sqlQc="select ccallocation.*,coreusers.fullName as QCUser,coreprocessmaster.processName,
				  	ccmaping.applicationNo,ccdataentry.entryDate,ccdataentry.endDate,ccdataentry.yourFirstName 
				  	from ccdataentry,ccallocation,ccmaping,coreusers,coreprocessmaster
					where ccallocation.entryId=ccdataentry.entryId 
					and ccmaping.mappingId=ccallocation.mappingId
					and coreprocessmaster.processId=ccallocation.processId
					and ccallocation.userId=coreusers.userId
					and ccmaping.applicationNo BETWEEN ".$applicationFrom." AND ".$applicationTo."
					and ccallocation.processId=3";
			$qparentQc=$this->db->query($sqlQc)->result();
			
			for($i=0;$i<count($qparentcap);$i++)
			{
				
			}
		//	print_r($qparentcap);
			/*for($i=0;$i<count($qparent);$i++)
			{
				if($qparent[$i]->processName=='Data Entry')
				{
					$qparent[$i]->CAPName=$qparent[$i]->fullName;
					
				}
			}	
			return $qparent; */
		}
		
public function generateCapError($applicationFrom,$applicationTo)
{
			$tmpArray = array();
			 $sql="select 
			 		ccallocation.*,
					coreusers.fullName,
					coreprocessmaster.processName,
				  	ccmaping.applicationNo,
					ccdataentry.*
					from 
					ccdataentry,
					ccallocation,
					ccmaping,
					coreusers,
					coreprocessmaster
					where  ccallocation.entryId=ccdataentry.entryId 
					and ccmaping.mappingId=ccallocation.mappingId
					and coreprocessmaster.processId=ccallocation.processId
					and ccallocation.userId=coreusers.userId
					and ccallocation.processId LIKE (SELECT processId from coreprocessmaster WHERE processName like 'Data Entry')
					and ccmaping.applicationNo BETWEEN ".$applicationFrom." AND ".$applicationTo."";
					$qparent=$this->db->query($sql)->result();
			for($i=0;$i<count($qparent);$i++)
					{
					$sqlQC="select 
								ccallocation.*,
								coreusers.fullName,
								coreprocessmaster.processName,
								ccmaping.applicationNo,
								ccdataentry.*
								from 
								ccdataentry,
								ccallocation,
								ccmaping,
								coreusers,
								coreprocessmaster
								where  ccallocation.entryId=ccdataentry.entryId 
								and ccmaping.mappingId=ccallocation.mappingId
								and coreprocessmaster.processId =ccallocation.processId
								and ccallocation.userId=coreusers.userId
								and ccallocation.processId LIKE (SELECT processId from coreprocessmaster WHERE processName like 'QC')
								and ccmaping.applicationNo BETWEEN ".$applicationFrom." AND ".$applicationTo."
								and ccmaping.mappingId=".$qparent[$i]->mappingId;
								$qparentQC=$this->db->query($sqlQC)->result();
						$array = json_decode(json_encode($qparent[$i]), True);
						$array1 = json_decode(json_encode($qparentQC[$i]), True);
 

								if(count($qparentQC)>0)
								{
									//print_r($qparent[$i]);
									$result[$i] = array_diff_assoc($array1,$array);
									$tmpArray = $result[$i];
									$result[$i]["QC"] = $tmpArray;
									$result[$i]["DE"] = $tmpArray; 
							
							
							

//print_r(array_values(array_keys($result[$i])));	
									for($j=0;$j<count(array_keys($tmpArray));$j++)
									{
										 
										$key=array_keys($tmpArray);
							 			
										//$result[$i][$val[$j]."_de"] = $qparent[$i]->$val[$j];
										$result[$i]["DE"][$key[$j]] = $qparent[$i]->$key[$j] ; 
										//$qparent[$i]->$val[$j];
									}
							
									echo "<pre>";
									print_r($result[$i]);
									echo "</pre>";
		
								}
						
						
				}	
						
			$resultarray = array("ApplicationNo"=>$tmpArray);			
						print_r($resultarray);
			//return $qparent; 
		}


public function imageName($jdNo,$agencyId)
{
			$sql="select * from ccindexedimage 
				  where jobNo=".$jdNo." and agencyId=".$agencyId." order by indexedImageId desc limit 1";
			$result=$this->db->query($sql)->result();
			return $result;			  
			
}


public function updateSnippet($fieldId, $page, $location, $appId,$imgPosition, $imageType)
{

			$sql="select snippetId from coresnippet where fieldId=".$fieldId." and imageTypeId=".$imageType;
			 
			$result=$this->db->query($sql);
			$rows = $result->num_rows();
			
			
			$sql = "insert into coresnippet (fieldId, pageNo, location, appId, imgPosition, imageTypeId) values (".$fieldId.",".$page.",'".$location."',".$appId.",'".$imgPosition."',".$imageType.")";	
			if($rows > 0){
				$sql = "update coresnippet set pageNo=".$page.", location='".$location."', imgPosition='".$imgPosition."',imageTypeId=".$imageType." where fieldId=".$fieldId;	
			}
			$qparent = $this->db->query($sql);
 			return true;
}
public function getSnippet($fieldId,$imageType=0)
{

//$json = "{'x':'268','y':'550','h':'80','w':'300'}";
 //$json = str_replace("'",'"',$json);
// echo $json;
 //var_dump(json_decode($json, true)); die;

			$sql="select * from coresnippet where fieldId=".$fieldId;
			
			if($imageType != 0){
				$sql.=" AND imageTypeId=".$imageType;	
			}
			
			$result=$this->db->query($sql)->result();
			if(count($result)>0){
			$result[0]->location = json_decode($result[0]->location);
			$result[0]->imgPosition = json_decode($result[0]->imgPosition);			
			}
 			return $result;
}
public function getunmapped($agencyId,$jobNo)
{
	$getAgency="select agencyCode from ccagencymaster where agencyId=".$agencyId;
			$rslt=$this->db->query($getAgency)->result();
			$job="";
			$job=IMAGE_INDEXING_CC_JOB_ROOT."".$jobNo;
			$arrFolder = scandir($job);
			$arrFolder =array_values($arrFolder);
	$appNo="select applicationNo from ccmaping where jobNo=".$jobNo." and agencyId=".$agencyId." 
					and allocatedApplication=''";
					
	$getrslt=$this->db->query($appNo)->result();
	
	$batch="select batchId from ccmaping where jobNo=".$jobNo." and agencyId=".$agencyId." 
					and allocatedApplication='' limit 1";
					
	$getbatch=$this->db->query($batch)->result();
			//$multiTIFF = new Imagick();
			if (!file_exists($job."".SEPARATOR.$rslt[0]->agencyCode.SEPARATOR."mergedImages".SEPARATOR)) 
			{
   		 		mkdir($job."".SEPARATOR.$rslt[0]->agencyCode.SEPARATOR."mergedImages".SEPARATOR,0777, true);
			}

 			for($f=0;$f<count($arrFolder);$f++)
			{
				if($arrFolder[$f]==$rslt[0]->agencyCode)
				{
					$arrmerged = array_values(array_diff(scandir($job."//".$rslt[0]->agencyCode),array('..', '.')));
				//	$arrFiles=scandir($job."\\".$rslt[0]->agencyCode."\\mergedImages");
					
				}
			}
			$arrSortedFiles = array();
			for($i=0;$i<count($getrslt);$i++)
			{
				if(@!is_dir($job."".SEPARATOR."".$rslt[0]->agencyCode."".SEPARATOR."".$arrmerged[$i]))
					 {
					
				$multiTIFF = new Imagick($job."".SEPARATOR."".$rslt[0]->agencyCode."".SEPARATOR."".$arrmerged[$i]);
			$count=$multiTIFF->getNumberImages();	
				if($count>1)
				{
							//MARK AS MERGED AND MOVE TO PROCESSING FOLDER 
rename($job."".SEPARATOR."".$rslt[0]->agencyCode."".SEPARATOR.$arrmerged[$i],$job."".SEPARATOR."".$rslt[0]->agencyCode."".SEPARATOR."mergedImages".SEPARATOR.$arrmerged[$i]);
				}}	
				
			}
			
			for($f=0;$f<count($arrFolder);$f++)
			{
				if($arrFolder[$f]==$rslt[0]->agencyCode)
				{
					$arrFiles = array_values(array_diff(scandir($job."//".$rslt[0]->agencyCode."//mergedImages"), array('..', '.')));
				//	$arrFiles=scandir($job."\\".$rslt[0]->agencyCode."\\mergedImages");
					
				}
			}
			for($i=0;$i<count($getrslt);$i++)
			{
				if(!empty($arrFiles[$i]))
				{
					if(!is_dir($job."//".$rslt[0]->agencyCode."//mergedImages".SEPARATOR.$arrFiles[$i]))
					 {
					
							$arrSortedFiles[] =  array("img"=>$arrFiles[$i]);
					}	
				
				}
			}
			
			
			$arrSortedFiles = array();
			for($i=0;$i<count($arrFiles);$i++){
				$arrSortedFiles[] = array("img"=>$arrFiles[$i]);	
			}
			
	 	return $files=array("batch"=>$getbatch[0]->batchId,"img"=>$arrSortedFiles,"data"=>$getrslt);	

			
//	return $getrslt;
}
public function getprevious($agencyId,$userId)
{
	 $sql="select ccdataentry.* from ccdataentry,ccmaping,ccallocation 
			where ccallocation.entryId=ccdataentry.entryId 
			and ccallocation.mappingId=ccmaping.mappingId 
			and ccmaping.agencyId=".$agencyId." and ccdataentry.userId=".$userId."
			order by ccdataentry.entryId desc limit 1 ";
	$result=$this->db->query($sql)->result();
	return $result;
}
public function searchApp($appref)
{
			
			$sql = "select ccdataentry.*,ccagencymaster.agencyCode,ccmaping.jobNo,ccmaping.allocatedApplication
			from ccdataentry,ccallocation,ccmaping,ccagencymaster
			 where 
			 ccdataentry.entryId=ccallocation.entryId
			 and 
			 ccmaping.mappingId=ccallocation.mappingId
			 and
			 ccmaping.agencyId=ccagencymaster.agencyId
			 and
			 AppSerialNo='".$appref."'";	
			$qparent = $this->db->query($sql)->result();
			return $qparent;
}
	public function generateOutput($appref){

	$arr = explode(",",$appref);

	$sql = "select ccdataentry.*,ccmaping.creationDate
,						(SELECT cccategoryvalue.categoryCode from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.nonIciciOTHCCCatId LIMIT 1) as nonIciciOTHCCCatId ,
					(SELECT cccategoryvalue.categoryCode from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.iciciRelTypeCatId LIMIT 1) as iciciRelTypeCatId,
					(SELECT cccategoryvalue.categoryCode from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.autoDebitOptCatId LIMIT 1) as autoDebitOptCatId,
					(SELECT cccategoryvalue.categoryCode from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.appSignatureId LIMIT 1) as appSignatureId,
					(SELECT cccategoryvalue.categoryCode from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.docAttachedCatId LIMIT 1) as docAttachedCatId,
					(SELECT cccategoryvalue.categoryCode from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.yourTitleCatId LIMIT 1) as yourTitleCatId,
					(SELECT cccategoryvalue.categoryCode from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.YourGenderCatId LIMIT 1) as YourGenderCatId,
					(SELECT cccategoryvalue.categoryCode from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.maritialStatus LIMIT 1) as maritialStatus,
					(SELECT cccitymaster.cityAbrevation from cccitymaster where cccitymaster.cityName =ccdataentry.currentCityId
					LIMIT 1) as currentCityId,
					(SELECT cccitymaster.cityAbrevation from cccitymaster where cccitymaster.cityName =ccdataentry.permanentCityId LIMIT 1) as permanentCityId,
					(SELECT cccategoryvalue.CategoryValue from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.qualification LIMIT 1) as qualification,
					(SELECT cccategoryvalue.CategoryValue from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.typeOfResidenCatId LIMIT 1) as typeOfResidenCatId,
					(SELECT cccategoryvalue.categoryCode from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.residenceCatId LIMIT 1) as residenceCatId,
					(SELECT cccategoryvalue.categoryCode from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.vehicleDescriptionId LIMIT 1) as vehicleDescriptionId,
					(SELECT cccategoryvalue.categoryCode from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.natureOwnCatId LIMIT 1) as natureOwnCatId,
					(SELECT cccategoryvalue.categoryCode from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.mailIdCatId LIMIT 1) as mailIdCatId,
					(SELECT cccategoryvalue.categoryCode from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.iciciRelTypeCatId LIMIT 1) as iciciRelTypeCatId,
					(SELECT cccategoryvalue.categoryValue from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.spouseOccupationCatId LIMIT 1) as spouseOccupationCatId,
					(SELECT cccategoryvalue.categoryValue from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.yourWorkOccupationCatId LIMIT 1) as yourWorkOccupationCatId,
					(SELECT cccategoryvalue.categoryValue from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.YourWorkIndustryCatId LIMIT 1) as YourWorkIndustryCatId,
					(SELECT cccitymaster.cityAbrevation from cccitymaster where cccitymaster.cityName =ccdataentry.yourWorkCityCatId LIMIT 1) as yourWorkCityCatId,
					(SELECT cccategoryvalue.categoryValue from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.YourWorkIndustryCatId LIMIT 1) as YourWorkIndustryCatId,
					(SELECT cccategoryvalue.categoryValue from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.YourWorkCompTypeCatId LIMIT 1) as YourWorkCompTypeCatId,
					(SELECT cccategoryvalue.categoryValue from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.YourWorkProfessionCatId LIMIT 1) as YourWorkProfessionCatId,
					(SELECT cccategoryvalue.categoryValue from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.RCUCategoryId LIMIT 1) as RCUCategoryId,
					(SELECT cccategoryvalue.categoryValue from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.yourWorkCrPositionCatId LIMIT 1) as yourWorkCrPositionCatId,
					(SELECT cccategoryvalue.categoryValue from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.suppApp1CardRequired LIMIT 1) as suppApp1CardRequired,
					(SELECT cccategoryvalue.categoryValue from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.suppApp1Relation LIMIT 1) as suppApp1Relation,
					(SELECT cccategoryvalue.categoryValue from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.suppApp1PhotoIdCatId LIMIT 1) as suppApp1PhotoIdCatId,
					(SELECT cccitymaster.cityAbrevation from cccitymaster where cccitymaster.cityName =ccdataentry.referenceCityCatId LIMIT 1) as referenceCityCatId,
					(SELECT cccitymaster.cityAbrevation from cccitymaster where cccitymaster.cityName =ccdataentry.reference2CityCatId LIMIT 1) as reference2CityCatId,
					(SELECT cccategoryvalue.categoryValue from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.subStatementEmailCatId LIMIT 1) as subStatementEmailCatId,
					(SELECT cccategoryvalue.categoryValue from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.subMobAlertCatId LIMIT 1) as subMobAlertCatId,
					(SELECT cccategoryvalue.categoryValue from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.suppApp2CardReqCatId LIMIT 1) as suppApp2CardReqCatId,
					(SELECT cccategoryvalue.categoryValue from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.subMobAlertCatId LIMIT 1) as subMobAlertCatId,
					(SELECT cccategoryvalue.categoryValue from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.typeOfResiCatId LIMIT 1) as typeOfResiCatId,
(SELECT ccsurrogatecodemaster.surrogateCode from ccsurrogatecodemaster where ccsurrogatecodemaster.surrogateId=ccdataentry.surrogateId LIMIT 1) as surrogateCode,
(SELECT cctiercodemaster.coCode from cctiercodemaster where cctiercodemaster.id=ccdataentry.companyId LIMIT 1) as companyCode,
(SELECT cclogomaster.logoCode from cclogomaster where cclogomaster.logoId=ccdataentry.logoCodeId LIMIT 1) as logoCode,
(SELECT ccvehiclemaster.imageCodeStartRange from ccvehiclemaster where ccvehiclemaster.vehicleId=ccdataentry.vehicleNo LIMIT 1) as vehicleNo,
(SELECT cccategoryvalue.categoryValue from cccategoryvalue where cccategoryvalue.categoryValuesId =ccdataentry.suppApp2RelCatId LIMIT 1) as suppApp2RelCatId,
(SELECT ccagencymaster.agencyName from ccagencymaster where ccagencymaster.agencyId =ccdataentry.agencyid LIMIT 1) as locationName,
(SELECT ccagencymaster.creditHub from ccagencymaster where ccagencymaster.agencyId =ccdataentry.agencyid LIMIT 1) as creditHub,
(SELECT cclogomaster.logoTempl from cclogomaster where cclogomaster.logoId=ccdataentry.logoCodeId LIMIT 1) as applicationTemplate


from  
ccdataentry, ccallocation,ccmaping
where 
ccdataentry.entryId = ccallocation.entryId AND
ccallocation.mappingId=ccmaping.mappingId and
ccallocation.processId = 3 
";

	$whr = "";
	for($i=0;$i<count($arr);$i++){
		if($i != 0){
			$whr.=" OR ";	
		}
		else{
			$whr.=" AND ( ";
		}
		$whr .= "  ApplRefNo like '".$arr[$i]."'";	
	}

	$whr .= ")";

		$sql.=$whr;
		//echo $sql;
		$arrresult = $this->db->query($sql)->result();
		if(!empty($arrresult)){
				$output = "";
				$output .=str_pad("0000000000",10);
				$output .=str_pad(date('Ymd'),8);
				$output .=str_pad(count($arr),5,0,STR_PAD_LEFT);
				$output .=str_pad((count($arr)*7000),10,0,STR_PAD_LEFT);
				$output .=str_pad("0000000000",10)."\n";
				for($i=0;$i<count($arrresult);$i++){
				$result = $arrresult[$i];
				/*echo "<pre>";
				print_r($result);
				echo "</pre>";*/
			$output .= str_pad($result->ApplRefNo,13); 					    // 1. ApplRefNo : 13 : 1,13
			$output .= str_pad(date('dmy',strtotime($arrresult[0]->creationDate)).$result->batchNo,10);// 2. batch no : 10 : 14,23
			$output .= str_pad($result->AppSerialNo,20);			   	      // 3. app serial no : 20 : 24,43
			$output .= str_pad(date('Ymd',strtotime($arrresult[0]->courieStampDate)),8);  // 4. current date : 8 : 44,51
			$output .= str_pad($result->dmaId,7);				    	     // 5. dma id : 7 : 52,58
			$output .= str_pad($result->branchCode,8);			  		    // 6. branch code : 8 : 59,66
			 $output .= str_pad($result->dmaCity,30);			   		      // 7. dma city : 30 : 67,96
			$output .= str_pad($result->dmeId,6);			     		     // 8. dme id : 6 : 97,102
			$output .= str_pad($result->promoId,3);			  			   // 9. promo code : 3 : 103,105
			$output .= str_pad($result->surrogateCode,2);	     			   // 10. surrogate code : 2 : 106,107
			$output .= str_pad($result->pricingId,2);	      			  	 // 11. pricing code : 2 : 108,109
			$output .= str_pad($result->surrogateCode.$result->pricingId,4);   // 12. channel code : 4 : 110,113
			$output .= str_pad(str_replace('-','',$result->courieStampDate),8);	// 13. courier date : 8 : 114,121
			if($result->companyCode==0)
			{
				$output .= str_pad("100",3);
			}
			else
			{
				$output .= str_pad($result->companyCode,3);	           		  	 // 14. company code : 3 : 122,124
			}
			$output .= str_pad($result->applicationTemplate,2);									   // 18. Application_Template : 2 : 125,126
			$output .= str_pad($result->logoCode,3);	      			    // 19. logo code : 3 : 127,129
			$output .= str_pad("Y",1);			   						    // 20. customer_record_no_yn : 1 : 130,130
			$output .= str_pad("",10);									    //21. customer_record_no : 10 :131,140			
			$output .= str_pad($result->iciciSalary_SavingAcNo,20);	      			 // 22. salary/savingA/c no : 20 : 141,160
			$output .= str_pad("N",1);	      			 					// 23. RCU screen sample : 1 : 161,161
			$output .= str_pad("",19);									    //24 . relationship_no :19 :161,180
			$output .= str_pad("Y",1);									    //25 . Create_New_Account_Card_No :1 :181,181
			$output .= str_pad("",16);									    //26. Existing_Old_Account_Card_No :16 :182,197
			$output .= str_pad("n",1);									    //27. same_cust_base_no :1 :198,198
			$output .= str_pad("EN",2);									   //28. Preferred_Language :2 : 199,200
			if($result->iciciRelTypeCatId=="BANK")
			$result->iciciRelTypeCatId="A";
			else if($result->iciciRelTypeCatId=="CREDIT-CARD")
			$result->iciciRelTypeCatId="R";
			else if($result->iciciRelTypeCatId=="POWER-PAY")
			$result->iciciRelTypeCatId="W";
			else
			$result->iciciRelTypeCatId=$result->iciciRelTypeCatId[0];
			$output .= str_pad($result->iciciRelTypeCatId[0],1);	   		     // 29.relationship type : 1 : 201,201
			$output .= str_pad($result->nonIciciOTHCCCatId[0],1);	   		    //30. Other Bank Credit/Card  : 1 : 202,202
			if($result->nonIciciOTHCCCatId[0]=="Y")
			{
				if($result->iciciCreditCardNo=="0")
				{
		  		$output .= str_pad("",16);
				}
				else
				{
				$output .= str_pad($result->iciciCreditCardNo,16);	   		     //31. Credit Card no : 16 : 203,218
				}
			}
			else
			{
				$output .= str_pad("",16);										 //31. Credit Card no : 16 : 203,218
			}
			$output .= str_pad("N",1);							   		    //32. Balance Transfer Facility : 1 : 219,219
			$output .= str_pad($result->suppApp1NameOnCard,30);	   		   			 //33. Name on card : 30 : 220,249
			$output .= str_pad("",20);	   		   	    //34 . Other credit card no : 20 : 250,269
			$output .= str_pad("",10);				    		   	 //35 . credit card expiry : 10 : 270,279
			$output .= str_pad("0",6," ",STR_PAD_LEFT);										 //36 . Balance Transfer Amount : 6 :280 :285
			$output .= str_pad("",4);									    //37. Balance Transfer Bank : 4 : 286 :289
			if($result->autoDebitOptCatId=="MAD")
			$result->autoDebitOptCatId="S";
			else if($result->autoDebitOptCatId=="TAD")
			$result->autoDebitOptCatId="D";
			else if($result->autoDebitOptCatId=="None")
			$result->autoDebitOptCatId="";
			$output .= str_pad($result->autoDebitOptCatId,1);	   		     //38 . Auto debit option: 1 : 290,290
			$output .= str_pad("0",6," ",STR_PAD_LEFT);	 			//39 . Auto debit account: 1 : 291,296
			$output .= str_pad($result->crossSellNo,20);	   		          //40 . crossSell No: 20 : 297,316
			$output .= str_pad(strtolower($result->appSignatureId[0]),1);	   		        //41 .application Signature Id :1: 317,317
			if($result->docAttachedCatId=="INCOME TAX RETURNS")
			$result->docAttachedCatId="ITR";
			else if($result->docAttachedCatId=="SALARY CERTIFICATE")
			$result->docAttachedCatId="SAL";
			else if($result->docAttachedCatId=="FORM 16")
			$result->docAttachedCatId="F16";
			else if($result->docAttachedCatId=="INCOME SURROGATE")
			$result->docAttachedCatId="SRG";
			else if($result->docAttachedCatId=="PAYSLIP")
			$result->docAttachedCatId="PAY";
			else if($result->docAttachedCatId=="OTHERS")
			$result->docAttachedCatId="OTH";
			$output .= str_pad($result->docAttachedCatId,3);	   		      //42 .document attached :3: 318,320
			$output .= str_pad("A",1);                   	   		        //43 .curretn city :1: 321,321
			$output .= str_pad("N",1);						   		        //44 .photo Flag :1: 322,322
			$output .= str_pad("",4);	   		       						 //45 .existing cards :4: 323,326
			$output .= str_pad("",3);	   		       						 //46 .pilot :3 : 327,329
			$output .= str_pad("",3);	   		       						 //47 .pilot 2 :3: 330,332
			$output .= str_pad("",3);		   		       						 //48 .pilot 3 :3: 333,335
			$output .= str_pad($result->yourWork4thLineEmbossing,30);	   	 //49 .4th line embossing :30: 336,365
			$output .= str_pad($result->netBankingId,11);				   	 //50 .net banking id :11: 366,376
			if($result->iciciCustomerIdNo=="0")
			{
				$output .= str_pad("",10);								    //51 .customer no :10: 377,386
			}
			else
			{
				$output .= str_pad($result->iciciCustomerIdNo,10);			    //51 .customer no :10: 377,386
			}
			$output .= str_pad("",3);						    			 //52 .officer id :3: 387,389
			$output .= str_pad("",10);						    		     //53 .emp code :10: 390,399
			$output .= str_pad($result->yourTitleCatId,10);				    //54 .title :10: 400,409
			$output .= str_pad($result->yourTitleExt,10);				      //55 .title ext :10: 410,419
			$output .= str_pad($result->yourFirstName,30);				     //56 . first name :30: 420,449
			$output .= str_pad($result->yourMiddleName,30);				    //57 . middle name :30: 450,479
			$output .= str_pad($result->yourLastName,30);				      //58 . last name :30: 480,509
			$output .= str_pad($result->emboName,21);				     	  //59 . embo name :21: 510,530
			$output .= str_pad($result->mailingName,15);				       //60 . mailing name :15: 531,545
			$output .= str_pad(str_replace('-','',$result->dateOfBirth),8);				        //61 . date of birth :8: 546,553
			$output .= str_pad($result->YourGenderCatId[0],1);				    //62 . gender :1: 554,554
			$output .= str_pad($result->motherName,20);				  	  	//63 . mother name :20: 555,574
			$output .= str_pad($result->maritialStatus[0],1);				  	 //64 . mother name :20: 575,575
			$output .= str_pad("0",1);				  						 //65 . no of children default0 :1: 576,576
			$output .= str_pad("",1);				  						  //66 . no of children default blank :1: 577,577
			$output .= str_pad("0",1);				  						 //67 . no of dependencies default0 :1: 578,578
			$output .= str_pad("",1);				  						  //68 . no of dependencies default blank :1: 579,579
			$output .= str_pad($result->currentAddress1,45);				   //69.current address 1 :45: 580,624
			$output .= str_pad($result->currentAddress2,45);				   //70.current address 2 :45: 625,669
			$output .= str_pad($result->currentAddress3,45);				   //71.current address 3 :45: 670,714
			$output .= str_pad($result->currentAddress4,45);				   //72.current address 4 :45: 715,759
			$output .= str_pad($result->currentCityId,3);				      //73.current city :3: 760,762
			$output .= str_pad($result->currentPincode,10," ",STR_PAD_LEFT);				    //74.current Pincode :10: 763,772
			$output .= str_pad($result->currentStateId,3);				     //75. current State : 3: 773,775
			$output .= str_pad("356",10);				    				  //76. current country : 10: 776,785
			$output .= str_pad($result->currentLandMark,45);				    //75. current LandMark :45 : 786,830
			if($result->currentResiTenure=="0")
			{
				$output .= str_pad("",2);				   //76.current resi tenure yr :2 : 831,832
			}
			else
			{
			$output .= str_pad($result->currentResiTenure,2);				   //76.current resi tenure yr :2 : 831,832
			}
			if($result->currentResiTenureExt=="0")
			{
				$output .= str_pad("",3);				//77. currentresi tenure month :2 : 833,834
			}
			else
			{
			$output .= str_pad($result->currentResiTenureExt,3);				//77. currentresi tenure month :2 : 833,834
			}
			$output .= str_pad($result->currentStdCode,10);				 	//78. current StdCode :10: 836,845
			$output .= str_pad($result->currentPhone1,9," ",STR_PAD_LEFT);				 	 //79. current phone 1 :9: 846,854
			$output .= str_pad("",10);				 						//80. current phone 2 :10: 855,864
			$output .= str_pad($result->currentMobile,10);				 	//81. current mobile :10: 865,874
			if($result->currentFaxNo=="0")
			{
				$output .= str_pad("",10);				 	//82. current fax :10: 875,884
			}
			else
			{
			$output .= str_pad($result->currentFaxNo,10);				 	//82. current fax :10: 875,884
			}
			$output .= str_pad($result->currentEmailId,40);				 	//83.current email id :40: 885,924
			$output .= str_pad($result->permanentAddress1,45);				   //84.permanent address 1 :45: 925,969
			$output .= str_pad($result->permanentAddress2,45);				   //85.permanent address 2 :45: 970,1014
			$output .= str_pad($result->permanentAddress3,45);				   //86.permanent address 3 :45: 1015,1059
			$output .= str_pad($result->permanentAddress4,45);				   //87.permanent address 4 :45: 1060,1104
			$output .= str_pad($result->permanentCityId,30);				      //88.permanent city :30: 1105,1134
			$output .= str_pad($result->permanentPincode,10," ",STR_PAD_LEFT);				    //89.permanent Pincode :10: 1135,1144
			$output .= str_pad($result->permanentStateId,3);				     //90. permanent State : 3: 1145,1147
			$output .= str_pad("356",10);				    				  	//91. permanent country : 10: 1148,1157
			$output .= str_pad($result->permanentLandmark,45);				    //92. permanent LandMark :45 :1158,1202
			$output .= str_pad($result->permanentStdCode,10);				 	//95. permanent StdCode :10: 1203,1212
			$output .= str_pad($result->permanentPhone1,9," ",STR_PAD_LEFT);				 	 //96. permanent phone 1 :9: 1213,1221
			$output .= str_pad("",10);				 							//97. permanent phone 2 :10: 1222,1231
			$output .= str_pad($result->permanentMobile,10);				 	//98. permanent mobile :10: 1232,1241
			if($result->permanentFaxNo=="0")
			{
			$output .= str_pad("",10);										 	//99. permanent fax :10: 1242,1251
			}
			else
			{
				$output .= str_pad($result->permanentFaxNo,10);				 	//99. permanent fax :10: 1242,1251
			
			}
			$output .= str_pad($result->permanentEmailId,40);				 	//100. permanent email id :40: 1252,1291
			$output .= str_pad("O",1);				 						 //101. religion :1: 1292,1293
			$output .= str_pad("OT",2);				 						 //102. application category default :1: 1293,1293
		//	$output .= str_pad("",1);				 						 //103. application category blank :1: 1294,1294
			if($result->qualification=="GRADUATE/DIPLOMA")
			{
			$result->qualification="GR";
			}else if($result->qualification=="MATRICULATE")
			{$result->qualification="MA";}
			else if($result->qualification=="POST-GRADUATE")
			{$result->qualification="PG";}
			else if($result->qualification=="PROFESSIONAL")
			{$result->qualification="PR";}
			else if($result->qualification=="UNDER GRADUATION")
			{$result->qualification="UG";}
			$output .= str_pad($result->qualification,2);				 	//104. qualification :2: 1295,1296
			$output .= str_pad("",15);				 						 //105. highest qualification :15: 1297,1311
			$output .= str_pad("",40);				 						 //106. institue name :40: 1312,1351
			$output .= str_pad($result->passportNo,25);				 	  //107.passportNo :25: 1352,1376
			$output .= str_pad("",8);				 						 //108.passport exp date :8: 1377,1384
			$output .= str_pad($result->drivingLicenseNo,25);				 //109.driving license :25: 1385,1409
			$output .= str_pad("",10);				 						 //110.driving license exp date :8: 1410,1419
			$output .= str_pad($result->fatherName,15);				 	//111.father name :15: 1420,1434
			$output .= str_pad($result->panNo,25);				 			//112.panNo :25: 1435,1459
			/*if($result->typeOfResidenCatId=="WITH RELATIVE/FRIEND")
			{$result->typeOfResidenCatId="L";}
			else if($result->typeOfResidenCatId=="OTHERS")
			{$result->typeOfResidenCatId="X";}
			else
			{$result->typeOfResidenCatId=$result->typeOfResidenCatId[0];}*/
			$output .= str_pad($result->typeOfResidenCatId,1);				 //113.type Of Residence :1: 1460,1460
			if($result->residenceCatId=="RESIDENT INDIAN")
			{$result->residenceCatId="I";}
			else
			{$result->residenceCatId=$result->residenceCatId[0];}
			$output .= str_pad($result->residenceCatId,1);				 //114. Resident category :1: 1461,1461
			$output .= str_pad($result->typeOfResiCatId,1);				 //115.type of resident :1: 1462,1462
			$output .= str_pad($result->vehicleDescriptionId[0],1);			 //116.nature of vehicle Ownership :1: 1463,1463
			$output .= str_pad("",20);										  //117. vehicle description :20: 1464,1483
			$output .= str_pad("O",1);										 //118.nature of vehicle :20: 1484,1484
			$output .= str_pad("",40);					 					 //119.financer name :40: 1485,1524
			$output .= str_pad($result->nonIciciBranchNameCatId,20);		 //120.bank name :20: 1525,1544
			$output .= str_pad("",20);					 					 //121.voters id :20: 1545,1564
			if($result->mailIdCatId=="OFFICE")
			{$result->mailIdCatId="W";}
			else if($result->mailIdCatId=="RESIDENCE")
			{$result->mailIdCatId="H";}
			else
			{$result->mailIdCatId=$result->mailIdCatId[0];}
			$output .= str_pad($result->mailIdCatId,30);					 //122.mailing address :30: 1565,1594
			$output .= str_pad("",20);					 					 //123.bank branch name default :20: 1595,1614
			$output .= str_pad("",30);					 					 //124.bank branch city default :30: 1615,1644
			
			$output .= str_pad("OT",2);									  //125.relationship type :2: 1645,1646
			$output .= str_pad("0",2);				 						 //126. account held default :1: 1647,1648
			//$output .= str_pad("",1);				 						 //127. account held blank :1: 1648,1648
			$output .= str_pad($result->iciciSalary_SavingAcNo,30);			 //128.iciciSalary_SavingAcNo :30: 1649,1678
			$output .= str_pad($result->spouseName,30);						 //129.spouse Name :30: 1679,1708
			if($result->spouseDateofBirth=="0000-00-00")
			{			
				$output .= str_pad("",10);										//130.spouse date of birth :10: 1709,1718
			}
			else
			{
			$output .= str_pad(str_replace('-','',$result->spouseDateofBirth),10," ",STR_PAD_LEFT);	//130.spouse date of birth :10: 1709,1718
			}
			$output .= str_pad("OT",2);			 							//131.spouse occupation :2: 1719,1720
			$output .= str_pad($result->spouseOccupationExt,10);			 //132.spouse occupation other :10: 1721,1730
			$output .= str_pad("GR",2);									     //133.spouse qualification default :2: 1731,1732
			$output .= str_pad($result->spouseCompany,40);				     //134.spouse company :40: 1733,1772
			$output .= str_pad("",10);									     //135.spouse phone :10: 1773,1782
			$output .= str_pad("",10);									     //136.spouse net monthly income balnk :10: 1783,1792
			$output .= str_pad("",10);								         //137.spouse anual income :10: 1793,1802
			$output .= str_pad("",10);									     //138. hp pump no blank :10: 1803,1812
			$output .= str_pad("",20);									     //139.lan no balnk :20: 1803,1832
			if($result->iciciLoanAcNo=="0")
			{
			$output .= str_pad("",30);				   			     //140.Loan A/cNo :30: 1833,1862

			}
			else
			{
			$output .= str_pad($result->iciciLoanAcNo,30);	   			     //140.Loan A/cNo :30: 1833,1862
			}
			if($result->vehicleNo=='0')
			{
				$output .= str_pad("",30);
			}
			else
			{
				$output .= str_pad($result->vehicleNo,30);				 		 //141.demat A/cNo balnk :30: 1863,1892
			}
			//$output .= str_pad("",30);									     
			$output .= str_pad($result->yourWorkOccupationCatId,2);	   		 //142.work occupation :2: 1893,1894
			$output .= str_pad("",8);										 //143.company tire blank :8: 1895,1902
			$output .= str_pad($result->YourWorkCompNameCatId,45);	   		 //144.company name :45: 1903,1947
			$output .= str_pad($result->YourWorkIndustryCatId,30);	   		 //145.type of industry :30: 1948,1977
			$output .= str_pad($result->yourWorkAddress1,45);	  	 		 //146.work address 1 :45: 1978,2022
			$output .= str_pad($result->yourWorkAddress2,45);	  	 		 //147.work address 2 :45: 2023,2067
			$output .= str_pad($result->yourWorkAddress3,45);	  	 		 //148.work address 3 :45: 2068,2122
			$output .= str_pad($result->yourWorkAddress4,45);	  	 	     //149.work address 4 :45: 2123,2157
			$output .= str_pad($result->yourWorkCityCatId,3);	  	 	//150.work city :3: 2158,2160
			$output .= str_pad($result->yourWorkPincode,10," ",STR_PAD_LEFT);	  	 	//151.work Pincode :10: 2161,2170
			$output .= str_pad($result->yourWorkStateCatId,3);	  	 	//152.work state :3: 2171,2173
			$output .= str_pad("356",10);	  						 	//153.work country :10: 2174,2183
			$output .= str_pad($result->yourWorkStdCode,10);	  	 	//154.work std code :10: 2184,2193
			$output .= str_pad($result->yourWorkPhone1,10," ",STR_PAD_LEFT);	  	 	//155.work phone 1 :10: 2194,2203
			if($result->yourWorkExtNo=="0")
			{$output .= str_pad("",10);}					  	 	//156.work ext no :10: 2204,2213}
			else
			{$output .= str_pad($result->yourWorkExtNo,10);	  	 	//156.work ext no :10: 2204,2213}
			}
			$output .= str_pad($result->yourWorkPhone2,10);	  	 	//157.work phone 2 :10: 2214,2223
			$output .= str_pad($result->yourWorkMobile,10);	  	 	//158.work mobile :10: 2224,2233
			$output .= str_pad("",15);	  						 	//160.work fax blank :15: 2234,2248
			$output .= str_pad($result->yourWorkEmailId,40);	  	 	//161.work email :40: 2249,2288
			$output .= str_pad($result->yourWorkLandmark,45);	  	 	//162.work landmark :45: 2289,2333
			$output .= str_pad("OTH",3);	 							//???163.industry type :3 :2334,2336
			if($result->yourWorkBusinessTenure=="0")
			{
				$output .= str_pad("",2);	  	//164.bussiness tenure yr :2 :2337,2338
			}
			else
			{
			$output .= str_pad($result->yourWorkBusinessTenure,2);	  	//164.bussiness tenure yr :2 :2337,2338
			}
			if($result->yourWorkBusinessTenureExt=="0")
			{
				$output .= str_pad("",3);	  	//165.bussiness tenure month :3 :2339,2341

			}
			else
			{
			$output .= str_pad($result->yourWorkBusinessTenureExt,3);	  	//165.bussiness tenure month :3 :2339,2341
			}
			$output .= str_pad($result->yourWorkDesignation,30);	  		 //166.designation :30 :2342,2371
			$output .= str_pad($result->yourWorkDepartment,25);	  		 //167.department :25 :2372,2396
			$output .= str_pad($result->yourWorkEmpCode,10);	  		 	//168.emp code :10 :2397,2406
			$output .= str_pad("",10);	  						 		  //169.cost center blank :10: 2407,2416
			$output .= str_pad("",16);	  						 		  //170.location blank :16: 2417,2432
			$output .= str_pad("",40);	  						 		  //171.prev company :40: 2418,2472
			$output .= str_pad("",20);	  						 		  //172.prev company city :20: 2473,2492
			$output .= str_pad("",2);	  						 		  //173.yrs at prev job:2: 2493,2494
			$output .= str_pad("",3);	  						 		  //174.months at prev job :3: 2495,2497
			$output .= str_pad("",25);	  						 		  //175.prev designation :25: 2498,2522
			$output .= str_pad("",10);	  						 		  //176.prev employer phone :10: 2523,2532
			$output .= str_pad("OTH",3);                        	  	 	//177.industry type :3 :2533,2535
			$output .= str_pad($result->YourWorkCompTypeCatId,3);	  	 	//178.company type :3 :2536,2538
			$output .= str_pad("",9);								  	 	//179.turnover :9 :2539,2547
			$output .= str_pad("",4);								  	 	//179.no of employees :4 :2548,2551
			if($result->yourWorkCRJobTenure=="0")
			{
				$output .= str_pad("",2);	  	 	//180.current job tenure :2 :2552,2553
			}
			else
			{
			$output .= str_pad($result->yourWorkCRJobTenure,2);	  	 	//180.current job tenure :2 :2552,2553
			}
			if($result->yourWorkCRJobTenureExt=="0")
			{
				$output .= str_pad("",3);	  	 								//181.current job tenure ext:3 :2554,2556
			}
			else
			{
				$output .= str_pad($result->yourWorkCRJobTenureExt,3);	  	 	//181.current job tenure ext:3 :2554,2556
			}
			$output .= str_pad($result->YourWorkProfessionCatId,2);	  	 	//182.current profession :2:2557,2558
			$output .= str_pad($result->yourWorkProfessionExt,20);	  	 	//183.current profession ext :20:2559,2578
			$output .= str_pad($result->yourWorkGAIncome,10," ",STR_PAD_LEFT);	  	 			//184.gross annual income :10:2579,2588
			if($result->yourWorkNetAIncome=="0")
			{
			$output .= str_pad("",10);	  	 	//185.net annual income :10:2589,2598
			}
			else
			{
			$output .= str_pad($result->yourWorkNetAIncome,10," ",STR_PAD_LEFT);	  	 	//185.net annual income :10:2589,2598

			}
			$output .= str_pad($result->yourWorkOTHSourceIncome,10," ",STR_PAD_LEFT);	  	//186.other source of income :10:2599,2608
			$output .= str_pad($result->yourWorkTotalIncome,12," ",STR_PAD_LEFT);	  	 //186.total annual income :12:2609,2620
			$output .= str_pad("",30);	  	 										//187. corporate id :30:2621,2650
			$output .= str_pad("VARA-".$result->locationName,8);	  	 							//188 default :8:2651,2658
			$output .= str_pad($result->RCUCategoryId[0],1);	  	 			//189.rcu screen :1:2659,2659
			$output .= str_pad($result->rcuCode,20);	  	 				//190.rcu code :20:2660,2679
		    if($result->yourWorkCrPositionCatId=="")
			{$output .= str_pad("O",1);}
			else
			{$output .= str_pad($result->yourWorkCrPositionCatId,1);	}  	 			//191.current position :1:2680,2680
			$output .= str_pad($result->reference2Name,25);	  	 			//192.reference2 Name :25:2681,2705
			$output .= str_pad($result->reference2Phone1,20);	  	 			//193.reference2 phone1 :20:2706,2725
			$output .= str_pad($result->suppApp1CardRequired[0],1);           //194.supplementary CardRequired :1:2726,2726
			if($result->suppApp1CardRequired[0]=="y")
			{
				$output .= str_pad($result->logoCode,3);	  	 					//195.logo Code :3:2727,2729
				$output .= str_pad($result->surrogateCode,2);	  	 			//196.surrogate Code :2:2730,2731
				$output .= str_pad($result->pricingId,2);	  	 			//197.price Code :2:2732,2733
				$output .= str_pad($result->promoId,3);	  	 			//198.promo Code :3:2734,2736
				$output .= str_pad($result->motherName,30);	  	 					//199.mother name :30:2737,2766
				$output .= str_pad($result->suppApp1NameOnCard,21);	  	 			//200.name on card :21:2767,2787
				$output .= str_pad(str_replace('-','',$result->dateOfBirth),10);	  	 			//201.DOB:21:2788,2797
				$output .= str_pad($result->yourTitleCatId,5);	  	 				//202.title:5:2798,2802
				
			
			}
			else
			{	
				$output .= str_pad("",3);	  	 							//195.logo Code :3:2727,2729
				$output .= str_pad("",2);	  	 							//196.surrogate Code :2:2730,2731
				$output .= str_pad("",2);	  	 							//197.price Code :2:2732,2733
				$output .= str_pad("",3);	  	 							//198.promo Code :3:2734,2736
				$output .= str_pad("",30);			  	 					//199.mother name :30:2737,2766
				$output .= str_pad("",21);	  	 			//200.name on card :21:2767,2787
				$output .= str_pad("",10);	  	 			//201.DOB:21:2788,2797
				$output .= str_pad("Mr.",5);	  	 									//202.title:5:2798,2802
				
			}
			$output .= str_pad($result->yourTitleExt,5);	  	 				//203.title other:5:2803,2807			
				$output .= str_pad($result->suppApp1Relation,2);	  	 				//204.relation:2:2808,2809
			//$output .= str_pad($result->suppApp1PhotoIdCatId,1);	  	 				//205.photo flag:1:2810,2810
			$output .= str_pad("N",1);	  	 										//205.photo flag:1:2810,2810

			$output .= str_pad("",30);	  					 				//206.nominee name:30:2811,2840
			$output .= str_pad("",20);	  					 				//207.nominee relation:20:2841,2860
			$output .= str_pad("",10);	  					 				//208.nominee dob:10:2861,2870
			$output .= str_pad("N",1);	  					 				//209.bill payment:1:2871,2871
			$output .= str_pad($result->referenceName,40);	  	 				//210.ref name 1:40:2872,2911
			$output .= str_pad($result->referenceStateCatId,40);	  	 				//211.ref state :40:2912,2951
			$output .= str_pad($result->referenceMobile,40);	  	 				//212.ref mobile :40:2952,2991
			$output .= str_pad($result->referenceCityCatId,45);	  	 				//213.ref city :45:2992,3036
			$output .= str_pad($result->reference2CityCatId,45);	  	 				//214.ref2 city :45:3037,3081
			$output .= str_pad("",45);	  	 									//215.third biller reference:45:3082,3126
			$output .= str_pad("",20);					  	 				//216.ECS :20:3127,3146
			$output .= str_pad($result->referencePhone1,10);			  	 							//217.micr :10:3147,3157
			$output .= str_pad($result->subStatementEmailCatId,3);	  	 		//218.statement by email :3:3157,3159
			$output .= str_pad($result->subscriptionEmailId,40);	  	 		//219.alert email id :40:3160,3199
			$output .= str_pad($result->subMobAlertCatId,3);	  	 		//220.mobile alert:3:3200,3202
			$output .= str_pad($result->subscriptionMobileNo,10);	  	 		//221.mobile :10:3203,3212
			$output .= str_pad("XXXX",5);	  	 								//222.dma code :10:3213,3217
			$output .= str_pad("",10);	  	 								//223.restart date :10:3218,3227
			if($result->referenceCard=="0")
			{
			$output .= str_pad("",19);	  	 			//224.reference Card :19:3228,3246
			}
			else
			{	$output .= str_pad($result->referenceCard,19);	  	 			//224.reference Card :19:3228,3246
			}
			$output .= str_pad($result->smrReferenceBy,20);	  	 			//225.smr Reference By :20:3247,3266
			$output .= str_pad("",10);	  	 								//226.smr Reference on :10:3267,3276
			$output .= str_pad($result->currentPincode,10);	  	 			//227.card guard :10:3277,3286
			$output .= str_pad($result->reference2Mobile,10);	  	 			//228.reference2 Mobile :10:3287,3296
			$output .= str_pad("",20);	  						 			//229.home loan :20:3297,3316
			$output .= str_pad("",10);	  						 			//230.ADA no :10:3317,3326
			$output .= str_pad($result->iciciPolicy1Cpp,10);	  	 			//231.CPP :10:3327,3336
			$output .= str_pad($result->iciciPolicy2Oat.$result->iciciPolicy2Etc,10);	  //232.oat,etc :10:3337,3346
			$output .= str_pad($result->glConsent1.$result->glConsent2,10);	  //232.lom,bil :10:3347,3356
			$output .= str_pad("",10);	  	 									//233.reimbursement :10:3357,3366
			$output .= str_pad("M",1);	  	 									//234.company financial closing yr :1:3367,3367
			$output .= str_pad("",4);	  	 									//235.yr incorp :4:3368,3371
			$output .= str_pad("",45);	  	 									//236.parent co name :45:3372,3416
			$output .= str_pad("D",1);	  	 									//237.payment by :1:3417,3417
			$output .= str_pad("D",1);	  	 									//238.payment stmnt by :1:3418,3418
			$output .= str_pad("F",1);	  	 									//239.payment  stmnt prefered by :1:3419,3419
			$output .= str_pad("",2);	  	 									//240.review months :2:3420,3421
			$output .= str_pad("1",1);	  	 									//241.deposit type :1:3422,3422
			$output .= str_pad("",4);	  	 									//242.security percentage :4:3423,3426
			$output .= str_pad("",9);	  	 									//243.secured payment :9:3427,3435
			$output .= str_pad("",9);	  	 									//244.security balance :9:3436,3444
			$output .= str_pad("",19);	  	 									//245.security dep account :19:3445,3463
			$output .= str_pad("90",4);	  	 									//246.security dep rate :4:3464,3467
			$output .= str_pad("0",4);	  	 									//247.routing transit :4:3468,3471
			$output .= str_pad("",8);	  	 									//248.maturity date :8:3472,3479
			$output .= str_pad("",20);	  	 									//249.car regstration no :20:3480,3499
			$output .= str_pad("",15);	  	 									//250.purpose overdraft :15:3500,3514
			$output .= str_pad("",20);	  	 									//251.loan A/c :20:3515,3534
			$output .= str_pad("",40);	  	 									//252.previous financer :40:3535,3574
			$output .= str_pad("",3);	  	 									//253.LTV% :3:3575,3577
			$output .= str_pad("",20);	  	 									//254.engine no :20:3578,3597
			$output .= str_pad("",20);	  	 									//255.chasis no :20:3598,3617
			$output .= str_pad("",20);	  	 									//256.scheme no :20:3618,3637
			$output .= str_pad("",20);	  	 									//257.purchased acc no :20:3638,3657
			if($result->iciciSalary_SavingAcNo=="0")
			{		
				$output .= str_pad($result->iciciSalary_SavingAcNo,25);	  	 			//258.auto debit acc no :25:3658,3682
			}
			else
			{
			$output .= str_pad($result->iciciSalary_SavingAcNo,25);	  	 			//258.auto debit acc no :25:3658,3682
			}
			$output .= str_pad($result->autoDebitBranch,20);	  	 			//259.auto debit branch :20:3683,3702
			$output .= str_pad("",20);						  	 			//260.delear code :20:3703,3722
			$output .= str_pad("",20);						  	 			//261.supply depot :20:3723,3742
			$output .= str_pad("",20);						  	 			//262.teritory code :20:3743,3762
			$output .= str_pad("",30);						  	 			//263.  name of authorized signature :30:3763,3792
			$output .= str_pad("",20);						  	 			//264.authorization type :20:3793,3812
			$output .= str_pad("",10);						  	 			//265.incorp company date :10:3813,3822
			$output .= str_pad("",10);						  	 			//266.incorp delearship date :10:3823,3832
			$output .= str_pad("I",3);						  	 			//267.application type :3:3833,3835
			$output .= str_pad("",10);						  	 			//268.sales prev :10:3836,3845
			$output .= str_pad("",10);						  	 			//269.total net worth :10:3846,3855
			$output .= str_pad("",25);						  	 			//270.tax registration no :25:3856,3880
			$output .= str_pad("",15);						  	 			//271.customer id :15:3881,3895
			$output .= str_pad("N",3);						  	 			//272.Pl required :3:3896,3898
			$output .= str_pad("",20);						  	 			//273.nature of business :20:3899,3918
			$output .= str_pad("",25);						  	 			//274.pl name of corporate :25:3919,3943
			$output .= str_pad("",3);						  	 			//275.total yrs in business :3:3944,3946
			$output .= str_pad("",10);						  	 			//276.pl monthly rent :10:3947,3956
			$output .= str_pad("",1);						  	 			//277.pl status :1:3957,3957
			$output .= str_pad("",5);						  	 			//278.pl tenure :5:3958,3962
			$output .= str_pad("",15);						  	 			//279.loan amount :15:3963,3977
			$output .= str_pad("",15);						  	 			//280.pl emi :15:3978,3992
			$output .= str_pad("",30);						  	 			//281.pl reimbursement :30:3993,4022
			$output .= str_pad("",15);						  	 			//282.pl outstanding amount :15:4022,4037
			$output .= str_pad("",15);						  	 			//283.pl monthly installment :15:4038,4052
			$output .= str_pad("",10);						  	 			//284.pl bank status :10:4053,4062
			$output .= str_pad("",1);						  	 			//285.vip indicator :1:4063,4063
			$output .= str_pad("INR",10);						  	 		//286.customer currency :10:4064,4073
			$output .= str_pad("INR",10);						  	 		//287.account currency :10:4074,4083
			$output .= str_pad("S",10);						  	 		//288.account billing :10:4084,4093
			$output .= str_pad("C",10);						  	 		//289.account payment maethod :10:4094,4103
			$output .= str_pad("",10);						  	 		//290.approved date :10:4104,4113
			$output .= str_pad("",10);						  	 		//291.template activation date 1 :10:4114,4123
			$output .= str_pad("",10);						  	 		//292.extra date 2 :10:4124,4133
			$output .= str_pad("",10);						  	 		//293.extra date3 :10:4134,4143
			$output .= str_pad("",10);						  	 		//294.extra date4:10:4144,4153
			$output .= str_pad("",10);						  	 		//295.extra date5 :10:4154,4163
			$output .= str_pad("",10);						  	 		//296.extradate 6 :10:4164,4173
			$output .= str_pad("",10);						  	 		//297.extra date7:10:4174,4183
			$output .= str_pad("",10);						  	 		//298.extra date8:10:4184,4193
			$output .= str_pad("",10);						  	 		//299.extra date9:10:4194,4203
			$output .= str_pad("",10);						  	 		//300.extra date10:10:4204,4213
			$output .= str_pad($result->lotcNo,50);					//301.lotc No:50:4214,4263
			$output .= str_pad("",50);									//302.ida No:50:4264,4313
			$output .= str_pad($result->reference2StateCatId,50);			//303.extra an 3:50:4314,4363
			$output .= str_pad("",50);									//304.extra an 4:50:4364,4413
			$output .= str_pad("",50);									//305.extra an 5:50:4414,4463
			$output .= str_pad("",50);									//306.extra an 6:50:4464,4513
			$output .= str_pad("",50);									//307.extra an 7:50:4514,4563
			$output .= str_pad("",50);									//308.extra an 8:50:4564,4613
			$output .= str_pad($result->referenceAddress1,50);			//309.extra an9:50:4614,4663
			$output .= str_pad($result->referenceAddress2,50);			//310.extra an 10:50:4664,4713
			$output .= str_pad("",50);									//311.extra an 11:50:4714,4763
			$output .= str_pad("",50);									//312.extra an 12:50:4764,4813
			$output .= str_pad("",50);									//313.extra an 13:50:4814,4863
			$output .= str_pad("",50);									//314.extra an 14:50:4864,4913
			$output .= str_pad("",50);									//315.extra an 15:50:4914,4963
			$output .= str_pad("",50);									//316.extra an 16:50:4964,5013
			$output .= str_pad("",50);									//317.extra an 17:50:5014,5063
			$output .= str_pad($result->reference2Address1,50);			//318.extra an 18:50:5064,5113
			$output .= str_pad($result->reference2Address2,50);			//319.extra an 19:50:5114,5163
			$output .= str_pad($result->inputter1,50);					//320.extra an 20:50:5164,5213
			$output .= str_pad($result->inputter2,50);					//321.extra an 21:50:5214,5263
			if($result->logoCode=="397" || $result->logoCode=="398" || $result->logoCode=="399" || $result->logoCode=="400" || $result->logoCode=="401" || $result->logoCode=="402")
			{
			$output .= str_pad("",50);									//322.extra an 22:50:5264,5313
			}
			else
			{
			$output .= str_pad("NONE",50);									//322.extra an 22:50:5264,5313
			}
			if($result->logoCode=="397" || $result->logoCode=="398" || $result->logoCode=="399" || $result->logoCode=="400" || $result->logoCode=="401" || $result->logoCode=="402")
			{
			$output .= str_pad("",50);									//323.extra an 23:50:5314,5363
			}
			else
			{	$output .= str_pad("NONE",50);									//323.extra an 23:50:5314,5363
			}
			$output .= str_pad(($result->DNDCatId==15699)?"n":"y",50);	//324.extra an 24:50:5364,5413
			$output .= str_pad("",50);									//325.extra an 25:50:5414,5463
			$output .= str_pad("",50);									//326.extra an 26:50:5464,5513
			$output .= str_pad("",50);									//327.extra an 27:50:5514,5563
			$output .= str_pad("",50);									//328.extra an 28:50:5564,5613
			$output .= str_pad("",50);									//329.extra an 29:50:5614,5663
			$output .= str_pad("",50);									//330.extra an 30:50:5664,5713
			$output .= str_pad($result->reference2Pincode,50);			//331.extra an 31:50:5714,5763
			$output .= str_pad($result->referenceCityCatId,50);			//332.extra an 32:50:5764,5813
			$output .= str_pad($result->creditHub,50);						//333.extra an 33:50:5814,5863
			$output .= str_pad("",50);									//334.extra an 34:50:5864,5913
			$output .= str_pad("",50);									//335.extra an 35:50:5914,5963
			$output .= str_pad("",50);									//336.extra an 36:50:5964,6013
			$output .= str_pad("",50);									//337.extra an 37:50:6014,6063
			$output .= str_pad("",50);									//338.extra an 38:50:6064,6113
			$output .= str_pad("",50);									//339.extra an 39:50:6114,6163
			$output .= str_pad("",50);									//340.extra an 40:50:6164,6213
			$output .= str_pad("",20);									//341.extra numeric 1:20:6214,6233
			$output .= str_pad("",20);									//342.extra numeric 2:20:6234,6253
			$output .= str_pad("",20);									//343.extra numeric 3:20:6254,6273
			$output .= str_pad("",20);									//344.extra numeric 4:20:6274,6293
			$output .= str_pad("",20);									//345.extra numeric 5:20:6294,6313
			$output .= str_pad("",20);									//346.extra numeric 6:20:6314,6333
			$output .= str_pad("",20);									//347.extra numeric 7:20:6334,6353
			$output .= str_pad("",20);									//348.extra numeric 8:20:6354,6373
			$output .= str_pad("",20);									//349.extra numeric 9:20:6374,6393
			$output .= str_pad("",20);									//350.extra numeric 10:0:6394,6413
			$output .= str_pad(strtolower($result->suppApp2CardReqCatId),1);	  	 	//351.supplementary CardRequired 2:1:6414,6414
			if(strtolower($result->suppApp2CardReqCatId)=="y")
			{
				$output .= str_pad($result->logoCode,3);	  	 			//352.logo Code :3:6415,6417
				$output .= str_pad($result->surrogateCode,2);	  	 			//353.surrogate Code :2:6418,6419
				$output .= str_pad($result->pricingId,2);	  	 			//354.price Code :2:6420,6421
				$output .= str_pad($result->promoId,3);	  	 			//355.promo Code :3:6422,6424
				$output .= str_pad($result->motherName,30);	  	 			//356.mother name :30:6425,6454
				$output .= str_pad($result->suppAppl2NameOnCard,21);	  	 			//357.name on card :21:6455,6475
				$output .= str_pad(str_replace('-','',$result->dateOfBirth),10);	  	 //358.DOB:10:6476,6485
				$output .= str_pad($result->yourTitleCatId,5);	  	 					//359.title:5:6486,6490
			}
			else
			{
				$output .= str_pad("0",3);	  	 			//352.logo Code :3:6415,6417
				$output .= str_pad("",2);	  	 			//353.surrogate Code :2:6418,6419
				$output .= str_pad("",2);	  	 			//354.price Code :2:6420,6421
				$output .= str_pad("",3);	  	 			//355.promo Code :3:6422,6424
				$output .= str_pad("",30);	  	 			//356.mother name :30:6425,6454
				$output .= str_pad("",21);	  	 			//357.name on card :21:6455,6475
				$output .= str_pad("",10);	  	 //358.DOB:10:6476,6485
				
				$output .= str_pad("Mr.",5);	  	 					//359.title:5:6486,6490
			}
				$output .= str_pad($result->yourTitleExt,5);	  	 					//360.title other:5:6491,6495
				$output .= str_pad($result->suppApp2RelCatId,2);	  	 				//361.relation:2:6496,6497

			$output .= str_pad("N",1);					  	 				//362.photo flag:1:6498,6498
			$output .= str_pad("",501)."\n";	 					 	 				//363.filler for data:502:6499,7000
			//$output .= ;			
			}
			$output .=str_pad("9999999999",10);
			$output .=str_pad(date('Ymd'),8);
			$output .=str_pad(count($arr),5,0,STR_PAD_LEFT);
			$output .=str_pad((count($arr)*7000),10,0,STR_PAD_LEFT);
			$output .=str_pad("9999999999",10);
			//print_r(date('dmYHisA'));
			   $filename = 'ICICITXT_'.date('dmYHisA').".txt";
 
			
				$handle = fopen(STORAGE_ROOT.SEPARATOR.$filename, "w");
			   fwrite($handle, $output);
			   fclose($handle);      
			  
			  
			   header('Content-Type: application/octet-stream');
			   header('Content-Disposition: attachment; filename='.($filename));
			   header('Expires: 0');
			   header('Cache-Control: must-revalidate');
			   header('Pragma: public');
			   header('Content-Length: ' . filesize(STORAGE_ROOT.SEPARATOR.$filename));
			   readfile(STORAGE_ROOT.SEPARATOR.$filename);
			   exit;
			 
			   return $result; 
	
	
				
			}
			 
	 }	

 //VALIDATION DATA
public function getpincode($pincode)
{
		// $sql = "SELECT * from  ccpincodemasternew WHERE pincode > '".$pincode."' and '".$pincode."' < topincode";     
		 $sql = "SELECT * from ccpincodemasternew WHERE '".$pincode."' BETWEEN pincode AND topincode";
		 $qparent = $this->db->query($sql)->result();
		 
		 return $qparent;
}
public function checkSerialNo($appSerialNo,$processId)
{
		// $sql = "SELECT * from  ccpincodemasternew WHERE pincode > '".$pincode."' and '".$pincode."' < topincode";     
		  $sql = "SELECT AppSerialNo,ccallocation.entryId from ccdataentry,ccallocation
		 		 WHERE AppSerialNo='".$appSerialNo."' and ccallocation.processId=".$processId." and ccdataentry.entryId=ccallocation.entryId";
		 $qparent = $this->db->query($sql)->result();
		 
		 return $qparent;
}

}




?>