# vanilla-todo.bytim.dev

Demo todo app created with vanilla TypeScript.

## Things I learned along the way

### Using web components with Vite

When running a build, Vite wants to take all of the imported CSS, code split it, and combine it into a single CSS 
asset.

This poses a problem with web components:

- If you attempt to include styles by appending a `<link>` element to the component's shadow root, that linked .css 
file will not resolve.
- If you attempt to include styles by adding a `<style>` element, Vite will extract it and inline the styles. This 
will prevent the `<style>` from being attached to the shadow root.

Without the styles being attached to the shadow root, you'll end up with unstyled components.

To prevent this, I ended up doing the following:

1. In the component's .ts file, include the raw contents as a string:

```ts
import css from "./alert.component.css?raw"
```

2. Create a `<style>` element and set that variable as its `innerHTML`:

```ts
const styles = document.createElement("style");
styles.innerHTML = css;
this.shadowRoot.appendChild(styles);
```

3. In tsconfig.json, add ".css" to the `excludes` array so it doesn't trigger "unknown module" errors.

```json
{
  "exclude": ["*.css"]
}
```
