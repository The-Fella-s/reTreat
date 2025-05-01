// src/pages/waiver.jsx
import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  InputAdornment,
  IconButton,
  Checkbox,
  FormGroup
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';

const waiverConfigs = {
  massage: {
    title: "Massage Intake Form",
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text' },
      { name: 'lastName', label: 'Last Name', type: 'text' },
      { name: 'dob', label: 'Date of Birth', type: 'date' },
      { name: 'occupation', label: 'Occupation', type: 'text' },
      { name: 'emergencyName', label: 'Emergency Contact Name', type: 'text' },
      { name: 'relationship', label: 'Contact Relationship', type: 'text' },
      { name: 'referral', label: 'How did you hear about us?', type: 'text' },
      { name: 'injuries', label: 'Please list Injuries or Illnesses', type: 'textarea' },
      { name: 'medications', label: 'Please list any medications you are currently taking', type: 'textarea' },
      { name: 'priorMassage', label: 'Have you had a massage before?', type: 'radio', options: ['Yes','No'] },
      { name: 'lastMassage', label: 'If yes, how long has it been since your last massage?', type: 'text' },
      { name: 'physicianCare', label: 'Are you currently under care of a physician?', type: 'radio', options: ['Yes','No'] },
      { name: 'physicianConditions', label: 'If so for what conditions?', type: 'text' },
      { name: 'pregnant', label: 'Are you pregnant?', type: 'radio', options: ['Yes','No'] }
    ]
  },
  wax: {
    title: "Waxing Consent Form",
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text' },
      { name: 'lastName', label: 'Last Name', type: 'text' },
      { name: 'referral', label: 'How did you hear about us?', type: 'text' },
      { name: 'services', label: 'Service(s) Requested', type: 'text' },
      { name: 'initials_scrub', label: 'I have not used a scrub, Retin-A, etc. in the last 72 hours (Initials)', type: 'text' },
      { name: 'initials_accutane', label: 'I have been off Accutane for at least 12 months (Initials)', type: 'text' },
      { name: 'initials_sideEffects', label: 'Some possible side effects include redness... (Initials)', type: 'text' },
      { name: 'initials_menstrual', label: 'For Brazilian... notify if on menstrual cycle (Initials)', type: 'text' },
      { name: 'initials_lesions', label: 'I do not have any open skin lesions... (Initials)', type: 'text' },
      { name: 'initials_risks', label: 'I understand that risks are involved... (Initials)', type: 'text' },
      { name: 'initials_postCare', label: 'I agree to adhere to post care... (Initials)', type: 'text' },
      { name: 'initials_age', label: 'I am over 18 years of age or have parental consent (Initials)', type: 'text' },
      { name: 'initials_notify', label: 'I will inform provider of complications ASAP (Initials)', type: 'text' }
    ]
  },
  skin: {
    title: "Confidential Skin Health History",
    description: `Please answer the following confidential questions so that we may have a better understanding of your general health and lifestyle, thereby enabling us to accurately analyze and assess your skin care needs.`,
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text' },
      { name: 'lastName', label: 'Last Name', type: 'text' },
      { name: 'referral', label: 'How did you hear about us?', type: 'text' },
      { name: 'meds', label: 'List all medications taken', type: 'text' },
      { name: 'allergies', label: 'Allergies', type: 'text' },
      { name: 'physician', label: 'Are you currently under the care of a physician?', type: 'radio', options: ['Yes','No'] },
      { name: 'physicianConditions', label: 'If yes, for what condition(s)?', type: 'text' },
      { name: 'pregnant', label: 'Are you pregnant?', type: 'radio', options: ['Yes','No'] },
      { name: 'treatedFor', label: 'Please check any conditions you have been treated for', type: 'checkbox', options: ['Skin Disease','Acne','Cold Sores','High Blood Pressure','Diabetes','Cancer','Hormone Therapy'] },
      { name: 'stressLevel', label: 'Your daily stress level', type: 'radio', options: ['Mild/Low','Medium/Average','High Intense'] },
      { name: 'water', label: 'How much water do you drink a day?', type: 'text' },
      { name: 'exercise', label: 'How often do you exercise?', type: 'text' },
      { name: 'skinRating', label: 'On a scale of 1 to 10, rate how you feel about the overall look of your skin', type: 'text' },
      { name: 'sunscreenFreq', label: 'How often do you wear facial sunscreen?', type: 'radio', options: ['Everyday','Occasionally',"Only when I'm outside"] },
      { name: 'sunBurnFreq', label: 'If you go in the sun without sunscreen, how often will you burn?', type: 'radio', options: ['Always','Most of the Time','Sometimes','Rarely Burn','Very Rarely','I never Burn'] },
      { name: 'lastSunBurn', label: 'When was your last sun burn?', type: 'date' },
      { name: 'tanningBeds', label: 'Use of tanning beds', type: 'radio', options: ['Daily','Once a week','Occasionally','Never'] },
      { name: 'cosmeticProcedures', label: 'Please list any cosmetic procedures in the last 12 months', type: 'textarea' },
      { name: 'skinCareLine', label: 'What skin care line are you using?', type: 'text' },
      { name: 'dailyRoutine', label: 'Describe your daily skin care routine', type: 'textarea' },
      { name: 'mostImportant', label: 'What is the most important improvement you would like to see in your skin', type: 'textarea' },
      { name: 'regularProcedures', label: 'Do you receive any of the following procedures regularly?', type: 'checkbox', options: ['Waxing','Facial Injections','Microdermabrasion','Chemical Peels','Other'] },
      { name: 'otherProcedure', label: 'If Other, please specify', type: 'text' },
      { name: 'initials_skin', label: 'Initials', type: 'text' },
      { name: 'acknowledge', label: 'I will inform my Esthetician verbally of any medications or allergies I have that may affect my treatment.', type: 'checkbox', options: ['I acknowledge'] }
    ]
  },
  browlash: {
    title: "Brow & Lash Waiver Form",
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text' },
      { name: 'lastName', label: 'Last Name', type: 'text' },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'phone', label: 'Phone (Digits Only)', type: 'text' },
      { name: 'referral', label: 'How did you hear about us?', type: 'text' },
      { name: 'procedures', label: 'Procedure(s) Today', type: 'text' },
      { name: 'initials_adult', label: 'I confirm that I am over age 18 (Initials)', type: 'text' },
      { name: 'initials_cosmetic', label: 'I understand this procedure is cosmetic only (Initials)', type: 'text' },
      { name: 'initials_read', label: 'I certify that I read and understand (Initials)', type: 'text' },
      { name: 'initials_questions', label: 'I had opportunity to ask questions (Initials)', type: 'text' },
      { name: 'initials_release', label: 'I consent and release this establishment (Initials)', type: 'text' }
    ]
  }
};

// Map of waiver types to DocuSign template IDs
const templateIds = {
  massage: "0e2036c6-3a04-4a2b-bbca-9daae5b09d2e",
  wax: "1d5bc7de-df50-4882-b893-9e265b46e2be", 
  skin: "67e88994-7f7b-4be7-9528-c04c3fa10af0",
  browlash: "4913129a-0b8b-48a1-9693-ccff9085a822"
};

export default function WaiverForms() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const iframeRef = useRef(null);

  const [selected, setSelected] = useState(null);
  const [values, setValues] = useState({});
  const [dsUrl, setDsUrl] = useState("");
  const [dsOpen, setDsOpen] = useState(false);
  const [dsLoading, setDsLoading] = useState(false);

  // auto-computed initials
  const initials =
    (values.firstName?.charAt(0) || "").toUpperCase() +
    (values.lastName?.charAt(0) || "").toUpperCase();

  const handleSelect = (key) => {
    setSelected(key);
    setValues({});
  };

  const handleChange = (name) => (e) => {
    setValues(prev => ({ ...prev, [name]: e.target.value }));
  };

  const handleAutoInitials = (field) => () => {
    setValues(prev => ({ ...prev, [field]: initials }));
  };

  const handleCheckbox = (field) => (e) => {
    setValues(prev => {
      const list = prev[field] || [];
      if (e.target.checked) return { ...prev, [field]: [...list, e.target.name] };
      return { ...prev, [field]: list.filter(x => x !== e.target.name) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) {
      toast.error("Please select a waiver type first.");
      return;
    }

    // required fields
    const required = waiverConfigs[selected].fields.map(f => f.name);
    const missing = required.filter(name => {
      const v = values[name];
      if (Array.isArray(v)) return v.length === 0;
      return !v || !v.toString().trim();
    });
    

    // initials fields must match
    waiverConfigs[selected].fields
      .filter(f => f.name.startsWith("initials_"))
      .forEach(f => {
        if (values[f.name] !== initials) {
          toast.error(`Initials for ${f.label} must be "${initials}"`);
          throw new Error(`Initials for ${f.label} must be "${initials}"`);
        }
      });

    try {
      setDsLoading(true);
      
      // if logged in, include token for user
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // First save the waiver to get an ID
      const { data: waiver } = await axios.post("/api/waivers", {
        waiverType: selected,
        formData: values
      }, { headers });

      toast.success("Form saved—launching signature…");

      // Convert form values to DocuSign tabs format
      const textTabs = [];
      const radioGroupTabs = [];
      const checkboxTabs = [];

      // Process each form field based on its type
      waiverConfigs[selected].fields.forEach(field => {
        const value = values[field.name];
        
        // Skip empty values
        if (!value && value !== 0) return;
        
        if (field.type === 'radio') {
          radioGroupTabs.push({
            groupName: field.name,
            radios: [{
              value: value,
              selected: "true"
            }]
          });
        } 
        else if (field.type === 'checkbox' && Array.isArray(value)) {
          value.forEach(option => {
            checkboxTabs.push({
              tabLabel: `${field.name}_${option.replace(/\s+/g, '')}`,
              selected: "true"
            });
          });
        }
        else {
          // Handle text, textarea, date, etc.
          textTabs.push({
            tabLabel: field.name,
            value: value.toString()
          });
        }
      });

      
      const { data } = await axios.post("/api/docusign/send-envelope", {
        customerEmail: values.email || user?.email,
        customerName: `${values.firstName} ${values.lastName}`,
        clientUserId: waiver._id,
        waiverType: selected,
        templateId: templateIds[selected],

      }, { headers });

      setDsUrl(data.signingUrl);
      setDsOpen(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Something went wrong—please try again.");
    } finally {
      setDsLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Select Waiver
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {Object.entries(waiverConfigs).map(([key, cfg]) => (
          <Grid key={key} item xs={12} sm={6} md={3}>
            <Paper
              onClick={() => handleSelect(key)}
              sx={{
                p: 2,
                cursor: 'pointer',
                textAlign: 'center',
                border: selected === key ? '2px solid' : '1px solid'
              }}
            >
              <Typography>{cfg.title}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {selected && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            {waiverConfigs[selected].title}
          </Typography>
          {waiverConfigs[selected].description && (
            <Typography paragraph>
              {waiverConfigs[selected].description}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ display:'grid', gap:2 }}>
            {waiverConfigs[selected].fields.map(f => {
              if (f.type === 'radio') {
                return (
                  <FormControl key={f.name}>
                    <FormLabel>{f.label}</FormLabel>
                    <RadioGroup
                      row
                      name={f.name}
                      value={values[f.name] || ''}
                      onChange={handleChange(f.name)}
                    >
                      {f.options.map(opt => (
                        <FormControlLabel
                          key={opt}
                          value={opt}
                          control={<Radio />}
                          label={opt}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                );
              }
              if (f.type === 'checkbox') {
                return (
                  <FormGroup key={f.name}>
                    <FormLabel>{f.label}</FormLabel>
                    {f.options.map(opt => (
                      <FormControlLabel
                        key={opt}
                        control={
                          <Checkbox
                            checked={(values[f.name]||[]).includes(opt)}
                            onChange={handleCheckbox(f.name)}
                            name={opt}
                          />
                        }
                        label={opt}
                      />
                    ))}
                  </FormGroup>
                );
              }
              if (f.type === 'textarea') {
                return (
                  <TextField
                    key={f.name}
                    label={f.label}
                    multiline
                    rows={3}
                    value={values[f.name]||''}
                    onChange={handleChange(f.name)}
                    fullWidth
                  />
                );
              }
              // text or date or initials
              const isDate = f.type === 'date';
              return (
                <TextField
                  key={f.name}
                  label={f.label}
                  type={isDate?'date':f.type}
                  value={values[f.name]||''}
                  onChange={handleChange(f.name)}
                  fullWidth
                  InputLabelProps={isDate?{ shrink: true }:undefined}
                  {...(f.name.startsWith('initials_') && {
                    InputProps: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleAutoInitials(f.name)}>
                            <ContentPasteGoIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  })}
                />
              );
            })}
            <Button type="submit" variant="contained">Submit &amp; Sign</Button>
          </Box>
        </Paper>
      )}

      <ToastContainer position="top-right" autoClose={5000} />

      <Dialog open={dsOpen} onClose={() => setDsOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Sign Your Waiver</DialogTitle>
        <DialogContent dividers sx={{ p:0, height:"80vh" }}>
          {dsLoading ? (
            <Box sx={{ display:'flex', justifyContent:'center', mt:4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <iframe
              ref={iframeRef}
              title="DocuSign Signer"
              src={dsUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              onLoad={() => {
                try {
                  const href = iframeRef.current.contentWindow.location.href;
                  if (href.includes("/waiver-complete")) {
                    setDsOpen(false);
                    toast.success("Waiver successfully submitted!");
                    navigate("/");
                  }
                } catch {}
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}