import React, { useState } from 'react';
import { TextField, Button, Grid, Container, Typography, Paper, Box } from '@mui/material';

const EarnMaster = () => {
    const [formData, setFormData] = useState({
        pn_CompanyID: '',
        pn_BranchID: '',
        Allowance1: '',
        Allowance2: '',
        Allowance3: '',
        Allowance4: '',
        Allowance5: '',
        Allowance6: '',
        Allowance7: '',
        Allowance8: '',
        Allowance9: '',
        Allowance10: '',
        Deduction1: '',
        Deduction2: '',
        Deduction3: '',
        Deduction4: '',
        Deduction5: '',
        Deduction6: '',
        Deduction7: '',
        Deduction8: '',
        Deduction9: '',
        Deduction10: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    Earnings and Deductions Master
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Company ID"
                                name="pn_CompanyID"
                                value={formData.pn_CompanyID}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Branch ID"
                                name="pn_BranchID"
                                value={formData.pn_BranchID}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 3 }}>
                                Allowances
                            </Typography>
                        </Grid>
                        {[...Array(10)].map((_, i) => (
                            <Grid item xs={12} sm={6} key={`allowance${i + 1}`}>
                                <TextField
                                    fullWidth
                                    label={`Allowance ${i + 1}`}
                                    name={`Allowance${i + 1}`}
                                    value={formData[`Allowance${i + 1}`]}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 3 }}>
                                Deductions
                            </Typography>
                        </Grid>
                        {[...Array(10)].map((_, i) => (
                            <Grid item xs={12} sm={6} key={`deduction${i + 1}`}>
                                <TextField
                                    fullWidth
                                    label={`Deduction ${i + 1}`}
                                    name={`Deduction${i + 1}`}
                                    value={formData[`Deduction${i + 1}`]}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12} sx={{ textAlign: 'center', mt: 4 }}>
                            <Button type="submit" variant="contained" color="primary" size="large">
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default EarnMaster;
