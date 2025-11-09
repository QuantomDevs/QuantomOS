# Extension Development Guide

## Overview

This guide explains how to develop extensions for the QuantomOS-Testing modular dashboard system. Extensions are JSON-based components that can be dynamically loaded and rendered on the dashboard, featuring user-configurable settings.

## Extension Architecture

### Shadow DOM Isolation

All extensions are rendered within a **Shadow DOM** to provide complete CSS and DOM isolation. This means:

- **Style Encapsulation**: CSS styles defined in your extension will not leak out to affect other extensions or the core dashboard.
- **DOM Encapsulation**: Your extension's JavaScript operates only within its own DOM tree, preventing conflicts.
- **No Style Conflicts**: Global styles from the dashboard or other extensions will not inadvertently affect your extension.

## Extension JSON Schema

Each extension is defined by a single JSON file with the following structure:

```json
{
  "id": "unique-extension-id",
  "name": "Extension Display Name",
  "title": "Title Shown in Widget Header",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "A brief description of what this extension does.",
  "settings": [
    {
      "id": "settingId",
      "name": "Setting Label",
      "type": "text",
      "defaultValue": "Default Value",
      "description": "Help text for the setting."
    }
  ],
  "html": "<!-- Your HTML template here -->",
  "css": "/* Your CSS styles here */",
  "javascript": "// Your JavaScript code here"
}
```

### Property Definitions

| Property      | Type    | Required | Description                                                                                              |
|---------------|---------|----------|----------------------------------------------------------------------------------------------------------|
| `id`          | string  | Yes      | Unique identifier for the extension (e.g., "quick-links"). Must not contain spaces.                     |
| `name`        | string  | Yes      | The display name of the extension shown in the app library.                                              |
| `title`       | string  | Yes      | The default title shown in the header of the widget instance.                                            |
| `version`     | string  | Yes      | Semantic version number of the extension (e.g., "1.0.0").                                                |
| `author`      | string  | Yes      | The name of the author or organization.                                                                  |
| `description` | string  | Yes      | A brief description of the extension's purpose and functionality.                                        |
| `settings`    | array   | No       | An array of setting objects that allow users to configure the widget instance.                           |
| `html`        | string  | Yes      | The HTML content to be rendered in the extension's Shadow DOM. Can contain template placeholders.          |
| `css`         | string  | No       | CSS styles that will be encapsulated within the extension's Shadow DOM.                                  |
| `javascript`  | string  | No       | JavaScript code that will be executed within the extension's context, with access to `shadowRoot`.       |

### The `settings` Object

The `settings` array allows you to create a configuration form for your extension. Each object in the array represents a single setting.

```json
{
  "id": "profileName",
  "name": "Name",
  "type": "text",
  "defaultValue": "Max Mustermann",
  "description": "Your full name"
}
```

| Property         | Type             | Required | Description                                                                                |
|------------------|------------------|----------|--------------------------------------------------------------------------------------------|
| `id`             | string           | Yes      | Unique identifier for the setting. Used as the placeholder in `html` and `javascript`.     |
| `name`           | string           | Yes      | The user-friendly label displayed for this setting in the configuration form.              |
| `type`           | string           | Yes      | Defines the input type for the setting in the UI. See "Setting Types" below.               |
| `defaultValue`   | string, number, boolean | Yes      | The initial value for the setting when a new widget is created.                            |
| `description`    | string           | No       | Help text displayed below the setting input to guide the user.                             |

### Setting Types

The `type` property determines the kind of input field shown to the user.

| Type      | Description                                                                                                |
|-----------|------------------------------------------------------------------------------------------------------------|
| `text`    | A standard single-line text input.                                                                         |
| `url`     | A text input with URL validation.                                                                          |
| `number`  | A numerical input field.                                                                                   |
| `boolean` | A checkbox or toggle switch.                                                                               |
| `file`    | A file uploader. The uploaded file is stored in `/src/extensions/files/` and its path is saved as the value. |

## Templating and Data Binding

Your extension's `html` and `javascript` fields are processed by a simple but powerful templating engine. You can inject values from your `settings` directly into your code.

### Basic Placeholders

Use double curly braces `{{settingId}}` to insert the value of a setting.

```json
"settings": [{ "id": "welcomeText", "defaultValue": "Hello!", ... }],
"html": "<p>{{welcomeText}}</p>"
```
**Result**: `<p>Hello!</p>`

### Conditional Rendering with Ternary Operators

The templating engine supports ternary operators to handle conditional logic directly in your HTML, which is especially useful for `boolean` settings.

The syntax is `{{condition ? 'value-if-true' : 'value-if-false'}}`.

```json
"settings": [{ "id": "showDate", "type": "boolean", "defaultValue": true, ... }],
"html": "<div style='display: {{showDate ? \"block\" : \"none\"}};'>...</div>"
```
If `showDate` is `true`, the `div` will be visible. If `false`, it will be hidden.

## Writing Extension Styles (CSS)

Styles are encapsulated in the Shadow DOM. You can and should use the dashboard's global CSS variables to maintain a consistent look and feel.

### Key CSS Variables

```css
/* Brand Colors */
--color-primary: #fc7f2c;
--color-secondary: #228df1;

/* Background & Text */
--color-background: #0f0f0f;
--extension-background: #0D0D0D;
--color-text: #777878;
--color-text-secondary: #6b7280;

/* Borders & Spacing */
--border-color: #d1d5db;
--spacing-md: 1rem;      /* 16px */
--radius-md: 0.5rem;     /* 8px */

/* Typography */
--font-family-primary: 'Inter', sans-serif;
--font-size-base: 1rem;
--font-weight-bold: 700;

/* Transitions */
--transition-fast: 150ms ease-in-out;
```

## Writing Extension Logic (JavaScript)

Your JavaScript code is executed in a context where a `shadowRoot` variable is available, which is your entry point to the extension's DOM.

- **Always** use `shadowRoot` to query elements (e.g., `shadowRoot.getElementById('my-element')`). Do not use `document`.
- You can use setting values directly in your script. They are replaced before the script is executed.

### Example: Using a Boolean Setting

```json
"settings": [{ "id": "showDate", "type": "boolean", "defaultValue": true, ... }],
"html": "<p id='date-display'></p>",
"javascript": "if ({{showDate}}) { shadowRoot.getElementById('date-display').textContent = new Date().toLocaleDateString(); }"
```
If `showDate` is `true`, the script becomes `if (true) { ... }`, and the date is displayed.

## Complete Extension Example: Profile Card

This example demonstrates all setting types and advanced templating.

```json
{
  "id": "profile-card",
  "name": "Profile Card",
  "title": "Profilkarte",
  "version": "1.0.0",
  "author": "System",
  "description": "Eine umfassende Profilkarte, die alle Einstellungstypen demonstriert: Text, Datei-Upload, Zahl und Boolean.",
  "settings": [
    {
      "id": "profileName",
      "name": "Name",
      "type": "text",
      "defaultValue": "Max Mustermann",
      "description": "Ihr vollständiger Name"
    },
    {
      "id": "profileImage",
      "name": "Profilbild",
      "type": "file",
      "defaultValue": "",
      "description": "Ein Profilbild (wird in /src/extensions/files gespeichert)"
    },
    {
      "id": "age",
      "name": "Alter",
      "type": "number",
      "defaultValue": 25,
      "description": "Ihr Alter in Jahren"
    },
    {
      "id": "showEmail",
      "name": "E-Mail anzeigen",
      "type": "boolean",
      "defaultValue": true,
      "description": "Bestimmt, ob die E-Mail-Adresse sichtbar ist"
    },
    {
      "id": "email",
      "name": "E-Mail",
      "type": "text",
      "defaultValue": "max@example.com",
      "description": "Ihre E-Mail-Adresse"
    }
  ],
  "html": "<div class='profile-card'><div class='profile-header'><img src='{{profileImage}}' alt='{{profileName}}' class='profile-image' onerror='this.src=\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%27 height=%27100%27%3E%3Crect fill=%27%23ddd%27 width=%27100%27 height=%27100%27/%3E%3Ctext fill=%27%23999%27 x=%2750%%27 y=%2750%%27 font-size=%2718%27 text-anchor=%27middle%27 dy=%27.3em%27%3EKein Bild%3C/text%3E%3C/svg%3E"'/><div class='profile-info'><h3 class='profile-name'>{{profileName}}</h3><p class='profile-age'>Alter: {{age}} Jahre</p><p class='profile-email' style='display: {{showEmail ? \"block\" : \"none\"}};'>📧 {{email}}</p></div></div></div>",
  "css": ".profile-card { padding: var(--spacing-md); } .profile-header { display: flex; gap: var(--spacing-md); align-items: center; } .profile-image { width: 80px; height: 80px; border-radius: var(--radius-full); object-fit: cover; border: 2px solid var(--color-primary); } .profile-info { flex: 1; } .profile-name { font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); margin: 0 0 var(--spacing-xs) 0; } .profile-age, .profile-email { margin: 0; color: var(--color-text-secondary); }",
  "javascript": ""
}
```

## Testing and Debugging

1.  **Create your JSON file** in the `/src/extensions/` directory.
2.  **Restart the server** to load the new extension. It will then be available in the app library.
3.  **Use Browser DevTools**:
    -   Inspect your widget on the page.
    -   In the "Elements" panel, you will see a `#shadow-root (open)` node. Expand it to inspect the DOM and styles of your extension.
    -   Check the "Console" for any JavaScript errors originating from your extension's code.

---
**Version**: 2.0.0
**Last Updated**: 2025-10-26
**Compatible with**: QuantomOS-Testing Dashboard v2.0+
---