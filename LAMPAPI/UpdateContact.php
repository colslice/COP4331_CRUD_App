<?php

$inData = getRequestInfo();

$contactId = $inData["id"];
$userId    = $inData["userId"];
$firstName = $inData["firstName"];
$lastName  = $inData["lastName"];
$phone     = $inData["phone"];
$email     = $inData["email"];

$conn = new mysqli("localhost", "project_user", "COP4331", "COP4331"); 

if($conn->connect_error){
  
    returnWithError($conn->connect_error);
  
}else{
  
    $check = $conn->prepare("SELECT ID FROM Contacts WHERE ID = ? AND UserID = ?");
    $check->bind_param("ii", $contactId, $userId);
    $check->execute();
    $checkResult = $check->get_result();

    if($checkResult->num_rows === 0){
      
        returnWithError("No contact found");
      
    }else{
      
        $check->close();
      
        $stmt = $conn->prepare(
            "UPDATE Contacts 
             SET FirstName = ?, LastName = ?, Phone = ?, Email = ? 
             WHERE ID = ? AND UserID = ?"
        );
      
        $stmt->bind_param("ssssii", $firstName, $lastName, $phone, $email, $contactId, $userId);
        $stmt->execute();
        $stmt->close();

        returnWithInfo($firstName, $lastName, $contactId);
      
    }

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

