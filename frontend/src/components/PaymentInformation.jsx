import {Box, Button, Card, Checkbox, FormControlLabel, TextField, Typography} from "@mui/material";
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
    const [expireDay, setExpireDay] = useState("");
    const [cvv, setCvv] = useState("");

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

    // Additional Notes states
    const [additionalNotes, setAdditionalNotes] = useState("");

    // Handler for checkbox change
    const handleCheckboxChange = (event) => {
        setIsShippingSameAsBilling(event.target.checked);
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
        console.log(`Expire Date: ${expireMonth}/${expireDay}`);
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
                        />
                        <TextField
                            fullWidth
                            label="Last Name"
                            variant="outlined"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
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
                        <TextField
                            fullWidth
                            label="Cardholder Name"
                            variant="outlined"
                            value={cardholderName}
                            onChange={(e) => setCardholderName(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Card Number"
                            variant="outlined"
                            type="number"
                            inputProps={{ maxLength: 16 }}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                        />
                        <Box gap={2} sx={{ display: "flex", flexDirection: "row" }}>
                            <TextField
                                fullWidth
                                label="Expire Date (MM)"
                                variant="outlined"
                                placeholder="MM"
                                type="number"
                                inputProps={{ min: 1, max: 12, maxLength: 2 }}
                                value={expireMonth}
                                onChange={(e) => setExpireMonth(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Expire Date (DD)"
                                variant="outlined"
                                placeholder="DD"
                                type="number"
                                inputProps={{ min: 1, max: 31, maxLength: 2 }}
                                value={expireDay}
                                onChange={(e) => setExpireDay(e.target.value)}
                            />
                        </Box>
                        <TextField
                            fullWidth
                            label="CVV"
                            variant="outlined"
                            type="password"
                            inputProps={{ maxLength: 3 }}
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
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
                        <TextField
                            fullWidth
                            label="State"
                            variant="outlined"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                        />
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
