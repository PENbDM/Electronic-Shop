import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface Brand {
  id: number;
  name: string;
  createdAt: string;
}

interface MuiTableProps {
  brands: Brand[];
}

const MuiTable: React.FC<MuiTableProps> = ({ brands }) => {
  const columns: GridColDef[] = [
    { field: "name", headerName: "Brand Name", width: 200 },
    { field: "createdAt", headerName: "Created At", width: 200 },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={brands}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
};

export default MuiTable;
