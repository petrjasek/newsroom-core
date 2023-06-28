import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {get} from 'lodash';

import {gettext} from 'utils';

import {
    hideModal,
    toggleDropdown,
    selectMenu,
} from '../actions';
import {
    userSelector,
    selectedMenuSelector,
    displayModelSelector,
    userSectionsSelector,
} from '../selectors';

import FollowedTopics from 'search/components/FollowedTopics';
import UserProfileMenu from './UserProfileMenu';
import UserProfileAvatar from './UserProfileAvatar';
import ShareItemModal from 'components/ShareItemModal';
import UserProfile from './profile/UserProfile';
import ProfileToggle from './ProfileToggle';

import '../style';
import {isUserAdmin} from '../../users/utils';

const modals = {shareItem: ShareItemModal};

class UserProfileApp extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.links = [
            {
                name: 'profile',
                label: gettext('My Profile'),
                content: UserProfile,
            },
        ];

        if (this.isSectionEnabled('wire')) {
            this.links.push({
                name: 'topics',
                label: gettext('My {{ section }} Topics', {section: sectionNames.wire}),
                content: FollowedTopics,
                type: 'wire',
            });
        }

        if (this.isSectionEnabled('agenda')) {
            this.links.push({
                name: 'events',
                label: gettext('My {{ section }} Topics', {section: sectionNames.agenda}),
                content: FollowedTopics,
                type: 'agenda',
            });
        }

        if (this.isSectionEnabled('monitoring')) {
            this.links.push({
                name: 'monitoring',
                label: gettext('My {{ monitoring }}', sectionNames),
                content: FollowedTopics,
                type: 'monitoring',
            });
        }
    }

    isSectionEnabled(name) {
        return isUserAdmin(this.props.user) || !!get(this.props, 'userSections', []).find((s) => s._id === name);
    }

    renderModal(specs) {
        if (specs) {
            const Modal = modals[specs.modal];
            return ReactDOM.createPortal(
                <Modal data={{...specs.data, isTopic: true}} />,
                document.getElementById('modal-container')
            );
        }
    }

    hideModal() {
        // Reload the page when closing the modal
        // so that all changes to folders/topics are
        // visible to the user.
        location.reload();
    }

    renderProfile() {
        const links = this.links.map((link) => {
            link.active = link.name === this.props.selectedMenu;
            return link;
        });

        const modal = this.renderModal(this.props.modal);
        const ActiveContent = links.find((link) => link.active).content;
        const topicType = links.find((link) => link.active).type;

        return (
            <div className="profile-container" role={gettext('dialog')} aria-label={links.find((link) => link.active).label}>
                <div className="profileWrap">
                    <div className="profile__mobile-close d-md-none">
                        <button className="icon-button" aria-label={gettext('Close')} onClick={this.hideModal}>
                            <i className="icon--close-thin icon--gray-dark" />
                        </button>
                    </div>
                    <nav className='profile__side-navigation' id='profile-menu'>
                        <UserProfileAvatar
                            user={this.props.user}
                        />
                        <UserProfileMenu
                            onClick={this.props.selectMenu}
                            links={links}
                        />
                    </nav>
                    <div className="profile__profile-content">
                        <section className="profile__profile-content-header">
                            <h5 className="profile__profile-content-title">
                                {links.find((link) => link.active).label}
                            </h5>
                            <button className="profile__profile-content-close" aria-label={gettext('Close')} role="button" onClick={this.hideModal}>
                                <i className="icon--close-thin" />
                            </button>
                        </section>
                        <section className="profile__profile-content-main">
                            <ActiveContent topicType={topicType}/>
                        </section>
                    </div>
                    {modal}
                </div>
            </div>
        );
    }

    render() {
        const profile = ReactDOM.createPortal(
            this.props.displayModal ? this.renderProfile() : null,
            document.getElementById('user-profile-app')
        );

        const overlay = this.props.dropdown && (
            <div
                key="overlay"
                className="user-profile__app--overlay"
                onClick={this.props.toggleDropdown}
            />
        );

        const dropdown = this.props.dropdown && (
            <div key="dropdown" className="dropdown-menu dropdown-menu-right show">
                <div className="card card--inside-dropdown">
                    <div className="card-header">
                        {`${this.props.user.first_name} ${this.props.user.last_name}`}
                    </div>
                    <ul className="list-group list-group-flush">
                        {this.links.map((link) => (
                            <li key={link.name} className="list-group-item list-group-item--link">
                                <a href="" onClick={(e) => this.props.selectMenu(e, link.name)}>{link.label}
                                    <i className="svg-icon--arrow-right" /></a>
                            </li>
                        ))}
                    </ul>
                    <div className="card-footer">
                        <a href="/logout" className="nh-button nh-button--tertiary float-end">{gettext('Logout')}</a>
                    </div>
                </div>
            </div>
        );

        const toggle = document.getElementById('header-profile-toggle');

        if (this.props.dropdown) {
            toggle.classList.add('show');
        } else {
            toggle.classList.remove('show');
        }

        return [
            overlay,
            <ProfileToggle key="toggle"
                user={this.props.user}
                onClick={this.props.toggleDropdown}
            />,
            dropdown,
            profile,
        ];
    }
}

UserProfileApp.propTypes = {
    user: PropTypes.object,
    modal: PropTypes.object,
    selectMenu: PropTypes.func,
    dropdown: PropTypes.bool,
    selectedMenu: PropTypes.string,
    displayModal: PropTypes.bool,
    toggleDropdown: PropTypes.func,
    hideModal: PropTypes.func,
};

const mapStateToProps = (state) => ({
    user: userSelector(state),
    modal: state.modal,
    dropdown: state.dropdown,
    selectedMenu: selectedMenuSelector(state),
    displayModal: displayModelSelector(state),
    userSections: userSectionsSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
    selectMenu: (event, name) => {event.preventDefault(); dispatch(selectMenu(name));},
    toggleDropdown: () => dispatch(toggleDropdown()),
    hideModal: () => dispatch(hideModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileApp);
