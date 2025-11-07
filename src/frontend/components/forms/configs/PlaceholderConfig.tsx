import { Grid2 as Grid } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';
import { CheckboxElement, SelectElement } from 'react-hook-form-mui';

import { useTheme } from '../../../context/ThemeContext';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { COLORS } from '../../../theme/styles';
import { theme } from '../../../theme/theme';
import { FormValues } from '../AddEditForm/types';

interface PlaceholderConfigProps {
    formContext: UseFormReturn<FormValues>;
}

const PLACEHOLDER_SIZE_OPTIONS = [
    { id: 'app', label: 'App Shortcut' },
    { id: 'widget', label: 'Widget' },
    { id: 'row', label: 'Full Row' },
];

export const PlaceholderConfig = ({ formContext }: PlaceholderConfigProps) => {
    const { colorTheme } = useTheme();
    const isMobile = useIsMobile();

    return (
        <>
            <Grid>
                <SelectElement
                    label='Placeholder Size'
                    name='placeholderSize'
                    options={PLACEHOLDER_SIZE_OPTIONS}
                    required
                    fullWidth
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'text.primary',
                            },
                            '.MuiSvgIcon-root ': {
                                fill: colorTheme.primaryText,
                            },
                            '&:hover fieldset': { borderColor: colorTheme.primaryAccent },
                            '&.Mui-focused fieldset': { borderColor: colorTheme.primaryAccent, },
                        },
                        width: '100%',
                        minWidth: isMobile ? '65vw' : '20vw',
                        '& .MuiMenuItem-root:hover': {
                            backgroundColor: `${COLORS.LIGHT_GRAY_HOVER} !important`,
                        },
                        '& .MuiMenuItem-root.Mui-selected': {
                            backgroundColor: `${colorTheme.primaryAccent} !important`,
                            color: 'white',
                        },
                        '& .MuiMenuItem-root.Mui-selected:hover': {
                            backgroundColor: `${colorTheme.primaryAccent} !important`,
                            color: 'white',
                        }
                    }}
                    slotProps={{
                        inputLabel: { style: { color: colorTheme.primaryText } }
                    }}
                />
            </Grid>
        </>
    );
};
