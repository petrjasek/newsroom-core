import React from 'react';
import PropTypes from 'prop-types';
import {gettext} from 'utils';
import AgendaTypeAheadFilter from './AgendaTypeAheadFilter';
import AgendaDropdownFilter from './AgendaDropdownFilter';

const filters = [{
    label: gettext('Any calendar'),
    field: 'calendar',
}, {
    label: gettext('Any location'),
    field: 'location',
    typeAhead: true,
}, {
    label: gettext('Any region'),
    field: 'place'
}, {
    label: gettext('Any coverage'),
    field: 'coverage',
    nestedField: 'coverage_type',
}];

function AgendaFilters({aggregations, toggleFilter, activeFilter}) {
    return (<div className='wire-column__main-header-agenda d-flex m-0 px-3 align-items-center flex-wrap flex-sm-nowrap'>
        {filters.map((filter) => (
            filter.typeAhead ? <AgendaTypeAheadFilter
                key={filter.label}
                aggregations={aggregations}
                filter={filter}
                toggleFilter={toggleFilter}
                activeFilter={activeFilter}
            /> : <AgendaDropdownFilter
                key={filter.label}
                aggregations={aggregations}
                filter={filter}
                toggleFilter={toggleFilter}
                activeFilter={activeFilter}
            />
        ))}
    </div>);
}

AgendaFilters.propTypes = {
    aggregations: PropTypes.object,
    toggleFilter: PropTypes.func,
    activeFilter: PropTypes.object,
};

export default AgendaFilters;
