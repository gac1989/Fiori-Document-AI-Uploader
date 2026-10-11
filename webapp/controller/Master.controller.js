sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/unified/FileUploader",
    "sap/ui/model/json/JSONModel"

], (Controller, MessageBox, MessageToast, FileUploader, JSONModel) => {
    "use strict";

    this._jobId;

    return Controller.extend("sap.btp.doxsapui5.controller.Master", {
        onInit() {
            this.oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

            // Create a model for the data
            const oModel = {}
            this.getView().setModel(new JSONModel(oModel), "invoice")

            // Create a UI state model for visibility and editing flags 
            const oModel2 = {
                editable: false,
                refreshEnabled: false,
                uploadEnabled: false
            }
            this.getView().setModel(new JSONModel(oModel2), "viewModel") 
        },

        async handleUploadPress() {
            if (this._jobId) {
                MessageBox.confirm(this.oResourceBundle.getText("confirmText"), {
                    onClose: async (oAction) => {
                        if (oAction === "OK") {
                            this._resetData()
                            await this._uploadImage()
                        }
                    }
                })
            } else {
                await this._uploadImage()
            }
        },

        onFileChange() {
            const oFileUploader = this.byId("fileUploader")
            if (oFileUploader.getValue()) {
                this.getView().getModel("viewModel").setProperty("/uploadEnabled", true)
            }
        },

        async onRefresh() {
            const response = await this._getStatus()
            if (response.status === "DONE") {
                this._setInvoiceData(response.extraction)
                const viewModel = this.getView().getModel("viewModel")
                viewModel.setProperty("/refreshEnabled", false)
                viewModel.setProperty("/editable", true)

            } else if (response.status === "PENDING") {
                MessageToast.show(this.oResourceBundle.getText("pendingText"))
            }
        },

        onSave() {
            MessageToast.show(this.oResourceBundle.getText("saveText"))
        },

        _resetData() {
            this.getView().getModel("invoice").setData({})
            this._jobId = ""
        },

        async _uploadImage() {
            //prepare form data
            const oFileUploader = this.byId("fileUploader")
            const oUploadedFile = oFileUploader.oFileUpload.files[0]
            const blob = new Blob([oUploadedFile], { type: oUploadedFile.type })

            const formData = new FormData()
            formData.append("file", blob, oUploadedFile.name)

            const options = this.getOwnerComponent().getModel("options").getData()
            formData.append('options', JSON.stringify(options))

            //call document ai 
            const response = await this._postToDox(formData)
            this._jobId = response.id;

            // enable refresh button
            this.getView().getModel("viewModel").setProperty("/refreshEnabled", true)
        },

        async _postToDox(formData) {
            const dieUrl = this._getbaseUrl() + "/document/jobs"
            const response = await fetch(dieUrl, {
                method: 'POST',
                body: formData
            })

            return response.json()
        },

        async _getStatus() {
            const dieUrl = this._getbaseUrl() + "/document/jobs" + "/" + this._jobId
            const response = await fetch(dieUrl, {
                method: 'GET'
            })
            return response.json()
        },

        _getbaseUrl() {
            const appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            const appPath = appId.replaceAll(".", "/");
            var appModulePath = sap.ui.require.toUrl(appPath);

            if (appModulePath === "..") {
                appModulePath = "";
            }

            return appModulePath +  "/document-information-extraction/v1"; 
        },

        _setInvoiceData(extractedData) {
            const invoice = {}

            //set header
            const invoiceHeader = (extractedData.headerFields).reduce((acc, curr) => {
                acc[curr.name] = curr.value
                return acc
            }, {})

            //set items
            const invoiceItems = (extractedData.lineItems).reduce((acc, item) => {
                const lineItem = item.reduce((acc, curr) => {
                    acc[curr.name] = curr.value
                    return acc
                }, {})
                acc.push(lineItem)
                return acc
            }, [])

            invoice["header"] = invoiceHeader;
            invoice["items"] = invoiceItems;

            this.getView().getModel("invoice").setData(invoice)
        }

    });
});

