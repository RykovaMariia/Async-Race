import './winner-modal.scss';
import { BaseComponent, TaggedElementProps } from '../base-component';
import { SvgContainer } from '../svg-container/svg-container';

export class WinnerModal extends BaseComponent {
  constructor({ name, time }: { name: string; time: number }, props?: TaggedElementProps) {
    super({ tagName: 'div', ...props });
    this.setClassName('modal');

    const modalWindow = new BaseComponent({ tagName: 'div', classNames: 'modal__window' });

    const heading = new BaseComponent({ tagName: 'div', textContent: 'WINNER' });

    const text = new BaseComponent({ tagName: 'div', textContent: `${name} - ${time}s` });

    const closeSvg = new SvgContainer('close', { classNames: 'modal-close' });

    this.addEventListener('click', (e) => {
      if (
        ![modalWindow, heading, text].map((el) => el.getElement()).includes(e.target as HTMLElement)
      )
        this.destroy();
    });

    modalWindow.insertChildren([heading, closeSvg, text]);
    this.insertChild(modalWindow);
  }
}
