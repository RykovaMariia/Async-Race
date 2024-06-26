import './button.scss';
import { BaseComponent, TaggedElementProps } from 'Components/base-component';

interface ButtonProps {
  type?: string;
  onclick?: (e: Event) => void;
}

export class Button extends BaseComponent<HTMLButtonElement> {
  constructor(props: TaggedElementProps, buttonProps?: ButtonProps) {
    super({ tagName: 'button', ...props });
    if (buttonProps?.onclick) this.setOnClick(buttonProps.onclick);
    if (buttonProps?.type) this.setAttribute({ name: 'type', value: buttonProps.type });
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
