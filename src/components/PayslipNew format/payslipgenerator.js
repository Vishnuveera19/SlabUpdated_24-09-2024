import {
  Grid,
  Card,
  TextField,
  Button,
  Typography,
  Box,
  CardContent,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import { PAYMPAYBILL, REPORTS } from "../../serverconfiguration/controllers";
import { getRequest, postRequest } from "../../serverconfiguration/requestcomp";
import { InputLabel } from "@mui/material";
import { ServerConfig } from "../../serverconfiguration/serverconfig";
import { useNavigate } from "react-router-dom";

export default function PayslipGenerator() {
  const [isloggedin, setIsloggedin] = useState(sessionStorage.getItem("user"));
  const [paympaybills, setPaymPayBills] = useState([]);
  const [pnEmployeeId, setPnEmployeeId] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [dDate, setDdate] = useState("");

  const navigate = useNavigate();

  const margin = { margin: "0 5px" };

  useEffect(() => {
    async function getData() {
      const data = await postRequest(ServerConfig.url, REPORTS, {
        query: `select * from paym_paybill where EmployeeCode = '${isloggedin}'`,
      });
      console.log();
      setPaymPayBills(data.data);
    }
    getData();
    console.log("Paympaybill", paympaybills);
  }, [isloggedin]);

  const handlesave = () => {
    const paym = paympaybills.filter(
      (e) => e.EmployeeCode == employeeCode && e.d_date == dDate
    );
    navigate("payslipmonthly", {
      state: {
        paym,
      },
    });
  };

  return (
    <div>
      <Grid style={{ padding: "80px 5px0 5px" }}>
        <Card style={{ maxWidth: 600, margin: "0 auto" }}>
          <CardContent>
            <Typography
              variant="h5"
              color="S- Light"
              align="center"
              gutterBottom
            >
              Generate Payslip
            </Typography>
            <form>
              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
                direction="column"
              >
                <Grid item xs={12} sm={12}>
                  <div style={{ width: "300px", position: "relative" }}>
                    <label
                      htmlFor="pnEmployeeId"
                      style={{
                        position: "absolute",
                        top: "-10px",
                        left: "10px",
                        backgroundColor: "white",
                        padding: "0 4px",
                        zIndex: 1,
                      }}
                    >
                      EmployeeId
                    </label>
                    <select
                      id="pnEmployeeId"
                      name="pnEmployeeId"
                      onChange={(e) => setPnEmployeeId(e.target.value)}
                      style={{ height: "50px", width: "100%", padding: "10px" }}
                    >
                      <option value="">Select</option>
                      {paympaybills.map((e) => (
                        <option key={e.pn_EmployeeID} value={e.pn_EmployeeID}>
                          {e.pn_EmployeeID}
                        </option>
                      ))}
                    </select>
                  </div>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <div style={{ width: "300px", position: "relative" }}>
                    <label
                      htmlFor="employeeCode"
                      style={{
                        position: "absolute",
                        top: "-10px",
                        left: "10px",
                        backgroundColor: "white",
                        padding: "0 4px",
                        zIndex: 1,
                      }}
                    >
                      EmployeeCode
                    </label>
                    <select
                      id="employeeCode"
                      name="employeeCode"
                      onChange={(e) => setEmployeeCode(e.target.value)}
                      style={{ height: "50px", width: "100%", padding: "10px" }}
                    >
                      <option value="">Select</option>
                      {paympaybills
                        .filter((e) => e.pn_EmployeeID == pnEmployeeId)
                        .map((e) => (
                          <option>{e.EmployeeCode}</option>
                        ))}
                    </select>
                  </div>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <div style={{ width: "300px", position: "relative" }}>
                    <label
                      htmlFor="dDate"
                      style={{
                        position: "absolute",
                        top: "-10px",
                        left: "10px",
                        backgroundColor: "white",
                        padding: "0 4px",
                        zIndex: 1,
                      }}
                    >
                      dDate
                    </label>
                    <select
                      id="dDate"
                      name="dDate"
                      onChange={(e) => setDdate(e.target.value)}
                      style={{ height: "50px", width: "100%", padding: "10px" }}
                    >
                      <option value="">Select</option>
                      {paympaybills
                        .filter(
                          (e) =>
                            e.pn_EmployeeID == pnEmployeeId &&
                            e.EmployeeCode == employeeCode
                        )
                        .map((e) => (
                          <option key={e.d_date} value={e.d_date}>
                            {new Date(e.d_date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                            })}
                          </option>
                        ))}
                    </select>
                  </div>
                </Grid>
              </Grid>
              <Grid container spacing={1} paddingTop={"10px"}>
                <Grid item xs={12} align="right">
                  <Button
                    style={margin}
                    type="reset"
                    variant="outlined"
                    color="primary"
                    size="small"
                  >
                    RESET
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlesave}
                    size="small"
                  >
                    Generate
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
}
