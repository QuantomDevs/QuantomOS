# Extension Examples

Collection of complete, well-commented extension examples demonstrating various features and techniques.

## Simple Text Display

Basic extension showing custom text:

```json
{
  "id": "simple-text",
  "name": "simpleText",
  "title": "Simple Text Widget",
  "version": "1.0.0",
  "author": "QuantomOS",
  "description": "Display customizable text in a styled box",
  "settings": [
    {
      "id": "message",
      "name": "Message",
      "type": "text",
      "defaultValue": "Hello, World!",
      "description": "Text to display"
    },
    {
      "id": "textColor",
      "name": "Text Color",
      "type": "text",
      "defaultValue": "#ffffff",
      "description": "Hex color code"
    }
  ],
  "html": "<div class=\"text-widget\"><h2 style=\"color: {{textColor}}\">{{message}}</h2></div>",
  "css": ".text-widget { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--color-widget-background); border-radius: 12px; padding: 2rem; }",
  "javascript": "console.log('Text widget loaded with message:', '{{message}}');"
}
```

## Weather Display

Extension fetching live weather data:

```json
{
  "id": "weather-widget",
  "name": "weatherWidget",
  "title": "Weather Widget",
  "version": "1.2.0",
  "author": "QuantomOS",
  "description": "Display current weather for any location",
  "settings": [
    {
      "id": "city",
      "name": "City",
      "type": "text",
      "defaultValue": "London",
      "description": "City name for weather data"
    },
    {
      "id": "apiKey",
      "name": "API Key",
      "type": "text",
      "defaultValue": "",
      "description": "OpenWeatherMap API key"
    },
    {
      "id": "units",
      "name": "Units",
      "type": "text",
      "defaultValue": "metric",
      "description": "Temperature units (metric or imperial)"
    },
    {
      "id": "refreshInterval",
      "name": "Refresh Interval (seconds)",
      "type": "number",
      "defaultValue": 600,
      "description": "How often to update weather data"
    }
  ],
  "html": "<div class=\"weather-container\"><div class=\"loading\">Loading weather...</div><div class=\"weather-data\" style=\"display: none;\"><h2 class=\"city-name\"></h2><div class=\"temperature\"></div><div class=\"description\"></div><div class=\"details\"></div></div><div class=\"error\" style=\"display: none;\"></div></div>",
  "css": ".weather-container { width: 100%; height: 100%; padding: 1.5rem; background: var(--color-widget-background); border-radius: 12px; color: var(--color-primary-text); } .loading { text-align: center; padding: 2rem; color: var(--color-secondary-text); } .weather-data { text-align: center; } .city-name { font-size: 1.5rem; margin-bottom: 1rem; } .temperature { font-size: 3rem; font-weight: bold; color: var(--color-primary-accent); } .description { font-size: 1.2rem; margin-top: 0.5rem; text-transform: capitalize; } .details { margin-top: 1rem; font-size: 0.9rem; color: var(--color-secondary-text); } .error { color: var(--color-error); padding: 1rem; text-align: center; }",
  "javascript": "async function fetchWeather() { const apiKey = '{{apiKey}}'; const city = '{{city}}'; const units = '{{units}}'; if (!apiKey) { document.querySelector('.loading').style.display = 'none'; document.querySelector('.error').style.display = 'block'; document.querySelector('.error').textContent = 'API key required'; return; } try { const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`); if (!response.ok) throw new Error('City not found'); const data = await response.json(); document.querySelector('.loading').style.display = 'none'; document.querySelector('.weather-data').style.display = 'block'; document.querySelector('.city-name').textContent = data.name; document.querySelector('.temperature').textContent = Math.round(data.main.temp) + '°' + (units === 'metric' ? 'C' : 'F'); document.querySelector('.description').textContent = data.weather[0].description; document.querySelector('.details').innerHTML = `Humidity: ${data.main.humidity}% • Wind: ${data.wind.speed} ${units === 'metric' ? 'm/s' : 'mph'}`; } catch (error) { document.querySelector('.loading').style.display = 'none'; document.querySelector('.error').style.display = 'block'; document.querySelector('.error').textContent = 'Failed to load weather: ' + error.message; } } fetchWeather(); setInterval(fetchWeather, {{refreshInterval}} * 1000);"
}
```

## Countdown Timer

Interactive countdown extension:

```json
{
  "id": "countdown-timer",
  "name": "countdownTimer",
  "title": "Countdown Timer",
  "version": "1.0.0",
  "author": "QuantomOS",
  "description": "Countdown to a specific date and time",
  "settings": [
    {
      "id": "targetDate",
      "name": "Target Date",
      "type": "text",
      "defaultValue": "2025-12-31T23:59:59",
      "description": "Date in format: YYYY-MM-DDTHH:MM:SS"
    },
    {
      "id": "eventName",
      "name": "Event Name",
      "type": "text",
      "defaultValue": "New Year",
      "description": "Name of the event"
    },
    {
      "id": "showSeconds",
      "name": "Show Seconds",
      "type": "boolean",
      "defaultValue": true,
      "description": "Display seconds in countdown"
    }
  ],
  "html": "<div class=\"countdown-widget\"><h2 class=\"event-name\">{{eventName}}</h2><div class=\"countdown\"><div class=\"time-unit\"><span class=\"value\" id=\"days\">0</span><span class=\"label\">Days</span></div><div class=\"time-unit\"><span class=\"value\" id=\"hours\">0</span><span class=\"label\">Hours</span></div><div class=\"time-unit\"><span class=\"value\" id=\"minutes\">0</span><span class=\"label\">Minutes</span></div><div class=\"time-unit\" style=\"display: {{showSeconds ? 'flex' : 'none'}}\"><span class=\"value\" id=\"seconds\">0</span><span class=\"label\">Seconds</span></div></div></div>",
  "css": ".countdown-widget { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--color-widget-background); border-radius: 12px; padding: 2rem; } .event-name { color: var(--color-primary-text); margin-bottom: 2rem; text-align: center; } .countdown { display: flex; gap: 1.5rem; flex-wrap: wrap; justify-content: center; } .time-unit { display: flex; flex-direction: column; align-items: center; min-width: 80px; } .value { font-size: 3rem; font-weight: bold; color: var(--color-primary-accent); line-height: 1; } .label { font-size: 0.9rem; color: var(--color-secondary-text); margin-top: 0.5rem; text-transform: uppercase; letter-spacing: 1px; }",
  "javascript": "function updateCountdown() { const target = new Date('{{targetDate}}').getTime(); const now = new Date().getTime(); const distance = target - now; if (distance < 0) { document.querySelector('.countdown').innerHTML = '<p style=\"color: var(--color-primary-accent); font-size: 1.5rem\">Event has arrived!</p>'; return; } const days = Math.floor(distance / (1000 * 60 * 60 * 24)); const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)); const seconds = Math.floor((distance % (1000 * 60)) / 1000); document.getElementById('days').textContent = days; document.getElementById('hours').textContent = hours.toString().padStart(2, '0'); document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0'); if ({{showSeconds}}) { document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0'); } } updateCountdown(); setInterval(updateCountdown, 1000);"
}
```

## RSS Feed Reader

Extension displaying RSS feeds:

```json
{
  "id": "rss-reader",
  "name": "rssReader",
  "title": "RSS Feed Reader",
  "version": "1.0.0",
  "author": "QuantomOS",
  "description": "Display latest items from an RSS feed",
  "settings": [
    {
      "id": "feedUrl",
      "name": "Feed URL",
      "type": "url",
      "defaultValue": "https://example.com/rss",
      "description": "URL to RSS or Atom feed"
    },
    {
      "id": "maxItems",
      "name": "Max Items",
      "type": "number",
      "defaultValue": 5,
      "description": "Number of items to display"
    },
    {
      "id": "updateInterval",
      "name": "Update Interval (minutes)",
      "type": "number",
      "defaultValue": 30,
      "description": "How often to refresh feed"
    }
  ],
  "html": "<div class=\"rss-widget\"><h2 class=\"feed-title\">Loading...</h2><div class=\"feed-items\"></div></div>",
  "css": ".rss-widget { width: 100%; height: 100%; padding: 1.5rem; background: var(--color-widget-background); border-radius: 12px; overflow-y: auto; } .feed-title { color: var(--color-primary-text); margin-bottom: 1rem; font-size: 1.25rem; } .feed-items { display: flex; flex-direction: column; gap: 1rem; } .feed-item { padding: 1rem; background: var(--color-secondary-background); border-radius: 8px; border-left: 3px solid var(--color-primary-accent); transition: transform 0.2s; cursor: pointer; } .feed-item:hover { transform: translateX(4px); } .item-title { color: var(--color-primary-text); font-weight: 600; margin-bottom: 0.5rem; } .item-description { color: var(--color-secondary-text); font-size: 0.9rem; line-height: 1.4; }",
  "javascript": "async function loadFeed() { try { const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('{{feedUrl}}')}`); const data = await response.json(); if (data.status !== 'ok') throw new Error('Failed to fetch feed'); document.querySelector('.feed-title').textContent = data.feed.title; const items = data.items.slice(0, {{maxItems}}).map(item => `<div class=\"feed-item\" onclick=\"window.open('${item.link}', '_blank')\"><div class=\"item-title\">${item.title}</div><div class=\"item-description\">${item.description.substring(0, 150)}...</div></div>`).join(''); document.querySelector('.feed-items').innerHTML = items; } catch (error) { document.querySelector('.feed-title').textContent = 'Error loading feed'; document.querySelector('.feed-items').innerHTML = `<p style=\"color: var(--color-error)\">${error.message}</p>`; } } loadFeed(); setInterval(loadFeed, {{updateInterval}} * 60 * 1000);"
}
```

## Further Reading

- [Extension Structure](./extension-structure.md)
- [Settings Reference](./settings-reference.md)
- [Template System](./template-system.md)
- [Best Practices](./best-practices.md)
