import axios from 'axios';
import { Request, Response, Router } from 'express';
import StatusCodes from 'http-status-codes';
import * as ical from 'node-ical';

export const calendarRoute = Router();

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    description?: string;
    location?: string;
    allDay?: boolean;
}

/**
 * POST /calendar/fetch-ical
 * Fetches and parses iCal data from a provided URL
 * Request body: { icalUrl: string }
 */
calendarRoute.post('/fetch-ical', async (req: Request, res: Response): Promise<void> => {
    try {
        const { icalUrl } = req.body;

        // Validate iCal URL
        if (!icalUrl || typeof icalUrl !== 'string') {
            res.status(StatusCodes.BAD_REQUEST).json({
                error: 'iCal URL is required and must be a string'
            });
            return;
        }

        // Validate URL format
        try {
            new URL(icalUrl);
        } catch {
            res.status(StatusCodes.BAD_REQUEST).json({
                error: 'Invalid iCal URL format'
            });
            return;
        }

        // Fetch iCal data
        const response = await axios.get(icalUrl, {
            timeout: 10000, // 10 second timeout
            headers: {
                'User-Agent': 'QuantomOS Calendar Widget',
                'Accept': 'text/calendar, text/plain, */*'
            },
            maxContentLength: 5 * 1024 * 1024 // 5MB max
        });

        const icalData = response.data;

        // Parse iCal data
        const events: CalendarEvent[] = [];

        // Parse using node-ical
        const parsedData = ical.parseICS(icalData);

        // Extract events from parsed data
        for (const key in parsedData) {
            const event = parsedData[key];

            // Only process VEVENT type
            if (event.type === 'VEVENT') {
                const startDate = event.start ? new Date(event.start) : new Date();
                const endDate = event.end ? new Date(event.end) : startDate;

                events.push({
                    id: event.uid || key,
                    title: event.summary || 'Untitled Event',
                    start: startDate,
                    end: endDate,
                    description: event.description || '',
                    location: event.location || '',
                    allDay: !event.start || typeof event.start === 'string' && event.start.length === 8 // YYYYMMDD format indicates all-day
                });

                // Handle recurring events (RRULE)
                if (event.rrule) {
                    try {
                        // Get occurrences for the next 3 months
                        const now = new Date();
                        const threeMonthsLater = new Date();
                        threeMonthsLater.setMonth(now.getMonth() + 3);

                        const dates = event.rrule.between(now, threeMonthsLater, true);

                        dates.forEach((date, index) => {
                            if (index === 0) return; // Skip first occurrence as it's already added

                            const duration = endDate.getTime() - startDate.getTime();
                            const occurrenceEnd = new Date(date.getTime() + duration);

                            events.push({
                                id: `${event.uid || key}-${date.getTime()}`,
                                title: event.summary || 'Untitled Event',
                                start: date,
                                end: occurrenceEnd,
                                description: event.description || '',
                                location: event.location || '',
                                allDay: !event.start || typeof event.start === 'string' && event.start.length === 8
                            });
                        });
                    } catch (rruleError) {
                        console.error('Error processing recurring event:', rruleError);
                        // Continue processing other events
                    }
                }
            }
        }

        // Sort events by start date
        events.sort((a, b) => a.start.getTime() - b.start.getTime());

        res.json({
            success: true,
            events,
            count: events.length
        });

    } catch (error) {
        let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        let errorMessage = 'Error fetching or parsing iCal data';

        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                statusCode = StatusCodes.GATEWAY_TIMEOUT;
                errorMessage = 'iCal fetch timeout';
            } else if (error.response) {
                statusCode = error.response.status;
                errorMessage = `iCal fetch error: ${error.response.statusText}`;
            } else if (error.code === 'ENOTFOUND') {
                statusCode = StatusCodes.BAD_REQUEST;
                errorMessage = 'Invalid iCal URL or network error';
            }

            console.error('iCal fetch error:', {
                status: statusCode,
                message: error.message,
                url: error.config?.url
            });
        } else {
            console.error('Unknown error fetching iCal:', error);
        }

        res.status(statusCode).json({ error: errorMessage });
    }
});
