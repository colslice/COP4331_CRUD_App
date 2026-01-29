<?php

	$inData = getRequestInfo();

	$contactId = $inData["id"];
	$userId    = $inData["userId"];

	$conn = new mysqli("localhost", "project_user", "COP4331", "COP4331"); 

	if ($conn->connect_error){
    
		returnWithError($conn->connect_error);
    
	}else{
    
		$stmt = $conn->prepare(
			"DELETE FROM Contacts WHERE ID = ? AND UserID = ?"
		);

		$stmt->bind_param("ii", $contactId, $userId);
		$stmt->execute();

		returnWithInfo("", "", $contactId);

		$stmt->close();
		$conn->close();
    
	}

	function getRequestInfo(){
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj){
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError($err){
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

	function returnWithInfo($firstName, $lastName, $id){
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson($retValue);
	}

?>

