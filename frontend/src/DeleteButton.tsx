import React, { useState } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import ActionButton from './ActionButton';
import ConfirmDialog from './ConfirmDialog';

interface DeleteButtonProps {
    /**
     * The user visible name of the item. Appears in accessibility text.
     */
    itemName: string;

    /**
     * The identifier for this item. This identifier is supplied to
     * identify the item when delete is confirmed.
     */
    itemId: string;

    /**
     * The title text for the delete dialog.
     */
    confirmTitle: string;
    /**
     * The text that must be input in order to delete the item.
     */
    confirmText: string;

    onDelete: (itemId: string) => void;
}

function DeleteButton(props: DeleteButtonProps) {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = (item: string) => {
        setShowConfirm(true);
    };

    return (
        <>
            <ActionButton
                icon={<DeleteIcon />}
                actionName="Delete "
                itemName={props.itemName}
                itemId={props.itemId}
                action={handleDelete}
            />
            {showConfirm && (
                <ConfirmDialog
                    title={props.confirmTitle}
                    message={props.confirmText}
                    confirmText={props.itemName}
                    onClose={() => {
                        setShowConfirm(false);
                    }}
                    onConfirm={() => {
                        setShowConfirm(false);
                        props.onDelete(props.itemId);
                    }}
                />
            )}
        </>
    );
}

export default DeleteButton;
