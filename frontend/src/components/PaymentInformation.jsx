import {Box, Button, Card, Checkbox, FormControlLabel, TextField, Typography, MenuItem, Select, InputLabel, FormControl} from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import HomeIcon from "@mui/icons-material/Home";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useState } from "react";
import {useNavigate} from "react-router-dom";

const PaymentInformation = () => {
    const navigate = useNavigate(); // Initialize navigate

    const [isShippingSameAsBilling, setIsShippingSameAsBilling] = useState(false);

    // User Information states
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");

    // Payment Information states
    const [cardholderName, setCardholderName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expireMonth, setExpireMonth] = useState("");
    const [expireYear, setExpireYear] = useState("");
    const [cvv, setCvv] = useState("");
    const [errors, setErrors] = useState({});

    // Billing Information states
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [country, setCountry] = useState("");

    // Shipping Information states
    const [shippingAddressLine1, setShippingAddressLine1] = useState("");
    const [shippingAddressLine2, setShippingAddressLine2] = useState("");
    const [shippingCity, setShippingCity] = useState("");
    const [shippingState, setShippingState] = useState("");
    const [shippingZipCode, setShippingZipCode] = useState("");
    const [shippingCountry, setShippingCountry] = useState("");

    // List of states
    const states = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
        "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT",
        "VA", "WA", "WV", "WI", "WY"
    ];

    // Additional Notes states
    const [additionalNotes, setAdditionalNotes] = useState("");

    // Handler for checkbox change
    const handleCheckboxChange = (event) => {
        setIsShippingSameAsBilling(event.target.checked);
    };

    const [showCvv, setShowCvv] = useState(false);

    // Toggle the visibility of the CVV field
    const handleToggleCvv = () => {
        setShowCvv((prevState) => !prevState);
    };

    // Handler for "Go Back" button click
    const handleGoBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    // Handler for "Book Appointment" button click
    const handleBookAppointment = () => {
        console.log("User Information:");
        console.log(`First Name: ${firstName}`);
        console.log(`Last Name: ${lastName}`);
        console.log(`Phone Number: ${phoneNumber}`);
        console.log(`Email: ${email}`);

        console.log("Payment Information:");
        console.log(`Cardholder Name: ${cardholderName}`);
        console.log(`Card Number: ${cardNumber}`);
        console.log(`Expire Date: ${expireMonth}/${expireYear}`);
        console.log(`CVV: ${cvv}`);

        console.log("Billing Information:");
        console.log(`Address Line 1: ${addressLine1}`);
        console.log(`Address Line 2: ${addressLine2}`);
        console.log(`City: ${city}`);
        console.log(`State: ${state}`);
        console.log(`ZIP Code: ${zipCode}`);
        console.log(`Country: ${country}`);

        if (!isShippingSameAsBilling) {
            console.log("Shipping Information:");
            console.log(`Shipping Address Line 1: ${shippingAddressLine1}`);
            console.log(`Shipping Address Line 2: ${shippingAddressLine2}`);
            console.log(`Shipping City: ${shippingCity}`);
            console.log(`Shipping State: ${shippingState}`);
            console.log(`Shipping ZIP Code: ${shippingZipCode}`);
            console.log(`Shipping Country: ${shippingCountry}`);
        }

        let validationErrors = {};
        
        if (!cardholderName) validationErrors.cardholderName = "Cardholder Name is required";
        if (!cardNumber.match(/^\d{16}$/)) validationErrors.cardNumber = "Card Number must be 16 digits";
        if (!expireMonth.match(/^0?[1-9]|1[0-2]$/)) validationErrors.expireMonth = "Invalid Month";
        if (!expireYear.match(/^0?[1-9]|[12][0-9]|3[01]$/)) validationErrors.expireYear = "Invalid Day";
        if (!cvv.match(/^\d{3}$/)) validationErrors.cvv = "CVV must be 3 digits";
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({}); // Clear errors if valid
        console.log("Payment validated, processing...");

        console.log("Additional Notes:");
        console.log(additionalNotes);
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
                        <TextField
                            fullWidth
                            label="First Name"
                            variant="outlined"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            error={!!errors.firstName} 
                            helperText={errors.firstName}
                        />
                        <TextField
                            fullWidth
                            label="Last Name"
                            variant="outlined"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            error={!!errors.LastName} 
                            helperText={errors.LastName}
                        />
                        <TextField
                            fullWidth
                            label="Phone Number"
                            variant="outlined"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Box>

                    {/* Right Section: Payment Information */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CreditCardIcon />
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                Payment Information
                            </Typography>
                        </Box>
                        <TextField
                            fullWidth
                            label="Cardholder Name"
                            variant="outlined"
                            value={cardholderName}
                            onChange={(e) => setCardholderName(e.target.value)}
                            error={!!errors.cardholderName} // 
                            helperText={errors.cardholderName}
                        />
                        <TextField
                            fullWidth
                            label="Card Number"
                            variant="outlined"
                            type="text" // Change to text instead of number
                            inputProps={{ maxLength: 16, pattern: "[0-9]*" }}
                            value={cardNumber}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                if (value.length <= 16) {
                                    setCardNumber(value);
                                }
                            }}
                            error={!!errors.cardNumber} 
                            helperText={errors.cardNumber}
                        />
                        <Box gap={2} sx={{ display: "flex", flexDirection: "row" }}>
                        <TextField
                            fullWidth
                            label="Expire Date (MM)"
                            variant="outlined"
                            placeholder="MM"
                            type="text" // Change to text instead of number
                            inputProps={{ maxLength: 2, pattern: "[0-9]*" }}
                            value={expireMonth}
                            onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, ""); 
                                if (value.length > 2) return; 
                                if (parseInt(value, 10) > 12) value = "12";
                                setExpireMonth(value);
                            }}
                            error={!!errors.expireMonth}
                            helperText={errors.expireMonth}
                        />

                        <TextField
                            fullWidth
                            label="Expire Date (YY)"
                            variant="outlined"
                            placeholder="YY"
                            type="text"
                            inputProps={{ maxLength: 2, pattern: "[0-9]*" }}
                            value={expireYear}
                            onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, ""); 
                                if (value.length > 2) return; 
                                setExpireYear(value);
                            }}
                            error={!!errors.expireYear}
                            helperText={errors.expireYear}
                        />
                        </Box>
                        <TextField
                        fullWidth
                        label="CVV"
                        variant="outlined"
                        type={showCvv ? "text" : "password"} // Toggle between text and password
                        inputProps={{ maxLength: 3 }}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        error={!!errors.cvv} 
                        helperText={errors.cvv}
                        InputProps={{
                            endAdornment: (
                                <Button onClick={handleToggleCvv} sx={{ cursor: "pointer" }}>
                                    {showCvv ? "Hide" : "Show"}
                                </Button>
                            ),
                        }}
                    />
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
                        <TextField
                            fullWidth
                            label="Address Line 1"
                            variant="outlined"
                            value={addressLine1}
                            onChange={(e) => setAddressLine1(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Address Line 2"
                            variant="outlined"
                            value={addressLine2}
                            onChange={(e) => setAddressLine2(e.target.value)}
                        />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, marginTop: 2 }}>
                        <TextField
                            fullWidth
                            label="City"
                            variant="outlined"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                   <FormControl fullWidth>
                        <InputLabel>State</InputLabel>
                            <Select
                                label="State"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                fullWidth
                            >
                                {states.map((stateAbbr) => (
                                    <MenuItem key={stateAbbr} value={stateAbbr}>
                                        {stateAbbr}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="ZIP Code"
                            variant="outlined"
                            type="number"
                            inputProps={{ maxLength: 5 }}
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ marginTop: 2 }}>
                        <TextField
                            fullWidth
                            label="Country"
                            variant="outlined"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
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
                                <TextField
                                    fullWidth
                                    label="Address Line 1"
                                    variant="outlined"
                                    value={shippingAddressLine1}
                                    onChange={(e) => setShippingAddressLine1(e.target.value)}
                                />
                                <TextField
                                    fullWidth
                                    label="Address Line 2"
                                    variant="outlined"
                                    value={shippingAddressLine2}
                                    onChange={(e) => setShippingAddressLine2(e.target.value)}
                                />
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, marginTop: 2 }}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    variant="outlined"
                                    value={shippingCity}
                                    onChange={(e) => setShippingCity(e.target.value)}
                                />
                                <TextField
                                    fullWidth
                                    label="State"
                                    variant="outlined"
                                    value={shippingState}
                                    onChange={(e) => setShippingState(e.target.value)}
                                />
                                <TextField
                                    fullWidth
                                    label="ZIP Code"
                                    variant="outlined"
                                    type="number"
                                    inputProps={{ maxLength: 5 }}
                                    value={shippingZipCode}
                                    onChange={(e) => setShippingZipCode(e.target.value)}
                                />
                            </Box>
                            <Box sx={{ marginTop: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Country"
                                    variant="outlined"
                                    value={shippingCountry}
                                    onChange={(e) => setShippingCountry(e.target.value)}
                                />
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
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                />

                {/* Spacing below Additional Notes, above the Buttons */}
                <Box mb={2}></Box>

                {/* Buttons */}
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={2} // This adds spacing between the buttons
                    width="100%"
                >
                    {/* Go Back button */}
                    <Button fullWidth variant="contained" onClick={handleGoBack}>Go Back</Button>

                    {/* Book Appointment button */}
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleBookAppointment}
                    >
                        Book Appointment
                    </Button>
                </Box>
            </Card>
        </>
    );
};

export default PaymentInformation;
