# Deploying Next.js Application to IIS

This guide provides step-by-step instructions for deploying this Next.js application to Internet Information Services (IIS) on Windows Server.

## Prerequisites

1. Windows Server with IIS installed
2. Node.js installed on the server (LTS version recommended)
3. URL Rewrite Module for IIS installed
4. Application Request Routing (ARR) for IIS installed
5. iisnode module installed

## Installation Steps

### 1. Install Required IIS Components

If not already installed, you need to install the following components:

- **URL Rewrite Module**: Download from [Microsoft's website](https://www.iis.net/downloads/microsoft/url-rewrite)
- **Application Request Routing**: Download from [Microsoft's website](https://www.iis.net/downloads/microsoft/application-request-routing)
- **iisnode**: Download from [GitHub](https://github.com/Azure/iisnode/releases)

### 2. Prepare Your Application

1. Build your Next.js application:
   ```
   npm run build
   ```

2. Make sure you have the following files in your project root:
   - `server.js` - Custom server file for Node.js
   - `web.config` - IIS configuration file
   - `.next` directory - Contains the built Next.js application

### 3. Deploy to IIS

1. Create a new website or application in IIS Manager
2. Set the physical path to your application folder
3. Configure the application pool:
   - Set .NET CLR version to "No Managed Code"
   - Set Identity to a user with sufficient permissions
   - Make sure "Enable 32-bit Applications" is set to "False" if you're on a 64-bit system

4. Copy your entire application directory to the server, including:
   - `node_modules` folder
   - `.next` folder
   - `public` folder
   - `server.js`
   - `web.config`
   - `package.json`

5. If you haven't already installed dependencies on the server, run:
   ```
   npm install --production
   ```

### 4. Configure IIS

1. Make sure the application pool identity has read/write permissions to the application directory
2. Verify that the Node.js executable path is correctly set in the system PATH environment variable
3. Restart the IIS website

### 5. Troubleshooting

If you encounter issues:

1. Check the iisnode logs in the `iisnode` directory within your application folder
2. Verify that all required modules are installed (URL Rewrite, ARR, iisnode)
3. Check IIS logs in `%SystemDrive%\inetpub\logs\LogFiles`
4. Make sure all file permissions are set correctly
5. Verify that the application pool identity has access to the Node.js executable

## Additional Configuration

### Environment Variables

To set environment variables for your application:

1. Open IIS Manager
2. Select your website
3. Double-click on "Application Settings"
4. Add your environment variables here

### HTTPS Configuration

To enable HTTPS:

1. Obtain an SSL certificate
2. In IIS Manager, select your website
3. Click "Bindings" in the Actions panel
4. Add a new binding for HTTPS with your certificate

## Maintenance

- To update your application, rebuild it and replace the `.next` directory on the server
- You may need to restart the application pool after updates

## References

- [iisnode documentation](https://github.com/Azure/iisnode/wiki)
- [Next.js documentation](https://nextjs.org/docs)
- [IIS documentation](https://docs.microsoft.com/en-us/iis/get-started/introduction-to-iis/iis-introduction)
