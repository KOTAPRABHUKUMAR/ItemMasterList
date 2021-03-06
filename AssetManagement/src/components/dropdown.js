import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ReactDOM from 'react-dom';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';

export class DataTableFilterDemo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            customers: null,
            selectedRepresentative: null,
            selectedDate: null,
            selectedStatus: null,
            globalFilter: ''
        };

        this.representatives = [
            {name: "Amy Elsner", image: 'amyelsner.png'},
            {name: "Anna Fali", image: 'annafali.png'},
            {name: "Asiya Javayant", image: 'asiyajavayant.png'},
            {name: "Bernardo Dominic", image: 'bernardodominic.png'},
            {name: "Elwin Sharvill", image: 'elwinsharvill.png'},
            {name: "Ioni Bowcher", image: 'ionibowcher.png'},
            {name: "Ivan Magalhaes",image: 'ivanmagalhaes.png'},
            {name: "Onyama Limba", image: 'onyamalimba.png'},
            {name: "Stephen Shaw", image: 'stephenshaw.png'},
            {name: "XuXue Feng", image: 'xuxuefeng.png'}
        ];

        this.statuses = [
            'unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'
        ]

        this.representativesItemTemplate = this.representativesItemTemplate.bind(this);
        this.statusItemTemplate = this.statusItemTemplate.bind(this);
        this.nameBodyTemplate = this.nameBodyTemplate.bind(this);
        this.countryBodyTemplate = this.countryBodyTemplate.bind(this);
        this.representativeBodyTemplate = this.representativeBodyTemplate.bind(this);
        this.dateBodyTemplate = this.dateBodyTemplate.bind(this);
        this.statusBodyTemplate = this.statusBodyTemplate.bind(this);
        this.activityBodyTemplate = this.activityBodyTemplate.bind(this);
        this.onRepresentativesChange = this.onRepresentativesChange.bind(this)
        this.onDateChange = this.onDateChange.bind(this);
        this.onStatusChange = this.onStatusChange.bind(this);
        this.filterDate = this.filterDate.bind(this);
        this.reset = this.reset.bind(this);
    }

    // componentDidMount() {
    //     this.customerService.getCustomersLarge().then(data => this.setState({ customers: data }));
    // }

    // filterDate(value, filter) {
    //     if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
    //         return true;
    //     }

    //     if (value === undefined || value === null) {
    //         return false;
    //     }

    //     return value === this.formatDate(filter);
    // }

    // formatDate(date) {
    //     let month = date.getMonth() + 1;
    //     let day = date.getDate();

    //     if (month < 10) {
    //         month = '0' + month;
    //     }

    //     if (day < 10) {
    //         day = '0' + day;
    //     }

    //     return date.getFullYear() + '-' + month + '-' + day;
    // }

    onRepresentativesChange(e) {
        this.dt.filter(e.value, 'representative.name', 'in');
        this.setState({ selectedRepresentative: e.value });
    }

    onDateChange(e) {
        this.dt.filter(e.value, 'date', 'custom');
        this.setState({ selectedDate: e.value });
    }

    onStatusChange(e) {
        this.dt.filter(e.value, 'status', 'equals');
        this.setState({ selectedStatus: e.value })
    }

    nameBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </React.Fragment>
        );
    }

    countryBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">Country</span>
                <img alt="flag" src="showcase/demo/images/flag_placeholder.png" onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} className={`flag flag-${rowData.country.code}`} width={30} />
                <span className="image-text">{rowData.country.name}</span>
            </React.Fragment>
        );
    }

    representativeBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">Representative</span>
                <img alt={rowData.representative.name} src={`showcase/demo/images/avatar/${rowData.representative.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width={32} style={{verticalAlign: 'middle'}} />
                <span className="image-text">{rowData.representative.name}</span>
            </React.Fragment>
        );
    }

    dateBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">Date</span>
                <span>{rowData.date}</span>
            </React.Fragment>
        );
    }

    statusBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">Status</span>
                <span className={`customer-badge status-${rowData.status}`}>{rowData.status}</span>
            </React.Fragment>
        );
    }

    activityBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">Activity</span>
                <ProgressBar value={rowData.activity} showValue={false} />
            </React.Fragment>
        );
    }

    representativesItemTemplate(option) {
        return (
            <div className="p-multiselect-representative-option">
                <img alt={option.name} src={`showcase/demo/images/avatar/${option.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width={32} style={{verticalAlign: 'middle'}} />
                <span className="image-text">{option.name}</span>
            </div>
        );
    }

    statusItemTemplate(option) {
        return <span className={`customer-badge status-${option}`}>{option}</span>;
    }

    reset() {
        this.setState({
            selectedRepresentative: null,
            selectedDate: null,
            selectedStatus: null,
            globalFilter: ''
        });

        this.dt.reset();
    }

    render() {
        const header = (
            <div className="table-header">
                <Button type="button" label="Clear" className="p-button-outlined" icon="pi pi-filter-slash" onClick={this.reset} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" value={this.state.globalFilter} onChange={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" />
                </span>
            </div>
        );

        const representativeFilter = <MultiSelect value={this.state.selectedRepresentative} options={this.representatives} itemTemplate={this.representativesItemTemplate} onChange={this.onRepresentativesChange} optionLabel="name" optionValue="name" placeholder="All" className="p-column-filter" />;
        const dateFilter = <Calendar value={this.state.selectedDate} onChange={this.onDateChange} dateFormat="yy-mm-dd" className="p-column-filter" placeholder="Registration Date"/>;
        const statusFilter = <Dropdown value={this.state.selectedStatus} options={this.statuses} onChange={this.onStatusChange} itemTemplate={this.statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;

        return (
            <div className="datatable-filter-demo">
                <div className="card">
                    <DataTable ref={(el) => this.dt = el} value={this.state.customers} paginator rows={10}
                        header={header} className="p-datatable-customers"
                        globalFilter={this.state.globalFilter} emptyMessage="No customers found.">
                        <Column field="name" header="Name" body={this.nameBodyTemplate} filter filterPlaceholder="Search by name" />
                        <Column field="country" filterField="country.name" header="Country" body={this.countryBodyTemplate} filter filterPlaceholder="Search by country" filterMatchMode="contains" />
                        <Column field="representative.name" header="Representative" body={this.representativeBodyTemplate} filter filterElement={representativeFilter} />
                        <Column field="date" header="Date" body={this.dateBodyTemplate} filter filterElement={dateFilter} filterFunction={this.filterDate} />
                        <Column field="status" header="Status" body={this.statusBodyTemplate} filter filterElement={statusFilter}/>
                        <Column field="activity" header="Activity" body={this.activityBodyTemplate} filter filterPlaceholder="Minimum" filterMatchMode="gte" />
                    </DataTable>
                </div>
            </div>
        );
    }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<DataTableFilterDemo/>, rootElement);