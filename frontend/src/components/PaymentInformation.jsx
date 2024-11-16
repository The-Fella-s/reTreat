import { Box, Card, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import HomeIcon from "@mui/icons-material/Home";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useState } from "react";

const PaymentInformation = () => {
    const [isShippingSameAsBilling, setIsShippingSameAsBilling] = useState(false);

    // Handler for checkbox change
    const handleCheckboxChange = (event) => {
        setIsShippingSameAsBilling(event.target.checked);
    };

    return (
        <>
            <Card
                sx={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                    padding: 2,
                    boxShadow: 2,
                    boxSizing: "border-box",
                }}
            >
                <Box
                    component="form"
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", lg: "row" },
                        gap: 4,
                        height: { xs: "auto", lg: "100%" },
                    }}
                >
                    {/* Left Section: User Information */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <AccountBoxIcon />
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                Your Information
                            </Typography>
                        </Box>
                        <TextField fullWidth label="First Name" variant="outlined" />
                        <TextField fullWidth label="Last Name" variant="outlined" />
                        <TextField fullWidth label="Phone Number" variant="outlined" type="tel" />
                        <TextField fullWidth label="Email" variant="outlined" type="email" />
                    </Box>

                    {/* Middle Space */}
                    <Box sx={{ width: { lg: "300px" } }}></Box>

                    {/* Right Section: Payment Information */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CreditCardIcon />
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                Payment Information
                            </Typography>
                        </Box>
                        <TextField fullWidth label="Cardholder Name" variant="outlined" />
                        <TextField fullWidth label="Card Number" variant="outlined" type="number" inputProps={{ maxLength: 16 }} />
                        <Box gap={2} sx={{ display: "flex", flexDirection: "row" }}>
                            <TextField
                                fullWidth
                                label="Expire Date (MM)"
                                variant="outlined"
                                placeholder="MM"
                                type="number"
                                inputProps={{ min: 1, max: 12, maxLength: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Expire Date (DD)"
                                variant="outlined"
                                placeholder="DD"
                                type="number"
                                inputProps={{ min: 1, max: 31, maxLength: 2 }}
                            />
                        </Box>
                        <TextField fullWidth label="CVV" variant="outlined" type="password" inputProps={{ maxLength: 3 }} />
                    </Box>
                </Box>

                {/* Billing Information */}
                <Box sx={{ marginTop: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <HomeIcon />
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Billing Information
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, marginTop: 2 }}>
                        <TextField fullWidth label="Address Line 1" variant="outlined" />
                        <TextField fullWidth label="Address Line 2" variant="outlined" />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, marginTop: 2 }}>
                        <TextField fullWidth label="City" variant="outlined" />
                        <TextField fullWidth label="State" variant="outlined" />
                        <TextField fullWidth label="ZIP Code" variant="outlined" type="number" inputProps={{ maxLength: 5 }} />
                    </Box>
                    <Box sx={{ marginTop: 2 }}>
                        <TextField fullWidth label="Country" variant="outlined" />
                    </Box>
                </Box>

                {/* Shipping Information */}
                <Box sx={{ marginTop: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocalShippingIcon />
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Shipping Information
                        </Typography>
                        {/* Checkbox for "Same as Billing" */}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isShippingSameAsBilling}
                                    onChange={handleCheckboxChange}
                                    color="primary"
                                />
                            }
                            label="Same as Billing Information"
                        />
                    </Box>

                    {/* Conditionally render Shipping Information fields */}
                    {!isShippingSameAsBilling && (
                        <>
                            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, marginTop: 2 }}>
                                <TextField fullWidth label="Address Line 1" variant="outlined" />
                                <TextField fullWidth label="Address Line 2" variant="outlined" />
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, marginTop: 2 }}>
                                <TextField fullWidth label="City" variant="outlined" />
                                <TextField fullWidth label="State" variant="outlined" />
                                <TextField fullWidth label="ZIP Code" variant="outlined" type="number" inputProps={{ maxLength: 5 }} />
                            </Box>
                            <Box sx={{ marginTop: 2 }}>
                                <TextField fullWidth label="Country" variant="outlined" />
                            </Box>
                        </>
                    )}
                </Box>

                {/* Additional Notes */}
                <TextField
                    fullWidth
                    label="Additional Notes"
                    variant="outlined"
                    sx={{ width: "100%", marginTop: 2 }}
                    multiline
                    rows={6}
                />
            </Card>
        </>
    );
};

export default PaymentInformation;
