export default function nameComponent(Component, newName) {
  const { [newName]: NamedComponent } = { [newName](...args) { return Component(...args) } };
  NamedComponent.displayName = newName;

  return NamedComponent;
}