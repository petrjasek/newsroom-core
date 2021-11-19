import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {gettext, isWireContext} from 'utils';

import {removeNewItems} from 'wire/actions';
import FilterButton from 'wire/components/filters/FilterButton';
import {loadMyWireTopic} from 'wire/actions';
import {loadMyAgendaTopic} from 'agenda/actions';
import {Accordion} from 'ui/components/Accordion';

const tabName = isWireContext() ? 'Wire Topics' : 'Agenda Topics';
const manageTopics = () => document.dispatchEvent(window.manageTopics);

function TopicItem({topic, newItemsByTopic, onClick, className}) {
    return (
        <a
            href="#"
            key={topic._id}
            className={className}
            onClick={(e) => onClick(e, topic)}
        >
            <span>{topic.company} // {topic.user} // </span>
            {topic.label}
            {newItemsByTopic && newItemsByTopic[topic._id] && (
                <span className="wire-button__notif">
                    {newItemsByTopic[topic._id].length}
                </span>
            )}
        </a>
    )
}

function TopicsTab({topics, loadMyTopic, newItemsByTopic, activeTopic, removeNewItems}) {
    const clickTopic = (event, topic) => {
        event.preventDefault();
        removeNewItems(topic._id);
        loadMyTopic(topic);
    };

    const clickManage = (event) => {
        event.preventDefault();
        manageTopics();
    };

    const topicClass = (topic) => (
        `btn btn-block btn-outline-${topic._id === activeTopicId ? 'primary' : 'secondary'}`
    );

    const activeTopicId = activeTopic ? activeTopic._id : null;
    const personalTopics = (topics || []).filter(
        (topic) => !topic.is_global
    );
    const globalTopics = (topics || []).filter(
        (topic) => topic.is_global
    );

    return (
        <React.Fragment>
            <Accordion
                id="my-topics-accordion"
                items={[{
                    id: 'my-topics--personal',
                    label: gettext('Personal'),
                    body: () => !personalTopics.length ? (
                        <div className='wire-column__info'>
                            {gettext('No {{name}} created.', {name: tabName})}
                        </div>
                    ) : (
                        <div>
                            {personalTopics.map((topic) => (
                                <TopicItem
                                    topic={topic}
                                    newItemsByTopic={newItemsByTopic}
                                    onClick={clickTopic}
                                    className={topicClass(topic)}
                                />
                            ))}
                        </div>
                    )
                }, {
                    id: 'my-topics--company',
                    label: gettext('Global'),
                    body: () => !globalTopics.length ? (
                        <div className='wire-column__info'>
                            {gettext('No {{name}} created.', {name: tabName})}
                        </div>
                    ) : (
                        <div>
                            {globalTopics.map((topic) => (
                                <TopicItem
                                    topic={topic}
                                    newItemsByTopic={newItemsByTopic}
                                    onClick={clickTopic}
                                    className={topicClass(topic)}
                                />
                            ))}
                        </div>
                    )
                }]}
            />,
            <FilterButton
                label={gettext('Manage my {{name}}', {name: tabName})}
                onClick={clickManage}
                className='reset filter-button--border'
                primary={true}
            />
        </React.Fragment>
    );
}

TopicsTab.propTypes = {
    topics: PropTypes.array.isRequired,
    newItemsByTopic: PropTypes.object,
    activeTopic: PropTypes.object,

    removeNewItems: PropTypes.func.isRequired,
    loadMyTopic: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    topics: state.topics || [],
    newItemsByTopic: state.newItemsByTopic,
});

const mapDispatchToProps = (dispatch) => ({
    removeNewItems: (topicId) => dispatch(removeNewItems(topicId)),
    loadMyTopic: (topic) => topic.topic_type === 'agenda' ?
        dispatch(loadMyAgendaTopic(topic._id)) :
        dispatch(loadMyWireTopic(topic._id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TopicsTab);
