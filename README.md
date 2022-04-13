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
import css from "./alert.component.css?raw";
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

### Custom elements don't support dependency injection

Unfortunately, you cannot inject dependencies in a custom element's constructor. In my case, I was hoping to inject a `TasksService` class into the `ListComponent` in order to decouple the business logic from the presentation logic.

Much to my chagrin, however, this wasn't possible. When you add a custom element to the registry, you have to provide a constructor. However, there is no apparent opportunity to pass a dependency to that constructor.

As a result, I had to make a tradeoff and create a private function in the `ListComponent` to create that dependency when the component is created.

### Promisify your interactions with IndexedDB

When first reading the [MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB) docs for IndexedDB, I was a little confused about how to work with it directly because it relied on events and callbacks, but not Promises. It was hard to wrap my ahead around making this work in a predictable way, since I was so used to working with Promises to handle asynchronous operations.

I decided to create a service that would act as a wrapper around IndexedDB. This allowed me to return promises to my own code, which would be resolved or rejected when the IndexedDB event callbacks were executed.

Although a little extra work up front, it made it much easier to interface with IndexedDB within my `TasksService` class.

### How to use events to communicate between components

In order to allow a parent component to listen for events fired from a child component, the event must be composed. This can be done like so:

```typescript
button.addEventListener("click", () => {
  const completeEvent = new CustomEvent("taskComplete", {
    bubbles: true,
    composed: true,
    detail: { taskId: this.taskId },
  });
  this.dispatchEvent(completeEvent);
});
```

In this example, the event is composed and will bubble, both of which are necessary for the event to reach listeners outside of its own shadow DOM. If `composed: false` were used, the event would still bubble but not beyond the custom element's shadow DOM.

Also in this example, notice the `detail` property: this is a neat feature I discovered when learning the difference between `Event` (which I already knew about) and `CustomEvent` (which I don't recall learning before). It's a mechanism for passing data along with the event, similar to what you can do with the `EventEmitter` in Angular.

The event listener can access it like so:

```typescript
const taskId = customEvent.detail.taskId;
```

Depending on your needs, this can be an alternative to accessing properties on the event target, or simply provide additional data that wouldn't otherwise be available through dataset attributes, etc.
