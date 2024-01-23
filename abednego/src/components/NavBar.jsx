import React, { useState } from 'react';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { PanelMenu } from 'primereact/panelmenu';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from 'primereact/sidebar';
import Image from '../assets/abednego.png';
import AddUserForm from '../components/users/formAddUser';
import CustomUpload from '../components/prospection/import';

export default function ProspectingMenu() {
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [visible3, setVisible3] = useState(false);

  const handleItemClick = (item) => {
    if (item.to) {
      navigate(item.to);
    }

    if (item.onclick) {
      item.onclick();
    }
    if (item.command) {
      item.command();
    }
  };

  const processItems = (items) => {
    return items.map((item) => ({
      ...item,
      command: () => handleItemClick(item),
      items: item.items && processItems(item.items),
    }));
  };

  const items = [
    {
      label: 'Dashboard',
      icon: 'pi pi-fw pi-home',
      to: '/default',
    },
    {
      label: 'Membre(s)',
      icon: 'pi pi-fw pi-file',
      items: [
        {
          label: 'Liste des membres',
          icon: 'pi pi-fw pi-table',
          to: '/client-global',
        },
        {
          label: 'Nouveau membre',
          icon: 'pi pi-fw pi-plus',
          command: () => {
            setVisible3(true);
          },
        },
      ],
    },
    {
      label: 'Staff',
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'Liste du staff',
          icon: 'pi pi-fw pi-table',
          to: '/users',
        },
        {
          label: 'Nouveau staff',
          icon: 'pi pi-fw pi-plus',
          command: () => {
            setVisible(true);
          },
        },
      ],
    },
    {
      label: 'Tutos',
      icon: 'pi pi-fw pi-list',
      to: '/tasks',
    },
    {
      label: 'Effectués',
      icon: 'pi pi-fw pi-check',
      to: '/reports',
    },
  ];

  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/4">
        <img src={Image} alt="abednego" width="150" height="150" />
      </div>
      <div className="md:w-3/4">
        <PanelMenu model={processItems(items)} />
      </div>
      <div className="md:w-full">
        <Sidebar visible={visible} position="right" onHide={() => setVisible(false)}>
          
          <AddUserForm />
        </Sidebar>
        <Sidebar visible={visible3} position="right" onHide={() => setVisible3(false)}>
          
          <CustomUpload />
        </Sidebar>
      </div>
    </div>
  );
}
