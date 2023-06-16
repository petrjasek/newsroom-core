import React from 'react';

import classNames from 'classnames';

import {gettext, formatDate, formatTime} from 'utils';
import ActionButton from 'components/ActionButton';
import {ToolTip} from '../../ui/components/ToolTip';
import AuditInformation from 'components/AuditInformation';

export function Topic({topic, actions, users, selectedTopicId}) {
    const getActionButtons = (topic) => actions.map(
        (action) => (
            <ActionButton
                key={action.name}
                item={topic}
                className='icon-button icon-button--primary'
                displayName={false}
                action={action}
                disabled={action.when != null && !action.when(topic)}
            />
        )
    );

    return (
        <div key={topic._id} className=''>
            <div className={classNames(
                'simple-card',
                {'simple-card--selected': selectedTopicId === topic._id}
            )}>
                <div className="simple-card__header simple-card__header-with-icons">
                    <ToolTip>
                        <h6
                            className="simple-card__headline"
                            title={topic.label || topic.name}
                        >
                            {topic.label || topic.name}
                        </h6>
                    </ToolTip>
                    <div className='simple-card__icons'>
                        {getActionButtons(topic)}
                    </div>
                </div>
                <p>{topic.description || ' '}</p>
                {topic.is_global ? (
                    <span className="simple-card__date">
                        <AuditInformation
                            item={topic}
                            users={users}
                            className="p-0"
                            noPadding={true}
                        />
                    </span>
                ) : (
                    <span className="simple-card__date">
                        {gettext('Created on {{ date }} at {{ time }}', {
                            date: formatDate(topic._created),
                            time: formatTime(topic._created),
                        })}
                    </span>
                )}
            </div>
        </div>
    );
}
