import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {gettext} from 'utils';

export function TopicFolder({folder, topics, children}) {
    const [opened, setOpened] = useState(false);

    return (
        <div key={folder._id} className="simple-card__group">
            <div className="simple-card__group-header">
                {opened ? (
                    <button type="button" className="icon-button icon-button--tertiary" title={gettext("Close")} onClick={() => setOpened(false)}><i className="icon--minus"></i></button>
                ) : (
                    <button type="button" className="icon-button icon-button--tertiary" title={gettext("Open")} onClick={() => setOpened(true)}><i className="icon--plus"></i></button>
                )}
                <div className="simple-card__group-header-title">
                    <i className="icon--folder"></i>
                    <span className="simple-card__group-header-name">{folder.name}</span>
                </div>
                <span className="badge badge--neutral rounded-pill me-2">{topics.length}</span>
                <div className="simple-card__group-header-actions">
                    <button type="button" className="icon-button icon-button--tertiary" title={gettext("Folder actions")}><i className="icon--more"></i></button>
                </div>
            </div>
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
};