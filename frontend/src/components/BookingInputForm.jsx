import React, { memo, useCallback, useState } from 'react';
import { TextField, Button, Card, CardContent, Grid2, Autocomplete } from '@mui/material';
import PropTypes from "prop-types";

const ComboBox = ({
                      categories,
                      name,
                      category,
                      description,
                      pricing,
                      duration,
                      onServiceChange,
                      onAddService
                  }) => {
    // Local state to track validation errors for duration.
    const [durationError, setDurationError] = useState(false);

    // Regex pattern expects one or more digits followed by a space and then one of the units.
    // It also allows an optional trailing "s" for plural.
    const durationPattern = /^\d+\s*(second|minute|hour)s?$/i;

    const handleNameChange = useCallback((e) => {
        onServiceChange('name', e.target.value);
    }, [onServiceChange]);

    const handleCategoryInputChange = useCallback((event, newInputValue) => {
        onServiceChange('category', newInputValue);
    }, [onServiceChange]);

    const handleCategoryChange = useCallback((event, newValue) => {
        onServiceChange('category', typeof newValue === 'string' ? newValue : newValue || '');
    }, [onServiceChange]);

    const handleDescriptionChange = useCallback((e) => {
        onServiceChange('description', e.target.value);
    }, [onServiceChange]);

    // Use type="number" for pricing to restrict the input to numeric values.
    const handlePricingChange = useCallback((e) => {
        onServiceChange('pricing', e.target.value);
    }, [onServiceChange]);

    // Validate duration input on change and set error state if it doesn't match the pattern.
    const handleDurationChange = useCallback((e) => {
        const value = e.target.value;
        onServiceChange('duration', value);
        setDurationError(value.length > 0 && !durationPattern.test(value));
    }, [onServiceChange, durationPattern]);

    const handleImageChange = useCallback((e) => {
        const file = e.target?.files?.[0];
        if (!file) return;
        onServiceChange('servicePicture', file);
        // Optionally, show a preview:
        const previewUrl = URL.createObjectURL(file);
        onServiceChange('preview', previewUrl);
    }, [onServiceChange]);

    return (
        <Card sx={{ minWidth: 350 }}>
            <CardContent>
                <Grid2 container direction="column" spacing={2}>
                    <Grid2 item>
                        <TextField
                            label="Service Name"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={name}
                            onChange={handleNameChange}
                        />
                    </Grid2>
                    <Grid2 item>
                        <Autocomplete
                            freeSolo
                            options={categories}
                            value={category}
                            inputValue={category}
                            onInputChange={handleCategoryInputChange}
                            onChange={handleCategoryChange}
                            renderInput={(params) => (
                                <TextField {...params} label="Category" variant="outlined" size="small" />
                            )}
                        />
                    </Grid2>
                    <Grid2 item>
                        <TextField
                            label="Description"
                            variant="outlined"
                            size="small"
                            multiline
                            fullWidth
                            rows={4}
                            maxRows={4}
                            value={description}
                            onChange={handleDescriptionChange}
                        />
                    </Grid2>
                    <Grid2 item>
                        <TextField
                            label="Duration"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={duration}
                            onChange={handleDurationChange}
                            error={durationError}
                            helperText={
                                durationError
                                    ? 'Duration must be formatted like "1 second", "30 minutes", or "2 hours".'
                                    : 'Format: e.g., 1 second, 30 minutes, or 2 hours'
                            }
                            inputProps={{
                                // The pattern attribute gives basic browser validation.
                                pattern: "\\d+\\s*(second|minute|hour)s?",
                            }}
                        />
                    </Grid2>
                    <Grid2 item>
                        <TextField
                            label="Price"
                            variant="outlined"
                            size="small"
                            fullWidth
                            type="number"
                            value={pricing}
                            onChange={handlePricingChange}
                            inputProps={{
                                min: 0,
                                step: "0.01",
                            }}
                        />
                    </Grid2>
                    <Grid2 item>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                    </Grid2>
                    <Grid2 item>
                        <Button variant="contained" fullWidth onClick={onAddService} disabled={durationError}>
                            Add Service
                        </Button>
                    </Grid2>
                </Grid2>
            </CardContent>
        </Card>
    );
};

ComboBox.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    pricing: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    onServiceChange: PropTypes.func.isRequired,
    onAddService: PropTypes.func.isRequired
};

export default memo(ComboBox);
