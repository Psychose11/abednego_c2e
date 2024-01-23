const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const decrypt = require("./decryptToken.js");
const key = require("./tokenKey.js");
const con = require("./databaseConnection.js");
const currrentDateAndHour = require("./currentDate.js");
const { token } = require("morgan");
const fs = require("fs");
const http = require("http");
const cors = require("cors");
const { ifError } = require("assert");
const ExcelJS = require("exceljs");
const { error } = require("console");

const privateKey = fs.readFileSync("server-key.pem", "utf8");
const certificate = fs.readFileSync("server-cert.pem", "utf8");

const credentials = { key: privateKey, cert: certificate };

const app = express();
const port = 2000;
const httpsServer = http.createServer(credentials, app);

let uploadedFileNameForFiles = "";

app.use(bodyParser.json());
app.use(cors());
app.use("/uploadedFiles", express.static("uploadedFiles"));

//picture get on sign up screen
const configureMulter = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      uploadedFileName = Date.now() + "-" + file.originalname;
      cb(null, uploadedFileName);
    },
  });

  return multer({ storage: storage });
};
const configureMulterForFile = () => {
  const storage = multer.memoryStorage();

  return multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 10, // Limite la taille du fichier à 10 Mo, ajustez selon vos besoins
    },
  });
};

var middlewareDecryptToken = async function (req, res, next) {
  // get the token send in headers in frontend
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // separe the token in the text and dlete unsused text 'Barrier'
    //decrypt the token
    decrypt(req, res, token);
    next();
    // console.log(req.userId);
  } else {
    res.status(401).json({ message: "Error" });
  }
};

const uploadFile = configureMulterForFile();

//sign up data
app.post("/create-prospectors", (req, res) => {
  const data = req.body;
  // console.log(data);
  let insertNewprospector = () => {
    let queryAddProspector = `INSERT INTO prospecteur(nomUtilisateur,motDePasse,mail,phone,nom,prenom) VALUES (?,?,?,?,?,?);`;

    let nomUtilisateur = data.username;
    let motDePasse = data.password;
    let mail = data.mail;
    let phone = data.phone;
    let nom = data.nom;
    let prenom = data.prenom;

    con.query(
      queryAddProspector,
      [nomUtilisateur, motDePasse, mail, phone, nom, prenom],
      (err, rows) => {
        if (err) {
          console.log(err);
        } else {
          res.sendStatus(200);
        }
      }
    );
  };

  let verifyUser = (data) => {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM prospecteur WHERE (nomUtilisateur = ? or phone = ? or mail = ?)`;
      let username = data.username;
      let phoneNumber = data.phone;
      let email = data.mail;

      con.query(query, [username, phoneNumber, email], (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });
  };
  verifyUser(data)
    .then((userExists) => {
      if (!userExists) {
        insertNewprospector();
      } else {
        res.sendStatus(409);
      }
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

//generate the token
function generateAuthToken(userId) {
  const token = jwt.sign({ userId }, key(), { expiresIn: "12h" });
  return token;
}
//when log in
app.post("/login", (req, res) => {
  const login = req.body;

  let verifyUser = (login) => {
    return new Promise((resolve, reject) => {
      let query = `SELECT idProspecteur FROM prospecteur WHERE (nomUtilisateur = ? AND motDePasse = ?)`;

      let username = login.Username;
      let password = login.Password;

      con.query(query, [username, password], (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length == 1) {
            const userId = results[0].idProspecteur;
            const username = results[0].nomUtilisateur;

            const token = generateAuthToken(userId);
            resolve(token);
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });
  };
  verifyUser(login)
    .then((token) => {
      if (token) {
        res.json({ token });
      } else {
        res.sendStatus(409);
      }
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});



//get the project PRO data
app.get("/get-the-pro-data/:id", (req,res) =>{
   const projectId = req.params.id;

   let projectName;
//obtenir le nom du projet
   const queryTakeTableName = `SELECT nomProjet from projet where idProjet = ?;`;

   const executeQuery = (callback) => {
     con.query(queryTakeTableName, [projectId], (err, results) => {
       if (err) {
         callback(err);
       } else {
         callback(null, results);
       }
     });
   };
   executeQuery((err, results) => {
     if (err) {
       console.error(err);
     } else {
       if (results && results.length > 0) {
         projectName = results[0].nomProjet;
//obtenir le nom du projet


// obtenir les colonnes de la base
         const queryGetHeaderColumn = `SHOW COLUMNS FROM ${con.escapeId(
          projectName
        )}`;
        con.query(
          queryGetHeaderColumn,
          [projectName],
          async (err, results) => {
            if (err) {
              console.log("erreur");
            } else {
              const columnNames = results.map((column) => column.Field);

              console.log(columnNames);         
// obtenir les colonnes de la base

//obtenir les données liées à la colonne

const queryGetDataPRO = `SELECT * from ${projectName}`;

con.query(queryGetDataPRO, (err, results) => {
  if (err) {
    // Gérer l'erreur
    res.status(500).json({ error: "Erreur lors de la récupération des données." });
  } else {
    // Renvoyer la réponse JSON avec les noms de colonnes et les résultats
    const data = results.map((row) => {
      const rowData = {};
      columnNames.forEach((columnName) => {
        rowData[columnName] = row[columnName];
      });
      return rowData;
    });

    // Renvoyer la réponse JSON avec les noms de colonnes et les résultats
    res.json(data);
  }
}
)
//obtenir les données liées à la colonne
            }});
       }
      }
    });

});
//get the project information
app.get("/get-project-info/:id", (req,res) =>{
  const projectId=req.params.id;

  const queryProjectInfo = `SELECT * from projet where idProjet = ?`;

  con.query(queryProjectInfo, [projectId],(err, results) => {
    if (err) {
    } else {
      const apiProject = results.map((projet) => ({
        idProjet: projet.idProjet,
        nomProjet: projet.nomProjet,
        typeProjet: projet.typeProjet,
        dateCreation: projet.dateCreation,
      }));
      res.json(apiProject);
    }
  });

});
//when you send you PRO File
app.post(
  "/upload-file",
  configureMulterForFile().single("file"),
  async (req, res) => {
    const projectId = req.body.projectId;

    //prendre le nom du projet(get the name of the project)

    let projectName;

    const queryTakeTableName = `SELECT nomProjet from projet where idProjet = ?;`;

    const executeQuery = (callback) => {
      con.query(queryTakeTableName, [projectId], (err, results) => {
        if (err) {
          callback(err);
        } else {
          callback(null, results);
        }
      });
    };

    executeQuery((err, results) => {
      if (err) {
        console.error(err);
      } else {
        if (results && results.length > 0) {
          projectName = results[0].nomProjet;

          //first taking the tableName via the idProject
          //****************************************************************************** */
          //take the header of column
          const queryGetHeaderColumn = `SHOW COLUMNS FROM ${con.escapeId(
            projectName
          )}`;
          con.query(
            queryGetHeaderColumn,
            [projectName],
            async (err, results) => {
              if (err) {
                console.log("erreur");
              } else {
                const columnNames = results.map((column) => column.Field);
                const columnsToInsert = columnNames.slice(1);

                console.log(columnsToInsert);
                // console.log("en tête des colonnes dans la base",columnNames);

                // requêtes pour insérer les valeurs dans la base
                //récupération du contenu du fichier
                // Récupération des données à partir du fichier Excel
                try {
                  if (!req.file) {
                    console.log("Aucun fichier n'a été envoyé.");
                    return res
                      .status(400)
                      .send("Aucun fichier n'a été envoyé.");
                  }
                  // Lecture du fichier
                  const bufferData = req.file.buffer;
                  const workbook = new ExcelJS.Workbook();
                  await workbook.xlsx.load(bufferData);
                  // Récupération la première feuille de calcul
                  const worksheet = workbook.worksheets[0];
                  // Récupérez les en-têtes de colonne
                  const headers = [];
                  const row = worksheet.getRow(1);

                  row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    if (cell.value) {
                      headers[colNumber] = cell.value;
                    }
                  });

                  const data = [];
                  for (let i = 2; i <= worksheet.rowCount; i++) {
                    const row = worksheet.getRow(i);
                    const rowData = {};

                    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                      if (headers[colNumber]) {
                        rowData[headers[colNumber]] = cell.value;
                      }
                    });

                    data.push(rowData);
                  }
                  console.log("Contenu du fichier Excel:", data);
                  // Récupération du contenu du fichier

                  //insertion du contenu du fichier excel
                  const queryCreateDataPro = `
  INSERT INTO ${projectName}(${columnsToInsert.join(", ")})
  VALUES ?
  ON DUPLICATE KEY UPDATE
  ${columnsToInsert.map((column) => `${column}=VALUES(${column})`).join(", ")}
`;

                  con.query(
                    queryCreateDataPro,
                    [data.map(Object.values)],
                    (error, results) => {
                      if (error) {
                        console.log(error);
                      } else {
                        res.status(200).send({
                          message: "Fichier reçu avec succès.",
                          filename: uploadedFileNameForFiles,
                        });
                      }
                    }
                  );
                } catch (error) {
                  console.error(
                    "Erreur lors de la manipulation du fichier:",
                    error
                  );
                  res
                    .status(500)
                    .send("Erreur lors de la manipulation du fichier.");
                }
              }
            }
          );
        }
      }
    });
  }
);
//create the project
app.post("/get-projet-data-creation", (req, res) => {
  const data = req.body;

  // Créer une table pro dynamiquement
  let createTablePro = () => {
    const createTableQuery = `CREATE TABLE ${data.nomProjet} (
  idPro INT AUTO_INCREMENT PRIMARY KEY,
  ${data.enTete.map((col) => `\`${col}\` VARCHAR(255)`).join(", ")}
);`;
    // Exécuter la requête
    con.query(createTableQuery, (error, results, fields) => {
      if (error) {
        console.error("Erreur lors de la création de la table :", error);
        res.status(500).send("Erreur lors de la création de la table");
      } else {
        console.log("Table créée avec succès !");
      }
    });
  };

  //Créer le projet
  let createProjet = () => {
    const createProjetQuery = `INSERT INTO projet(nomProjet,typeProjet,dateCreation) values (?,?,?)`;
    const createProjetProspecteurQuery = `INSERT INTO projet_prospecteur(idProjet, idProspecteur) VALUES (?, ?)`;

    let nomProjet = data.nomProjet;
    let typeProjet = data.typeprojet;
    let dateCreation = currrentDateAndHour();

    con.query(
      createProjetQuery,
      [nomProjet, typeProjet, dateCreation],
      (error, results) => {
        if (error) {
          console.error("Erreur lors de l'ajout du projet : ", error);
          res.status(500).send("Erreur lors de l'ajout du projet");
        } else {
          //console.log("Ajout effectué");
          res.sendStatus(200);
          const idProjet = results.insertId;
          // Ajouter les relations entre le projet et les prospecteurs
          data.prospecteurs.forEach((prospecteur) => {
            const idProspecteur = prospecteur.id;

            con.query(
              createProjetProspecteurQuery,
              [idProjet, idProspecteur],
              (error, results) => {
                if (error) {
                  console.error(
                    "Erreur lors de l'ajout de la relation projet-prospecteur : ",
                    error
                  );
                } else {
                  //console.log(`Relation projet-prospecteur ajoutée pour le prospecteur ${idProspecteur}`);
                }
              }
            );
          });
          createTablePro();
          createQuestion();
        }
      }
    );
  };

  let createQuestion = () => {
    // Déclarer idProjet en dehors de la fonction con.query
    let idProjet;

    // Obtenir l'id du projet
    const getIdProjet = `SELECT idProjet FROM projet WHERE nomProjet = ?`;
    let nomProjet = data.nomProjet;
    let idQuestion;

    // Utiliser une Promise pour gérer l'asynchronicité
    const getIdPromise = new Promise((resolve, reject) => {
      con.query(getIdProjet, [nomProjet], (error, results) => {
        if (error) {
          console.error("Erreur lors de l'obtention de l'id", error);
          reject(error);
        } else {
          if (results.length > 0) {
            idProjet = results[0].idProjet;
            resolve(idProjet);
          } else {
            console.log("Aucun projet trouvé avec ce nom.");
            resolve(null);
          }
        }
      });
    });
    getIdPromise
      .then((idProjet) => {
        let questions = data.question;

        if (questions.length === 0) {
          console.log("Le tableau des questions est vide.");
          return;
        }
        const insertQuestionQuery = `INSERT INTO question(idProjet,numeroQuestion,typeDeQuestion,question) VALUES (?,?,?,?)`;
        const insertQuestion = (question, numeroQuestion) => {
          con.query(
            insertQuestionQuery,
            [
              idProjet,
              numeroQuestion,
              question.Typedequestion,
              question.Laquestion,
            ],
            (error, results) => {
              if (error) {
                console.error(
                  "Erreur lors de l'insertion de la question",
                  error
                );
              } else {
                idQuestion = results.insertId;
                insertReponses(question.Lesoptions, idQuestion);
              }
            }
          );
        };

        const insertReponses = (options, idQuestion) => {
          const insertReponseQuery = `INSERT INTO reponse(idProjet,idQuestion, numeroReponse, reponse) VALUES (?,?,?,?)`;

          options.forEach((option, optionIndex) => {
            con.query(
              insertReponseQuery,
              [idProjet, idQuestion, optionIndex + 1, option],
              (error, results) => {
                if (error) {
                  console.error(
                    "Erreur lors de l'insertion de l'option de réponse",
                    error
                  );
                } else {
                }
              }
            );
          });
        };

        questions.forEach((question, index) => {
          if (questions.Typedequestion !== null) {
            insertQuestion(question, index + 1);
          }
        });
      })
      .catch((error) => {
        console.error("Erreur lors de l'obtention de l'id du projet", error);
      });
  };

  let verifyProjet = (data) => {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM projet WHERE nomProjet = ?`;

      let nomProjet = data.nomProjet;
      con.query(query, [nomProjet], (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });
  };
  verifyProjet(data)
    .then((projetExists) => {
      if (!projetExists) {
        createProjet();
      } else {
        res.sendStatus(409);
      }
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});
//update prospector profile
app.post("/modification-prospector", (req, res) => {
  const data = req.body;

  let UpdateProspector = () => {
    let queryUpdateProspector = `UPDATE prospecteur set nomUtilisateur = ? , motDePasse = ?, mail = ? , phone = ? , nom = ?, prenom = ? WHERE idProspecteur = ?;`;

    let idProspecteur = data.id;
    let nomUtilisateur = data.username;
    let motDePasse = data.password;
    let mail = data.mail;
    let phone = data.phone;
    let nom = data.nom;
    let prenom = data.prenom;

    con.query(
      queryUpdateProspector,
      [nomUtilisateur, motDePasse, mail, phone, nom, prenom, idProspecteur],
      (err, rows) => {
        if (err) {
          console.log(err);
        } else {
          res.sendStatus(200);
        }
      }
    );
  };

  let verifyUser = (data) => {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM prospecteur WHERE ((nomUtilisateur = ? or phone = ? or mail = ?) AND idProspecteur <> ?)`;

      let id = data.id;
      let username = data.username;
      let phoneNumber = data.phone;
      let email = data.mail;

      con.query(query, [username, phoneNumber, email, id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });
  };
  verifyUser(data)
    .then((userExists) => {
      if (!userExists) {
        UpdateProspector();
      } else {
        res.sendStatus(409);
      }
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});
//delete prospecteur
app.post("/suppression-prospector", (req, res) => {
  const data = req.body;

  let DeleteProspector = () => {
    let queryDeleteProspector = `DELETE FROM prospecteur WHERE idProspecteur = ?`;

    let id = data.id;
    con.query(queryDeleteProspector, [id], (error, results) => {
      if (error) {
      } else {
        res.sendStatus(200);
      }
    });
  };

  let verifyUser = (data) => {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM prospecteur WHERE idProspecteur = ?`;

      let id = data.id;

      con.query(query, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length < 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });
  };
  verifyUser(data)
    .then((userExists) => {
      if (!userExists) {
        DeleteProspector();
      } else {
        res.sendStatus(409);
      }
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});
//get project data for the dataTable
app.get("/all-project/:token", (req, res) => {
  const token = req.params.token;
  decrypt(req, res, token);
  const queryGetProjectData = `SELECT * from projet;`;
  con.query(queryGetProjectData, (err, results) => {
    if (err) {
    } else {
      const apiProject = results.map((projet) => ({
        idProjet: projet.idProjet,
        nomProjet: projet.nomProjet,
        typeProjet: projet.typeProjet,
        dateCreation: projet.dateCreation,
      }));
      res.json(apiProject);
    }
  });
});


//get the cibled question of project
app.get("/cibled-question-project/:token/:idProjet", (req, res) => {
  const token = req.params.token;
  const idProjet = req.params.idProjet;

  //take the  header od column == (name of the projet = table name)

  //first taking the tableName via the idProject
  let projectName;

  const queryTakeTableName = `SELECT nomProjet from projet where idProjet = ?;`;

  const executeQuery = (callback) => {
    con.query(queryTakeTableName, [idProjet], (err, results) => {
      if (err) {
        callback(err);
      } else {
        callback(null, results);
      }
    });
  };

  executeQuery((err, results) => {
    if (err) {
      console.error(err);
    } else {
      if (results && results.length > 0) {
        projectName = results[0].nomProjet;

        //first taking the tableName via the idProject
        //******************************************************************** */
        //take the header of column
        const queryGetHeaderColumn = `SHOW COLUMNS FROM ${con.escapeId(
          projectName
        )}`;
        con.query(queryGetHeaderColumn, [projectName], (err, results) => {
          if (err) {
            console.log("erreur");
          } else {
            const columnNames = results.map((column) => column.Field);
            res.json({ columnNames });
          }
        });

        //take the header of column
      }
    }
  });
});
//get prospector data for the dataTable
app.get("/all-prospector/:token", (req, res) => {
  const token = req.params.token;

  decrypt(req, res, token);

  const queryGetProspector = `SELECT * FROM prospecteur where (idProspecteur <> ?)`;

  con.query(queryGetProspector, [req.userId], (err, results) => {
    if (err) {
    } else {
      const apiProspector = results.map((prospector) => ({
        id: prospector.idProspecteur,
        nomUtilisateur: prospector.nomUtilisateur,
        motDepasse: prospector.motDePasse,
        mail: prospector.mail,
        phone: prospector.phone,
        nom: prospector.nom,
        prenom: prospector.prenom,
      }));
      res.json(apiProspector);
    }
  });
});
//get member data for the dataTable
app.get("/all-member/:token", (req, res) => {
  const token = req.params.token;

  decrypt(req, res, token);

  const queryGetProspector = `SELECT * FROM utilisateur`;

  con.query(queryGetProspector, [req.userId], (err, results) => {
    if (err) {
    } else {
      const apiProspector = results.map((prospector) => ({
        id: prospector.idUtilisateur,
        nomUtilisateur: prospector.nomUtilisateur,
        motDepasse: prospector.motDePasse,
        mail: prospector.mail,
        parcours: prospector.parcours,
        niveau:prospector.niveau,
        telephone: prospector.telephone,
        nom: prospector.nom,
        prenom: prospector.prenom,
        payement: prospector.payement,
      }));
      res.json(apiProspector);
    }
  });
});




//get the prospector info via the token
app.get("/prospector-info/:token", (req, res) => {
  const token = req.params.token;

  decrypt(req, res, token);

  const queryProspectorInfo = `SELECT * FROM prospecteur where (idProspecteur = ?)`;

  con.query(queryProspectorInfo, [req.userId], (err, results) => {
    if (err) {
    } else {
      const apiInfoProspector = results.map((infoprospector) => ({
        id: infoprospector.idProspecteur,
        nomUtilisateur: infoprospector.nomUtilisateur,
        motDepasse: infoprospector.motDePasse,
        mail: infoprospector.mail,
        phone: infoprospector.phone,
        nom: infoprospector.nom,
        prenom: infoprospector.prenom,
      }));
      res.json(apiInfoProspector);
    }
  });
});


//print the listening port :3000
httpsServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
