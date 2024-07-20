export default class EventEmitter {
  constructor() {}

  addChangeListener(name, listener) {
    const listeners = this[name];
    if (!listeners) {
        this[name] = [listener];
    } else {
        listeners.push(listener);
    }
  }

  raiseChange(name) {
    const listeners = this[name];
    if (listeners) {
        listeners.forEach(listener => listener());
    }
  }

  bubbleChange(model, name) {
    model.addChangeListener(name, () => this.raiseChange(name));
  }
}
