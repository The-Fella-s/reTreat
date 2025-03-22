import { Box, Button, Card, TextField, Typography, MenuItem, Select, InputLabel, FormControl, FormControlLabel, Checkbox } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import HomeIcon from "@mui/icons-material/Home";
import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";  // Correct useLocation import
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import extractErrorMessage from "../utilities/error.js";
import { useCart } from "../context/CartContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

const PaymentInformation = () => {
    const navigate = useNavigate();  // Initialize navigate
    const { addToCart } = useCart();  // Use the addToCart function from CartContext
    const { location } = useLocation();  // Use useLocation to get passed state
    const { appointmentData } = location || {};  // Safely destructure appointmentData

    const { user } = useContext(AuthContext);

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

    // Additional state for linking card to account
    const [linkCard, setLinkCard] = useState(false);

    // List of states
    const states = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
        "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT",
        "VA", "WA", "WV", "WI", "WY"
    ];

    // Additional Notes states
    const [additionalNotes, setAdditionalNotes] = useState("");

    const [showCvv, setShowCvv] = useState(false);

    // Toggle the visibility of the CVV field
    const handleToggleCvv = () => {
        setShowCvv((prevState) => !prevState);
    };

    // Handler for "Go Back" button click
    const handleGoBack = () => {
        navigate(-1);  // Navigate back to the previous page
    };

    // Handler for "Book Appointment" button click
    const handleBookAppointment = async () => {
        let validationErrors = {};

        if (!user) {
            toast.error('You must be logged in to book an appointment.');
            navigate('/login');  // Redirect to login page
            return;
        }

        // Validation logic for user input fields
        if (!firstName) validationErrors.firstName = "First Name is required";
        if (!lastName) validationErrors.lastName = "Last Name is required";
        if (!phoneNumber) validationErrors.phoneNumber = "Phone Number is required";
        if (!cardholderName) validationErrors.cardholderName = "Cardholder Name is required";
        if (!cardNumber.match(/^\d{16}$/)) validationErrors.cardNumber = "Card Number must be 16 digits";
        if (!expireMonth.match(/^0?[1-9]|1[0-2]$/)) validationErrors.expireMonth = "Invalid Month";
        if (!expireYear.match(/^\d{2}$/)) validationErrors.expireYear = "Invalid Year";
        if (!cvv.match(/^\d{3}$/)) validationErrors.cvv = "CVV must be 3 digits";

        // Billing Information validations
        if (!addressLine1) validationErrors.addressLine1 = "Address Line 1 is required";
        if (!city) validationErrors.city = "City is required";
        if (!state) validationErrors.state = "State is required";
        if (!zipCode) validationErrors.zipCode = "Zip Code is required";
        if (!country) validationErrors.country = "Country is required";

        // If there are any validation errors, update the state and exit early
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});  // Clear errors if valid

        try {
            // Card data and booking logic
            const cardData = {
                email: email,
                cardholderName: cardholderName,
                cardNumber: cardNumber,
                expMonth: expireMonth,
                expYear: expireYear,
                cvv: cvv,
                addressLine1: addressLine1,
                addressLine2: addressLine2,
                administrativeDistrictLevel1: state,
                country: country,
                firstName: firstName,
                lastName: lastName,
                locality: city,
                postalCode: zipCode,
            };

            let cardId = null;
            if (linkCard) {
                // Try to retrieve an existing card by email
                try {
                    const retrieveCard = await axios.get('http://localhost:5000/api/cards/retrieve', { params: { email } });
                    if (retrieveCard.data.card.id) {
                        cardId = retrieveCard.data.card.id;
                    }
                } catch (error) {
                    // If card not found, create a new card
                    if (error.response?.status === 404) {
                        try {
                            const response = await axios.post('http://localhost:5000/api/cards/create', cardData);
                            if (response.data) {
                                cardId = response.data.id;
                                if (cardId) {
                                    toast.success("Card successfully linked");
                                }
                            }
                        } catch (createError) {
                            const extracted = extractErrorMessage(createError);
                            setErrors({ general: extracted });
                            toast.error(extracted);
                            return;  // Exit early if linking fails
                        }
                    } else {
                        // Handle other errors if necessary
                        const extracted = extractErrorMessage(error);
                        setErrors({ general: extracted });
                        toast.error(extracted);
                        return;
                    }
                }
            } else {
                // User chose not to link the card, proceed without linking
                toast.info("Proceeding without linking your card.");
            }

            await addToCart(user.id, appointmentData);  // Add to cart logic remains the same
            toast.success("Appointment successfully booked!");
            setTimeout(() => {
                navigate("/");  // Optionally redirect after success
            }, 1500);
        } catch (error) {
            const extracted = extractErrorMessage(error);
            setErrors({ general: extracted });
            toast.error(extracted);
        }
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
                <Box component="form" sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 4, height: { xs: "auto", lg: "100%" } }}>
                    {/* Left Section: User Information */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <AccountBoxIcon />
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>Your Information</Typography>
                        </Box>
                        <TextField fullWidth label="First Name" variant="outlined" value={firstName} onChange={(e) => setFirstName(e.target.value)} error={!!errors.firstName} helperText={errors.firstName} required />
                        <TextField fullWidth label="Last Name" variant="outlined" value={lastName} onChange={(e) => setLastName(e.target.value)} error={!!errors.lastName} helperText={errors.lastName} required />
                        <TextField fullWidth label="Phone Number" variant="outlined" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))} error={!!errors.phoneNumber} helperText={errors.phoneNumber} required />
                        <TextField fullWidth label="Email" variant="outlined" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Box>

                    {/* Right Section: Payment Information */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CreditCardIcon />
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>Payment Information</Typography>
                            </Box>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={linkCard}
                                        onChange={(e) => setLinkCard(e.target.checked)}
                                        sx={{ padding: 0 }} // Remove extra padding from the checkbox
                                    />
                                }
                                label="Link card to account"
                            />
                        </Box>
                        <TextField fullWidth label="Cardholder Name" variant="outlined" value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} error={!!errors.cardholderName} helperText={errors.cardholderName} />
                        <TextField fullWidth label="Card Number" variant="outlined" type="text" inputProps={{ maxLength: 16, pattern: "[0-9]*" }} value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))} error={!!errors.cardNumber} helperText={errors.cardNumber} />
                        <Box gap={2} sx={{ display: "flex", flexDirection: "row" }}>
                            <TextField fullWidth label="Expire Date (MM)" variant="outlined" placeholder="MM" type="text" inputProps={{ maxLength: 2, pattern: "[0-9]*" }} value={expireMonth} onChange={(e) => setExpireMonth(e.target.value.replace(/\D/g, ""))} error={!!errors.expireMonth} helperText={errors.expireMonth} />
                            <TextField fullWidth label="Expire Date (YY)" variant="outlined" placeholder="YY" type="text" inputProps={{ maxLength: 2, pattern: "[0-9]*" }} value={expireYear} onChange={(e) => setExpireYear(e.target.value.replace(/\D/g, ""))} error={!!errors.expireYear} helperText={errors.expireYear} />
                        </Box>
                        <TextField fullWidth label="CVV" variant="outlined" type={showCvv ? "text" : "password"} inputProps={{ maxLength: 3 }} value={cvv} onChange={(e) => setCvv(e.target.value)} error={!!errors.cvv} helperText={errors.cvv} InputProps={{ endAdornment: (<Button onClick={handleToggleCvv} sx={{ cursor: "pointer" }}>{showCvv ? "Hide" : "Show"}</Button>) }} />
                    </Box>
                </Box>

                {/* Billing Information */}
                <Box sx={{ marginTop: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <HomeIcon />
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>Billing Information</Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, marginTop: 2 }}>
                        <TextField fullWidth label="Address Line 1" variant="outlined" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} error={!!errors.addressLine1} helperText={errors.addressLine1} required />
                        <TextField fullWidth label="Address Line 2" variant="outlined" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, marginTop: 2 }}>
                        <TextField fullWidth label="City" variant="outlined" value={city} onChange={(e) => setCity(e.target.value)} error={!!errors.city} helperText={errors.city} required />
                        <FormControl fullWidth error={!!errors.state} required>
                            <InputLabel>State</InputLabel>
                            <Select label="State" value={state} onChange={(e) => setState(e.target.value)}>{states.map((stateAbbr) => (<MenuItem key={stateAbbr} value={stateAbbr}>{stateAbbr}</MenuItem>))}</Select>
                            {errors.state && (<Typography variant="caption" color="error">{errors.state}</Typography>)}
                        </FormControl>
                        <TextField fullWidth label="ZIP Code" variant="outlined" type="number" inputProps={{ maxLength: 5 }} value={zipCode} onChange={(e) => setZipCode(e.target.value)} error={!!errors.zipCode} helperText={errors.zipCode} required />
                    </Box>
                    <Box sx={{ marginTop: 2 }}>
                        <TextField fullWidth label="Country" variant="outlined" value={country} onChange={(e) => setCountry(e.target.value)} error={!!errors.country} helperText={errors.country} required />
                    </Box>
                </Box>

                {/* Additional Notes */}
                <TextField fullWidth label="Additional Notes" variant="outlined" sx={{ width: "100%", marginTop: 2 }} multiline rows={6} value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} />

                {/* Buttons */}
                <Box display="flex" flexDirection="column" alignItems="center" gap={2} width="100%">
                    <Button fullWidth variant="contained" onClick={handleGoBack}>Go Back</Button>
                    <Button fullWidth variant="contained" onClick={handleBookAppointment}>Book Appointment</Button>
                    <ToastContainer position="top-center" autoClose={5000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                </Box>
            </Card>
        </>
    );
};

export default PaymentInformation;
