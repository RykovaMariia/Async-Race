interface BaseComponentProps {
  tagName: string;
  classNames?: string | string[];
  textContent?: string;
  parentNode?: HTMLElement;
  attributes?: AttributeElement | AttributeElement[];
}

export type TaggedElementProps = Omit<BaseComponentProps, 'tagName'>;

interface AttributeElement {
  name: string;
  value: string;
}

export class BaseComponent<T extends HTMLElement = HTMLElement> {
  protected element: T;

  constructor(props: BaseComponentProps) {
    this.element = document.createElement(props.tagName) as T;
    if (props.classNames) this.setClassName(props.classNames);
    this.setTextContent(props.textContent ?? '');
    if (props.parentNode) {
      this.insertChild(props.parentNode);
    }
    if (props.attributes instanceof Array) {
      props.attributes.forEach((attribute) => this.setAttribute(attribute));
    } else if (props.attributes) this.setAttribute(props.attributes);
  }

  getElement() {
    return this.element;
  }

  setClassName(classNames: string[] | string) {
    if (typeof classNames === 'string') {
      this.element.classList.add(classNames);
    } else {
      this.element.classList.add(...classNames);
    }
  }

  removeClassName(className: string) {
    this.element.classList.remove(className);
  }

  getTextContent() {
    return this.element.textContent;
  }

  setTextContent(text: string) {
    this.element.textContent = text;
  }

  insertChild(child: HTMLElement | BaseComponent): void {
    if (child instanceof HTMLElement) {
      this.element.append(child);
    } else this.element.append(child.getElement());
  }

  insertChildren(children: BaseComponent[]): void {
    children.forEach((el) => this.insertChild(el.getElement()));
  }

  setAttribute(attribute: AttributeElement) {
    if (attribute) {
      this.element.setAttribute(attribute.name, attribute.value);
    }
  }

  destroy() {
    this.element.remove();
  }
}
