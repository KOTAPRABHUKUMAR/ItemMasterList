import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import '../index.css';
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ProductService from '../service/ProductService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import './Form.css';
import { Dropdown } from 'primereact/dropdown';
import companyLogo from '../assets/images/logo.png';

export class DataTableCrudDemo extends Component {

    emptyProduct = {
        
        id: null,
        assetType:'',
        assetManufacturer:'',
        model:'',
        serialNumber:'',
        assetStage:''
        
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
            selectedProducts: null,
            selectedAssetStage1:null,
            selectedAssetType1:null,
            submitted: false,
            globalFilter: null
        };
    

        this.productService = new ProductService();
        this.actionBodyTemplate = this.actionBodyTemplate.bind(this);
        
        this.onassetTypeChange = this.onassetTypeChange.bind(this);
        this.onassetStageChange = this.onassetStageChange.bind(this);

        this.statusBodyTemplate = this.statusBodyTemplate.bind(this);

        this.openNew = this.openNew.bind(this);
        this.hideDialog = this.hideDialog.bind(this);
        this.saveProduct = this.saveProduct.bind(this);
        this.editProduct = this.editProduct.bind(this);
        this.confirmDeleteProduct = this.confirmDeleteProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.confirmDeleteSelected = this.confirmDeleteSelected.bind(this);
        this.deleteSelectedProducts = this.deleteSelectedProducts.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onInputNumberChange = this.onInputNumberChange.bind(this);
        this.hideDeleteProductDialog = this.hideDeleteProductDialog.bind(this);
        this.hideDeleteProductsDialog = this.hideDeleteProductsDialog.bind(this);
    }

    componentDidMount() {
        this.productService.getProducts().then(data=>
            {
                this.setState({products:data});
            this.setState({productsFiltered:data}) 
                  })
    }

   

    openNew() {
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

    saveProduct() {
        let state = { submitted: true };

        if (this.state.product.assetManufacturer.trim()) {
            let products = [...this.state.products];
            let product = {...this.state.product};
            if (this.state.product.id) {
                const index = this.findIndexById(this.state.product.id);

                products[index] = product;
                this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            }
            else {
                product.id = this.createId();
                // product.image = 'product-placeholder.svg';
                products.push(product);
                this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            state = {
                ...state,
                products,
                productDialog: false,
                product: this.emptyProduct
            };
        }

        this.setState(state);
    }

    editProduct(product) {
        this.setState({
            product: { ...product },
            productDialog: true
        });
    }

    confirmDeleteProduct(product) {
        this.setState({
            product,
            deleteProductDialog: true
        });
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
        for (let i = 0; i < this.state.products.length; i++) {
            if (this.state.products[i].id === id) {
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

   

    confirmDeleteSelected() {
        this.setState({ deleteProductsDialog: true });
    }

    deleteSelectedProducts() {
        let productsFiltered = this.state.productsFiltered.filter(val => !this.state.selectedProducts.includes(val));
        this.setState({
            productsFiltered,
            deleteProductsDialog: false,
            selectedProducts: null
        });
        this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    }

    


    onSearch = () => {
        let result = [];
        //let var234 = event.target.value;

        let assetType = (this.state.selectedAssetType1 === null ? "All" : this.state.selectedAssetType1) ;
        // let assetStage = (this.state.selectedAssetStage1 === null ? "all" : this.state.selectedAssetStage1.toLowerCase());
        let assetStage = (this.state.selectedAssetStage1 === null ? "All" : this.state.selectedAssetStage1);
        result = this.state.products.filter((data) => {
            if(assetType === "All" && assetStage !== "all"){
                return data.assetStage.search(assetStage) !== -1;
            }
            if(assetStage === "all" && assetType !== "All"){
                return data.assetType.search(assetType) !== -1;
            }
            if(assetStage !== "all" && assetType !== "All"){
            return data.assetType.search(assetType) !== -1 &&
            data.assetStage.search(assetStage) !== -1;
            }
            if(assetStage === "all" && assetType === "All"){
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

    onassetTypeChange1 = (event) =>{
        let product = {...this.state.product};
        product['assetType'] = event.value;
        this.setState({ product });
    }

    onassetStageChange1 =(event) =>{
        let product = {...this.state.product};
        product['assetStage'] = event.value;
        this.setState({ product });
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
 

    onInputChange(e, name) {
        const val = (e.target && e.target.value) || '';
        let product = {...this.state.product};
        product[`${name}`] = val;

        this.setState({ product });
    
    }

    onInputNumberChange(e, name) {
        const val = e.value || 0;
        let product = {...this.state.product};
        product[`${name}`] = val;

        this.setState({ product });
    }

    


    statusBodyTemplate(rowData) {
        return <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
    }


   

    actionBodyTemplate(rowData) {
        return (
            <React.Fragment>
                {/* <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => this.editProduct(rowData)} /> */}
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
                <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={this.deleteSelectedProducts} />
            </React.Fragment>
        );

        return (
            <div className="datatable-crud-demo">
                <Toast ref={(el) => this.toast = el} />

                <div className="card">
                <div className="main-header">
                <img src={companyLogo} alt="ivis. logo" />
                </div>
                <div className="p-field-1" >
                <h2 >Assets Management</h2>
                </div>
                  
              <div className="p-formgrid p-grid">       
                 
                 <label style={{ marginLeft : "20px" }} >  AssetType : </label>
                 <select
                                      name="assetType"  
                                      value={this.state.assetType} onChange={this.onassetTypeChange}
                                      >
                                          <option value="All">All</option>
                                          <option value="Laptop">Laptop</option>
                                          <option value="Desktop">Desktop</option>
                                          <option value="Monitor">Monitor</option>
                                          <option value="MobileHeadset">MobileHeadset</option>
                                      </select>                

              
             <label  style={{ marginLeft : "20px" }}>  AssetStage : </label>
             <select
                                      name="assetStage"  
                                      value={this.state.assetStage} onChange={this.onassetStageChange}
                                      >
                                          <option value="All">All</option>
                                          <option value="Staged">Staged</option>
                                          <option value="Issued">Issued</option>
                                          <option value="Recovered">Recovered</option>
                                          <option value="Returned">Returned</option>
                                      </select>
          
             
            
                  <Button style={{ marginLeft : "20px" }} type="button" label="Search" onClick={() => this.onSearch()}/> 

                  <InputText style={{ marginLeft : "600px" }}type="search" className="p-mr-2" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Search..." />
 
                  <Button label="New" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={this.openNew} />
                 <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={this.confirmDeleteSelected} disabled={!this.state.selectedProducts || !this.state.selectedProducts.length} />
            
 

            </div>
  

<Toolbar />
              
                
              


            

                    <DataTable ref={(el) => this.dt = el} value={this.state.productsFiltered} selection={this.state.selectedProducts} onSelectionChange={(e) => this.setState({ selectedProducts: e.value })}
                        dataKey="id" paginator rows={9} rowsPerPageOptions={[10, 15, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={this.state.globalFilter}
                        header={header}>

                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column  field="assetType"  header="Asset Type" sortable style={{ width: '200px' }}></Column>
                        <Column field="assetManufacturer" header="Asset Manufacturer" sortable style={{ width: '200px' }} ></Column>
                        {/* <Column header="Image" body={this.imageBodyTemplate}></Column> */}
                        <Column field="model" header="Model"  sortable style={{ width: '200px' }} ></Column>
                        <Column field="serialNumber" header="Seril Number" sortable style={{ width: '200px' }} ></Column> 
                        <Column  field="assetStage" header="Asset Stage" sortable  filter style={{ width: '200px' }} ></Column>
                                      
                        <Column header="Actions" style={{ paddingLeft: '12px'}} body={this.actionBodyTemplate}></Column>
                    </DataTable>
                    <div className="main-footer">
                
                    
                <div><i class="pi pi-envelope"></i> Support@ivis.net</div>
                <div>Copyright © 2021 IVIS. All rights reserved.</div>
                        <div><i class="pi pi-phone"></i> 7569843002</div>
                
                
                    </div>
                </div>

                <Dialog visible={this.state.productDialog} style={{ width: '800px' }} header="Item Details" modal className="p-fluid" footer={productDialogFooter} onHide={this.hideDialog}>
                   

                    <div className="p-field">
                    <div className="p-formgrid p-grid">     
                    <div className="p-field ">
                        <label htmlFor="assetManufacturer">Asset Manufacturer</label>
                        <InputText id="assetManufacturer" value={this.state.product.assetManufacturer} onChange={(e) => this.onInputChange(e, 'assetManufacturer')} required autoFocus className={classNames({ 'p-invalid': this.state.submitted && !this.state.product.assetManufacturer })} />
                        {this.state.submitted && !this.state.product.assetManufacturer && <small className="p-error">assetManufacturer is required.</small>}
                    </div>
                    
                           
                           
                    
                        </div>
                    </div>
                    <div className="p-field ">
                    <label className="p-mb-3">Asset Type</label>
                    <select
                                        name="assetType"  
                                        value={this.state.assetStage} onChange={this.onassetStageChange}
                                        >
                                            <option value="null"></option>
                                            <option value="Laptop">Laptop</option>
                                            <option value="Desktop">Desktop</option>
                                            <option value="Monitor">Monitor</option>
                                            <option value="MobileHeadset">MobileHeadset</option>
                                        </select>

                    
                    </div>
                    <div className="p-field">
                    <label htmlFor="model">Model</label>
                        <InputText id="model" value={this.state.product.model} onChange={(e) => this.onInputChange(e, 'model')} required rows={3} cols={20} />

                                          </div>

                    <div className="p-formgrid p-grid">
                        <div className="p-field p-col">
                           
                        <label htmlFor="serialNumber">SerialNumber</label>
                            <InputNumber id="serialNumber" value={this.state.product.serialNumber} onValueChange={(e) => this.onInputNumberChange(e, 'serialNumber')} integeronly />                       </div>
                        
                    </div>
                    
                    <div className="p-formgrid p-grid">
                       
                        
               <label>AssetStage : </label>
               <select
               type = {InputText}
                                        name="assetStage"  
                                        value={this.state.assetStage} onChange={this.onassetStageChange}
                                        >
                                            <option value="null"></option>
                                            <option value="Staged">Staged</option>
                                            <option value="Issued">Issued</option>
                                            <option value="Recovered">Recovered</option>
                                            <option value="Returned">Returned</option>
                                        </select>
                    </div>
                    
                </Dialog>

                <Dialog visible={this.state.deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={this.hideDeleteProductDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                        {this.state.product && <span>Are you sure you want to delete <b>{this.state.product.name}</b>?</span>}
                    </div>
                </Dialog>

                <Dialog visible={this.state.deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={this.hideDeleteProductsDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                        {this.state.product && <span>Are you sure you want to delete the selected products?</span>}
                    </div>
                </Dialog>
            </div>
        );
    }
}
                
const rootElement = document.getElementById("root");
ReactDOM.render(<DataTableCrudDemo />, rootElement);