const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const jwt = require('jsonwebtoken');

const decrypt = require('./decryptToken.js');
const key = require('./tokenKey.js');
const con = require('./databaseConnection.js');
const currrentDateAndHour = require('./currentDate.js');

const { token } = require('morgan');
const fs = require('fs');
const https = require('https');

const privateKey = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.cert', 'utf8');
const credentials = { key: privateKey, cert: certificate };



const app = express();
const port = 3000;
const httpsServer = https.createServer(credentials, app);



let uploadedFileName = '';
let uploadedFileNameForFiles= '';

app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use('/uploadedFiles', express.static('uploadedFiles'));

//picture get on sign up screen
const configureMulter = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
      uploadedFileName = Date.now() + '-' + file.originalname;
      cb(null, uploadedFileName);
    },
  });

  return multer({ storage: storage });
};
const configureMulterForFile = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploadedFiles');
    },
    filename: function (req, file, cb) {
      uploadedFileNameForFiles = Date.now() + '-' + file.originalname;
      cb(null, uploadedFileNameForFiles);
    },
  });

  return multer({ storage: storage });
};

var middlewareDecryptToken = async function (req, res, next) {
  // get the token send in headers in frontend
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(' ')[1]; // separe the token in the text and dlete unsused text 'Barrier' 
    //decrypt the token
    decrypt(req, res, token);
    next();
    // console.log(req.userId);
  } else {
    res.status(401).json({ message: 'Error' });
  }

};



const upload = configureMulter();
const uploadFile = configureMulterForFile();

app.post('/get-picture', upload.single('image'), (req, res) => {
 if (!req.file) {
    return res.status(400).send('Aucun fichier n\'a été envoyé.');
  }
  res.status(200).send({
    message: 'Image reçue avec succès.',
    filename: uploadedFileName,
  });
});

app.post('/get-file',uploadFile.single('file'),middlewareDecryptToken,(req,res) =>{

let insertFileOnProfile = () =>{
  let insertFileQuery = `UPDATE profil
  SET fichierUpload = ?
  WHERE id = ?;`;

  let id = req.userId;
  let file = uploadedFileNameForFiles;

  con.query(insertFileQuery, [file, id], (err, rows) => {
      if (err) {
        console.log(err);
      }
      else {
       
      }
    });

}

  if (!req.file) {
    return res.status(400).send('Aucun fichier n\'a été envoyé.');
  }
  res.status(200).send({
    message: 'Fichier reçue avec succès.',
    filename: uploadedFileNameForFiles,
  });
  
  insertFileOnProfile();
});

//sign up data
app.post('/get-data', (req, res) => {
  const data = req.body;

  let singleRowInsert = () => {

    let query = `INSERT INTO utilisateur 
          (nomUtilisateur, motDePasse,mail,telephone,typeUtilisateur) VALUES (?,?,?,?,?);`;
    let username = data.username;
    let password = data.password;
    let email = data.email;
    let phoneNumber = data.phoneNumber;
    let userType = data.dropdownvalue2;

    con.query(query, [username,
      password, email, phoneNumber, userType], (err, rows) => {
        if (err) {
          console.log(err);
        }
        else {
          // console.log("ligne insérer dans utilisateur à l'index = " + rows.insertId);

        }
      });
  };


  let insertProfil = () => {

    let query = `INSERT INTO profil 
             (photoDeProfil,nom,adresse,province) VALUES (?,?,?,?);`;

    //console.log(uploadedFileName);
    let nameOrOther = data.nameOrOther;
    let localAdress = data.localAdress;
    let dropdownvalue = data.dropdownvalue;

    con.query(query, [uploadedFileName,
      nameOrOther, localAdress, dropdownvalue], (err, rows) => {
        if (err) {
          console.log(err);
        }
        else {
          // console.log("ligne insérer dans profil  à l'index = " + rows.insertId);

        }
      });
  }

  let verifyUser = (data) => {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM utilisateur WHERE (nomUtilisateur = ? or telephone = ? or mail = ?)`;
      let username = data.username;
      let phoneNumber = data.phoneNumber;
      let email = data.email;

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
        singleRowInsert();
        insertProfil();
        res.sendStatus(200);
      } else {
        //console.log("L'utilisateur existe déjà.");
        uploadedFileName = '';
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
  const token = jwt.sign({ userId }, key(), { expiresIn: '1h' });
  return token;
}

//get username and password
app.post('/get-login', (req, res) => {
  const login = req.body;

  let verifyUser = (login) => {
    return new Promise((resolve, reject) => {
      let query = `SELECT id FROM utilisateur WHERE (nomUtilisateur = ? AND motDePasse = ?)`;

      let username = login.Username;
      let password = login.Password;

      con.query(query, [username, password], (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length == 1) {
            const userId = results[0].id;
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
        //console.log("Utilisateur existant");
        //console.log("Your token :",token,'\t' , currrentDateAndHour);

        res.json({ token });
      } else {
        //console.log("Utilisateur non existant");
        res.sendStatus(409);
      }
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

//get token from cache device
app.use('/token', (req, res) => {

  // get the token send in headers in frontend
  const authHeader = req.headers['authorization'];
  if (authHeader) {

    const token = authHeader.split(' ')[1]; // separe the token

    // print the received token
    //console.log('The token sended from front :', token);

    //decrypt the token
    decrypt(req, res, token);
    console.log(req.userId);

  } else {
    res.status(401).json({ message: '' });
  }

});

//create the API for view profile
app.get('/get-data-from-db/:token', (req, res) => {
  const token = req.params.token;

  decrypt(req, res, token);


  const apiquery = `SELECT * FROM profil,utilisateur where ((utilisateur.id = profil.id) AND ((utilisateur.id <> ?) AND (profil.id <> ?))) `;

  con.query(apiquery, [req.userId, req.userId], (err, results) => {

    if (err) {
      console.error('Erreur de requete :', err);
      res.status(500).json({ error: 'erreur de requete SQL' })
    }
    else {
      const profilesWithImagePaths = results.map((profils) => ({
        id: profils.id,
        photoDeProfilPath: `uploads/${profils.photoDeProfil.toString('utf8')}`,
        nom: profils.nom,
        adresse: profils.adresse,
        biographie: profils.biographie,
        province: profils.province,
        typeUtilisateur: profils.typeUtilisateur,
      }));
      res.json(profilesWithImagePaths);
    }
  });
},);
//create the API for the Active profile
app.get('/get-active-profile/:token', (req, res) => {

  const token = req.params.token;

  decrypt(req, res, token);

  const apiquery = `SELECT * FROM profil,utilisateur where (utilisateur.id = ? AND profil.id = ?) `;

  con.query(apiquery, [req.userId, req.userId], (err, results) => {

    if (err) {
      console.error('Erreur de requete :', err);
      res.status(500).json({ error: 'erreur de requete SQL' })
    }
    else {
      const profilesWithImagePaths = results.map((profile) => ({
        id: profile.id,
        photoDeProfilPath: `uploads/${profile.photoDeProfil.toString('utf8')}`,
        nom: profile.nom,
        nomUtilisateur: profile.nomUtilisateur,
        adress: profile.adresse,
        phone: profile.telephone,
        biographie: profile.biographie,
        mail: profile.mail,
        province: profile.province,
        typeUtilisateur: profile.typeUtilisateur,

    
      }));
      res.json(profilesWithImagePaths);
    }
  });
});
//get the updated data when the users update her profile
app.post('/get-updated-profil-data', middlewareDecryptToken, (req, res) => {

  const data = req.body;
  
  let UpdateUser = () => {

    let query = `UPDATE utilisateur
      SET nomUtilisateur = ? , mail = ? , telephone = ?, typeUtilisateur = ?
      WHERE id = ?;`;
    let id = req.userId;
    let username = data.name;
    let email = data.email;
    let phoneNumber = data.phoneNumber;
    let userType = data.dropdownvalue2;

    con.query(query, [username,
      email, phoneNumber, userType, id], (err, rows) => {
        if (err) {
          console.log(err);
        }
        else {
          // console.log("ligne modifiée dans utilisateur à l'index = " + rows.insertId);

        }
      });
  };
  let UpdateProfil = () => {

    let query = `UPDATE profil
      SET nom = ? , adresse = ? , province = ?, biographie = ?
      WHERE id = ?;`;

    console.log(uploadedFileName);
    let id = req.userId;
    let nameOrOther = data.nameOrOther;
    let bio = data.biographie;
    let localAdress = data.localAdress;
    let dropdownvalue = data.dropdownvalue;

    con.query(query, [
      nameOrOther, localAdress, dropdownvalue, bio, id], (err, rows) => {
        if (err) {
          console.log(err);
        }
        else {
          // console.log("ligne modifiée dans profil  à l'index = " + rows.insertId);

        }
      });
  }
  UpdateUser();
  UpdateProfil();
});
//make the search API
app.get('/search/:text', (req, res) => {
  const text = req.params.text;

  // console.log(text);

    const apiquery = "SELECT * FROM profil, utilisateur WHERE (utilisateur.nomUtilisateur LIKE ? OR profil.nom LIKE ?) AND utilisateur.id = profil.id";

    con.query(apiquery, [`%${text}%`, `%${text}%`] ,(err, results) => {

    if (err) {
      console.error('Erreur de requete :', err);
      res.status(500).json({ error: 'erreur de requete SQL' })
    }
    else {
      const profilesWithImagePaths = results.map((profile) => ({
        id: profile.id,
        photoDeProfilPath: `uploads/${profile.photoDeProfil.toString('utf8')}`,
        nom: profile.nom,
        nomUtilisateur: profile.nomUtilisateur,
        adress: profile.adresse,
        phone: profile.telephone,
        biographie: profile.biographie,
        mail: profile.mail,
        province: profile.province,
        typeUtilisateur: profile.typeUtilisateur,
      }));
      res.json(profilesWithImagePaths);
    }
  });

});

//when Like button is pressed
app.post('/like', middlewareDecryptToken, (req, res) => {
  const data = req.body;

  let verifyMutualsLike = (data) => {
    return new Promise((resolve, reject) => {
      let VerifyStatus = 'select * from `like` where ((idEnvoyeur = ?) AND (idReceveur = ?));';

      let idEnvoyeur = data.idLikedProfil;
      let idReceveur = req.userId;

      con.query(VerifyStatus, [idEnvoyeur, idReceveur], (err, results) => {
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
  }
  verifyMutualsLike(data)
    .then((mutualLikeExists) => {
      if (!mutualLikeExists) {
        insertLikeWithNullStatus();
        makeNotifications(); 
        res.sendStatus(200);
      } else {
        insertLikeWithStatus();
        insertMeet();
        makemeetNotification();
        console.log(currrentDateAndHour());
        res.sendStatus(409);
      }
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });

  let insertLikeWithNullStatus = () => {

    let likequery = 'insert into `like`(dateLike,idEnvoyeur,idReceveur,status) values (?,?,?,?);'

    let dateLike = currrentDateAndHour();
    let idEnvoyeur = req.userId;
    let idReceveur = data.idLikedProfil;
    let status = 0;

    con.query(likequery, [dateLike,
      idEnvoyeur, idReceveur, status], (err, rows) => {
        if (err) {
          console.log(err);
        }
        else {
          console.log("ligne insérer dans like à l'index = " + rows.insertId);

        }
      });
  }
  let insertLikeWithStatus = () => {
    let likequery = 'insert into `like`(dateLike,idEnvoyeur,idReceveur,status) values (?,?,?,?);'

    let dateLike = currrentDateAndHour();
    let idEnvoyeur = req.userId;
    let idReceveur = data.idLikedProfil;
    let status = 1;

    con.query(likequery, [dateLike,
      idEnvoyeur, idReceveur, status], (err, rows) => {
        if (err) {
          console.log(err);
        }
        else {
          console.log("ligne insérer dans like à l'index = " + rows.insertId);

        }
      });
  }
  let insertMeet = () => {

    let meetquery = 'insert into meet(idUtilisateur1,idUtilisateur2,dateLikeMutuel) values (?,?,?);'

    let idUtilisateur1 = req.userId;
    let idUtilisateur2 = data.idLikedProfil;
    let dateLikeMutuel = currrentDateAndHour();


    con.query(meetquery, [idUtilisateur1,
      idUtilisateur2, dateLikeMutuel], (err, rows) => {
        if (err) {
          console.log(err);
        }
        else {
          console.log("ligne insérer dans like à l'index = " + rows.insertId);
        }
      });
  }
  let makeNotifications = () =>{

    let notificationquery = 'insert into notification(message,dateNotif,idEnvoyeur,idReceveur) values (?,?,?,?);'

    let message = data.message;
    let dateNotif = currrentDateAndHour();
    let idEnvoyeur = req.userId;
    let idReceveur = data.idLikedProfil;

    con.query(notificationquery, [message,
      dateNotif, idEnvoyeur,idReceveur], (err, rows) => {
        if (err) {
          console.log(err);
        }
        else {
          console.log("ligne insérer dans notification à l'index = " + rows.insertId);
        }
      });
  }
  let makemeetNotification = () =>{
    let notificationquery = 'insert into notification(message,dateNotif,idEnvoyeur,idReceveur) values (?,?,?,?);'

    let message = 'meet';
    let dateNotif = currrentDateAndHour();
    let idEnvoyeur = req.userId;
    let idReceveur = data.idLikedProfil;

    con.query(notificationquery, [message,
      dateNotif, idEnvoyeur,idReceveur], (err, rows) => {
        if (err) {
          console.log(err);
        }
        else {
          console.log("ligne insérer dans notification à l'index = " + rows.insertId);
        }
      });
  }

});
//API for liked profile
app.get('/liked-profile/:token', (req, res) => {

  const token = req.params.token;

  decrypt(req, res, token);

  const likeApiQuery = 'SELECT * FROM `like` where  idEnvoyeur = ?;';

  con.query(likeApiQuery, [req.userId], (err, results) => {

    if (err) {
      console.error('Erreur de requete :', err);
      res.status(500).json({ error: 'erreur de requete SQL' })
    }
    else {
      const profilesWithImagePaths = results.map((profils) => ({
        id: profils.idReceveur,
      }));
      res.json(profilesWithImagePaths);
    }
  });

});
//API for notification profile
app.get('/notification/:token',(req,res) => {
  const token = req.params.token;

  decrypt(req, res, token);

  const notificationquery = 'SELECT * FROM notification,profil where (notification.idReceveur = ? AND notification.idEnvoyeur = profil.id) ORDER BY notification.dateNotif DESC;';

  con.query(notificationquery, [req.userId], (err, results) => {

    if (err) {
      console.error('Erreur de requete :', err);
      res.status(500).json({ error: 'erreur de requete SQL' })
    }
    else {
      const profilesWithImagePaths = results.map((profils) => ({
        idEnvoyeur: profils.idEnvoyeur,
        nomEnvoyeur: profils.nom,
        photoDeProfilPath: `uploads/${profils.photoDeProfil.toString('utf8')}`,
        message: profils.message,
        dateNotif: profils.dateNotif,
      }));
      res.json(profilesWithImagePaths);
    }
  });

});

//how many people liked my profile
app.get('/how-many-like/:token',(req,res) => {
  const token = req.params.token;

  decrypt(req, res, token);

  const howmanyquery = 'SELECT COUNT(*) AS likeCount FROM `like` WHERE idReceveur = ?;';


  con.query(howmanyquery, [req.userId], (err, results) => {
    if (err) {
      console.error('Erreur de requête :', err);
      res.status(500).json({ error: 'Erreur de requête SQL' });
    } else {
      const likeCount = results[0].likeCount;
      res.json(likeCount);
    }
  });
});
//how many meet
app.get('/how-many-meet/:token' , (req,res) =>
{
  const token = req.params.token;

  decrypt(req, res, token);

  const howmanymeetquery = 'SELECT COUNT(*) AS meetcount FROM meet WHERE (idUtilisateur1 = ? or idutilisateur2 = ?);';

  con.query(howmanymeetquery, [req.userId,req.userId], (err, results) => {
    if (err) {
      console.error('Erreur de requête :', err);
      res.status(500).json({ error: 'Erreur de requête SQL' });
    } else {
      const meetCount = results[0].meetcount;
      res.json(meetCount );
    }
  });

});
//API for profile Id
app.get('/user/:token/:id' , (req,res) =>{

const id = req.params.id;

const token = req.params.token;
decrypt(req,res,token);

const userquery = 'select * from profil,utilisateur where ((profil.id = ?) AND utilisateur.id = profil.id)';

con.query(userquery, [id], (err, results) => {

  if (err) {
    console.error('Erreur de requete :', err);
    res.status(500).json({ error: 'erreur de requete SQL' })
  }
  else {
    let defaultFileName='null';
    const profilesWithImagePaths = results.map((profils) => ({
      id: profils.id,
      nom: profils.nom,
      adresse: profils.adresse,
      province: profils.province,
      photoDeProfilPath: profils.photoDeProfil
        ? `uploads/${profils.photoDeProfil.toString('utf8')}`
        : `uploads/${defaultFileName}`,
      phone: profils.telephone,
      biographie: profils.biographie,
      mail: profils.mail,
      typeUtilisateur: profils.typeUtilisateur,
      uploadFile: profils.fichierUpload
        ? `uploadedFiles/${profils.fichierUpload.toString('utf8')}`
        : `uploadedFiles/${defaultFileName}`,

    }));
    res.json(profilesWithImagePaths);
  }
});

});

//post message
app.post('/message' ,middlewareDecryptToken,(req,res) =>{
  const data = req.body;

  console.log(currrentDateAndHour(), '\n', 'message :' ,data.message, '\n id of sender :', req.userId ,'\n id of recever :',data.receiver);



  let likequery = 'insert into message(dateEnvoie,idEnvoyeur,idRecepteur,contenu) values (?,?,?,?);'

  let dateEnvoie = currrentDateAndHour();
  let idEnvoyeur = req.userId;
  let idReceveur = data.receiver;
  let contenu = data.message;

  con.query(likequery, [dateEnvoie,
    idEnvoyeur, idReceveur, contenu], (err, rows) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log("ligne insérer dans message à l'index = " + rows.insertId);

      }
    });


});

// API for user sended message 
app.get('/sended-message/:token/:id',(req,res) => {
   
const id = req.params.id;

const token = req.params.token;

decrypt(req,res,token);

const messagequery = 'select * from message where (idEnvoyeur = ? AND idRecepteur = ?) ORDER BY dateEnvoie ASC';

con.query(messagequery, [req.userId,id], (err, results) => {

  if (err) {
    console.error('Erreur de requete :', err);
    res.status(500).json({ error: 'erreur de requete SQL' })
  }
  else {
    const message = results.map((messages) => ({
      idSend:messages.idEnvoyeur,
      idReceive:messages.idRecepteur,
      date : messages.dateEnvoie,
      message : messages.contenu,
    }));
    res.json(message);
  }
});
});

//API for user received message
app.get('/received-message/:token/:id',(req,res) => {
  const id = req.params.id;

  const token = req.params.token;
  
  decrypt(req,res,token);
  
  const messagequery = 'select * from message where (idEnvoyeur = ? AND idRecepteur = ?) ORDER BY dateEnvoie ASC';
  
  con.query(messagequery, [id,req.userId], (err, results) => {
  
    if (err) {
      console.error('Erreur de requete :', err);
      res.status(500).json({ error: 'erreur de requete SQL' })
    }
    else {
      const message = results.map((messages) => ({
        idSend:messages.idEnvoyeur,
        idReceive:messages.idRecepteur,
        date : messages.dateEnvoie,
        message : messages.contenu,
      }));
      res.json(message);
    }
  });
});


app.get('/dashboard.html', (req, res) => {
  fs.readFile('dashboard.html', 'utf8', (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Fichier non trouvé');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
});

//API for dashboard admin
app.get('/dashboard',(req,res) =>{
  
  let selectAllUser = () =>{

    let usersQuery ='SELECT * from utilisateur,profil where utilisateur.id = profil.id;';

con.query(usersQuery, (err, results) => {

  if (err) {
    console.error('Erreur de requete :', err);
    res.status(500).json({ error: 'erreur de requete SQL' })
  }
  else {
    const resultsUsers = results.map((resultsUsers) => ({
      photoDeProfil:`uploads/${resultsUsers.photoDeProfil.toString('utf8')}`,
      id:resultsUsers.id,
      username:resultsUsers.nomUtilisateur,
      nom:resultsUsers.nom,
      mail:resultsUsers.mail,
      phone:resultsUsers.telephone,
      adresse:resultsUsers.adresse,
      province:resultsUsers.province,
      typeUser:resultsUsers.typeUtilisateur
    }));
    res.json(resultsUsers);
  }
});

  }
selectAllUser();
});

//print the listening port :3000
httpsServer.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});