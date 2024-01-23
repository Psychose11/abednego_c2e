import React, { useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const ProspectionForm = () => {
  const [formData, setFormData] = useState({
    fields: [
      { id: 1, label: "Raison Sociale", name: "raisonSociale", value: "" },
      { id: 2, label: "Nom du Propriétaire", name: "nomProprio", value: "" },
      { id: 3, label: "Adresse du Local", name: "adresseLocal", value: "" },
      {
        id: 4,
        label: "Numéro de Téléphone",
        name: "numeroTelephone",
        value: "",
      },
    ],
  });

  const [newFieldName, setNewFieldName] = useState("");
  const [displayDialog, setDisplayDialog] = useState(false);

  const handleChange = (id, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      fields: prevFormData.fields.map((field) =>
        field.id === id ? { ...field, value } : field
      ),
    }));
  };

  const handleAddField = () => {
    setDisplayDialog(true);
  };

  const handleDialogSubmit = () => {
    const newField = {
      id: formData.fields.length + 1,
      label: newFieldName,
      name: `champ${formData.fields.length + 1}`,
      value: "",
    };

    setFormData((prevFormData) => ({
      ...prevFormData,
      fields: [...prevFormData.fields, newField],
    }));

    setDisplayDialog(false);
    setNewFieldName("");
  };

  const handleRemoveField = (id) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      fields: prevFormData.fields.filter((field) => field.id !== id),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données du formulaire:", formData.fields);
  };

  return (
    <Card title="Formulaire de Prospection">
      <form onSubmit={handleSubmit}>
        <div className="p-fluid p-formgrid p-grid">
          {formData.fields.map((field) => (
            <div key={field.id} className="p-field p-col-12 p-md-6">
              <label htmlFor={field.name}>{field.label}</label>
              <div className="p-inputgroup">
                <InputText
                  id={field.name}
                  name={field.name}
                  value={field.value}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
                {field.id > 4 && (
                  <Button
                    type="button"
                    icon="pi pi-times"
                    className="p-button-danger"
                    onClick={() => handleRemoveField(field.id)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-field p-col-12" style={{ paddingTop: "20px" }}>
          <div style={{ marginBottom: "10px" }}>
            <Button
              type="button"
              label="Ajouter Champ"
              onClick={handleAddField}
            />
          </div>
          <div>
            <Button type="submit" label="Soumettre" />
          </div>
        </div>

        <Dialog
          visible={displayDialog}
          onHide={() => setDisplayDialog(false)}
          header="Ajouter un Champ"
        >
          <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-col-12">
              <label htmlFor="newFieldName">Nom du Champ</label>
              <InputText
                id="newFieldName"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
              />
            </div>
          </div>
          <div className="p-dialog-footer" style={{ marginTop: "20px" }}>
            <Button label="Annuler" onClick={() => setDisplayDialog(false)} />
            <Button label="Ajouter" onClick={handleDialogSubmit} />
          </div>
        </Dialog>
      </form>
    </Card>
  );
};

export default ProspectionForm;
