import React from 'react';

const Lists = (props) => {

    const { lists, createNewList, selectList, selectedList } = props;

    return (
        <div id="lists">
            {selectedList !== null && 
                    <div>
                        Current list: {selectedList.name}
                    </div>
            }
            <div>
            {lists !== null && !!lists.total && lists.result.map((list) => {
                return (
                    <div onClick={(e) => selectList(e, list)} key={list.id}>{list.name}</div>
                )
            })}
            </div>
            <form onSubmit={(e) => createNewList(e)}>
                <input type="text" name="name" />
                <input type="submit" value="Add new list" />
            </form>
        </div>
    )
}

export default Lists;
