-- --------------------------------------------------------
-- Hôte:                         127.0.0.1
-- Version du serveur:           8.0.30 - MySQL Community Server - GPL
-- SE du serveur:                Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Listage de la structure de la base pour abednego
DROP DATABASE IF EXISTS `abednego`;
CREATE DATABASE IF NOT EXISTS `abednego` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `abednego`;

-- Listage de la structure de table abednego. a
DROP TABLE IF EXISTS `a`;
CREATE TABLE IF NOT EXISTS `a` (
  `idPro` int NOT NULL AUTO_INCREMENT,
  `Nom` varchar(255) DEFAULT NULL,
  `Num` varchar(255) DEFAULT NULL,
  `Mail` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idPro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Listage des données de la table abednego.a : ~0 rows (environ)

-- Listage de la structure de table abednego. canon
DROP TABLE IF EXISTS `canon`;
CREATE TABLE IF NOT EXISTS `canon` (
  `idPro` int NOT NULL AUTO_INCREMENT,
  `Raison Sociale` varchar(255) DEFAULT NULL,
  `Nom` varchar(255) DEFAULT NULL,
  `Adresse` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idPro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Listage des données de la table abednego.canon : ~0 rows (environ)

-- Listage de la structure de table abednego. projet
DROP TABLE IF EXISTS `projet`;
CREATE TABLE IF NOT EXISTS `projet` (
  `idProjet` int NOT NULL AUTO_INCREMENT,
  `nomProjet` varchar(100) DEFAULT NULL,
  `typeProjet` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `dateCreation` datetime DEFAULT NULL,
  PRIMARY KEY (`idProjet`),
  KEY `idProjet` (`idProjet`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

-- Listage des données de la table abednego.projet : ~2 rows (environ)
REPLACE INTO `projet` (`idProjet`, `nomProjet`, `typeProjet`, `dateCreation`) VALUES
	(1, 'CANON', 'proImporter', '2023-12-27 14:10:24'),
	(2, 'A', 'proSaisir', '2023-12-28 13:08:14');

-- Listage de la structure de table abednego. projet_prospecteur
DROP TABLE IF EXISTS `projet_prospecteur`;
CREATE TABLE IF NOT EXISTS `projet_prospecteur` (
  `idProjet` int NOT NULL,
  `idProspecteur` int DEFAULT NULL,
  KEY `FK_projet_prospecteur_projet` (`idProjet`),
  KEY `FK_projet_prospecteur_prospecteur` (`idProspecteur`),
  CONSTRAINT `FK_projet_prospecteur_projet` FOREIGN KEY (`idProjet`) REFERENCES `projet` (`idProjet`),
  CONSTRAINT `FK_projet_prospecteur_prospecteur` FOREIGN KEY (`idProspecteur`) REFERENCES `prospecteur` (`idProspecteur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Listage des données de la table abednego.projet_prospecteur : ~3 rows (environ)
REPLACE INTO `projet_prospecteur` (`idProjet`, `idProspecteur`) VALUES
	(1, 2),
	(1, 7),
	(2, 8);

-- Listage de la structure de table abednego. prospecteur
DROP TABLE IF EXISTS `prospecteur`;
CREATE TABLE IF NOT EXISTS `prospecteur` (
  `idProspecteur` int NOT NULL AUTO_INCREMENT,
  `nomUtilisateur` varchar(100) DEFAULT NULL,
  `motDePasse` varchar(150) DEFAULT NULL,
  `mail` varchar(150) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idProspecteur`),
  KEY `idProspecteur` (`idProspecteur`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3;

-- Listage des données de la table abednego.prospecteur : ~8 rows (environ)
REPLACE INTO `prospecteur` (`idProspecteur`, `nomUtilisateur`, `motDePasse`, `mail`, `phone`, `nom`, `prenom`) VALUES
	(1, 'admin', '@dministrator', 'ramiaramananambolatiana@gmail.com', '+261 34 32 908 70', 'Sarobidy', 'Tahina'),
	(2, 'Tahina', 'sarobidy', 'fetrasarobidy3@gmail.com', '+261 34 13 136 55', 'FETRARISON', 'Tahina Sarobidy'),
	(7, 'Maella', 'motdepasse', 'mbolatianaharinavalona@gmail.com', '+261 34 50 975 09', 'Tiana', 'Mbola'),
	(8, 'Stiffler', '123admin456', 'fetra@gmail.com', '+261 32 12 855 96', 'Sarobidy', 'Fetra'),
	(9, 'Kevin', '124578963', 'kevin@gmail.com', '+261 32 11 554 69', 'Grand', 'Tito'),
	(10, 'boulot', 'motdepasse', 'monBoulot@gmail.com', '+261 34 22 569 88', 'mon', 'Boulot'),
	(13, 'Mbola', 'kely', 'Mbolavitessebemintsy@mail.com', '+261 34 12 124 58', 'vitesse', 'Mbola'),
	(15, 'MHD', 'mohamedsyllah', 'MHD@gmail.com', '+261 33 12 408 50', 'Syla', 'Mohamed');

-- Listage de la structure de table abednego. question
DROP TABLE IF EXISTS `question`;
CREATE TABLE IF NOT EXISTS `question` (
  `idQuestion` int NOT NULL AUTO_INCREMENT,
  `idProjet` int NOT NULL DEFAULT '0',
  `numeroQuestion` int NOT NULL DEFAULT '0',
  `typeDeQuestion` varchar(50) DEFAULT NULL,
  `question` longtext NOT NULL,
  PRIMARY KEY (`idQuestion`),
  KEY `idQuestion` (`idQuestion`),
  KEY `FK__projet` (`idProjet`),
  CONSTRAINT `FK__projet` FOREIGN KEY (`idProjet`) REFERENCES `projet` (`idProjet`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;

-- Listage des données de la table abednego.question : ~2 rows (environ)
REPLACE INTO `question` (`idQuestion`, `idProjet`, `numeroQuestion`, `typeDeQuestion`, `question`) VALUES
	(1, 1, 1, 'casesACocher', 'une question'),
	(5, 2, 1, 'choixMultiples', 'test');

-- Listage de la structure de table abednego. reponse
DROP TABLE IF EXISTS `reponse`;
CREATE TABLE IF NOT EXISTS `reponse` (
  `idReponse` int NOT NULL AUTO_INCREMENT,
  `idProjet` int NOT NULL,
  `idQuestion` int NOT NULL,
  `numeroReponse` int NOT NULL,
  `reponse` longtext NOT NULL,
  PRIMARY KEY (`idReponse`),
  KEY `idReponse` (`idReponse`),
  KEY `FK_reponse_projet` (`idProjet`),
  KEY `FK_reponse_question` (`idQuestion`),
  CONSTRAINT `FK_reponse_projet` FOREIGN KEY (`idProjet`) REFERENCES `projet` (`idProjet`),
  CONSTRAINT `FK_reponse_question` FOREIGN KEY (`idQuestion`) REFERENCES `question` (`idQuestion`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;

-- Listage des données de la table abednego.reponse : ~6 rows (environ)
REPLACE INTO `reponse` (`idReponse`, `idProjet`, `idQuestion`, `numeroReponse`, `reponse`) VALUES
	(1, 1, 1, 1, 'oui'),
	(2, 1, 1, 2, 'non'),
	(3, 1, 1, 3, 'oui'),
	(4, 2, 5, 1, 'A'),
	(5, 2, 5, 2, 'B'),
	(6, 2, 5, 3, 'C');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
