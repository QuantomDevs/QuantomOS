# Extension Development Documentation

Complete guide for creating custom QuantomOS widgets using the JSON-based extension system.

## Getting Started

- **[Extension Development Guide](./extension-development-guide.md)** - Complete tutorial for building extensions
- **[Extension Structure](./extension-structure.md)** - Detailed JSON schema and required fields

## Configuration

- **[Settings Reference](./settings-reference.md)** - All available setting types and options
- **[Template System](./template-system.md)** - Dynamic content with placeholders and variables

## Styling and Theming

- **[Shadow DOM Guide](./shadow-dom-guide.md)** - Style isolation and theme integration

## Development Resources

- **[API Reference](./api-reference.md)** - Available JavaScript APIs for extensions
- **[Best Practices](./best-practices.md)** - Code quality, performance, and security guidelines
- **[Examples](./examples.md)** - Complete extension examples to learn from

## Troubleshooting

- **[Troubleshooting](./troubleshooting.md)** - Common issues and solutions

## Quick Reference

### Minimal Extension

```json
{
  "id": "my-widget",
  "name": "myWidget",
  "title": "My Widget",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "Widget description",
  "html": "<div>Hello World</div>"
}
```

### Extension with Settings

```json
{
  "id": "my-widget",
  "name": "myWidget",
  "title": "My Widget",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "Configurable widget",
  "settings": [
    {
      "id": "message",
      "name": "Message",
      "type": "text",
      "defaultValue": "Hello",
      "description": "Message to display"
    }
  ],
  "html": "<div>{{message}}</div>",
  "css": "div { color: var(--color-accent); }",
  "javascript": "console.log('Widget loaded');"
}
```

## Extension Workflow

1. **Create**: Write JSON extension file in `/extensions` directory
2. **Test**: Extension appears automatically in widget selector
3. **Configure**: Add widget to dashboard and test settings
4. **Refine**: Iterate on design and functionality
5. **Share**: Submit to marketplace or share with community

## Need Help?

- Check the [Troubleshooting Guide](./troubleshooting.md)
- Review [Examples](./examples.md) for inspiration
- Ask questions in [GitHub Discussions](https://github.com/QuantomDevs/quantomos/discussions)
- Report bugs in [GitHub Issues](https://github.com/QuantomDevs/quantomos/issues)

## Contributing Extensions

Share your extensions with the community:
1. Create well-documented extension
2. Test thoroughly
3. Submit to marketplace repository
4. Help others with questions

---

**Happy extension building!** 🚀
