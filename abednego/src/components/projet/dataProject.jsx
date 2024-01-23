import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import EditSidebar from "../users/modificationSideBar";

const ip = process.env.REACT_APP_IP;

const headCells = [
  { id: "matricule", label: "N° matricule" },
  { id: "nom", label: "Nom" },
  { id: "username", label: "Nom d'Utilisateur" },
  { id: "mail", label: "Mail" },
  { id: "phone", label: "Telephone" },
  { id: "payement", label: "Payement" },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) =>
    onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all users" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, onDeleteClick, onEditClick, onSearch } = props;
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Gestion des membres
        </Typography>
      )}

      {numSelected > 0 ? (
        <div style={{ display: "flex" }}>
          <Tooltip title="Edit">
            <IconButton onClick={onEditClick}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={onDeleteClick}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      ) : (
        <Tooltip title="Filter list">         
        </Tooltip>
      )}

      <span className="p-input-icon-left">
        <i className="pi pi-search" />

        <InputText
          type="search"
          placeholder="Rechercher..."
          value={searchValue}
          onChange={handleSearchChange}
        />
      </span>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function EnhancedTable() {
  const [prospecteurs, setProspecteurs] = useState([]);

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("matricule");
  const [selected, setSelected] = React.useState([]);
  const [editSidebarVisible, setEditSidebarVisible] = useState(false);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchValue, setSearchValue] = useState("");
  const toast = useRef(null);

  const [selectedProspecteur, setSelectedProspecteur] = useState(null);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    setSelected([]);
  };

  const handleEditSidebarHide = () => {
    setEditSidebarVisible(false);
    setSelectedProspecteur(null);
  };

  const handleSaveProspecteur = (editedProspecteur) => {
    // Mettez à jour les données dans votre état prospecteurs
    // Ajoutez la logique pour sauvegarder les modifications
    // Vous pouvez utiliser axios ou tout autre moyen pour envoyer les modifications au serveur
    const updatedProspecteurs = prospecteurs.map((p) =>
      p.id === editedProspecteur.id ? editedProspecteur : p
    );
    setProspecteurs(updatedProspecteurs);
  };

  const handleEditClick = () => {
    if (selected.length === 1) {
      const selectedProspecteur = prospecteurs.find(
        (p) => p.id === selected[0]
      );
      setEditSidebarVisible(true);
      setSelectedProspecteur(selectedProspecteur);
    } else {
      console.warn("Sélectionnez une seule ligne pour l'édition.");
    }
  };

  const showSuccess = () => {
    toast.current.show({
      severity: "success",
      summary: "Suppression effectué",
      detail: "Le prospecteur a bien été supprimer",
      sticky: true,
    });
  };

  const showError = () => {
    toast.current.show({
      severity: "error",
      summary: "Erreur",
      detail: "Erreur de suppression du prospecteur",
      life: 3000,
    });
  };

  const showExistant = () => {
    toast.current.show({
      severity: "error",
      summary: "Ustilisateur non existant",
      detail: "L'utilisateur n'existe pas",
      life: 3000,
    });
  };

  const handleDeleteClick = async () => {
    if (selected.length > 0) {
      const selectedProspecteurs = selected.map((id) =>
        prospecteurs.find((p) => p.id === id)
      );
      console.log(
        "Informations sur les lignes sélectionnées pour la suppression :",
        selectedProspecteurs
      );

      let id = selectedProspecteurs[0].id;
      console.log(id);

      const url = `${ip}suppression-prospector`;
      const headers = { "Content-Type": "application/json" };

      const dataIns = {
        id: id,
      };

      const confirmAndSendData = async () => {
        const userConfirmed = window.confirm(
          "Voulez-vous vraiment effectuer cette action ?"
        );

        if (userConfirmed) {
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
            if (error.response && error.response.status === 409) {
              console.log("Conflict detected in catch block");
              showExistant();
            } else if (error.response && error.response.status === 500) {
              console.error("Server error in catch block");
              showError();
            }
          }
        } else {
          console.log("Action annulée par l'utilisateur");
        }
      };
      confirmAndSendData();
    } else {
      console.warn("Aucune ligne sélectionnée pour la suppression.");
    }
  };

  const handleClick = (event, id) => {
    const isAlreadySelected = selected.includes(id);

    if (isAlreadySelected) {
      setSelected([]);
    } else {
      setSelected([id]);
    }

    // const prospecteur = prospecteurs.find((p) => p.id === id);
    // console.log("Informations sur la ligne sélectionnée :", prospecteur);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - prospecteurs.length) : 0;
  const visibleRows = React.useMemo(() => {
    const filteredProspecteurs = stableSort(
      prospecteurs,
      getComparator(order, orderBy)
    ).filter((prospecteur) => {
      const searchLower = searchValue.toLowerCase();
      const usernameMatch = prospecteur.nomUtilisateur
        .toLowerCase()
        .includes(searchLower);
      const mailMatch = prospecteur.mail.toLowerCase().includes(searchLower);
      const phoneMatch = prospecteur.telephone.toLowerCase().includes(searchLower);
      const nomMatch = prospecteur.nom.toLowerCase().includes(searchLower);
      const matriculeMatch = prospecteur.matricule.toLowerCase().includes(searchLower);
    

      // Utilisez une logique OR pour inclure les lignes correspondant à l'un des critères
      return (
        usernameMatch || mailMatch || phoneMatch || nomMatch || matriculeMatch
      );
    });

    return filteredProspecteurs.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [order, orderBy, page, rowsPerPage, prospecteurs, searchValue]);

  useEffect(() => {
    const fetchProspecteur = async () => {
      try {
        const cachedToken = sessionStorage.getItem("token");

        if (cachedToken) {
          const headers = { Authorization: `Bearer ${cachedToken}` };
          const response = await axios.get(
            `${ip}all-member/${cachedToken}`,
            { headers }
          );

          if (response.status === 200) {
            setProspecteurs(response.data);
          } else {
            throw new Error("Failed to load data");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchProspecteur();
  }, [prospecteurs]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onSearch={setSearchValue}
        />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} size={dense ? "small" : "medium"}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={prospecteurs.length}
            />
            <TableBody>
              {visibleRows.map((prospecteur, index) => {
                const isItemSelected = isSelected(prospecteur.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, prospecteur.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={prospecteur.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell align="left">{prospecteur.matricule}</TableCell>
                    <TableCell align="left">{prospecteur.nom}</TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="normal"
                    >
                      {prospecteur.nomUtilisateur}
                    </TableCell>
                    <TableCell align="left">{prospecteur.mail}</TableCell>
                    <TableCell align="left">{prospecteur.telephone}</TableCell>
                    <TableCell align="left">{prospecteur.payement}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={prospecteurs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Densité des lignes"
      />
      <Toast ref={toast} />
      <EditSidebar
        visible={editSidebarVisible}
        onHide={handleEditSidebarHide}
        selectedProspecteur={selectedProspecteur}
        onSave={handleSaveProspecteur}
      />
    </Box>
  );
}
