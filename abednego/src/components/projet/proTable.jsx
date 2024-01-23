import * as React from "react";
import { Dialog } from 'primereact/dialog';
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
import { Menu } from "primereact/menu";
import { visuallyHidden } from "@mui/utils";
import { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from 'primereact/fileupload';
import { InputText } from "primereact/inputtext";
import axios from "axios";


const ip = process.env.REACT_APP_IP;

const QuestionnaireDialog = ({ projectId, visible, onHide }) => {
  const [projectData, setProjectData] = useState(null);
  const [head, setHead] = useState([]);
  const [dense, setDense] = React.useState(false);
  const [pro, setPro] = useState([]);
  const [projetInfo, setProjetInfo] = useState([]);
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [id, setId] = useState();

  const [selectedFile, setSelectedFile] = useState(null);
  const onSelectFile = (e) => {
    const file = e.files[0];
    if (file) {
      setSelectedFile(file);
      console.log("Fichier sélectionné :", file.name);
    }
  };

  const envoyerFichierVersBackend = async () => {
    console.log("id du projet", id);

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('projectId', id);

      try {
        const response = await axios.post(`${ip}upload-file`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Réponse du backend:', response.data);
      } catch (erreur) {
        console.error('Erreur lors de l\'envoi du fichier vers le backend :', erreur);
      }
    }
  };

  useEffect(() => {
    const fetchProjet = async () => {
      try {
        const headers = { Authorization: `Bearer ${id}` };
        const response = await axios.get(`${ip}get-the-pro-data/${id}`, {
          headers,
        });
        if (response.status === 200) {
          setPro(response.data);
        } else {
          throw new Error("Failed to load data");
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchProjet();
  }, [visible, projectId]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const cachedToken = sessionStorage.getItem("token");
        if (cachedToken) {
          const headers = { Authorization: `Bearer ${cachedToken}` };
          const response = await axios.get(
            `${ip}cibled-question-project/${cachedToken}/${projectId}`,
            { headers }
          );

          // Vérifiez si la réponse est réussie et contient les noms de colonnes
          if (response.status === 200 && response.data && response.data.columnNames) {
            setHead(response.data.columnNames);
          } else {
            console.error("Erreur lors de la récupération des noms de colonnes.");
          }
        }
      } catch (error) {
      }
      const response = await fetch(`votre/endpoint/${projectId}`);
      const data = await response.json();
      setProjectData(data);
    };
    if (projectId) {
      fetchQuestion();
      console.log(head);
      setId(projectId);
    }
  }, [visible, projectId]);

  useEffect(() => {
    const fetchProjetInfo = async () => {
      try {
        const headers = { Authorization: `Bearer ${id}` };
        const response = await axios.get(`${ip}get-project-info/${id}`, {
          headers,
        });
        if (response.status === 200) {
          setProjetInfo(response.data);
        } else {
          throw new Error("Failed to load data");
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchProjetInfo();
  }, [visible, projectId]);
  

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = pro.map((n) => n.idPro);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSelect = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  function EnhancedTableHead(props) {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort,
      head,
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
          {head.map((headCell) => (
            <TableCell
              key={headCell}
              align="left"
              padding="normal"
              sortDirection={orderBy === headCell ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell}
                direction={orderBy === headCell ? order : "asc"}
                onClick={createSortHandler(headCell)}
              >
                {headCell}
                {orderBy === headCell ? (
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
          <Tooltip title="Import pro">
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
  function EnhancedTableBody(props) {
    const { pro, numSelected, onSelect, order, orderBy, dense, page, rowsPerPage } = props;
  
    const isSelected = (id) => numSelected.indexOf(id) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, pro.length - page * rowsPerPage);
  
    return (
      <TableBody>
        {pro
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => {
            const isItemSelected = isSelected(row.idPro);
  
            return (
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
                key={row.idPro}
                selected={isItemSelected}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={isItemSelected}
                    onChange={(e) => onSelect(e, row.idPro)}
                  />
                </TableCell>
                {head.map((headCell) => (
                  <TableCell key={headCell} align="left">
                    {row[headCell]}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        {emptyRows > 0 && (
          <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
            <TableCell colSpan={6} />
          </TableRow>
        )}
      </TableBody>
    );
  }
  
  return (
    <Dialog
      header="Liste des Pro"
      visible={visible}
      maximizable
      style={{ width: '80vw' }}
      onHide={onHide}
    >

      <div>
        <FileUpload
          mode="basic"
          name="demo[]"
          accept=".xlsx, .xls"
          maxFileSize={1000000}
          onSelect={onSelectFile}
          style={{ paddingBottom: "0.01em" }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1em' }}>
          <Button label="Update" icon="pi pi-upload" onClick={() => envoyerFichierVersBackend(projectId)} severity="success"/>
        </div>
      </div>

      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            onDeleteClick={() => console.log("Delete Clicked")} // Add your delete function here
            onEditClick={() => console.log("Edit Clicked")} // Add your edit function here
            onSearch={(value) => console.log("Search Query: ", value)} // Add your search function here
          />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} size={dense ? "small" : "medium"} stickyHeader>
              <EnhancedTableHead
                head={head}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
              />
              <EnhancedTableBody
                pro={pro}
                numSelected={selected}
                onSelect={handleSelect}
                order={order}
                orderBy={orderBy}
                dense={dense}
                page={page}
                rowsPerPage={rowsPerPage}
              />
            </Table>
          </TableContainer>
          <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={pro.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          
        </Paper>
      </Box>

    </Dialog>
  );
};

export default QuestionnaireDialog;
