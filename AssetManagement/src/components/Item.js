import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import '../index.css';
import './Form.css';
import {FileUpload} from 'primereact/fileupload'
import axios from 'axios'
import { MultiSelect } from 'primereact/multiselect';
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ProductService from '../service/ProductService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import companyLogo from '../assets/images/logo.png';
import { Calendar } from 'primereact/calendar';

export class DataTableCrudDemo extends Component {

    emptyProduct = {
        
        id: null,
        assetType:'',
        assetManufacturer:'',
        model:'',
        serialNumber:'',
        assetStage:'',
        modifyDate:'',
createDate:'',
createteUserId:'',
midifyUserId:''
        
    };

    constructor(props) {
        super(props);

        this.state = {
            products: null,
            productsFiltered: null,
            productDialog: false,
            deleteProductDialog: false,
            deleteProductsDialog: false,
            product: this.emptyProduct,
            selectedProductsFiltered: null,
            selectedAssetType2:null,
            selectedAssetStage2:null,
            selectedAssetStage1:null,
            selectedAssetId1:null,
            selectedAssetType1:null,
            submitted: false,
            globalFilter: null
        };
    
this.assetType = [
    {name:'Laptop', code:'Laptop'},
    {name:'Desktop', code: 'Desktop'},
    {name:'Monitor', code: 'Monitor'},
    {name:'MobileHandSet', code: 'MobileHandSet'},
    {name:'SimCard', code: 'SimCard'},
    {name:'ToolKit', code: 'ToolKit'}


]

this.assetStage = [
    {name:'Staged', code:'Staged'},
    {name:'Issued', code: 'Issued'},
    {name:'Scrap', code:'Scrap'},
    {name:'Returned', code: 'Returned'},
    {name:'Recovered', code: 'Recovered'},

    
]
        

        this.productService = new ProductService();
        
        this.actionBodyTemplate = this.actionBodyTemplate.bind(this);
        this.onassetStageChange= this.onassetStageChange.bind(this);
        this.onassetStageChange2=this.onassetStageChange2.bind(this);
        this.onassetTypeChange= this.onassetTypeChange.bind(this);
        this.onassetTypeChange2=this.onassetTypeChange2.bind(this);
        this.openNew = this.openNew.bind(this);
        this.hideDialog = this.hideDialog.bind(this);
        this.saveProduct = this.saveProduct.bind(this);


        this.editProduct = this.editProduct.bind(this);
        this.confirmDeleteProduct = this.confirmDeleteProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.exportCSV = this.exportCSV.bind(this);
        // this.confirmDeleteSelected = this.confirmDeleteSelected.bind(this);
        // this.deleteSelectedProductsFiltered = this.deleteSelectedProductsFiltered.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onInputNumberChange = this.onInputNumberChange.bind(this);
        this.hideDeleteProductDialog = this.hideDeleteProductDialog.bind(this);
        // this.hideDeleteProductsFilteredDialog = this.hideDeleteProductsFilteredDialog.bind(this);
    }

    componentDidMount() {
        // this.productService.getProducts().then(data => this.setState({ products: data }));
        axios.get('http://localhost:8080/asset/allAssets')
        .then(response => {
            console.log(response)
            this.setState({productsFiltered:response.data})
            this.setState({products:response.data})
        })
        .catch(error => {
            console.log(error)
        })
        
    }

    

    openNew() {
        console.log('in openNew()');
        this.setState({
            product: this.emptyProduct,
            submitted: false,
            productDialog: true
        });
    }

    hideDialog() {
        this.setState({
            submitted: false,
            productDialog: false
        });
    }

    hideDeleteProductDialog() {
        this.setState({ deleteProductDialog: false });
    }

    hideDeleteProductsDialog() {
        this.setState({ deleteProductsDialog: false });
    }

    saveProduct(product) {
        let state = { submitted: true };
         
        if (this.state.product.model.trim()) {
            let productsFiltered = [...this.state.productsFiltered];
            let product = {...this.state.product};
            if (this.state.product.id) {
                const index = this.findIndexById(this.state.product.id);

                productsFiltered[index] = product;
                this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
                axios.put('http://localhost:8080/asset/updateAsset', product)
                .then(response => console.log('update working',response));
            }
            else {
                console.log('new product' + product.model);

                axios.post('http://localhost:8080/asset/addAsset', product)
                 .then(response => console.log('post working',response));

               
                this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            state = {
                ...state,
                productsFiltered,
                productDialog: false,
                product: this.emptyProduct
            };
        }

        this.setState(state);
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    editProduct(product) {
        console.log("in editproduct",product);
        this.setState({
            product: { ...product },
            productDialog: true
        });
        axios.put('http://localhost:8080/asset/updateAsset', product)
        .then(response => console.log('update working',response));
    }

    confirmDeleteProduct(product) {
        this.setState({
            product,
            deleteProductDialog: true
        });
        console.log("product del id ",product.id);
        axios.delete('http://localhost:8080/asset/deleteAsset/'+product.id)
        .then(response => console.log('delete working',response));
    }

    deleteProduct() {
        let productsFiltered = this.state.productsFiltered.filter(val => val.id !== this.state.product.id);
        this.setState({
            productsFiltered,
            deleteProductDialog: false,
            product: this.emptyProduct
        });
        this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    }

    findIndexById(id) {
        let index = -1;
        for (let i = 0; i < this.state.productsFiltered.length; i++) {
            if (this.state.productsFiltered[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId() {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

   

    // confirmDeleteSelected(product) {
    //     this.setState({ deleteProductsFilteredDialog: true });
    //     axios.delete('http://localhost:8080/asset/deleteAsset/'+product.id)
    //     .then(response => console.log('delete working',response));
        
    // }

    // deleteSelectedProductsFiltered() {
    //     let productsFiltered = this.state.productsFiltered.filter(val => !this.state.selectedProductsFiltered.includes(val));
    //     this.setState({
    //         productsFiltered,
    //         deleteProductsDialog: false,
    //         selectedProductsFiltered: null
    //     });
    //     axios.delete('http://localhost:8080/GetAllAsserts/'+productsFiltered.id)
    //     .then(response => console.log('delete working',response));
    //     this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    // }

    onStatusChange(e) {
        let product = {...this.state.product};
        product['status'] = e.value;
        this.setState({ product });
    }

    onInputChange(e, name) {
        const val = (e.target && e.target.value) || '';
        let product = {...this.state.product};
        product[`${name}`] = val;
        this.dt.filter(e.value, 'name', 'equals');


        this.setState({ product });
      
    
    }

    onInputNumberChange(e, name) {
        const val = e.value || 0;
        let product = {...this.state.product};
        product[`${name}`] = val;

        this.setState({ product });
       

    }

   

    
    
    onSearch = () => {
        let result = [];
        //let var234 = event.target.value;

        let assetType = (this.state.selectedAssetType1 === null ? "All" : this.state.selectedAssetType1) ;
        // let assetStage = (this.state.selectedAssetStage1 === null ? "all" : this.state.selectedAssetStage1.toLowerCase());
        let assetStage = (this.state.selectedAssetStage1 === null ? "All" : this.state.selectedAssetStage1);
        result = this.state.products.filter((data) => {
            if(assetType === "All" && assetStage !== "All"){
                return data.assetStage.search(assetStage) !== -1;
            }
            if(assetStage === "all" && assetType !== "All"){
                return data.assetType.search(assetType) !== -1;
            }
            if(assetStage !== "All" && assetType !== "All"){
            return data.assetType.search(assetType) !== -1 &&
            data.assetStage.search(assetStage) !== -1;
            }
            if(assetStage === "All" && assetType === "All"){
                return data;
            }
        });
        this.setState({ productsFiltered : result});
    }
    onassetTypeChange = (event) => {
        //let result = [];
        this.setState({ selectedAssetType1: event.target.value});
        

       // result = this.state.products.filter((data) => {
       //     return data.assetType.search(event.target.value) !== -1;
       // });
       // this.setState({ products : result});
    }

    onassetTypeChange2 = (event) =>{
        let product = {...this.state.product};
        product['assetType'] = event.value;
        // this.dt.filter(event.value, 'assetType', 'equals');

        this.setState({ product });
        this.setState({ selectedAssetType2: event.value });


    }

    onDateChange(e, name) {
                const val = e.value || 0;
                let product = { ...this.state.product };
                product[`${name}`] = val;
                console.log(product[`${name}`]);
                this.setState({ product });
        
            }
        
        
    onassetStageChange2 =(event) =>{
        let product = {...this.state.product};
        product['assetStage'] = event.value;
        // this.dt.filter(event.value, 'assetStage', 'equals');

        this.setState({ product });
        this.setState({ selectedAssetStage2: event.value });


    }
    
    onassetStageChange = (event) => {
        // let result = [];
         //let val = event.target.value.toLowerCase();
         this.setState({ selectedAssetStage1: event.target.value});
         //result = this.state.products.filter((data) => {
         //    return data.assetStage.search(val) !== -1;
         //});
         //this.setState({ products : result});
      }
 


    

   

    actionBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => this.editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => this.confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    }

    render() {
        const header = (
            
            <div className="header">
                    </div>
        );
        const productDialogFooter = (
            <React.Fragment>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={this.hideDialog} />
                <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={this.saveProduct} />
            </React.Fragment>
        );
        const deleteProductDialogFooter = (
            <React.Fragment>
                <Button label="No" icon="pi pi-times" className="p-button-text" onClick={this.hideDeleteProductDialog} />
                <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={this.deleteProduct} />
            </React.Fragment>
        );
        const deleteProductsDialogFooter = (
            <React.Fragment>
                <Button label="No" icon="pi pi-times" className="p-button-text" onClick={this.hideDeleteProductsDialog} />
                <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={this.deleteSelectedProductsFiltered} />
            </React.Fragment>
        );
        

        return (
            <div className="datatable-crud-demo">
                <Toast ref={(el) => this.toast = el} />

                <div className="card">
                <div className="main-header">
                <img src={companyLogo} alt="ivis. logo" />
                </div>
                <h1 style={{ marginLeft : "600px" }}>Asset Management</h1>
                <div className="p-formgrid p-grid"  style={{ padding : "",marginLeft : "250px" }}>
        
       
      
    
        </div>
              
                <div className="p-formgrid p-grid" style={{ padding : "20px" }}>       
                 
                 <label style={{ marginLeft : "20px" }} >  AssetType : </label>
                 <select className="search" style={{ width:'10rem'}}
                                      name="assetType"  
                                      value={this.state.assetType} onChange={this.onassetTypeChange}
                                      >
                                          <option value="All">All</option>
                                          <option value="Laptop">Laptop</option>
                                          <option value="Desktop">Desktop</option>
                                          <option value="Monitor">Monitor</option>
                                          <option value="MobileHeadset">MobileHeadset</option>
                                          <option value="SimCard">SimCard</option>
                                          <option value="ToolKit">ToolKit</option>


                                      </select>                

              
             <label   style={{ marginLeft : "20px" }}>  AssetStage : </label>
             <select className="search"  style={{ width:'11em'}}
                                      name="assetStage"  
                                      value={this.state.assetStage} onChange={this.onassetStageChange}
                                      >
                                          <option value="All">All</option>
                                          <option value="Staged">Staged</option>
                                          <option value="Issued">Issued</option>
                                          <option value="Recovered">Recovered</option>
                                          <option value="Returned">Returned</option>
                                          <option value="Scrap">Scrap</option>
                                          

                                      </select>
                         
            
                   <Button className ="btn" style={{ marginLeft : "20px" }} type="button" label="Search" onClick={() => this.onSearch()}/> 
                  

                  <InputText style={{ marginLeft : "200px" }}type="search" className="p-mr-2" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Search..." />
 
                  <Button label="New" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={this.openNew} />
                 {/* <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={this.confirmDeleteSelected} disabled={!this.state.selectedProductsFiltered || !this.state.selectedProductsFiltered.length} /> */}
                 <Button style={{ marginLeft : "5px" }}label="Export" icon="pi pi-upload" className="p-button-help" onClick={this.exportCSV} />
                {/* <FileUpload mode="basic" accept="Excel"  label="Import" chooseLabel="Import" className="p-mr-2 p-d-inline-block" /> */}

 

            </div>

                    <DataTable ref={(el) => this.dt = el}  value={this.state.productsFiltered} selection={this.state.selectedProductsFiltered} onSelectionChange={(e) => this.setState({ selectedProductsFiltered: e.value })}
                        dataKey="id" paginator rows={9} rowsPerPageOptions={[10, 15, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={this.state.globalFilter}
                        header={header}>

                        <Column headerStyle={{ width: '3rem' }}></Column>
                        <Column  field="id"  header="Asset Id" sortable style={{ width: '150px' }} ></Column>
                        <Column  field="assetType"  header="Asset Type" sortable style={{ width: '150px' }}  ></Column>
                        <Column field="assetManfacturer" header="Asset Manufacturer" sortable style={{ width: '200px' }} ></Column> 
                        <Column field="model" header="Model"  sortable ></Column>
                        <Column  field="serialNumber" header="SerialNumber" sortable  ></Column> 
                        <Column field="assetStage" header="Asset Stage" sortable  ></Column>
                        <Column header="Actions" style={{ paddingLeft: '12px'}} body={this.actionBodyTemplate}></Column>
                    </DataTable>
                    <div className="main-footer">
                
                    
                <div><i class="pi pi-envelope"></i> Support@ivis.net</div>
                <div>Copyright © 2021 IVIS. All rights reserved.</div>
                        <div><i class="pi pi-phone"></i> 7569843002</div>
                
                
                    </div>
                </div>

                
                <Dialog visible={this.state.productDialog} style={{ width: '800px' }} header="Item Details" modal className="p-fluid" footer={productDialogFooter} onHide={this.hideDialog}>
                   
                <div className="p-formgrid p-grid">     
                    <div className="p-field p-col-4">
                        <label htmlFor="assetManufacturer">Asset Manufacturer :</label>
                        <InputText id="assetManufacturer"  value={this.state.product.assetManufacturer} onChange={(e) => this.onInputChange(e, 'assetManufacturer')} required autoFocus className={classNames({ 'p-invalid': this.state.submitted && !this.state.product.assetManufacturer })} />
                        {this.state.submitted && !this.state.product.assetManufacturer && <small className="p-error">assetManufacturer is required.</small>}
                  
                        </div>
                       
                    <div className="p-field p-col-4">
                                    
                                    <label>AssetType :  </label>
                                    <Dropdown  style={{ width: '14rem'}} value={this.state.selectedAssetType2} options={this.assetType} onChange={this.onassetTypeChange2} optionLabel="name"  required className={classNames({ 'p-invalid': this.state.submitted && !this.state.product.assetType })}/>
                       {this.state.submitted && !this.state.product.assetType && <small className="p-error">assetType is required.</small>}
                                    
                       </div>
                       <div className="p-field p-col-4">
                    <label htmlFor="model">Model :</label>
                        <InputText id="model"  value={this.state.product.model} onChange={(e) => this.onInputChange(e, 'model')} required rows={3} cols={20} />

                     </div>
                     
                    </div>


                <div className="p-formgrid p-grid">    
                        <div className="p-field p-col-4">
                           
                        <label htmlFor="serialNumber">SerialNumber :</label>
                            <InputText  id="serialNumber" value={this.state.product.serialNumber} onChange={(e) => this.onInputChange(e, 'serialNumber')}  />                       </div>
                        
                            <div className="p-field p-col-4">
                       
                        
                       <label>AssetStage : </label>
                       <Dropdown  value={this.state.selectedAssetStage2} options={this.assetStage} onChange={this.onassetStageChange2} optionLabel="name"  required className={classNames({ 'p-invalid': this.state.submitted && !this.state.product.assetStage })}/>
                       {this.state.submitted && !this.state.product.assetStage && <small className="p-error">assetStage is required.</small>}

                            </div>
                            <div className="p-field p-col">
                    <label htmlFor="createUserId">Create Userid</label>
                        <InputText id="createUserId"  onChange={(e) => this.onInputChange(e, 'createUserId')} required rows={3} cols={20} />

                     </div>
                     </div>
                     <div className="p-formgrid p-grid">       

<div className="p-field p-col-4">
<label htmlFor="createDate">Create Date :</label>
<Calendar id="icon"  value={this.state.product.createDate} onChange={(e) => this.onDateChange(e, 'createDate')} showIcon></Calendar>
 </div>
 
    <div className="p-field p-col-4">
       
    <label htmlFor="modifyDate">Modified Date :</label>
    <Calendar id="icon" value={this.state.product.modifyDate} onChange={(e) => this.onDateChange(e, 'modifyDate')} showIcon></Calendar>
    </div>
        <div className="p-field p-col-4">
   
    
   <label>Modify UserId : </label>
   <InputText id="modifyUserId"  onChange={(e) => this.onInputChange(e, 'modifyUserId')} required rows={3} cols={20} />

        </div>
 </div>
                  
                    
                  
                    
                </Dialog>

                <Dialog visible={this.state.deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={this.hideDeleteProductDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-2" style={{ fontSize: '1rem'}} />
                        {this.state.product && <span>Are you sure you want to delete <b>{this.state.product.sap_Code}</b>?</span>}
                    </div>
                </Dialog>

                <Dialog visible={this.state.deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={this.hideDeleteProductsDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-2" style={{ fontSize: '1rem'}} />
                        {this.state.product && <span>Are you sure you want to delete the selected products?</span>}
                    </div>
                </Dialog>
            </div>
        );
    }
}
                
const rootElement = document.getElementById("root");
ReactDOM.render(<DataTableCrudDemo />, rootElement);