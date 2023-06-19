import React from 'react';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Modal, ModalVariant } from '@patternfly/react-core/dist/dynamic/components/Modal';
import { TextContent } from '@patternfly/react-core/dist/dynamic/components/Text';
import { BugIcon } from '@patternfly/react-icons/dist/dynamic/icons/bug-icon';
import { ChromeUser } from '@redhat-cloud-services/types';
import { useDispatch, useSelector } from 'react-redux';
import { DeepRequired } from 'utility-types';

import { toggleDebuggerModal } from '../../redux/actions';
import { ReduxState } from '../../redux/store';
import { MenuToggle, MenuToggleElement } from '@patternfly/react-core/dist/dynamic/components/MenuToggle';
import { Select, SelectList, SelectOption } from '@patternfly/react-core/dist/dynamic/components/Select';

import DebuggerTable from './DebuggerTable';

import './Debugger.scss';

export type DebuggerModalProps = {
  user: DeepRequired<ChromeUser>;
};

const DebuggerModal = ({ user }: DebuggerModalProps) => {
  const isOpen = useSelector<ReduxState, boolean | undefined>(({ chrome: { isDebuggerModalOpen } }) => isDebuggerModalOpen);
  const dispatch = useDispatch();
  const setIsModalOpen = (isOpen: boolean) => dispatch(toggleDebuggerModal(isOpen));
  const [isDropdownOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string>('Entitlements');
  const menuRef = React.useRef<HTMLDivElement>(null);
  const onToggleClick = () => {
    setIsOpen(!isDropdownOpen);
  };
  const onSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, itemId: string | number | undefined) => {
    setSelected(itemId as string);
    setIsOpen(false);
  };
  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle ref={toggleRef} onClick={onToggleClick} isExpanded={isDropdownOpen} className="chr-c-debugger-dropdown">
      {selected}
    </MenuToggle>
  );

  return (
    <React.Fragment>
      <Button
        ouiaId="debugger-button"
        className="chr-c-button-debugger"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <BugIcon />
      </Button>
      <Modal
        aria-label="Debugger modal"
        isOpen={isOpen}
        className="chr-c-debugger-modal"
        variant={ModalVariant.medium}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="chr-c-debugger-content">
          <TextContent>
            <h1>Chrome Debugger</h1>
          </TextContent>
          <Select
            id="single-select"
            ref={menuRef}
            isOpen={isDropdownOpen}
            selected={selected}
            onSelect={onSelect}
            onOpenChange={(isOpen) => setIsOpen(isOpen)}
            toggle={toggle}
          >
            <SelectList>
              <SelectOption itemId="Entitlements">Entitlements</SelectOption>
              <SelectOption itemId="Roles">Roles</SelectOption>
            </SelectList>
          </Select>
          <DebuggerTable user={user} selected={selected} />
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default DebuggerModal;
