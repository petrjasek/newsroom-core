import React, {useState, useRef} from 'react';
import PropTypes from 'prop-types';
import {gettext} from 'utils';
import {Popover, PopoverBody} from 'reactstrap';
import classNames from 'classnames';
import { TopicFolderEditor } from './TopicFolderEditor';

const EDITING_OFF = 0;
const EDITING_ON = 1;
const EDITING_ERROR = 2;

export function TopicFolder({folder, topics, folderPopover, toggleFolderPopover, moveTopic, saveFolder, deleteFolder, children}) {
    const [opened, setOpened] = useState(false);
    const [popover, togglePopover] = useState(false);
    const [dragover, setDragOver] = useState(false);
    const [editing, setEditing] = useState(EDITING_OFF);
    const buttonRef = useRef(null);
    const actions = [
        {
            id: 'edit',
            name: gettext("Rename"),
            icon: 'edit',
            callback: () => setEditing(EDITING_ON),
        },
        {
            id: 'delete',
            name: gettext("Delete"),
            icon: 'trash',
            callback: () => {
                deleteFolder(folder);
                toggleFolderPopover(folder);
            },
        },
    ];

    return (
        <div key={folder._id} className="simple-card__group" 
            onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                setDragOver(true);
            }}
            onDragLeave={() => {
                setDragOver(false);
            }}
            onDrop={(event) => {
                const topic = event.dataTransfer.getData("topic");

                moveTopic(topic, folder);
            }}
        >
            {editing ? (
                <TopicFolderEditor 
                    folder={folder}
                    error={editing === EDITING_ERROR ? {} : null}
                    onSave={(name) => {
                        saveFolder(folder, {name})
                            .then(() => setEditing(EDITING_OFF), (reason) => setEditing(EDITING_ERROR));
                    }}
                    onCancel={() => setEditing(EDITING_OFF)}
                />
            ) : (
                <div className={classNames("simple-card__group-header", {
                    'simple-card__group-header--ondragover': dragover,
                })}>
                    {opened ? (
                        <button type="button" className="icon-button icon-button--tertiary" title={gettext("Close")} onClick={() => setOpened(false)}><i className="icon--minus"></i></button>
                    ) : (
                        <button type="button" className="icon-button icon-button--tertiary"
                            title={gettext("Open")}
                            onClick={() => setOpened(true)}
                            disabled={topics.length === 0}
                        ><i className="icon--plus"></i></button>
                    )}
                    <div className="simple-card__group-header-title">
                        <i className="icon--folder"></i>
                        <span className="simple-card__group-header-name">{folder.name}</span>
                    </div>
                    <span className="badge badge--neutral rounded-pill me-2">{topics.length}</span>
                    <div className="simple-card__group-header-actions">
                        <button
                            ref={buttonRef}
                            onClick={() => toggleFolderPopover(folder)}
                            className="icon-button icon-button--tertiary"
                            aria-label={gettext('Folder Actions')}>
                            <i className='icon--more'></i>
                        </button>
                        {buttonRef.current && (
                            <Popover
                                key={"popover-folder-" + folder._id}
                                isOpen={folderPopover === folder._id}
                                target={buttonRef}
                                className="action-popover"
                                delay={0}
                                fade={false}
                                toggle={(event) => {
                                    togglePopover(!popover);
                                }}
                            >
                                <PopoverBody>
                                    {actions.map((action) => (
                                        <button key={action.id}
                                            type="button"
                                            className="dropdown-item"
                                            onClick={() => action.callback()}
                                        >
                                            <i className={"icon--" + action.icon} />
                                            {action.name}
                                        </button>
                                    ))}
                                </PopoverBody>
                            </Popover>
                        )}
                    </div>
                </div>
            )}
            {opened && (
            <div className="simple-card__group-content">
                {children}
            </div>
            )}
        </div>
    );
}

TopicFolder.propTypes = {
    folder: PropTypes.shape({
        name: PropTypes.string,
    }),
    topics: PropTypes.array,
    saveFolder: PropTypes.func,
    deleteFolder: PropTypes.func,
};