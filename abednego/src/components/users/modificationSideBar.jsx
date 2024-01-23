import React, { useState, useEffect,useRef } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import { InputText } from 'primereact/inputtext';
import formatPhoneNumber from '../NumberFormat';
import axios from "axios";

const ip = process.env.REACT_APP_IP;


export default function EditSidebar({ visible, onHide, selectedProspecteur, onSave }) {
    const [editedProspecteur, setEditedProspecteur] = useState(selectedProspecteur || {});

    useEffect(() => {
        // Vérifiez si selectedProspecteur est défini avant de mettre à jour l'état
        if (selectedProspecteur) {
            setEditedProspecteur(selectedProspecteur);
        }
    }, [selectedProspecteur]);

    const handleInputChange = (e, field) => {
        setEditedProspecteur((prevProspecteur) => ({
            ...prevProspecteur,
            [field]: e.target.value,
        }));
    };

    const toast = useRef(null);

    const showSuccess = () => {
        toast.current.show({
          severity: "success",
          summary: "Modification effectué",
          detail: "les modifications ont bien été effectués",
          sticky: true,
        });
      };
      const showExistant = () => {
        toast.current.show({
          severity: "error",
          summary: "Ustilisateur Existant",
          detail: "Certains des informations existent déjà notamment des noms d'utilisateurs des mails ou des numero de téléphone",
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

     
      const sleep = ms => new Promise(r => setTimeout(r, ms));
    const handleSaveClick = async () => {
        
        let id = editedProspecteur.id;
        let nom = editedProspecteur.nom;
        let prenom = editedProspecteur.prenom;
        let username = editedProspecteur.nomUtilisateur;
        let password = editedProspecteur.motDepasse; 
        let mail = editedProspecteur.mail;
        let phone = editedProspecteur.phone;

        const dataIns = {
            id:id,
            nom: nom,
            prenom: prenom,
            username: username,
            phone: formatPhoneNumber(phone),
            password: password,
            mail: mail,
          };

          const url = `${ip}modification-prospector`;
          const headers = { "Content-Type": "application/json" };

          try {
            const response = await axios.post(url, dataIns, { headers });
    
            if (response.status === 200) {
              console.log("Data sent successfully");
              showSuccess();
              await sleep(1000);
              onSave(editedProspecteur);
              onHide();
            } 
           
            else {
              console.error("Failed to send data"); 
            }
          } catch (error) {
            if (error.response && error.response.status === 409) {
                console.log("Conflict detected in catch block");
                showExistant(); 
            } else if (error.response && error.response.status === 500) {
                console.error("Server error in catch block");
                showError();;
            }
          }

    };

   

    return (
        <Sidebar visible={visible} onHide={onHide} position="right" style={{ backgroundColor: 'white' }}>
            {selectedProspecteur && (
                <div style={{ padding: '24px', maxWidth: '400px' }}>
                <h3>Modifier d'un Prospecteur</h3>
                <div className="p-fluid">
                    <div className="p-field" style={{ marginBottom: '16px' }}>
                        <label htmlFor="nomUtilisateur">Nom d'Utilisateur:</label>
                        <InputText
                            id="nomUtilisateur"
                            value={editedProspecteur.nomUtilisateur || ''}
                            onChange={(e) => handleInputChange(e, 'nomUtilisateur')}
                        />
                    </div>
            
                    <div className="p-field" style={{ marginBottom: '16px' }}>
                        <label htmlFor="motDepasse">Mot de passe:</label>
                        <InputText
                            id="motDepasse"
                            value={editedProspecteur.motDepasse || ''}
                            onChange={(e) => handleInputChange(e, 'motDepasse')}
                        />
                    </div>
            
                    <div className="p-field" style={{ marginBottom: '16px' }}>
                        <label htmlFor="mail">Mail:</label>
                        <InputText
                            id="mail"
                            value={editedProspecteur.mail || ''}
                            onChange={(e) => handleInputChange(e, 'mail')}
                        />
                    </div>
            
                    <div className="p-field" style={{ marginBottom: '16px' }}>
                        <label htmlFor="phone">Téléphone:</label>
                        <InputText
                            id="phone"
                            value={editedProspecteur.phone || ''}
                            onChange={(e) => handleInputChange(e, 'phone')}
                        />
                    </div>
            
                    <div className="p-field" style={{ marginBottom: '16px' }}>
                        <label htmlFor="nom">Nom:</label>
                        <InputText
                            id="nom"
                            value={editedProspecteur.nom || ''}
                            onChange={(e) => handleInputChange(e, 'nom')}
                        />
                    </div>
            
                    <div className="p-field" style={{ marginBottom: '16px' }}>
                        <label htmlFor="prenom">Prénom:</label>
                        <InputText
                            id="prenom"
                            value={editedProspecteur.prenom || ''}
                            onChange={(e) => handleInputChange(e, 'prenom')}
                        />
                    </div>
            
                    <div className="p-field">
                        <Button label="Save" onClick={handleSaveClick} />
                        
                    </div>
                </div>
            </div>
            
            
            )}
            <Toast ref={toast} />
        </Sidebar>
    );
}
