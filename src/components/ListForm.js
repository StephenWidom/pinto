import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#app');

const ListForm = (props) => {
    const { isModalOpen, toggleModal, createNewList } = props;
    return (
        <Modal
            isOpen={isModalOpen}
            className="lists-modal"
            overlayClassName="lists-modal-overlay"
        >
            <span id="close-modal" onClick={toggleModal}>&chi;</span>
            <form onSubmit={(e) => createNewList(e)}>
                <input type="text" name="name" />
                <input type="submit" value="Add new list" placeholder="Shopping list name" />
            </form>
        </Modal>
    )
}

export default ListForm;
