<?php

$inData = getRequestInfo();

$conn = new mysqli("localhost", "root", "", "cop4331");

if ($conn->connect_error){
  
  returnWithError($conn->connect_error);
  
}else{
   
  $sql = "SELECT * FROM Contacts 
          WHERE (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?) 
          AND UserID = ?";
  
  $stmt = $conn->prepare($sql);

  $searchTerm = "%" . $inData["search"] . "%";
  $stmt->bind_param("ssssi", $searchTerm, $searchTerm, $searchTerm, $searchTerm, $inData["userId"]);
  $stmt->execute();
  $result = $stmt->get_result();

  $contactsString = "";
  $count = 0;

  while($row = $result->fetch_assoc()){
        
    if($count > 0){
            
      $contactsString .= ",";
        
    }
        
    $contactsString .= '{"id":' . $row["ID"] .
                          ',"firstName":"' . $row["FirstName"] .
                          '","lastName":"' . $row["LastName"] .
                          '","phone":"' . $row["Phone"] .
                          '","email":"' . $row["Email"] . '"}';
    $count++;
    
  }

  if($count===0){
      
    returnWithError("Person Not Found");
      
  }else{
      
    returnWithInfo($contactsString);
      
  }

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
    $retValue = '{"results":[],"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($contactsString){
    $retValue = '{"results":[' . $contactsString . '],"error":""}';
    sendResultInfoAsJson($retValue);
}

?>

