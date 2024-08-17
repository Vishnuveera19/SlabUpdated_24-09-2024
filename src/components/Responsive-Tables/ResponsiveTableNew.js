import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { TextField } from '@mui/material';
import { format, addMinutes } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { PAYMCATEGORY } from '../../serverconfiguration/controllers';


// Utility function to create a Date object with specific time
const createDateWithTime = (hours, minutes) => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// TimePicker cell component
const TimePickerCell = ({ value, onChange, disabled }) => {
  const [internalValue, setInternalValue] = useState(value || createDateWithTime(0, 0));

  const handleChange = (newValue) => {
    setInternalValue(newValue);
    onChange(newValue); // Notify parent of the change
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
        value={internalValue}
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} variant="standard" />}
        ampm={false}
        views={['hours', 'minutes']}
        inputFormat="HH:mm"
        mask="__:__"
        sx={{ width: '100%' }}
        disabled={disabled}
      />
    </LocalizationProvider>
  );
};

const StyledDataGrid = styled(DataGrid)({
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: '#D3D3D3',
    color: '#000000',
  },
  '& .MuiDataGrid-cell:focus': {
    outline: 'none', // Remove the default focus outline
  },
  '& .MuiDataGrid-columnHeader:focus': {
    outline: 'none', // Remove the default focus outline for column headers
  },
  '& .MuiDataGrid-cell': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    '&:focus': {
      outline: 'none',
    }
  },
  '& .MuiDataGrid-cell:focus-within': {
    outline: 'none',
  }
});

const initialRows = [
  { id: 1, otFromDuration: createDateWithTime(0, 0), otToDuration: createDateWithTime(0, 0), otHours: "", otRate: "" },
];

export default function OverTimeGrid() {
  const [rows, setRows] = useState(initialRows);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0
  });
  const [isEditable, setIsEditable] = useState(true);
  const[Category, setcategory] = useState([])
  
  useEffect(() => {
    async function getData() {
      const data = await getRequest(ServerConfig.url, PAYMCATEGORY);
      setcategory(data.data);
     
    }
    getData();
  }, []);

  // Handler for updating a row's value
  const handleRowUpdate = (id, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
    console.log('Updated Rows:', rows); // Ensure rows state is updated
  };
  

  // Handler to add a new row
  const addRow = () => {
    // Ensure there is at least one row before accessing lastRow
    const lastRow = rows.length > 0 ? rows[rows.length - 1] : null;
    
    // If lastRow is null (no rows), set otFromDuration to a default value
    const newOtFromDuration = lastRow ? addMinutes(lastRow.otToDuration, 1) : createDateWithTime(0, 0);
  
    const newRow = {
      id: rows.length + 1,
      otFromDuration: newOtFromDuration,
      otToDuration: createDateWithTime(0, 0),
      otHours: "",
      otRate: ""
    };
  
    setRows([...rows, newRow]);
  };

  const saveData = () => {
    console.log('Data saved:', rows.map(row => ({
      ...row,
      otFromDuration: format(row.otFromDuration, 'HH:mm'),
      otToDuration: format(row.otToDuration, 'HH:mm')
    })));
    setIsEditable(false);
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleDeleteRow = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    
    // Only update otFromDuration if there are remaining rows
    const updatedRowsWithNewDurations = updatedRows.map((row, index) => {
      if (index > 0) {
        const prevRow = updatedRows[index - 1];
        return {
          ...row,
          otFromDuration: addMinutes(prevRow.otToDuration, 1),
        };
      }
      return row;
    });
    
    setRows(updatedRowsWithNewDurations);
  };

  const columns = [
    {
      field: 'otFromDuration',
      headerName: 'OT From Duration',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <TimePickerCell
          value={params.value}
          onChange={(newValue) => {
            handleRowUpdate(params.id, 'otFromDuration', newValue);
          }}
          disabled={!isEditable}
        />
      ),
      headerAlign: 'center',
      align: 'center',
      editable: false
    },
    {
      field: 'otToDuration',
      headerName: 'OT To Duration',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <TimePickerCell
          value={params.value}
          onChange={(newValue) => {
            handleRowUpdate(params.id, 'otToDuration', newValue);
          }}
          disabled={!isEditable}
        />
      ),
      headerAlign: 'center',
      align: 'center',
      editable: false
    },
    {
      field: 'otHours',
      headerName: 'OT Hours',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <TimePickerCell
          value={params.value}
          onChange={(newValue) => {
            handleRowUpdate(params.id, 'otHours', newValue);
          }}
          disabled={!isEditable}
        />
      ),
      headerAlign: 'center',
      align: 'center',
      editable: false
    },
    {
      field: 'otRate',
      headerName: 'OT Rate',
      flex: 1,
      type: 'singleSelect',
      valueOptions: ["1.0", "1.5", "2.0", "2.5", "3.0", "3.5"],
      minWidth: 120,
      editable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <TextField
        select
        value={params.value || ''}
        onChange={(event) => {
          handleRowUpdate(params.id, 'otRate', event.target.value);
        }}
        disabled={!isEditable}
        SelectProps={{
          native: true,
        }}
      >
        <option value="" disabled>Select rate</option> 
        {["1.0", "1.5", "2.0", "2.5", "3.0", "3.5"].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </TextField>
      ),
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
          onClick={() => handleDeleteRow(params.id)}
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
          processRowUpdate={(newRow) => {
            console.log('Row being updated:', newRow);
            handleRowUpdate(newRow.id, newRow.field, newRow.value);
            return newRow;
          }}
          onCellEditCommit={(params) => {
            console.log('Cell edited:', params.row.id, params.field, params.value);
          }}
        />
      </div>
      <div style={{ marginTop: 5, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={addRow}
          style={{ marginRight: 8 }}
        >
          Add Row
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={saveData}
          style={{ marginRight: 8 }}
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
