import {IAuthProvider, ICompany, ICompanyType, ICountry, IProduct, ISection, IService, IUser} from 'interfaces';
import {cloneDeep} from 'lodash';
import {
    EDIT_COMPANY,
    TOGGLE_COMPANY_SECTION,
    TOGGLE_COMPANY_PRODUCT,
    UPDATE_COMPANY_SEATS,
    NEW_COMPANY,
    QUERY_COMPANIES,
    SELECT_COMPANY,
    CANCEL_EDIT,
    GET_COMPANIES,
    GET_COMPANY_USERS,
    INIT_VIEW_DATA,
    SET_ERROR,
    GET_PRODUCTS,
} from './actions';

import {ADD_EDIT_USERS} from 'actions';

import {searchReducer} from 'search/reducers';

export interface ICompanySettingsStore {
    query: string | null;
    companies: Array<ICompany>;
    companiesById: {[companyId: string]: ICompany};
    activeCompanyId: ICompany['_id'] | null;
    isLoading: boolean;
    totalCompanies: number | null,
    activeQuery: string | null;
    services: Array<IService>;
    sections: Array<ISection>;
    companyTypes: Array<ICompanyType>;
    apiEnabled: boolean;
    search: any;
    companyToEdit: ICompany | null;
    errors: {[field: string]: Array<string>} | null;
    companyUsers: Array<IUser>;
    products: Array<IProduct>;
    authProviders: Array<IAuthProvider>;
    ui_config: {[key: string]: any};
    countries: Array<ICountry>;
    companyOptions: Array<{
        value: ICompany['_id'];
        text: ICompany['name'];
    }>
}

const initialState: ICompanySettingsStore = {
    query: null,
    companies: [],
    companiesById: {},
    activeCompanyId: null,
    isLoading: false,
    totalCompanies: null,
    activeQuery: null,
    services: [],
    sections: [],
    companyTypes: [],
    apiEnabled: false,
    search: searchReducer(undefined, undefined, 'settings'),
    companyToEdit: null,
    errors: null,
    companyUsers: [],
    products: [],
    authProviders: [],
    ui_config: {},
    countries: [],
    companyOptions: [],
};

function setupCompanies(companyList: any, state: any) {
    const companiesById: any = {};
    const companyOptions: any = [];
    const companies = companyList.map((company: any) => {
        companiesById[company._id] = company;
        companyOptions.push({value: company._id, text: company.name});
        return company._id;
    });

    return {
        ...state,
        companiesById,
        companyOptions,
        companies,
        isLoading: false,
        totalCompanies: companyList.length,
    };
}

export default function companyReducer(state: any = initialState, action: any) {
    switch (action.type) {

    case SELECT_COMPANY: {
        const defaultCompany: any = {
            is_enabled: true,
            _id: null,
            name: '',
            phone: '',
            sd_subscriber_id: '',
            account_manager: '',
            contact_name: '',
            country: '',
            contact_email: '',
            url: '',
        };

        return {
            ...state,
            activeCompanyId: action.id || null,
            companyToEdit: action.id ? Object.assign(defaultCompany, state.companiesById[action.id]) : null,
            errors: null,
        };
    }

    case EDIT_COMPANY: {
        const target = action.event.target;
        const field = target.name;
        const company = cloneDeep(state.companyToEdit);

        company[field] = target.type === 'checkbox' ? target.checked : target.value;
        return {...state, companyToEdit: company, errors: null};
    }

    case TOGGLE_COMPANY_SECTION: {
        const company = cloneDeep(state.companyToEdit);

        if (company.sections == null) {
            company.sections = {};
        }

        company.sections[action.sectionId] = !company.sections[action.sectionId];

        return {...state, companyToEdit: company};
    }

    case TOGGLE_COMPANY_PRODUCT: {
        const company = cloneDeep(state.companyToEdit);
        const {productId, sectionId, enable} = action.payload;

        if (company.products == null) {
            company.products = [];
        }

        if (enable === true) {
            company.products.push({
                _id: productId,
                section: sectionId,
                seats: 0,
            });
        } else {
            company.products = company.products.filter(
                (product: any) => (
                    product._id !== productId
                )
            );
        }

        return {...state, companyToEdit: company};
    }

    case UPDATE_COMPANY_SEATS: {
        const company = cloneDeep(state.companyToEdit);
        const {productId, seats} = action.payload;

        if (company.products == null) {
            company.products = [];
        }

        company.products.forEach((product: any) => {
            if (product._id === productId) {
                product.seats = seats;
            }
        });

        return {...state, companyToEdit: company};
    }

    case NEW_COMPANY: {
        const newUser =  {
            user_type: 'public',
            is_approved: true,
            is_enabled: true,
            _id: null,
            name: '',
            email: '',
            phone: '',
            company: '',
        };

        const newCompany: any = {
            name: '',
            sd_subscriber_id: '',
            account_manager: '',
            phone: '',
            contact_name: '',
            country: '',
            is_enabled: true,
            contact_email: '',
            url:'',
        };

        return {...state, companyToEdit: action.data === 'users' ? newUser : newCompany, errors: null};
    }

    case CANCEL_EDIT: {
        return {...state, companyToEdit: null, errors: null};
    }

    case SET_ERROR:
        return {...state, errors: action.errors};

    case QUERY_COMPANIES:
        return {...state,
            isLoading: true,
            totalCompanies: null,
            activeQuery: state.query};

    case GET_COMPANIES:
        return setupCompanies(action.data, state);

    case GET_COMPANY_USERS:
        return {...state, companyUsers: action.data};

    case GET_PRODUCTS:
        return {...state, products: action.data};

    case INIT_VIEW_DATA: {
        const nextState: any = {
            ...state,
            services: action.data.services,
            products: action.data.products,
            sections: action.data.sections,
            companyTypes: action.data.company_types || [],
            apiEnabled: action.data.api_enabled || false,
            authProviders: action.data.auth_providers || [],
            ui_config: action.data.ui_config,
            countries: action.data.countries,
        };

        return setupCompanies(action.data.companies, nextState);
    }

    case ADD_EDIT_USERS: {
        return {
            ...state,
            editUsers: [
                ...(state.editUsers || []),
                ...action.data,
            ]
        };
    }

    default: {
        const search = searchReducer(state.search, action, 'settings');

        if (search !== state.search) {
            return {...state, search};
        }

        return state;
    }
    }
}
