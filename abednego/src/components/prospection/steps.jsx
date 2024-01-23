import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const steps = [
  "Statut de l'appel",
  "Concernant l'interlocuteur",
  "Concernant l'objectif",
  "Finalités",
  "Nouvelle Étape", // Ajout d'une nouvelle étape
  "Résumé", // Ajout de l'étape de résumé
];

const questions = [
  "Quel est le statut de l'appel ?",
  "Qui est l'interlocuteur principal ?",
  "Quel est l'objectif principal de la prospection ?",
  "Quelles sont les finalités de la prospection ?",
  "Une nouvelle question ?", // Ajout d'une nouvelle question
  "Résumé des réponses", // Ajout de la question de résumé
];

const options = [
  ["En cours", "Terminé", "Non atteint"],
  ["Responsable des achats", "Responsable marketing", "Autre"],
  ["Nouvelle vente", "Renouvellement de contrat", "Prise de rendez-vous"],
  ["Acquérir de nouveaux clients", "Fidéliser les clients actuels", "Autre"],
  ["Option 1", "Option 2", "Option 3"], // Options pour la nouvelle question
  [], // Aucune option pour le résumé
];

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [answers, setAnswers] = React.useState(Array(steps.length).fill(''));
  const [confirmation, setConfirmation] = React.useState(false);

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
    setAnswers(Array(steps.length).fill(''));
    setConfirmation(false);
  };

  const handleAnswerChange = (event) => {
    const newAnswers = [...answers];
    newAnswers[activeStep] = event.target.value;
    setAnswers(newAnswers);
  };

  const handleFinish = () => {
    console.log('Réponses finales:', answers);
    setConfirmation(true);
  };

  const progressionText = `${activeStep + 1}/${steps.length}`;

  return (
 

    <Box sx={{ width: '90%', minHeight: '500px'}}> 
      <Stepper activeStep={activeStep} alternativeLabel>
        <Step key={steps[activeStep]}>
          <StepLabel>
            <Typography variant="subtitle1">
              {`${steps[activeStep]} ${progressionText}`}
            </Typography>
          </StepLabel>
        </Step>
      </Stepper>
      {activeStep === steps.length - 1 ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            {confirmation
              ? 'Réponses confirmées'
              : 'Réponses non confirmées'}
          </Typography>
          {confirmation ? (
            <ToggleButtonGroup
              value={confirmation}
              exclusive
              onChange={() => handleReset()}
            >
              <ToggleButton value={true}>J'approuve</ToggleButton>
              <ToggleButton value={false}>Je rejette</ToggleButton>
            </ToggleButtonGroup>
          ) : (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                Résumé des réponses :
              </Typography>
              {answers.map((answer, index) => (
                <Typography key={index} sx={{ mt: 1, mb: 1 }}>
                  {questions[index]} : {answer}
                </Typography>
              ))}
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleReset} sx={{ ml: 1 }}>
                  Annuler
                </Button>
                <Button onClick={handleFinish} sx={{ ml: 1 }}>
                  Valider
                </Button>
                
              </Box>
            </React.Fragment>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            {questions[activeStep]}
          </Typography>
          <RadioGroup
            name={`question-${activeStep}`}
            value={answers[activeStep]}
            onChange={(e) => handleAnswerChange(e)}
          >
            {options[activeStep].map((option, index) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Retour
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Passer
              </Button>
            )}

            <Button onClick={handleNext} sx={{ mr: 1 }}>
              Suivant
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  
  );
}
