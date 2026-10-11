## Application Details
|               |
| ------------- |
|**Generation Date and Time**<br>Wed Sep 23 2026 18:58:07 GMT+0000 (Coordinated Universal Time)|
|**App Generator**<br>SAP Fiori Application Generator|
|**App Generator Version**<br>1.32.0|
|**Generation Platform**<br>SAP Business Application Studio|
|**Template Used**<br>Basic|
|**Service Type**<br>None|
|**Service URL**<br>N/A|
|**Module Name**<br>doxsapui5|
|**Application Title**<br>Dox Fiori|
|**Namespace**<br>sap.btp|
|**UI5 Theme**<br>sap_horizon|
|**UI5 Version**<br>1.152.0|
|**Enable TypeScript**<br>False|
|**Add Eslint configuration**<br>True, see https://www.npmjs.com/package/@sap-ux/eslint-plugin-fiori-tools#rules for the eslint rules.|


# Fiori Document AI Uploader

This project is a SAPUI5/Fiori application executed locally in SAP Business Application Studio (BAS). It interacts with the SAP Document AI service to manage and upload business documents.

## Prerequisites

- Active **SAP Document AI** subscription.
- SAP Document AI instance (`blocks_of_100` plan) with a **Service Key** generated.
- **SAP Business Application Studio** (BAS) workspace.

### Destination Configuration in SAP BTP

Create an HTTP Destination at the Subaccount level with the following details:

| Property | Value |
| :--- | :--- |
| **Name** | `DOX_Service` |
| **Type** | `HTTP` |
| **URL** | *"url"* from the service key + `/document-information-extraction/v1` |
| **Proxy Type** | `Internet` |
| **Authentication** | `OAuth2ClientCredentials` |
| **Client ID** | *"uaa.clientid"* from the service key |
| **Client Secret** | *"uaa.clientsecret"* from the service key |
| **Token Service URL** | *"uaa.url"* from the service key + `/oauth/token` |

#### Additional Properties

| Property | Value |
| :--- | :--- |
| `WebIDEEnabled` | `true` |
| `HTML5.DynamicDestination` | `true` |
| `WebIDEUsage` | `odata_gen` |

---

## Startup & Deployment

### 1. Document AI Schema Setup

1. Navigate to the `tests/` folder in the root of this project and download the `invoice_schema_schema.json` file.
    2. Access your **SAP Document AI** subscription via the BTP Cockpit.
3. Go to the **Schemas** section on the left menu, click **Import**, and upload the downloaded JSON file.
4. Make sure to **Activate** the schema after a successful import.

### 2. Run the Application in BAS

Open the terminal in SAP Business Application Studio and execute the following steps:

1. **Clone the repository and enter the directory:**
   ```bash
   git clone https://github.com/gac1989/Fiori-Document-AI-Uploader.git
   cd Fiori-Document-AI-Uploader
   ```

2. **Log in to Cloud Foundry:** *(Mandatory so the local Fiori proxy middleware can discover and resolve your BTP Destination)*:
   ```bash
   cf login
   ```

3. **Install dependencies and start the local server:**
   ```bash
   npm install
   npm start
   ```

### 3. Testing the App

To test the document extraction workflow, upload the sample PDF file `sample_invoice.pdf` located inside the `tests/` folder using the application UI.




