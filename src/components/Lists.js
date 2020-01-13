import React from 'react';
import ListForm from './ListForm.js';

const Lists = (props) => {

    const { lists, createNewList, selectList, selectedList, isModalOpen, toggleModal } = props;

    return (
        <div>
            <h1>Shopping Lists <span onClick={toggleModal} id="open-modal" className="span-button">+ Create New List</span></h1>
            <div>
            {lists !== null && !!lists.total && lists.result.map((list) =>
                    <div onClick={() => selectList(list.id)} key={list.id}>{list.name}</div>
            )
            ||
                <p>You haven't created a shopping list yet.</p>
            }
            </div>
            <ListForm isModalOpen={isModalOpen} toggleModal={toggleModal} createNewList={createNewList} />
        </div>
    )
}

export default Lists;
