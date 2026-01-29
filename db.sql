-- Compatible with XAMPP / MariaDB

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- ----------------------------
-- Table structure for Contacts
-- ----------------------------

DROP TABLE IF EXISTS `Contacts`;

CREATE TABLE `Contacts` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(50) NOT NULL DEFAULT '',
  `LastName` varchar(50) NOT NULL DEFAULT '',
  `Phone` varchar(50) NOT NULL DEFAULT '',
  `Email` varchar(50) NOT NULL DEFAULT '',
  `UserID` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for Contacts

INSERT INTO `Contacts` VALUES
(1,'Colin','Hopkins','1234567890','test@gmail.com',1212),
(8,'bobbuu','job','1234','b@b.com',1),
(9,'bobby','job','1234','b@b.com',1),
(10,'bolib','smiyth','1237','b@lb.com',1),
(12,'bobbuyu','job','1234','b@b.com',8);

-- ----------------------------
-- Table structure for Users
-- ----------------------------

DROP TABLE IF EXISTS `Users`;

CREATE TABLE `Users` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(50) NOT NULL DEFAULT '',
  `LastName` varchar(50) NOT NULL DEFAULT '',
  `Login` varchar(50) NOT NULL DEFAULT '',
  `Password` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for Users

INSERT INTO `Users` VALUES
(1,'Rick','Leinecker','RickL','COP4331'),
(2,'Sam','Hill','SamH','Test'),
(3,'Rick','Leinecker','RickL','5832a71366768098cceb7095efb774f2'),
(4,'Sam','Hill','SamH','0cbc6611f5540bd0809a388dc95a615b'),
(5,'Nolan','Engler','nolan123','password'),
(6,'Nolanee','Engler3','nolan1233','password'),
(7,'Nolanuueue','Enugler3','nolauun1233','password'),
(8,'big','big','big12','password'),
(9,'','','',''),
(10,'knob','hobb','job','123456'),
(11,'Test','Tester','Tester123','password123'),
(12,'dog','smith','dog124','password'),
(13,'dogg','smitth','dog12334','password');
