import React from 'react';
import PropTypes from 'prop-types';

import {get} from 'lodash';

import {Topic} from './Topic';
import {TopicFolder} from './TopicFolder';

const TopicList = ({topics, selectedTopicId, actions, users, folders}) => {

    if (get(topics, 'length', 0) < 0 && get(folders, 'length', 0) < 0) {
        return null;
    }

    const renderedFolders = folders.map((folder) => (
        <TopicFolder key={folder._id} folder={folder} topics={topics.filter((topic) => topic.folder === folder._id)} />
    ));

    const renderedTopics = topics.filter((topic) => topic.folder == null).map(
        (topic) => (
            <Topic key={topic._id} topic={topic} actions={actions} users={users} selectedTopicId={selectedTopicId} />
        )
    );

    return Array.prototype.concat(renderedFolders, renderedTopics);
};

TopicList.propTypes = {
    topics: PropTypes.arrayOf(PropTypes.object),
    selectedTopicId: PropTypes.string,
    actions: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        icon: PropTypes.string,
        action: PropTypes.func,
    })),
    users: PropTypes.array,
    folders: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
    })),
};

export default TopicList;
