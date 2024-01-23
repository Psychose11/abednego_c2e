import React, { useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { Toast } from "primereact/toast";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
const ip = process.env.REACT_APP_IP;

const responseTypes = [
  { label: "Paragraphe", value: "paragraphe", icon: "pi pi-align-left" },
  { label: "Date", value: "date", icon: "pi pi-calendar" },
  { label: "Heure", value: "heure", icon: "pi pi-clock" },
  {
    label: "Choix Multiples",
    value: "choixMultiples",
    icon: "pi pi-check-circle",
  },
  {
    label: "Cases à cocher",
    value: "casesACocher",
    icon: "pi pi-check-square",
  },
  { label: "Liste déroulante", value: "listeDeroulante", icon: "pi pi-list" },
];

const MyForm = () => {
  const toast = useRef(null);
  const [projectName, setProjectName] = useState("");
  const [questionCards, setQuestionCards] = useState([]);
  const [projectType, setProjectType] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionValues, setQuestionValues] = useState([]);
  const [prospecteurs, setProspecteurs] = useState([]);
  const [mavariable, setMavariable] = useState([
    { Laquestion: "", Typedequestion: "", Lesoptions: [] },
  ]);
  const index = questionCards.length;
  const [selectedProspecteurs, setSelectedProspecteurs] = useState([]);
  const [inputs, setInputs] = useState([""]);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchProspecteur = async () => {
      try {
        const cachedToken = sessionStorage.getItem("token");

        if (cachedToken) {
          const headers = { Authorization: `Bearer ${cachedToken}` };
          const response = await axios.get(
            `${ip}all-prospector/${cachedToken}`,
            { headers }
          );

          if (response.status === 200) {
            const prospecteursData = response.data;
            setProspecteurs(prospecteursData);
          } else {
            throw new Error("Failed to load data");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchProspecteur();
  }, []);

  const handleProspecteurChange = (event, value) => {
    setSelectedProspecteurs(value);
  };

  const load = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      handleAddQuestionCard();
    }, 100);
  };

  const handleTypeChange = (event) => {
    const { name, checked } = event.target;
    setProjectType(checked ? name : "");
  };

  const showProjetExistant = () => {
    toast.current.show({
      severity: "error",
      summary: "Création du projet",
      detail:
        "Choisissez un autre nom de projet",
      life: 3000,
    });
  };
  const showError = () => {
    toast.current.show({
      severity: "error",
      summary: "Création du projet",
      detail:
        "Erreur lors de la création du projet",
      life: 3000,
    });

  }
  const showSuccesscreation = () => {
    toast.current.show({
      severity: "success",
      summary: "Création du projet",
      detail: "Le projet a été créé",
      life: 3000,
    });
    
  };

  const handleCreateProject = async () => {

    const url = `${ip}get-projet-data-creation`;
    const headers = { "Content-Type": "application/json" };
    const data = {
      nomProjet: projectName,
      typeprojet: projectType,
      enTete: inputs,
      prospecteurs: selectedProspecteurs,
      question: mavariable,
    };

    try {
      const response = await axios.post(url, data, { headers });
      if (response.status === 200) {
        console.log("login successfully");
        showSuccesscreation();
        const sleep = ms => new Promise(r => setTimeout(r, ms));
        await sleep(5000);
        navigate('/client-global');

      } else {
        console.error("Failed to send data");
        showError();
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        showProjetExistant();
      } else if (error.response && error.response.status === 500) {
        showError();
      }
    }   
  };

  //création des colonnes pour les pro

  const handleInputChange = (index, value) => {
    const updatedInputs = [...inputs];
    updatedInputs[index] = value;
    setInputs(updatedInputs);
  };

  const handleRemoveInput = (index) => {
    const updatedInputs = [...inputs];
    updatedInputs.splice(index, 1);
    setInputs(updatedInputs);
  };

  const handleAddInput = () => {
    setInputs([...inputs, ""]);
  };


  
  //création des colonnes pour les pro


  const handleAddQuestionCard = () => {
    setQuestionCards((prevCards) => [
      ...prevCards,
      <QuestionCard
        key={index}
        index={index}
        onDelete={handleDeleteQuestionCard}
      />,
    ]);
  };

  const handleDeleteQuestionCard = (index) => {
    setQuestionCards((prevCards) =>
      prevCards.filter((card) => card.props.index !== index)
    );
    setQuestionValues((prevValues) => prevValues.filter((_, i) => i !== index));
    
    setMavariable((prevMavariable) => {
      const newMavariable = [...prevMavariable];
      newMavariable[index] = null; // ou undefined, selon votre préférence
      return newMavariable;
    });

  };

  const QuestionCard = ({ index, onDelete }) => {
    const [questionInput, setQuestionInput] = useState("");
    const [questionType, setQuestionType] = useState("");
    const [options, setOptions] = useState([{ value: [] }]);
    const [optionsValue, setOptionsValue] = useState([
      { optionsDeReponse: [] },
    ]);

    useEffect(() => {
      setMavariable((prevMavariable) => {
        const newMavariable = [...prevMavariable];
        const index = questionCards.length;
        newMavariable[index] = {
          ...newMavariable[index],
          Laquestion: questionInput,
          Typedequestion: questionType,
          Lesoptions: optionsValue,
        };
        return newMavariable;
      });
    }, [questionInput, questionType]);

    const dropdownOptions = responseTypes.map((type) => ({
      label: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <i className={type.icon} style={{ marginRight: "0.5rem" }}></i>
          {type.label}
        </div>
      ),
      value: type.value,
    }));

    const handleAddOption = () => {
      setOptions([...options, { value: [] }]);
    };

    const handleRemoveOption = (optionIndex) => {
      setOptions((prevOptions) =>
        prevOptions.filter((_, i) => i !== optionIndex)
      );
    };

    const handleOptionChange = (index, key, value) => {
      setOptions((prevOptions) =>
        prevOptions.map((opt, i) =>
          i === index ? { ...opt, [key]: value } : opt
        )
      );
      optionsValue[index] = value;
    };

    const renderResponseInput = (type, options) => {
      switch (type) {
        case "paragraphe":
          return (
            <InputTextarea
              autoResize
              disabled
              rows={1}
              cols={70}
              style={{ marginTop: "1rem" }}
              placeholder="Réponse en paragraphe"
            />
          );
        case "date":
          return (
            <div>
              <h5>Date</h5>
              <Calendar disabled showIcon />
            </div>
          );
        case "heure":
          return (
            <div>
              <h5>Heure</h5>
              <Calendar disabled timeOnly />
            </div>
          );
        case "choixMultiples":
          return (
            <div>
              <h5>Choix Multiples</h5>
            </div>
          );
        case "casesACocher":
          return (
            <div>
              <h5>Cases à cocher</h5>
            </div>
          );
        case "listeDeroulante":
          return (
            <div>
              <h5>Liste déroulante</h5>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <Card
        className="p-m-2"
        style={{ width: "70%", position: "relative", marginTop: "1rem" }}
      >
        <Button
          icon="pi pi-trash"
          severity="danger"
          aria-label="Cancel"
          style={{ position: "absolute", top: "0", right: "0" }}
          onClick={() => onDelete(index)}
        />
        <h5>Nouvelle Question</h5>
        <div style={{ display: "flex" }}>
          <Grid item xs={12} sm={6} style={{ maxWidth: "50%" }}>
            <InputText
              placeholder="Entrez votre question"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12} sm={6} style={{ maxWidth: "50%" }}>
            <Dropdown
              value={questionType}
              options={dropdownOptions}
              onChange={(e) => setQuestionType(e.value)}
              placeholder="Sélectionnez le type de réponse"
              optionLabel="label"
              optionValue="value"
              style={{ width: "100%", marginLeft: "10px" }}
            />
          </Grid>
        </div>
        
        {renderResponseInput(questionType, options)}
        {questionType === "choixMultiples" ||
        questionType === "casesACocher" ||
        questionType === "listeDeroulante" ? (
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column" }}>
  <h5>Options de réponse</h5>
  
  {options.map((opt, optIndex) => (
    <div key={optIndex} style={{ display: "flex", alignItems: "center" }}>
      <div className="p-inputgroup">
        <InputText
          value={opt.value}
          onChange={(e) => handleOptionChange(optIndex, "value", e.target.value)}
          style={{ marginTop: "1rem", marginRight: "1rem" }}
          placeholder="Option de réponse"
        />
        <Button
          icon="pi pi-trash"
          severity="warning"
          onClick={() => handleRemoveOption(optIndex)}
          style={{ marginTop: "1rem" }}
        />
      </div>
    </div>
  ))}
  
  <div style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}>
    <Button
      icon="pi pi-plus"
      label="Ajouter option"
      onClick={handleAddOption}
    />
  </div>
</div>

        ) : null}
      </Card>
    );
  };

  return (
    <div className="p-d-flex p-jc-center">
      <Card className="p-m-2" style={{ width: "70%" }}>
        <h2>Création de projet</h2>
        <h5>Nom du Projet</h5>
        <InputText
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          style={{ width: "100%" }}
        />
        <h5>Type du Projet</h5>
        <div className="flex flex-wrap justify-content-center gap-3">
          <Checkbox
            inputId="proImporter"
            name="proImporter"
            checked={projectType === "proImporter"}
            onChange={handleTypeChange}
          />
          <label htmlFor="proImporter" className="ml-2">
            Pro à Importer
          </label>
          <Checkbox
            inputId="proSaisir"
            name="proSaisir"
            checked={projectType === "proSaisir"}
            onChange={handleTypeChange}
            style={{ marginLeft: "10px" }}
          />
          <label htmlFor="proSaisir" className="ml-2">
            Pro à Saisir
          </label>
        </div>
        {((projectType === "proImporter") || (projectType === "proSaisir")) && (
          <div className="block" style={{ display: "flex", flexDirection: "column", marginBottom: "1rem", marginTop: "1rem" }}>
          <h5>Colonnes pour les pros</h5>
          
          {inputs.map((input, index) => (
            <div key={index} className="p-inputgroup" style={{ display: "flex", alignItems: "center" }}>
              <InputText
                placeholder="Entête de colonne"
                value={input}
                style={{ marginTop: "1rem", marginRight: "1rem" }}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
              <Button
                icon="pi pi-trash"
                severity="warning"
                onClick={() => handleRemoveInput(index)}
                style={{ marginTop: "1rem" }}
              />
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}>
            <Button
              icon="pi pi-plus"
              label="Ajouter colonne"
              onClick={handleAddInput}
            />
          </div>
        </div>
        
        )}
        <h5>Attribution des prospecteurs</h5>
        <div className="card p-fluid">
          <span className="p-float-label">
            <Autocomplete
              multiple
              options={prospecteurs}
              getOptionLabel={(option) => option.nomUtilisateur}
              value={selectedProspecteurs}
              onChange={handleProspecteurChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    style: {
                      fontFamily: "var(--font-family)",
                      fontSize: "1rem",
                      color: "#495057",
                      background: "#ffffff",
                      padding: "0.5rem",
                      border: "1px solid #ced4da",
                      transition:
                        "background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s",
                      borderRadius: "3px",
                      width: "100%",
                    },
                    "&:onFocus": {
                      ...params.InputProps.onFocus,
                      boxShadow: "0 0 0 0.2rem rgba(0, 123, 255, 0.25)",
                    },
                    "&:hover": {
                      boxShadow: "0 0 0 0.2rem rgba(0, 123, 255, 0.25)",
                      backgroundColor: "#cce5ff",
                    },
                  }}
                  placeholder="Nom d'utilisateur"
                />
              )}
            />
          </span>
        </div>
      </Card>
      {questionCards.map((card) => (
        <React.Fragment key={card.props.index}>{card}</React.Fragment>
      ))}

      <div className="card flex flex-wrap justify-content-center gap-3">
        <Button
          label="Ajouter question"
          icon="pi pi-plus"
          loading={loading}
          onClick={load}
          style={{ marginTop: "1rem" }}
        />

        <Button
          label="Créer le projet"
          icon="pi pi-save"
          severity="success"
          style={{ marginTop: "1rem", marginLeft: "1rem" }}
          onClick={handleCreateProject}
        />
      </div>
      <Toast ref={toast} />
    </div>
  );
};

export default MyForm;
