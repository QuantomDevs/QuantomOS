import { Box, Typography, IconButton, Popover, List, ListItem, CircularProgress } from '@mui/material';
import { ChevronLeft, ChevronRight, Event as EventIcon, ErrorOutline } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { responsiveTypography, responsiveSpacing, responsiveIcons, responsiveGap } from '../../../../utils/responsiveStyles';

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    description?: string;
    location?: string;
    allDay?: boolean;
}

interface CalendarWidgetProps {
    config?: {
        enableIcal?: boolean;
        icalUrl?: string;
        showLabel?: boolean;
        displayName?: string;
    };
    previewMode?: boolean;
    editMode?: boolean;
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ config, previewMode = false }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedDateEvents, setSelectedDateEvents] = useState<CalendarEvent[]>([]);

    const enableIcal = config?.enableIcal === true;
    const icalUrl = config?.icalUrl || '';
    const showLabel = config?.showLabel !== false;
    const displayName = config?.displayName || 'Calendar';

    // Fetch iCal events
    useEffect(() => {
        if (!enableIcal || !icalUrl || previewMode) return;

        const fetchEvents = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await axios.post('/api/calendar/fetch-ical', {
                    icalUrl
                });

                const parsedEvents = response.data.events.map((e: any) => ({
                    ...e,
                    start: new Date(e.start),
                    end: new Date(e.end)
                }));

                setEvents(parsedEvents);
            } catch (err) {
                console.error('Error fetching calendar events:', err);
                setError('Failed to load calendar events');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, [enableIcal, icalUrl, previewMode]);

    const handlePreviousMonth = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() - 1);
            return newDate;
        });
    };

    const handleNextMonth = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + 1);
            return newDate;
        });
    };

    const handleDayClick = (day: number, hasEvents: boolean, event: React.MouseEvent<HTMLElement>) => {
        if (!hasEvents) return;

        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(clickedDate);

        const dayEvents = events.filter(e => {
            const eventDate = new Date(e.start);
            return eventDate.getFullYear() === clickedDate.getFullYear() &&
                   eventDate.getMonth() === clickedDate.getMonth() &&
                   eventDate.getDate() === clickedDate.getDate();
        });

        setSelectedDateEvents(dayEvents);
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
        setSelectedDate(null);
        setSelectedDateEvents([]);
    };

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        const day = new Date(year, month, 1).getDay();
        // Convert Sunday (0) to 7 to make Monday first day
        return day === 0 ? 6 : day - 1;
    };

    const hasEventsOnDay = (day: number) => {
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return events.some(event => {
            const eventDate = new Date(event.start);
            return eventDate.getFullYear() === checkDate.getFullYear() &&
                   eventDate.getMonth() === checkDate.getMonth() &&
                   eventDate.getDate() === checkDate.getDate();
        });
    };

    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() &&
               currentDate.getMonth() === today.getMonth() &&
               currentDate.getFullYear() === today.getFullYear();
    };

    const isWeekend = (dayIndex: number) => {
        return dayIndex === 5 || dayIndex === 6; // Saturday or Sunday
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];

        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            days.push(
                <Box key={`empty-${i}`} sx={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
            );
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const hasEvents = hasEventsOnDay(day);
            const isTodayDate = isToday(day);

            days.push(
                <Box
                    key={day}
                    onClick={(e) => hasEvents && handleDayClick(day, hasEvents, e)}
                    sx={{
                        aspectRatio: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        cursor: hasEvents ? 'pointer' : 'default',
                        borderRadius: '4px',
                        backgroundColor: isTodayDate ? 'var(--color-primary-accent)' : 'transparent',
                        '&:hover': hasEvents ? {
                            backgroundColor: 'var(--color-hover-background)'
                        } : {},
                        transition: 'all 0.2s ease'
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: isTodayDate ? 'white' : 'var(--color-primary-text)',
                            fontWeight: isTodayDate ? 700 : 500,
                            fontSize: responsiveTypography.body2
                        }}
                    >
                        {day}
                    </Typography>
                    {hasEvents && (
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 2,
                                width: '4px',
                                height: '4px',
                                borderRadius: '50%',
                                backgroundColor: isTodayDate ? 'white' : 'var(--color-primary-accent)'
                            }}
                        />
                    )}
                </Box>
            );
        }

        return days;
    };

    // Show configuration message if iCal is not enabled
    if (!enableIcal && !previewMode) {
        return (
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 2,
                    textAlign: 'center',
                    backgroundColor: 'var(--color-widget-background)',
                    borderRadius: '8px'
                }}
            >
                <EventIcon sx={{ fontSize: responsiveIcons.xlarge, color: 'var(--color-secondary-text)', mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'var(--color-primary-text)', mb: 1 }}>
                    Calendar Not Configured
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--color-secondary-text)' }}>
                    Enable iCal integration and configure a URL in the widget settings
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'var(--color-widget-background-transparent)',
                borderRadius: '8px',
                overflow: 'hidden'
            }}
        >
            {showLabel && (
                <Box
                    sx={{
                        padding: `${responsiveSpacing.sm} ${responsiveSpacing.md}`,
                        borderBottom: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-secondary-background)'
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        sx={{
                            color: 'var(--color-primary-text)',
                            fontWeight: 600,
                            fontSize: responsiveTypography.subtitle2
                        }}
                    >
                        {displayName}
                    </Typography>
                </Box>
            )}

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 1 }}>
                {/* Month Navigation */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 2
                    }}
                >
                    <IconButton
                        size="small"
                        onClick={handlePreviousMonth}
                        sx={{ color: 'var(--color-primary-text)' }}
                    >
                        <ChevronLeft />
                    </IconButton>

                    <Typography variant="subtitle1" sx={{ color: 'var(--color-primary-text)', fontWeight: 600, fontSize: responsiveTypography.subtitle1 }}>
                        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </Typography>

                    <IconButton
                        size="small"
                        onClick={handleNextMonth}
                        sx={{ color: 'var(--color-primary-text)' }}
                    >
                        <ChevronRight />
                    </IconButton>
                </Box>

                {/* Weekday Headers */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: responsiveGap.sm, marginBottom: responsiveGap.sm }}>
                    {DAYS_OF_WEEK.map((day, index) => (
                        <Box
                            key={day}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0.5
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: isWeekend(index) ? 'var(--color-primary-accent)' : 'var(--color-secondary-text)',
                                    fontWeight: 600,
                                    fontSize: responsiveTypography.small
                                }}
                            >
                                {day}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* Calendar Grid */}
                {isLoading ? (
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress size={32} sx={{ color: 'var(--color-primary-accent)' }} />
                    </Box>
                ) : error ? (
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <ErrorOutline sx={{ fontSize: responsiveIcons.large, color: 'var(--color-error)', mb: 1 }} />
                        <Typography variant="caption" sx={{ color: 'var(--color-error)' }}>
                            {error}
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: responsiveGap.sm, flex: 1 }}>
                        {renderCalendar()}
                    </Box>
                )}
            </Box>

            {/* Event Popover */}
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                slotProps={{
                    backdrop: {
                        sx: {
                            backgroundColor: 'rgba(0, 0, 0, 0.3)'
                        }
                    }
                }}
                PaperProps={{
                    sx: {
                        backgroundColor: 'var(--color-secondary-background)',
                        backgroundImage: 'none',
                        maxWidth: 300,
                        maxHeight: 400,
                        border: '1px solid var(--color-border)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
                    }
                }}
            >
                <Box sx={{ p: 2 }}>
                    {selectedDate && (
                        <Typography variant="subtitle2" sx={{ color: 'var(--color-primary-text)', fontWeight: 600, mb: 1 }}>
                            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </Typography>
                    )}
                    {selectedDateEvents.length > 0 ? (
                        <List sx={{ p: 0 }}>
                            {selectedDateEvents.map(event => {
                                try {
                                    // Ensure start and end are valid Date objects
                                    const startDate = event.start instanceof Date ? event.start : new Date(event.start);
                                    const endDate = event.end instanceof Date ? event.end : new Date(event.end);

                                    // Check if dates are valid
                                    const isValidStart = !isNaN(startDate.getTime());
                                    const isValidEnd = !isNaN(endDate.getTime());

                                    let timeDisplay = 'All Day';
                                    if (!event.allDay && isValidStart && isValidEnd) {
                                        const startTime = startDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                                        const endTime = endDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                                        timeDisplay = `${startTime} - ${endTime}`;
                                    }

                                    return (
                                        <ListItem key={event.id} sx={{ px: 0, py: 1, flexDirection: 'column', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', '&:last-child': { borderBottom: 'none' } }}>
                                            <Typography variant="body2" sx={{ color: 'var(--color-primary-text)', fontWeight: 600 }}>
                                                {event.title || 'Untitled Event'}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'var(--color-secondary-text)' }}>
                                                {timeDisplay}
                                            </Typography>
                                            {event.location && (
                                                <Typography variant="caption" sx={{ color: 'var(--color-secondary-text)', mt: 0.5 }}>
                                                    📍 {event.location}
                                                </Typography>
                                            )}
                                            {event.description && (
                                                <Typography variant="caption" sx={{ color: 'var(--color-muted-text)', mt: 0.5, wordBreak: 'break-word' }}>
                                                    {event.description}
                                                </Typography>
                                            )}
                                        </ListItem>
                                    );
                                } catch (error) {
                                    console.error('Error rendering event:', error, event);
                                    return (
                                        <ListItem key={event.id} sx={{ px: 0, py: 1 }}>
                                            <Typography variant="caption" sx={{ color: 'var(--color-error)' }}>
                                                Error displaying event
                                            </Typography>
                                        </ListItem>
                                    );
                                }
                            })}
                        </List>
                    ) : (
                        <Typography variant="body2" sx={{ color: 'var(--color-secondary-text)', textAlign: 'center', py: 2 }}>
                            No events for this date
                        </Typography>
                    )}
                </Box>
            </Popover>
        </Box>
    );
};
