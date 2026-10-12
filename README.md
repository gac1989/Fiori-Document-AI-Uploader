# 🚀 SAP Fiori & Document AI Uploader

A modern, intelligent solution developed with **SAPUI5 / Fiori** and integrated with cognitive Artificial Intelligence services on **SAP BTP** for the automation, upload, and analytical extraction of business documents.

---

## 💼 Business Use Case (Business Value)
In corporate environments, manual processing of invoices and supplier documents causes delays and a high margin of human error. This application solves that problem by automating the business process through **Artificial Intelligence (Machine Learning / advanced OCR)**.

The user simply uploads a PDF document and the system automatically extracts the key information, reducing processing times and leaving it ready for subsequent integration into ERP systems such as **SAP S/4HANA**.

---

## 📸 Demo / Solution Flow

<p align="center">
  <img src="https://github.com/user-attachments/assets/706116c1-f416-4ddc-a90c-e7985ae6ccda" width="24%" alt="Access from SAP Build Work Zone" title="Integration in SAP Build Work Zone" style="vertical-align: middle; margin-right: 1%;" />
  <img src="https://github.com/user-attachments/assets/31b41585-daa9-42e3-b8db-02e60a9cb5bf" width="37%" alt="Fiori Document Upload Screen" title="Document upload in the Fiori UI" style="vertical-align: middle; margin-right: 1%;" />
  <img src="https://github.com/user-attachments/assets/52576534-bf85-4eb0-87dd-fabbfa6228a2" width="37%" alt="Document AI Analytical Data Extraction" title="Document AI extraction results" style="vertical-align: middle;" />
</p>

---

## 🏗️ Solution Architecture

```text
[ SAP Fiori UI App (BAS) ]
           │
           ▼ (Via BTP Destination Local Proxy / Cloud Foundry)
[ SAP BTP Cockpit / Connectivity ]
           │
           ▼ (OAuth 2.0 Client Credentials)
[ SAP Document Information Extraction API (Document AI) ]
```

---

## 🛠️ Prerequisites

- Active subscription to **SAP Document Information Extraction** (Document AI).
- Service instance configured with the `blocks_of_100` plan and a generated **Service Key**.
- Active workspace in **SAP Business Application Studio** (BAS).

### Destination Configuration in SAP BTP

Create an HTTP destination in your Subaccount with the following detailed parameters:

| Property | Value |
| :--- | :--- |
| **Name** | `DOX_Service` |
| **Type** | `HTTP` |
| **URL** | *"url"* extracted from the service key + `/document-information-extraction/v1` |
| **Proxy Type** | `Internet` |
| **Authentication** | `OAuth2ClientCredentials` |
| **Client ID** | *"uaa.clientid"* extracted from the service key |
| **Client Secret** | *"uaa.clientsecret"* extracted from the service key |
| **Token Service URL** | *"uaa.url"* extracted from the service key + `/oauth/token` |

#### Additional Properties

| Property | Value |
| :--- | :--- |
| `WebIDEEnabled` | `true` |
| `HTML5.DynamicDestination` | `true` |
| `WebIDEUsage` | `odata_gen` |

---

## ⚙️ Startup & Deployment

### 1. Schema Preparation in Document AI

1. Navigate to the `tests/` folder in the root of this project and download the schema file `invoice_schema_schema.json`.
2. Access your **SAP Document AI** subscription from the BTP Cockpit.
3. Go to the **Schemas** section in the left-hand menu, click **Import**, and upload the downloaded JSON file.
4. Make sure to **Activate** the schema once the import is complete.

### 2. Running the Application Locally in BAS

Open the terminal in SAP Business Application Studio and run the following commands in sequence:

1. **Clone the repository and navigate to the directory:**
```bash
   git clone https://github.com/gac1989/Fiori-Document-AI-Uploader.git
   cd Fiori-Document-AI-Uploader
```

2. **Log in to Cloud Foundry:** *(This step is mandatory so that the local Fiori proxy middleware can correctly resolve your BTP Destination)*:
```bash
   cf login
```

3. **Install dependencies and start the local server:**
```bash
   npm install
   npm start
```

---

## 🧪 Workflow Testing

To validate the complete intelligent extraction workflow, use the sample PDF file `sample_invoice.pdf` located inside the `tests/` folder and upload it directly through the application's user interface.
