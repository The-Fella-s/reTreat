import React, { useState } from "react";
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
  Button
} from "@mui/material";

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
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text' },
      { name: 'lastName', label: 'Last Name', type: 'text' },
      { name: 'referral', label: 'How did you hear about us?', type: 'text' },
      { name: 'meds', label: 'List all medications taken', type: 'text' },
      { name: 'allergies', label: 'Allergies', type: 'text' },
      { name: 'physician', label: 'Are you currently under care of a physician? If yes, for what condition(s)?', type: 'text' },
      { name: 'pregnant', label: 'Are you pregnant?', type: 'radio', options: ['Yes','No'] },
      { name: 'treatedFor', label: 'Please check conditions you have been treated for', type: 'text' },
      { name: 'stressLevel', label: 'Daily stress level (1-10)', type: 'text' },
      { name: 'water', label: 'How much water do you drink a day?', type: 'text' },
      { name: 'procedures', label: 'Do you receive any of the following regularly?', type: 'text' },
      { name: 'otherProcedures', label: 'If other, please specify', type: 'text' }
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

export default function WaiverForms() {
  const [selected, setSelected] = useState(null);
  const [values, setValues]     = useState({});

  const handleSelect = (key) => {
    setSelected(key);
    setValues({});
  };

  const handleChange = (name) => (e) => {
    setValues(v => ({ ...v, [name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) {
      toast.error("Please select a waiver type first.");
      return;
    }
    // validate required
    const required = waiverConfigs[selected].fields.map(f => f.name);
    const missing = required.filter(name => !values[name] || values[name].toString().trim() === '');
    if (missing.length) {
      toast.error("Please fill all required fields before submitting.");
      return;
    }

    try {
      await axios.post('/api/waivers', { waiverType: selected, formData: values });
      toast.success('Waiver submitted successfully!');
      setSelected(null);
      setValues({});
    } catch (error) {
      console.error('Submission error', error);
      toast.error('Failed to submit waiver. Please try again.');
    }
  };

  return (
    <Container sx={{ mt:4, mb:4 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontFamily: "Courier New, monospace" }}>
        Select Waiver
      </Typography>
      <Grid container spacing={2} sx={{ mb:4, alignItems: 'stretch' }}>
        {Object.entries(waiverConfigs).map(([key, cfg]) => (
          <Grid key={key} item xs={12} sm={6} md={3}>
            <Paper
              onClick={() => handleSelect(key)}
              sx={{
                p:2,
                cursor:'pointer',
                textAlign:'center',
                border: selected===key ? t => `2px solid ${t.palette.primary.main}` : '1px solid #ccc'
              }}
            >
              <Typography>{cfg.title}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {selected && (
        <Paper sx={{ p:3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontFamily: "Courier New, monospace" }}>
            {waiverConfigs[selected].title}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display:'grid', gap:2 }}>
            {waiverConfigs[selected].fields.map(f => (
              f.type === 'radio' ? (
                <FormControl key={f.name}>
                  <FormLabel>{f.label}</FormLabel>
                  <RadioGroup row name={f.name} value={values[f.name]||''} onChange={handleChange(f.name)}>
                    {f.options.map(opt => (
                      <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
                    ))}
                  </RadioGroup>
                </FormControl>
              ) : f.type === 'textarea' ? (
                <TextField
                  key={f.name}
                  label={f.label}
                  multiline
                  rows={3}
                  value={values[f.name]||''}
                  onChange={handleChange(f.name)}
                  fullWidth
                />
              ) : (
                <TextField
                  key={f.name}
                  label={f.label}
                  type={f.type}
                  value={values[f.name]||''}
                  onChange={handleChange(f.name)}
                  fullWidth
                />
              )
            ))}
            <Button type="submit" variant="contained">Submit Waiver</Button>
          </Box>
        </Paper>
      )}

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </Container>
  );
}
