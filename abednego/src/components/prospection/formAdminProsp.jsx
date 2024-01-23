import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRef } from "react";
import zxcvbn from "zxcvbn";
import { Toast } from "primereact/toast";

import axios from "axios";

const defaultTheme = createTheme();

export default function AdminProsp() {
  //verification for valid email

 


  //toast notification
  const toast = useRef(null);
  const showSuccess = () => {
    toast.current.show({
      severity: "success",
      summary: "Création effectué",
      detail: "L'utilisateur peut maintenant se connecter",
      sticky: true,
    });
  };
  const showVoidText = () => {
    toast.current.show({
      severity: "warn",
      summary: "Vérifier vos champs de saisies",
      detail: "Certains de vos champs sont vides",
      life: 3000,
    });
  };

  const showError = () => {
    toast.current.show({
      severity: "error",
      summary: "Erreur",
      detail: "Erreur de création de l'utilisateur",
      life: 3000,
    });
  };

  //to send form data to the node js server
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let nom = data.get("nom");
    let prenom = data.get("prenom");
    let username = data.get("username");
    let password = data.get("password");
    let mail = data.get("mail");

    if (
      nom === "" ||
      prenom === "" ||
      username === "" ||
      password === "" ||
      mail === ""
    ) {
      showVoidText();
    } else {
      const dataIns = {
        nom: nom,
        prenom: prenom,
        username: username,
        password: password,
        mail: mail,
      };

      const url = `http://192.168.88.36:2000/get-data`;
      const headers = { "Content-Type": "application/json" };

      try {
        const response = await axios.post(url, dataIns, { headers });

        if (response.status === 200) {
          console.log("Data sent successfully");
          showSuccess();
        } else {
          console.error("Failed to send data");
          showError();
        }
      } catch (error) {
        console.error("Error sending data:", error);
        console.error("Error response:", error.response);
      }

      console.log(dataIns);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Nouveau projet
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="nomProjet"
                  label="Nom du projet"
                  name="nomProjet"
                />
              </Grid>

              
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              créer le projet
            </Button>
            <Toast ref={toast} />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
