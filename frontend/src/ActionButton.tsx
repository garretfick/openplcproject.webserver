import React from 'react';
import { Tooltip, IconButton } from '@chakra-ui/react';

export interface ActionButtonProps {
    /**
     * The icon to be used in the button.
     */
    icon: React.ReactElement;

    /**
     * The name of the action.
     */
    actionName: string;

    /**
     * Human friendly name for the item.
     */
    itemName: string;

    /**
     * Identifier for the item. The identifier is supplied to the
     * callback when the button is clicked.
     */
    itemId: string;

    action: (itemId: string) => void;
}

function ActionButton(props: ActionButtonProps) {
    const onClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        const itemId = event.currentTarget.dataset.id;
        if (itemId) {
            props.action(itemId);
        }
    };
    return (
        <Tooltip label={props.actionName + props.itemName}>
            <IconButton
                aria-label={props.actionName + props.itemName}
                icon={props.icon}
                onClick={onClickHandler}
                data-id={props.itemId}
                marginRight={1}
            />
        </Tooltip>
    );
}

export default ActionButton;
