import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// Styled DataGrid component
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-cell': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: '#D3D3D3',
    color: '#000000',
  },
}));


// Main PtGrid component
export default function PtGrid() {
  const [rows, setRows] = React.useState(initialRows);
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 5,
    page: 0
  });
  const [isEditable, setIsEditable] = React.useState(true);


  // Custom cell renderer for the UpperLimit column
  const CustomCell = React.forwardRef((params, ref) => {
    const [textValue, setTextValue] = React.useState(params.value || '');
    const [dropdownValue, setDropdownValue] = React.useState('');
  
    const handleTextChange = (event) => {
      if (isEditable) { // Check if the grid is editable
        const input = event.target;
        const newValue = input.value;
        const cursorPosition = input.selectionStart;
  
        if (!isNaN(newValue) && newValue.indexOf('.') === -1) {
          input.value = `${newValue}.00`;
          input.selectionStart = cursorPosition;
          input.selectionEnd = cursorPosition;
        }
  
        setTextValue(input.value);
        params.api.setEditCellValue({ id: params.id, field: params.field, value: input.value });
        // Update the rows state
        params.api.updateRows([{ id: params.id, UpperLimit: input.value }]);
      }
    };
  
    const handleDropdownChange = (event) => {
      if (isEditable) { // Check if the grid is editable
        const selectedValue = event.target.value;
        if (selectedValue === 'Upwards') {
          setTextValue('Upwards');
          params.api.setEditCellValue({ id: params.id, field: params.field, value: 'Upwards' });
          // Update the rows state
          params.api.updateRows([{ id: params.id, UpperLimit: 'Upwards' }]);
        }
        setDropdownValue(''); // Reset dropdown value to empty
      }
    };
  
    return (
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <TextField
          value={textValue}
          onChange={handleTextChange}
          variant="standard"
          size="small"
          style={{ flex: 1, marginRight: 8 }}
          ref={ref}
          disabled={!isEditable} // Disable the TextField if the grid is not editable
        />
        <Select
          value={dropdownValue}
          onChange={handleDropdownChange}
          size="small"
          style={{ width: 30, height: 30 }}
          disabled={!isEditable} // Disable the Select if the grid is not editable
        >
          <MenuItem value="Upwards">Upwards</MenuItem>
        </Select>
      </div>
    );
  });
  
  const AnnualBasisCell = React.forwardRef((params, ref) => {
    const [textValue, setTextValue] = React.useState(params.value || '');
  
    const handleTextChange = (event) => {
      if (isEditable) { // Check if the grid is editable
        const input = event.target;
        const newValue = input.value;
        const cursorPosition = input.selectionStart;
  
        if (!isNaN(newValue) && newValue.indexOf('.') === -1) {
          input.value = `${newValue}.00`;
          input.selectionStart = cursorPosition;
          input.selectionEnd = cursorPosition;
        }
  
        setTextValue(input.value);
        params.api.setEditCellValue({ id: params.id, field: params.field, value: input.value });
        // Update the rows state
        params.api.updateRows([{ id: params.id, AnnualBasis: input.value }]);
      }
    };
  
    return (
      <TextField
        value={textValue}
        onChange={handleTextChange}
        variant="standard"
        size="small"
        style={{ width: '100%' }}
        ref={ref}
        disabled={!isEditable} // Disable the TextField if the grid is not editable
      />
    );
  });

  // Handle row updates
  const handleProcessRowUpdate = React.useCallback((newRow) => {
    const updatedRows = rows.map((row) => {
      if (row.id === newRow.id) {
        return { ...row, ...newRow }; // Update the entire row object
      }
      return row;
    });
    setRows(updatedRows);
    return newRow;
  }, [rows]);

  const addRow = () => {
    // Find the previous row
    const previousRow = rows[rows.length - 1];
  
    // Calculate the new LowerLimit
    let newLowerLimit = '';
    if (previousRow && previousRow.UpperLimit) {
      // Convert UpperLimit to a number and add 1
      const upperLimitValue = parseFloat(previousRow.UpperLimit);
      if (!isNaN(upperLimitValue)) {
        newLowerLimit = (upperLimitValue + 1).toFixed(2);
      }
    }
  
    // Log the previous row details
    console.log('Previous Row:', previousRow);
  
    // Create the new row
    const newRow = {
      id: rows.length + 1,
      LowerLimit: newLowerLimit,
      UpperLimit: '',
      AnnualBasis: '',
      HalfYearly: '',
      MonthlyAmount: ''
    };
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const handleSave = () => {
    const filledRows = rows.filter((row) => Object.values(row).some((value) => value !== ''));
    console.log("Filled rows:", filledRows);
    setIsEditable(false); // Update the editability state to false
  };

  const handleEdit = () => {
    setIsEditable(true);
  }
  
  const handleDelete = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };
  
  
  const columns = [
    {
      field: 'LowerLimit', 
      headerName: 'Lower Limit (Rs.)', 
      flex: 1, 
      minWidth: 150, 
      editable: isEditable, 
      headerAlign: 'center', 
      align: 'center',
      renderCell: (params) => {
        const formattedValue = parseFloat(params.value).toFixed(2);
        return <div>{formattedValue}</div>;
      }
    },
    { 
      field: 'UpperLimit', 
      headerName: 'Upper Limit (Rs.)', 
      flex: 1, 
      minWidth: 150, 
      editable: false, 
      headerAlign: 'center', 
      align: 'center',
      renderCell: (params) => <CustomCell {...params} />,
    },
    { 
      field: 'AnnualBasis', 
      headerName: 'Annual Basis', 
      flex: 1, 
      minWidth: 150, 
      editable: false, 
      headerAlign: 'center', 
      align: 'center',
      renderCell: (params) => <AnnualBasisCell {...params} />,
    },
    { 
      field: 'HalfYearly', 
      headerName: 'Half Yearly', 
      flex: 1, 
      minWidth: 120, 
      editable: isEditable, 
      headerAlign: 'center', 
      align: 'center' 
    },
    { 
      field: 'MonthlyAmount', 
      headerName: 'Monthly Amount', 
      flex: 1, 
      minWidth: 120, 
      editable: isEditable, 
      headerAlign: 'center', 
      align: 'center' 
    },
    {
      field: 'actions',
      headerName: '',
      flex: 0.2,
      minWidth: 40,
      renderCell: (params) => (
        <IconButton
          variant="outlined"
          color="error"
          size="small"
          onClick={() => handleDelete(params.id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
      headerAlign: 'center',
      align: 'center',
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 200, width: '100%' }}>
      <div style={{ flex: 1 }}>
        <StyledDataGrid
          rows={rows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25]}
          autoHeight
          processRowUpdate={handleProcessRowUpdate} // Update rows when edited
        />
      </div>
      <div style={{ marginTop: 5, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ marginRight: 8 }}
          onClick={addRow}
        >
          Add Row
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          style={{ marginRight: 8 }}
          onClick={handleSave}
        >
          Save
        </Button>
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={handleEdit}
        >
          Edit
        </Button>
      </div>
    </div>
  );
}

// Initial rows
const initialRows = [
  { id: 1, LowerLimit: '0.00', UpperLimit: '', AnnualBasis: '', HalfYearly: '', MonthlyAmount: '' },
];
