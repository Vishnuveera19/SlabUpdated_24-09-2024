import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { TextField } from '@mui/material';
import { format } from 'date-fns';

// Helper function to create a Date object with specific time
const createDateWithTime = (hours, minutes) => {
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

const TimePickerCell = ({ value, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <TimePicker
          value={value || createDateWithTime(0, 0)}
          onChange={onChange}
          renderInput={(params) => <TextField {...params} variant="standard" />}
          ampm={false} // Use 24-hour format
          views={['hours', 'minutes']}
          format="HH:mm"
          sx={{ width: '100%' }}
        />
      </div>
    </LocalizationProvider>
  );
};

const StyledDataGrid = styled(DataGrid)({
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: '#D3D3D3',
    color: '#000000',
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
  { id: 1, otFromDuration: createDateWithTime(0, 0), otToDuration: createDateWithTime(0, 0), otHours: null, otRate: null },
];

export default function OverTimeGrid() {
  const [rows, setRows] = useState(initialRows);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0
  });

  const [otToDuration, setOtToDuration] = useState(createDateWithTime(0, 0));

  const handleOtToDurationChange = (newValue) => {
    setOtToDuration(newValue); // Update otToDuration correctly
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
          onChange={(newValue) => params.api.setEditCellValue({ id: params.id, field: 'otFromDuration', value: newValue })}
        />
      ),
      headerAlign: 'center',
      align: 'center'
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
            handleOtToDurationChange(newValue); // Use the function here
            const formattedTime = format(newValue, 'HH:mm');
            console.log('OT To Duration Changed:', formattedTime); // Log formatted time
            params.api.setEditCellValue({ id: params.id, field: 'otToDuration', value: newValue });
          }}
        />
      ),
      headerAlign: 'center',
      align: 'center'
    },
    
    {
      field: 'otHours',
      headerName: 'OT Hours',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <TimePickerCell
          value={params.value}
          onChange={(newValue) => params.api.setEditCellValue({ id: params.id, field: 'otHours', value: newValue })}
        />
      ),
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'otRate',
      headerName: 'OT Rate',
      flex: 1,
      type: "singleSelect",
      valueOptions: ["1.0", "1.5", "2.0", "2.5", "3.0", "3.5"],
      minWidth: 120,
      editable: true,
      headerAlign: 'center',
      align: 'center'
    },
  ];
  

  const addRow = () => {
    // Ensure otToDuration is not null before using it
    const currentOtToDuration = otToDuration || createDateWithTime(0, 0);
    const formattedOtToDuration = format(currentOtToDuration, 'HH:mm');
    console.log('Previous row otToDuration:', formattedOtToDuration);
  
    const newRow = {
      id: rows.length + 1,
      otFromDuration: createDateWithTime(0, 0),
      otToDuration: createDateWithTime(0, 0), // Use the correct otToDuration
      otHours: null,
      otRate: null
    };
    
    setRows([...rows, newRow]);
    setOtToDuration(null); // Reset otToDuration for the new row
  };
  

  const saveData = () => {
    // Implement your save logic here
    console.log('Data saved:', rows);
    // Disable editing mode if necessary
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 370, width: '100%' }}>
      <div style={{ flex: 1 }}>
        <StyledDataGrid
          rows={rows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25]}
          autoHeight
          processRowUpdate={(newRow) => {
            // Update rows with the new values
            const updatedRows = rows.map(row => row.id === newRow.id ? { ...row, ...newRow } : row);
            setRows(updatedRows);
            return newRow;
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
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
        >
          Save
        </Button>
      </div>
    </div>
  );
}
