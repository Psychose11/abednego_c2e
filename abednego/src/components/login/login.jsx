import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Image from "../../assets/abednego.png";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import axios from "axios";
import { useRef } from "react";

const ip = process.env.REACT_APP_IP;

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/Psychose11">
        Psychose
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();

  const toast = useRef(null);

  const showVoidText = () => {
    toast.current.show({
      severity: "warn",
      summary: "Vérifier vos champs de saisies",
      detail: "Certains de vos champs sont vides",
      life: 3000,
    });
  };

  const showNonExistant = () => {
    toast.current.show({
      severity: "error",
      summary: "Ustilisateur non existant",
      detail:
        "Il se peut que votre utilisateur n'esiste pas ou votre mot de passe est erroné",
      life: 3000,
    });
  };
  const showError = () => {
    toast.current.show({
      severity: "error",
      summary: "Erreur de connexion",
      detail: "Désolé nous n'arrivons pas à vous connecter",
      life: 3000,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);



    let username = data.get("Username");
    let password = data.get("password");

    if (username === "" || password === "") {
      showVoidText();
    } else {
      if (username === "admin") {
        const login = {
          Username: username,
          Password: password,
        };

        const url = `${ip}login`;
        const headers = { "Content-Type": "application/json" };

        try {
          const response = await axios.post(url, login, { headers });

          if (response.status === 200) {
            console.log("login successfully");
            const token = response.data.token;

            const setTokenPromise = new Promise((resolve) => {
              sessionStorage.setItem("token", token);
              resolve();
            });

        
            (async () => {
              await setTokenPromise;
              console.log("Your token:");
              console.log(sessionStorage.getItem("token"));
              navigate("/default");
            })();
          } else {
            console.error("Failed to send data");
          }
        } catch (error) {
          // console.error("Error sending data:", error);
          // console.error("Error response:", error.response);

          if (error.response && error.response.status === 409) {
            showNonExistant();
          } else if (error.response && error.response.status === 500) {
            showError();
          }
        }
      } else {
        const login = {
          Username: username,
          Password: password,
        };

        const url = `${ip}login`;
        const headers = { "Content-Type": "application/json" };

        try {
          const response = await axios.post(url, login, { headers });

          if (response.status === 200) {
            console.log("login successfully");
            const token = response.data.token;

            sessionStorage.setItem("token", token);

            console.log("your token :");
            console.log(sessionStorage.getItem("token"));

            navigate("/prospection");
          } else {
            console.error("Failed to send data");
          }
        } catch (error) {
          // console.error("Error sending data:", error);
          // console.error("Error response:", error.response);

          if (error.response && error.response.status === 409) {
            showNonExistant();
          } else if (error.response && error.response.status === 500) {
            showError();
          }
        }
      }
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
          <img src={Image} alt="abednego" width={200} height={200}/>

          <Typography component="h1" variant="h5">
            Connexion
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="Username"
              label="Nom d'utilisateur"
              name="Username"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Se souvenir de moi"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Connexion
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/" variant="body2">
                  Mot de passe oublié?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/enregistrement" variant="body2">
                  {"Créer un compte"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
        <Toast ref={toast} />
      </Container>
    </ThemeProvider>
  );
}
