import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { FormControlLabel } from '@mui/material';
import Switch from '@mui/material/Switch';


export default function OverTimeGrid() {
  const [rows, setRows] = React.useState(initialRows);
  const [paginationModel, setpaginationModel] = React.useState({
    pageSize: 5,
    page: 0
  });
  const [showCategory, setShowCategory] = React.useState(true); 

  const addRow = () => {
    const newRow = {
      id: rows.length + 1, 
      otFromDuration: '',
      otToDuration: '',
      otHours: null,
      otRate: null
    };
    setRows([...rows, newRow]);
  };

  const columns = [
    ...(showCategory ? [{ field: 'Category', editable: true, type: 'singleSelect', valueOptions: ['Staff', 'Workers'], flex: 1, minWidth: 150, headerAlign: 'center', align: 'center' }] : []),
   { field: 'otFromDuration', headerName: 'OT From Duration', flex: 1, minWidth: 150, editable: true, headerAlign: 'center', align: 'center' },
   { field: 'otToDuration', headerName: 'OT To Duration', flex: 1, minWidth: 150, editable: true, headerAlign: 'center', align: 'center' },
   { field: 'otHours', headerName: 'OT Hours', flex: 1, minWidth: 120, editable: true, headerAlign: 'center', align: 'center' },
   { field: 'otRate', headerName: 'OT Rate', flex: 1, minWidth: 120, editable: true, headerAlign: 'center', align: 'center' },
 ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 371, width: '100%' }}>
    <div style={{ marginBottom: 16 }}>
      <FormControlLabel
        control={<Switch checked={!showCategory} onChange={() => setShowCategory(prev => !prev)} />}
        label="All Employees"
      />
    </div>
    <div style={{ flex: 1 }}>
      <StyledDataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setpaginationModel}
        pageSizeOptions={[5, 10, 25]}
      />
    </div>
    <Button
      variant="contained"
      color="primary"
      size="small"
      onClick={addRow}
      style={{ alignSelf: 'flex-end', marginTop: 16 }}
    >
      Add Row
    </Button>
  </div>
);
}


const StyledDataGrid = styled(DataGrid)({
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: '#dcdcdc',
  },
});





const initialRows = [
  { id: 1, otFromDuration: '', otToDuration: '', otHours: null, otRate: null },
  { id: 2, otFromDuration: '', otToDuration: '', otHours: null, otRate: null },
  { id: 3, otFromDuration: '', otToDuration: '', otHours: null, otRate: null },
  { id: 4, otFromDuration: '', otToDuration: '', otHours: null, otRate: null },
  { id: 5, otFromDuration: '', otToDuration: '', otHours: null, otRate: null },
];
