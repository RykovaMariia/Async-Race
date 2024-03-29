import './button.scss';
import { BaseComponent, TaggedElementProps } from '../base-component';

export class Button extends BaseComponent<HTMLButtonElement> {
  constructor(props: TaggedElementProps, onclick?: (e: Event) => void) {
    super({ tagName: 'button', ...props });
    if (onclick) this.setOnClick(onclick);
    this.setClassName('button');
  }

  setDisableState(state: boolean) {
    this.element.disabled = state;
  }

  setOnClick(onclick: (e: Event) => void) {
    this.element.addEventListener('click', onclick);
  }

  toggleButton(button: Button) {
    this.element.parentElement?.append(button.element);
    this.destroy();
  }
}
