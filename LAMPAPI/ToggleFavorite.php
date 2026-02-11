<?php

$inData = getRequestInfo();

// $conn = new mysqli("localhost", "project_user", "COP4331", "COP4331");
$conn = new mysqli("localhost", "root", "", "cop4331");

if ($conn->connect_error) 
{
    returnWithError($conn->connect_error);
} 
else 
{
    $contactId = $inData["contactId"];
    $userId = $inData["userId"];

    // Step 1 — Get current favorite value
    $stmt = $conn->prepare("SELECT Favorite FROM Contacts WHERE ID=? AND UserID=?");
    $stmt->bind_param("ii", $contactId, $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) 
    {
        // Step 2 — Toggle value
        $newFavorite = ($row["Favorite"] == 1) ? 0 : 1;

        $stmt->close();

        // Step 3 — Update DB
        $update = $conn->prepare("UPDATE Contacts SET Favorite=? WHERE ID=? AND UserID=?");
        $update->bind_param("iii", $newFavorite, $contactId, $userId);
        $update->execute();
        $update->close();

        returnWithInfo($newFavorite);
    } 
    else 
    {
        returnWithError("Contact not found");
    }

    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"favorite":0,"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($favorite)
{
    $retValue = '{"favorite":' . $favorite . ',"error":""}';
    sendResultInfoAsJson($retValue);
}

?>
