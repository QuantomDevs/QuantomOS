# API Reference

Complete reference for QuantomOS frontend and backend APIs.

## Frontend APIs

### React Hooks

#### `useApi<T>(apiFunction)`

Unified hook for API calls with loading, error, and data state.

```typescript
import { useApi } from '../hooks/useApi';

function MyComponent() {
  const { data, isLoading, error, execute } = useApi(apiFunction);

  useEffect(() => {
    execute();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return <div>{/* Use data */}</div>;
}
```

#### `useToast()`

Display toast notifications.

```typescript
const { showToast } = useToast();

showToast('Operation successful', { type: 'success' });
showToast('Error occurred', { type: 'error' });
showToast('Warning message', { type: 'warning' });
showToast('Information', { type: 'info' });
```

### Context API

#### `AppContext`

Global application state.

```typescript
import { useAppContext } from '../context/AppContextProvider';

function MyComponent() {
  const {
    user,          // Current user
    config,        // Dashboard configuration
    layout,        // Widget layout
    updateConfig,  // Update configuration
    updateLayout,  // Update layout
  } = useAppContext();
}
```

### API Client (`dash-api.ts`)

#### Authentication

```typescript
import { authApi } from '../api/dash-api';

// Login
await authApi.login(password);

// Logout
await authApi.logout();

// Get current user
const user = await authApi.getCurrentUser();
```

#### Configuration

```typescript
import { configApi } from '../api/dash-api';

// Get configuration
const config = await configApi.getConfig();

// Update configuration
await configApi.updateConfig(newConfig);

// Get layout
const layout = await configApi.getLayout();

// Update layout
await configApi.updateLayout(newLayout);
```

#### Media

```typescript
import { mediaApi } from '../api/dash-api';

// Upload wallpaper
await mediaApi.uploadWallpaper(file);

// Upload icon
await mediaApi.uploadIcon(file);

// Delete media
await mediaApi.deleteMedia(filename);
```

---

## Backend APIs

### Authentication Endpoints

#### `POST /api/auth/login`

Authenticate user.

**Request Body**:
```json
{
  "password": "string"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "username": "string",
    "profilePicture": "string"
  }
}
```

#### `POST /api/auth/logout`

Logout current user.

**Response**:
```json
{
  "success": true
}
```

#### `GET /api/auth/user`

Get current authenticated user.

**Response**:
```json
{
  "username": "string",
  "profilePicture": "string"
}
```

### Configuration Endpoints

#### `GET /api/config`

Get dashboard configuration.

**Response**:
```json
{
  "title": "string",
  "searchEnabled": boolean,
  "searchProvider": "string",
  "publicAccess": boolean,
  "background": {
    "type": "image" | "color",
    "value": "string",
    "blur": number
  },
  "theme": { ... },
  "pages": [ ... ]
}
```

#### `POST /api/config`

Update dashboard configuration.

**Request Body**: Same as GET response

#### `GET /api/config/layout`

Get widget layout.

**Response**:
```json
{
  "desktop": [ ... ],
  "mobile": [ ... ]
}
```

#### `POST /api/config/layout`

Update widget layout.

### Media Endpoints

#### `POST /api/media/upload/wallpaper`

Upload background image.

**Request**: multipart/form-data with file

**Response**:
```json
{
  "success": true,
  "filename": "string",
  "url": "string"
}
```

#### `POST /api/media/upload/icon`

Upload icon.

**Request**: multipart/form-data with file

#### `DELETE /api/media/:filename`

Delete uploaded media.

### Extension Endpoints

#### `GET /api/extensions`

Get all custom extensions.

**Response**:
```json
[
  {
    "id": "string",
    "name": "string",
    "title": "string",
    "version": "string",
    "author": "string",
    "description": "string",
    "settings": [ ... ],
    "html": "string",
    "css": "string",
    "javascript": "string"
  }
]
```

### Calendar Endpoints

#### `POST /api/calendar/fetch-ical`

Fetch and parse iCal feed.

**Request Body**:
```json
{
  "icalUrl": "string"
}
```

**Response**:
```json
{
  "events": [
    {
      "start": "ISO date",
      "end": "ISO date",
      "title": "string",
      "description": "string"
    }
  ]
}
```

### System Endpoints

#### `GET /api/system/info`

Get system information.

**Response**:
```json
{
  "cpu": {
    "usage": number,
    "temperature": number
  },
  "memory": {
    "total": number,
    "used": number,
    "free": number
  },
  "network": {
    "upload": number,
    "download": number
  }
}
```

#### `GET /api/system/disks`

Get disk information.

**Response**:
```json
[
  {
    "name": "string",
    "mount": "string",
    "total": number,
    "used": number,
    "available": number,
    "filesystem": "string"
  }
]
```

---

## TypeScript Types

### Common Types

```typescript
// User
interface User {
  username: string;
  profilePicture?: string;
}

// Configuration
interface Config {
  title: string;
  searchEnabled: boolean;
  searchProvider: string;
  publicAccess: boolean;
  background: {
    type: 'image' | 'color';
    value: string;
    blur: number;
  };
  theme: Record<string, string>;
  pages: Page[];
}

// Page
interface Page {
  id: string;
  name: string;
  widgets: Widget[];
}

// Widget
interface Widget {
  id: string;
  type: ITEM_TYPE;
  config: Record<string, any>;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

// Widget Types
enum ITEM_TYPE {
  WEATHER_WIDGET = 'WEATHER_WIDGET',
  DATE_TIME_WIDGET = 'DATE_TIME_WIDGET',
  SYSTEM_MONITOR_WIDGET = 'SYSTEM_MONITOR_WIDGET',
  // ... etc
}
```

---

## Error Handling

### HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **429**: Too Many Requests (rate limited)
- **500**: Internal Server Error

### Error Response Format

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Rate Limiting

- **Login**: 5 attempts per 15 minutes
- **API Calls**: 100 requests per 15 minutes
- **Uploads**: 10 uploads per hour

Exceeded limits return 429 status with retry-after header.

---

## Authentication

All protected endpoints require JWT token:
- Token sent as httpOnly cookie
- Token expires after 24 hours
- Refresh on activity

**Headers**:
```
Cookie: token=<jwt_token>
```

---

## CORS

CORS enabled for development:
- Origin: http://localhost:5173
- Credentials: true

Production uses same-origin policy.

---

## For More Information

- [Introduction & Architecture](./01-introduction.md)
- [Extension API Reference](../extensions/api-reference.md)
- [Contributing Guide](../contributing/01-how-to-contribute.md)
